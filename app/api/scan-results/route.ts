import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/scan-results?userId=xxx — fetch scan history for a user
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('scan_results')
    .select('id, scan_id, file_desc, total_findings, risk_score, risk_level, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ scans: data })
}

// POST /api/scan-results — link an existing scan_id to a user after signup
export async function POST(request: NextRequest) {
  try {
    const { userId, scanId } = await request.json()
    if (!userId || !scanId) return NextResponse.json({ error: 'userId and scanId required' }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('scan_results')
      .update({ user_id: userId })
      .eq('scan_id', scanId)
      .is('user_id', null)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
