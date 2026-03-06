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
    // Handle OAuth redirect errors
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error && errorDescription) {
      const decodedDescription = decodeURIComponent(errorDescription)

      // Check if this is an email conflict error from OAuth
      if (decodedDescription.includes('Multiple accounts with the same email')) {
        // Store pending provider and redirect to login with linking mode
        const provider = sessionStorage.getItem('pendingLinkProvider') || 'github'
        router.push(`/login?linkProvider=${provider}`)
      }
    }
  }, [searchParams, router])

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

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
