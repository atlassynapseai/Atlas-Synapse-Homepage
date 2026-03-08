'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface ProtectedRouteProps {
  children: ReactNode
  requireSubscription?: boolean
}

/**
 * Wraps a component to protect it with authentication
 * If user is not logged in, redirects to /login
 * If requireSubscription is true and user has no active subscription, redirects to /pricing
 */
export function ProtectedRoute({ children, requireSubscription = false }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/login')
      return
    }

    // TODO: Check subscription status from database
    // if (requireSubscription && !hasActiveSubscription) {
    //   router.push('/pricing')
    // }
  }, [user, loading, router, requireSubscription])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816]">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
