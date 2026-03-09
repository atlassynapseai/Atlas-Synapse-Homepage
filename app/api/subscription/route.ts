import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: 'Database is not configured on the server.' }, { status: 503 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  )

  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('subscription_status, current_plan, subscription_ends_at')
      .eq('id', userId)
      .single()

    // Return empty subscription state if user row doesn't exist yet
    if (!userData) {
      return NextResponse.json({
        subscriptionStatus: null,
        currentPlan: null,
        subscriptionEndsAt: null,
        activeSubscription: null,
      })
    }

    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      subscriptionStatus: userData.subscription_status,
      currentPlan: userData.current_plan,
      subscriptionEndsAt: userData.subscription_ends_at,
      activeSubscription: subscriptionData || null,
    })
  } catch (error: any) {
    console.error('Subscription check error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}
