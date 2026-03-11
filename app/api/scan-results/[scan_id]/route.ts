import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest, { params }: { params: { scan_id: string } }) {
  const { scan_id } = params
  const userId = request.nextUrl.searchParams.get('userId')

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('scan_results')
    .select('*')
    .eq('scan_id', scan_id)
    .eq('user_id', userId)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Scan not found' }, { status: 404 })

  return NextResponse.json(data)
}
