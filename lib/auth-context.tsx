'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error && errorDescription) {
      const decodedDescription = decodeURIComponent(errorDescription)
      if (decodedDescription.includes('Multiple accounts with the same email')) {
        const provider = sessionStorage.getItem('pendingLinkProvider') || 'github'
        router.push(`/login?linkProvider=${provider}`)
      }
    }
  }, [searchParams, router])

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // After any sign-in, link pending scan if present (set by Auditor banner flow)
      if (_event === 'SIGNED_IN' && session?.user) {
        const pendingScanId = sessionStorage.getItem('pendingScanId')
        if (pendingScanId) {
          sessionStorage.removeItem('pendingScanId')
          try {
            await fetch('/api/scan-results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ scanId: pendingScanId, userId: session.user.id }),
            })
          } catch (_) {}
          // Send user to dashboard so they see their scan history
          router.push('/dashboard')
        }

        // OAuth-specific: check if profile is complete
        const provider = session.user.app_metadata?.provider
        const isOAuth = provider === 'google' || provider === 'github'
        const currentPath = window.location.pathname

        if (isOAuth && currentPath !== '/complete-profile') {
          const { data: profile } = await supabase
            .from('users')
            .select('company')
            .eq('id', session.user.id)
            .single()

          if (!profile?.company) {
            router.push('/complete-profile')
          }
        }
      }
    })

    return () => subscription?.unsubscribe()
  }, [router])

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
