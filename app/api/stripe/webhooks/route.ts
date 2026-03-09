import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import { stripe } from '@/lib/stripe'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { sendWelcomeEmail } from '@/lib/mailer'

// Create supabase client lazily inside request handlers only
function getSupabase(): SupabaseClient {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase env vars are not configured')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  )
}

async function buffer(readable: Readable) {
  const chunks: Uint8Array[] = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export async function POST(request: NextRequest) {
  try {
    const body = await buffer(request.body as any)
    const signature = request.headers.get('stripe-signature') as string

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 })
    }

    const supabase = getSupabase()

    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object, supabase)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object, supabase)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object, supabase)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object, supabase)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object, supabase)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(subscription: any, supabase: SupabaseClient) {
  const { customer, id, status, current_period_start, current_period_end, items, metadata } = subscription
  const planId = metadata?.planId || items.data[0]?.plan?.nickname || items.data[0]?.price?.nickname

  const { data: userData } = await supabase
    .from('users').select('id, email').eq('stripe_customer_id', customer).single()

  if (!userData) { console.error(`User not found for customer ${customer}`); return }

  await supabase.from('subscriptions').insert({
    user_id: userData.id,
    stripe_subscription_id: id,
    plan_tier: planId || 'standard',
    amount: items.data[0]?.plan?.amount || 0,
    status,
    current_period_start: new Date(current_period_start * 1000).toISOString(),
    current_period_end: new Date(current_period_end * 1000).toISOString(),
  })

  await supabase.from('users').update({
    subscription_status: status === 'active' ? 'active' : 'pending',
    current_plan: planId || 'standard',
  }).eq('id', userData.id)

  // Send welcome email
  if (userData.email && status === 'active') {
    try {
      await sendWelcomeEmail(userData.email, planId || 'standard')
    } catch (err) {
      console.error('Welcome email failed (non-critical):', err)
    }
  }
}

async function handleSubscriptionUpdated(subscription: any, supabase: SupabaseClient) {
  const { id, status, current_period_start, current_period_end, items, metadata } = subscription

  await supabase.from('subscriptions').update({
    status,
    current_period_start: new Date(current_period_start * 1000).toISOString(),
    current_period_end: new Date(current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('stripe_subscription_id', id)

  const { data: subData } = await supabase
    .from('subscriptions').select('user_id').eq('stripe_subscription_id', id).single()

  if (subData) {
    const planId = metadata?.planId || items.data[0]?.plan?.nickname || items.data[0]?.price?.nickname
    await supabase.from('users').update({
      subscription_status: status === 'active' ? 'active' : status,
      current_plan: planId || 'standard',
    }).eq('id', subData.user_id)
  }
}

async function handleSubscriptionDeleted(subscription: any, supabase: SupabaseClient) {
  const { id } = subscription

  await supabase.from('subscriptions').update({
    status: 'canceled',
    canceled_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('stripe_subscription_id', id)

  const { data: subData } = await supabase
    .from('subscriptions').select('user_id').eq('stripe_subscription_id', id).single()

  if (subData) {
    await supabase.from('users').update({
      subscription_status: 'canceled',
      current_plan: null,
    }).eq('id', subData.user_id)
  }
}

async function handlePaymentSucceeded(invoice: any, supabase: SupabaseClient) {
  const { customer, id, amount_paid } = invoice

  const { data: userData } = await supabase
    .from('users').select('id').eq('stripe_customer_id', customer).single()

  if (!userData) { console.error(`User not found for customer ${customer}`); return }

  await supabase.from('payments').insert({
    user_id: userData.id,
    stripe_payment_id: id,
    amount: amount_paid,
    status: 'succeeded',
    description: 'Invoice payment processed',
  })
}

async function handlePaymentFailed(invoice: any, supabase: SupabaseClient) {
  const { customer, id, amount_due } = invoice

  const { data: userData } = await supabase
    .from('users').select('id').eq('stripe_customer_id', customer).single()

  if (!userData) { console.error(`User not found for customer ${customer}`); return }

  await supabase.from('payments').insert({
    user_id: userData.id,
    stripe_payment_id: id,
    amount: amount_due,
    status: 'failed',
    description: 'Invoice payment failed',
  })

  await supabase.from('users').update({ subscription_status: 'past_due' }).eq('id', userData.id)
}
