'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function AuthInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scanId = searchParams.get('scan_id') || ''
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const switchMode = (m: 'signin' | 'signup') => {
    setMode(m)
    setError('')
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (signUpError) throw signUpError
        if (data.user) {
          await supabase.from('users').upsert({
            id: data.user.id,
            name,
            phone: phone || null,
            company,
            job_title: jobTitle,
          })
          if (scanId) {
            await fetch('/api/scan-results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: data.user.id, scanId }),
            })
          }
          // Notify team of new signup
          fetch('/api/notify-signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, company, jobTitle, provider: 'email' }),
          }).catch(() => { })
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Failed to get user data')
        if (scanId) {
          fetch('/api/scan-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, scanId }),
          }).catch(() => { })
        }
      }
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError('')
    setLoading(true)
    try {
      sessionStorage.setItem('pendingLinkProvider', provider)
      if (scanId) sessionStorage.setItem('pendingScanId', scanId)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: mode === 'signup'
            ? `${window.location.origin}/complete-profile`
            : `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`)
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 transition-all hover:border-white/20 focus:border-atlas-primary/50 focus:outline-none'

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="Atlas Synapse" className="h-9 w-9 object-contain" />
            <span className="font-bold text-white text-lg tracking-tight">Atlas Synapse</span>
          </Link>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8">
          {/* Tab switcher */}
          <div className="flex rounded-lg border border-white/10 bg-slate-800/40 p-1 mb-8">
            <button
              onClick={() => switchMode('signin')}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${mode === 'signin'
                  ? 'bg-gradient-to-r from-atlas-primary to-atlas-secondary text-white shadow'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${mode === 'signup'
                  ? 'bg-gradient-to-r from-atlas-primary to-atlas-secondary text-white shadow'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-500/20 border border-red-500/30 p-4 text-red-300 text-sm">{error}</div>
          )}

          {/* OAuth buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700/60 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => handleOAuth('github')}
              disabled={loading}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700/60 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-slate-900 px-2 text-slate-500">or continue with email</span></div>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Jane Smith" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone <span className="text-slate-600">(opt)</span></label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+1 555 0000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Company <span className="text-red-400">*</span></label>
                    <input type="text" value={company} onChange={e => setCompany(e.target.value)} className={inputClass} placeholder="Acme Corp" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Job Title <span className="text-red-400">*</span></label>
                    <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className={inputClass} placeholder="CTO / AI Lead" required />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email <span className="text-red-400">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="you@company.com" required />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-400">Password <span className="text-red-400">*</span></label>
                {mode === 'signin' && (
                  <Link href="/forgot-password" className="text-xs text-atlas-secondary hover:text-atlas-primary transition-colors">
                    Forgot password?
                  </Link>
                )}
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-atlas-primary/40 hover:scale-[1.02] active:scale-95"
            >
              {loading ? '...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" />
      </div>
    }>
      <AuthInner />
    </Suspense>
  )
}
