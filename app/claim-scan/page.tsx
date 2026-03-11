'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function ClaimScanInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scanId = searchParams.get('scan_id') || ''

  useEffect(() => {
    if (!scanId) {
      router.replace('/dashboard')
      return
    }

    // Use onAuthStateChange so we wait for the session to load from storage
    // before deciding — avoids the race condition where getUser() returns null
    // while the session is still initialising.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== 'INITIAL_SESSION' && event !== 'SIGNED_IN') return
      subscription.unsubscribe()

      if (session?.user) {
        // Already signed in — claim the scan immediately
        await fetch('/api/scan-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id, scanId }),
        }).catch(() => {})
        router.replace('/dashboard')
      } else {
        // Not signed in — store scan_id and go to signup
        router.replace(`/auth?mode=signup&scan_id=${scanId}`)
      }
    })

    return () => subscription.unsubscribe()
  }, [scanId, router])

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" />
    </div>
  )
}

export default function ClaimScanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" />
      </div>
    }>
      <ClaimScanInner />
    </Suspense>
  )
}
