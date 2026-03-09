import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { PRICING_PLANS } from '@/lib/pricing-plans'

export async function POST(request: NextRequest) {
  // Guard all required env vars before anything else
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe is not configured on the server.' }, { status: 503 })
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Database is not configured on the server.' }, { status: 503 })
  }

  // Create supabase client inside the handler (not at module level)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  )

  try {
    const { planId, userId, email } = await request.json()

    if (!planId || !userId) {
      return NextResponse.json({ error: 'Missing planId or userId' }, { status: 400 })
    }

    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS]
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    let { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single()

    // Auto-create user row if it doesn't exist (e.g. OAuth signup without trigger)
    if (!userData) {
      if (!email) {
        return NextResponse.json({ error: 'User not found and no email provided' }, { status: 400 })
      }
      await supabase.from('users').insert({
        id: userId,
        email,
        subscription_status: 'none',
      })
      userData = { stripe_customer_id: null, email }
    }

    let stripeCustomerId = userData.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userData.email || email,
        metadata: { userId },
      })
      stripeCustomerId = customer.id

      await supabase
        .from('users')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', userId)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://atlas-synapse-homepage.vercel.app'

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price * 100,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: { userId, planId },
      },
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      metadata: { userId, planId },
    })

    return NextResponse.json({ sessionId: session.id, sessionUrl: session.url })
  } catch (error: any) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
