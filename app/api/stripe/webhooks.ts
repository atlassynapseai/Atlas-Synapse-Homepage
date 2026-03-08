import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
)

// Convert Request body to string for signature verification
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
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 400 }
      )
    }

    // Handle events
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
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

async function handleSubscriptionCreated(subscription: any) {
  const { customer, id, status, current_period_start, current_period_end, items } = subscription
  const planId = items.data[0]?.plan?.nickname || items.data[0]?.price?.nickname

  // Get user by customer ID
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customer)
    .single()

  if (!userData) {
    console.error(`User not found for customer ${customer}`)
    return
  }

  // Create subscription record
  await supabase.from('subscriptions').insert({
    user_id: userData.id,
    stripe_subscription_id: id,
    plan_tier: planId || 'standard',
    amount: items.data[0]?.plan?.amount || 0,
    status,
    current_period_start: new Date(current_period_start * 1000).toISOString(),
    current_period_end: new Date(current_period_end * 1000).toISOString(),
  })

  // Update user subscription status
  await supabase
    .from('users')
    .update({
      subscription_status: status === 'active' ? 'active' : 'pending',
      current_plan: planId || 'standard',
    })
    .eq('id', userData.id)
}

async function handleSubscriptionUpdated(subscription: any) {
  const { id, status, current_period_start, current_period_end, items } = subscription

  // Update subscription record
  await supabase
    .from('subscriptions')
    .update({
      status,
      current_period_start: new Date(current_period_start * 1000).toISOString(),
      current_period_end: new Date(current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', id)

  // Get user and update
  const { data: subData } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', id)
    .single()

  if (subData) {
    const planId = items.data[0]?.plan?.nickname || items.data[0]?.price?.nickname
    await supabase
      .from('users')
      .update({
        subscription_status: status === 'active' ? 'active' : status,
        current_plan: planId || 'standard',
      })
      .eq('id', subData.user_id)
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  const { id } = subscription

  // Update subscription record
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', id)

  // Get user and update
  const { data: subData } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', id)
    .single()

  if (subData) {
    await supabase
      .from('users')
      .update({
        subscription_status: 'canceled',
        current_plan: 'free',
      })
      .eq('id', subData.user_id)
  }
}

async function handlePaymentSucceeded(invoice: any) {
  const { customer, id, amount_paid, status } = invoice

  // Get user by customer ID
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customer)
    .single()

  if (!userData) {
    console.error(`User not found for customer ${customer}`)
    return
  }

  // Record payment
  await supabase.from('payments').insert({
    user_id: userData.id,
    stripe_payment_id: id,
    amount: amount_paid,
    status: 'succeeded',
    description: 'Invoice payment processed',
  })
}

async function handlePaymentFailed(invoice: any) {
  const { customer, id, amount_due } = invoice

  // Get user by customer ID
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customer)
    .single()

  if (!userData) {
    console.error(`User not found for customer ${customer}`)
    return
  }

  // Record failed payment
  await supabase.from('payments').insert({
    user_id: userData.id,
    stripe_payment_id: id,
    amount: amount_due,
    status: 'failed',
    description: 'Invoice payment failed',
  })

  // Update subscription status to past_due
  await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
    })
    .eq('id', userData.id)
}
