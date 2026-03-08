'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

function ConsentPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState(false)
  const [error, setError] = useState('')

  // OAuth request params
  const clientId    = searchParams.get('client_id') ?? ''
  const redirectUri = searchParams.get('redirect_uri') ?? ''
  const scope       = searchParams.get('scope') ?? 'openid profile email'
  const state       = searchParams.get('state') ?? ''
  const responseType = searchParams.get('response_type') ?? 'code'

  // Friendly scope labels
  const scopeLabels: Record<string, string> = {
    openid:  'Verify your identity',
    profile: 'Read your name and avatar',
    email:   'Read your email address',
    offline_access: 'Stay signed in across sessions',
  }
  const requestedScopes = scope.split(/[\s,+]/).filter(Boolean)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)

      // Not logged in — send to login and return here after
      if (!user) {
        const returnUrl = encodeURIComponent(window.location.href)
        router.replace(`/login?next=${returnUrl}`)
      }
    })
  }, [router])

  const handleAllow = async () => {
    if (!redirectUri) {
      setError('Missing redirect_uri — cannot complete authorization.')
      return
    }
    setApproving(true)
    try {
      // Build redirect back to the requesting client with state preserved.
      // Supabase handles the actual code issuance server-side; we signal
      // consent by forwarding the user back with the consent=granted param.
      const url = new URL(redirectUri)
      if (state) url.searchParams.set('state', state)
      url.searchParams.set('consent', 'granted')
      window.location.href = url.toString()
    } catch {
      setError('Invalid redirect_uri. Cannot complete authorization.')
      setApproving(false)
    }
  }

  const handleDeny = () => {
    if (redirectUri) {
      try {
        const url = new URL(redirectUri)
        if (state) url.searchParams.set('state', state)
        url.searchParams.set('error', 'access_denied')
        url.searchParams.set('error_description', 'The user denied the authorization request.')
        window.location.href = url.toString()
        return
      } catch { /* fall through */ }
    }
    router.replace('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return null // Redirecting to login

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">

      {/* Background orbs */}
      <div className="orb orb-purple" style={{ top: '-60px', left: '-60px', opacity: 0.5 }} />
      <div className="orb orb-blue"   style={{ bottom: '10%', right: '-40px', opacity: 0.4 }} />

      <div className="relative z-10 w-full max-w-md">

        {/* Card */}
        <div className="atlas-card p-8 sm:p-10">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 shrink-0 animate-glow-pulse" style={{ borderRadius: '10px' }}>
              <img src="/logo.png" alt="Atlas Synapse" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-atlas-primary">Atlas Synapse</p>
              <p className="text-sm text-slate-400">Authorization Request</p>
            </div>
          </div>

          {/* Requesting app info */}
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400 mb-1">An application is requesting access</p>
            {clientId && (
              <p className="text-xs font-mono text-slate-500 truncate">client_id: {clientId}</p>
            )}
          </div>

          {/* User confirmation */}
          <p className="text-slate-300 text-sm mb-5">
            Signed in as{' '}
            <span className="font-semibold text-white">{user.email}</span>
          </p>

          {/* Scopes */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
              This app will be able to:
            </p>
            <ul className="space-y-2">
              {requestedScopes.map((s) => (
                <li key={s} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-atlas-primary/20 text-atlas-primary text-xs">✓</span>
                  {scopeLabels[s] ?? s}
                </li>
              ))}
            </ul>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDeny}
              disabled={approving}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 disabled:opacity-50"
            >
              Deny
            </button>
            <button
              onClick={handleAllow}
              disabled={approving}
              className="relative-sheen sheen flex-1 rounded-xl bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-atlas-primary/40 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            >
              {approving ? 'Authorizing…' : 'Allow Access'}
            </button>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Not you?{' '}
            <Link href="/login" className="text-atlas-primary hover:underline">
              Switch account
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default function OAuthConsentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" />
      </div>
    }>
      <ConsentPageInner />
    </Suspense>
  )
}
