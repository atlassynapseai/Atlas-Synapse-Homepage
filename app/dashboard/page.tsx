'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { PRICING_PLANS } from '@/lib/pricing-plans'
import { ProtectedRoute } from '@/components/ProtectedRoute'

interface SubscriptionData {
  subscriptionStatus: string | null
  currentPlan: string | null
  subscriptionEndsAt: string | null
  activeSubscription: any
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch(`/api/subscription?userId=${user.id}`)
        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
          // Route not found or server error - show no subscription state
          setSubscriptionData({ subscriptionStatus: null, currentPlan: null, subscriptionEndsAt: null, activeSubscription: null })
          return
        }
        const data = await response.json()
        if (data.error) {
          // Server returned an error JSON - show no subscription state silently
          setSubscriptionData({ subscriptionStatus: null, currentPlan: null, subscriptionEndsAt: null, activeSubscription: null })
        } else {
          setSubscriptionData(data)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptionData()
  }, [user])

  const handleBillingPortal = async () => {
    setPortalLoading(true)
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      })

      if (!response.ok) throw new Error('Failed to open billing portal')
      const { url } = await response.json()
      window.location.href = url
    } catch (err: any) {
      setError(err.message)
      setPortalLoading(false)
    }
  }

  const currentPlan = subscriptionData?.currentPlan ? PRICING_PLANS[subscriptionData.currentPlan as keyof typeof PRICING_PLANS] : null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050816] pt-32 pb-20">
        {/* Header */}
        <div className="border-b border-white/10 mb-12 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Welcome to your Atlas Synapse workspace</p>
              </div>
              <Link href="/" className="text-slate-400 hover:text-white">
                ← Back to Home
              </Link>
            </div>

            {/* User info card */}
            <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">User ID</p>
                  <p className="text-white font-mono text-sm">{user?.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          {error && (
            <div className="mb-8 rounded-lg bg-red-500/20 border border-red-500/50 p-4 text-red-300 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-slate-400">Loading subscription information...</div>
            </div>
          ) : (
            <>
              {/* Subscription section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Subscription</h2>

                {subscriptionData?.subscriptionStatus === 'active' && currentPlan ? (
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {/* Plan card */}
                    <div className="md:col-span-2 rounded-lg border border-atlas-primary/50 bg-gradient-to-br from-atlas-primary/10 to-atlas-secondary/10 p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2">{currentPlan.name} Plan</h3>
                          <p className="text-slate-400">${currentPlan.price}/month</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-300 text-sm font-semibold">Active</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {currentPlan.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-300">
                            <svg className="w-5 h-5 text-atlas-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={handleBillingPortal}
                        disabled={portalLoading}
                        className="w-full rounded-lg bg-slate-800 border border-white/20 px-4 py-3 font-semibold text-white hover:bg-slate-700/60 disabled:opacity-50 transition-all"
                      >
                        {portalLoading ? 'Loading...' : 'Manage Billing'}
                      </button>
                      <Link
                        href="/pricing"
                        className="block w-full text-center rounded-lg border border-white/20 px-4 py-3 font-semibold text-white hover:bg-white/5 transition-all"
                      >
                        Change Plan
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/10 bg-slate-900/60 p-8 text-center">
                    <p className="text-slate-400 mb-6">You don't have an active subscription yet.</p>
                    <Link
                      href="/pricing"
                      className="inline-block rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-8 py-3 font-semibold text-white hover:opacity-95"
                    >
                      Choose a Plan
                    </Link>
                  </div>
                )}
              </div>

              {/* Products section */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Products & Community</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Aegis Prime Auditor */}
                  <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6 hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">Aegis Prime Auditor</h3>
                        <p className="text-sm text-slate-400">Advanced AI system auditing</p>
                      </div>
                      {subscriptionData?.subscriptionStatus === 'active' && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded">
                          <span className="text-green-300 text-xs font-semibold">Unlocked</span>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-400 text-sm mb-6">
                      {subscriptionData?.subscriptionStatus === 'active'
                        ? 'Full access to all auditing features'
                        : `Available with ${currentPlan?.name || 'Premium'} plan and above`}
                    </p>

                    <button className="w-full rounded-lg border border-white/20 px-4 py-2 font-semibold text-white hover:bg-white/5 transition-all disabled:opacity-50"
                      disabled={subscriptionData?.subscriptionStatus !== 'active'}>
                      {subscriptionData?.subscriptionStatus === 'active' ? 'Launch' : 'Upgrade to Access'}
                    </button>
                  </div>

                  {/* Skool Community */}
                  <a
                    href="https://www.skool.com/atlas-synapse-ai-systems-9152/about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-atlas-primary/30 bg-gradient-to-br from-atlas-primary/10 to-atlas-secondary/10 p-6 hover:border-atlas-primary/60 hover:from-atlas-primary/15 hover:to-atlas-secondary/15 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-atlas-primary transition-colors">Atlas Synapse Community</h3>
                        <p className="text-sm text-slate-400">Powered by Skool</p>
                      </div>
                      <svg className="w-5 h-5 text-atlas-primary shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-slate-400 text-sm mb-6">
                      Join live Q&amp;A sessions, access the AI Governance Roadmap, and connect with other members — all in one place.
                    </p>
                    <div className="flex items-center gap-2 text-atlas-primary text-sm font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Open Community →
                    </div>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
