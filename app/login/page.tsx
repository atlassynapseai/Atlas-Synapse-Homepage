'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLinkingPrompt, setShowLinkingPrompt] = useState(false)
  const [linkingProvider, setLinkingProvider] = useState<'google' | 'github' | null>(null)
  const [linkingInProgress, setLinkingInProgress] = useState(false)

  // Check if we're in linking mode
  const linkProvider = searchParams.get('linkProvider') as 'google' | 'github' | null

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

      // If we're in linking mode, show the linking prompt instead of redirecting
      if (linkProvider) {
        setShowLinkingPrompt(true)
        setLinkingProvider(linkProvider)
      } else {
        router.push('/')
      }
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

  // Link the pending OAuth provider to current account
  const handleLinkAccount = async () => {
    if (!linkingProvider) return

    setLinkingInProgress(true)
    setError('')

    try {
      const { error } = await supabase.auth.linkIdentity({
        provider: linkingProvider,
        options: {
          redirectTo: window.location.origin + '/Atlas-Synapse-Homepage',
        },
      })

      if (error) throw error

      // Success - redirect to homepage
      setShowLinkingPrompt(false)
      router.push('/')
    } catch (err: any) {
      setError(err.message || `Failed to link ${linkingProvider} account`)
    } finally {
      setLinkingInProgress(false)
    }
  }

  const handleSkipLinking = () => {
    setShowLinkingPrompt(false)
    router.push('/')
  }

  // Show linking prompt instead of login form
  if (showLinkingPrompt && linkingProvider) {
    return (
      <div className="min-h-screen bg-[#050816] pt-24">
        <div className="mx-auto max-w-md animate-bounce-in rounded-lg border border-white/10 bg-slate-900/60 p-8">
          <h1 className="text-2xl font-bold text-slate-100 mb-6 animate-slide-down delay-100">Link Account</h1>

          {error && (
            <div className="error-message mb-4 rounded-lg bg-red-500/20 p-4 text-red-300 text-sm">{error}</div>
          )}

          <div className="animate-slide-down delay-200 mb-6 rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
            <p className="text-blue-300 text-sm">
              We found an existing account with this email. You can now link your {linkingProvider === 'github' ? 'GitHub' : 'Google'}{' '}
              account to it. This means you'll be able to sign in using either provider.
            </p>
          </div>

          <div className="space-y-3 animate-slide-up delay-300">
            <button
              onClick={handleLinkAccount}
              disabled={linkingInProgress}
              className="w-full rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-3 font-semibold text-white disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-atlas-primary/50 active:scale-95"
            >
              {linkingInProgress ? `Linking ${linkingProvider === 'github' ? 'GitHub' : 'Google'}...` : `Link ${linkingProvider === 'github' ? 'GitHub' : 'Google'} Account`}
            </button>

            <button
              onClick={handleSkipLinking}
              disabled={linkingInProgress}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-3 font-semibold text-slate-300 hover:bg-slate-700/60 disabled:opacity-50 transition-all duration-200 active:scale-95"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    )
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
