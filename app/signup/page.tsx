'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function SignUpInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scanId = searchParams.get('scan_id') || ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      })

      if (signUpError) throw signUpError

      // Save extra profile fields
      if (data.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          name,
          phone: phone || null,
          company,
          job_title: jobTitle,
        })

        // Link pending scan if present
        if (scanId) {
          await fetch('/api/scan-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: data.user.id, scanId }),
          })
        }
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    setError('')
    setLoading(true)

    try {
      sessionStorage.setItem('pendingLinkProvider', provider)
      if (scanId) sessionStorage.setItem('pendingScanId', scanId)

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/complete-profile`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      const errorMessage = err.message || `Failed to sign up with ${provider}`
      if (errorMessage.includes('Multiple accounts with the same email')) {
        setError('Account already exists with this email. Sign in with your existing account first.')
        setTimeout(() => router.push(`/login?linkProvider=${provider}`), 2000)
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:border-white/20 focus:border-atlas-primary/50 focus:outline-none'

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-16">
      <div className="mx-auto max-w-md animate-bounce-in rounded-lg border border-white/10 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2 animate-slide-down delay-100">Create Account</h1>
        <p className="text-sm text-slate-400 mb-6">Join Atlas Synapse — AI governance starts here.</p>

        {error && <div className="mb-4 rounded-lg bg-red-500/20 p-4 text-red-300 text-sm">{error}</div>}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name <span className="text-red-400">*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Jane Smith" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone <span className="text-slate-500 font-normal">(optional)</span></label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+1 555 000 0000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Company <span className="text-red-400">*</span></label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)} className={inputClass} placeholder="Acme Corp" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Job Title <span className="text-red-400">*</span></label>
              <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className={inputClass} placeholder="CTO / AI Lead" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email <span className="text-red-400">*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="you@company.com" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password <span className="text-red-400">*</span></label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative-sheen sheen w-full rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-2 font-semibold text-white disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-atlas-primary/50 active:scale-95"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center text-sm"><span className="bg-slate-900 px-2 text-slate-400">Or continue with</span></div>
        </div>

        <div className="space-y-3">
          <button onClick={() => handleOAuthSignUp('google')} disabled={loading} className="relative-sheen w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700/60 disabled:opacity-50 transition-all duration-200 active:scale-95">
            Sign Up with Google
          </button>
          <button onClick={() => handleOAuthSignUp('github')} disabled={loading} className="relative-sheen w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700/60 disabled:opacity-50 transition-all duration-200 active:scale-95">
            Sign Up with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-atlas-secondary hover:text-atlas-primary transition-colors duration-200">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignUp() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050816] flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" /></div>}>
      <SignUpInner />
    </Suspense>
  )
}
