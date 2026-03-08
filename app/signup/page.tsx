'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Sign up with email and password
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (signUpError) throw signUpError

      // User profile is created automatically by database trigger
      // Redirect to pricing to let user choose a subscription plan
      router.push('/pricing')
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
      // Store the provider in case of email conflict error
      sessionStorage.setItem('pendingLinkProvider', provider)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as 'google' | 'github',
        options: {
          redirectTo: window.location.origin,
        },
      })

      if (error) throw error
    } catch (err: any) {
      const errorMessage = err.message || `Failed to sign up with ${provider}`

      // Check if this is an account linking scenario (same email, different provider)
      if (errorMessage.includes('Multiple accounts with the same email')) {
        setError(`Account already exists with this email. Sign in with your existing account first to link providers.`)

        // Show a helpful link to navigate to login
        setTimeout(() => {
          router.push(`/login?linkProvider=${provider}`)
        }, 2000)
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] pt-24">
      <div className="mx-auto max-w-md animate-bounce-in rounded-lg border border-white/10 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-6 animate-slide-down delay-100">Create Account</h1>

        {error && <div className="error-message mb-4 rounded-lg bg-red-500/20 p-4 text-red-300 text-sm">{error}</div>}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="animate-slide-down delay-100">
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 text-slate-100 placeholder-slate-500 transition-all duration-300 hover:border-white/20"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="animate-slide-down delay-200">
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

          <div className="animate-slide-down delay-300">
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

          <div className="animate-slide-down delay-400">
            <button
              type="submit"
              disabled={loading}
              className="relative-sheen sheen w-full rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-2 font-semibold text-white disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-atlas-primary/50 active:scale-95"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="relative my-6 animate-slide-down delay-400">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleOAuthSignUp('google')}
            disabled={loading}
            className="animate-slide-in-left delay-500 relative-sheen w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700/60 disabled:opacity-50 transition-all duration-200 active:scale-95"
          >
            Sign Up with Google
          </button>

          <button
            onClick={() => handleOAuthSignUp('github')}
            disabled={loading}
            className="animate-slide-in-right delay-500 relative-sheen w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700/60 disabled:opacity-50 transition-all duration-200 active:scale-95"
          >
            Sign Up with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400 animate-slide-up delay-500">
          Already have an account?{' '}
          <Link href="/login" className="text-atlas-secondary hover:text-atlas-primary transition-colors duration-200">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
