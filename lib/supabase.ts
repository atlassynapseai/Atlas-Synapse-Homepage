import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Debug logging
if (typeof window !== 'undefined') {
  console.log('Supabase URL loaded:', supabaseUrl ? '✓' : '✗ MISSING')
  console.log('Supabase Key loaded:', supabaseAnonKey ? '✓' : '✗ MISSING')
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Supabase credentials are missing! Did you restart the dev server after creating .env.local?')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
