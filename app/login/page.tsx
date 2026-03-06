'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: window.location.origin + '/Atlas-Synapse-Homepage',
        },
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] pt-24">
      <div className="mx-auto max-w-md animate-bounce-in rounded-lg border border-white/10 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-6 animate-slide-down delay-100">Sign In</h1>

        {error && <div className="error-message mb-4 rounded-lg bg-red-500/20 p-4 text-red-300 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="animate-slide-down delay-100">
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:border-white/20"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="animate-slide-down delay-200">
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:border-white/20"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="animate-slide-down delay-300">
            <button
              type="submit"
              disabled={loading}
              className="relative-sheen sheen w-full rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-2 font-semibold text-white disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-atlas-primary/50 active:scale-95"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="relative my-6 animate-slide-down delay-300">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
            className="animate-slide-in-left delay-400 relative-sheen w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700/60 disabled:opacity-50 transition-all duration-200 active:scale-95"
          >
            Sign In with GitHub
          </button>

          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="animate-slide-in-right delay-400 relative-sheen w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700/60 disabled:opacity-50 transition-all duration-200 active:scale-95"
          >
            Sign In with Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400 animate-slide-up delay-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-atlas-secondary hover:text-atlas-primary transition-colors duration-200">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
