'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Supabase processes the recovery token from the URL hash automatically
    // and fires an auth state change with event = 'PASSWORD_RECOVERY'
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidSession(true)
      }
      setChecking(false)
    })

    // Also check if there's already a session (user arrived with valid token)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidSession(true)
        setChecking(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#050816] pt-24 flex items-center justify-center">
        <div className="text-slate-400">Verifying reset link...</div>
      </div>
    )
  }

  if (!validSession) {
    return (
      <div className="min-h-screen bg-[#050816] pt-24">
        <div className="mx-auto max-w-md rounded-lg border border-white/10 bg-slate-900/60 p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
            <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Link expired or invalid</h1>
          <p className="text-slate-400 mb-8">
            This password reset link has expired or already been used. Request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all"
          >
            Request New Link
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#050816] pt-24">
        <div className="mx-auto max-w-md rounded-lg border border-white/10 bg-slate-900/60 p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
            <svg className="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Password updated</h1>
          <p className="text-slate-400">Redirecting you to the dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] pt-24">
      <div className="mx-auto max-w-md rounded-lg border border-white/10 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Set new password</h1>
        <p className="text-slate-400 text-sm mb-6">Choose a strong password for your account.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/30 p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 text-slate-100 placeholder-slate-500 transition-all hover:border-white/20"
              placeholder="Min. 8 characters"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 text-slate-100 placeholder-slate-500 transition-all hover:border-white/20"
              placeholder="Repeat password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-2.5 font-semibold text-white disabled:opacity-50 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-atlas-primary/40"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link href="/login" className="text-atlas-secondary hover:text-atlas-primary transition-colors">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
