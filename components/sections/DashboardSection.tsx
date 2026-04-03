'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { PRICING_PLANS } from '@/lib/pricing-plans'

interface SubscriptionData {
  subscriptionStatus: string | null
  currentPlan: string | null
  subscriptionEndsAt: string | null
  activeSubscription: any
}

interface ScanRecord {
  id: string
  scan_id: string
  file_desc: string
  total_findings: number
  risk_score: number
  risk_level: string
  created_at: string
}

export function DashboardSection() {
  const { user } = useAuth()
  const router = useRouter()
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([])
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
          setSubscriptionData({ subscriptionStatus: null, currentPlan: null, subscriptionEndsAt: null, activeSubscription: null })
          return
        }
        const data = await response.json()
        if (data.error) {
          setSubscriptionData({ subscriptionStatus: null, currentPlan: null, subscriptionEndsAt: null, activeSubscription: null })
        } else {
          setSubscriptionData(data)
        }

        // Fetch scan history
        const scanRes = await fetch(`/api/scan-results?userId=${user.id}`)
        if (scanRes.ok) {
          const scanData = await scanRes.json()
          setScanHistory((scanData.scans || []).slice(0, 5)) // Limit to 5 recent scans
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

  const auditorAccessLevel = subscriptionData?.currentPlan === 'vip'
    ? 'Enterprise Access'
    : subscriptionData?.currentPlan === 'premium'
      ? 'Full Access'
      : 'Basic Access'

  if (loading) {
    return (
      <section className="relative py-16 text-center">
        <div className="text-slate-400">Loading your workspace...</div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-white/10">
          <h2 className="text-4xl font-bold text-white mb-2">Your Workspace</h2>
          <p className="text-slate-400">Account information, subscription, and products</p>
        </div>

        {error && (
          <div className="mb-8 rounded-lg bg-red-500/20 border border-red-500/50 p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Account info card */}
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6 mb-12">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
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

        {/* Subscription section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Subscription</h3>

          {subscriptionData?.subscriptionStatus === 'active' && currentPlan ? (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Plan card */}
              <div className="md:col-span-2 rounded-lg border border-purple-400/50 bg-gradient-to-br from-purple-400/10 to-pink-400/10 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-3xl font-bold text-white mb-2">{currentPlan.name} Plan</h4>
                    <p className="text-slate-400">${currentPlan.price}/month</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-green-300 text-sm font-semibold">Active</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentPlan.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
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
                  href="/?scroll=pricing"
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
                href="/?scroll=pricing"
                className="inline-block rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 px-8 py-3 font-semibold text-white hover:opacity-95"
              >
                Choose a Plan
              </Link>
            </div>
          )}
        </div>

        {/* Products section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Products & Community</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Aegis Prime Auditor */}
            <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6 hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white">Aegis Prime Auditor</h4>
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
                  ? `${auditorAccessLevel} — AI governance and audit tooling`
                  : 'Available with any active subscription'}
              </p>

              {subscriptionData?.subscriptionStatus === 'active' ? (
                <a
                  href="/Aegis-Prime-Auditor/"
                  className="block w-full text-center rounded-lg border border-purple-400/50 bg-purple-400/10 px-4 py-2 font-semibold text-white hover:bg-purple-400/20 transition-all"
                >
                  Launch Aegis Prime Auditor →
                </a>
              ) : (
                <Link
                  href="/?scroll=pricing"
                  className="block w-full text-center rounded-lg border border-white/20 px-4 py-2 font-semibold text-slate-400 hover:bg-white/5 transition-all"
                >
                  Upgrade to Access
                </Link>
              )}
            </div>

            {/* Skool Community */}
            <a
              href="https://www.skool.com/atlas-synapse-ai-systems-9152/about"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-purple-400/30 bg-gradient-to-br from-purple-400/10 to-pink-400/10 p-6 hover:border-purple-400/60 hover:from-purple-400/15 hover:to-pink-400/15 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">Atlas Synapse Community</h4>
                  <p className="text-sm text-slate-400">Powered by Skool</p>
                </div>
                <svg className="w-5 h-5 text-purple-400 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Join live Q&A sessions, access the AI Governance Roadmap, and connect with other members — all in one place.
              </p>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Open Community →
              </div>
            </a>
          </div>
        </div>

        {/* Recent scans */}
        {scanHistory.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Recent Audits</h3>
            <div className="rounded-lg border border-white/10 bg-slate-900/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">File(s)</th>
                    <th className="px-6 py-3 text-left">Risk</th>
                    <th className="px-6 py-3 text-left">Findings</th>
                    <th className="px-6 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {scanHistory.map(scan => (
                    <tr
                      key={scan.id}
                      onClick={() => router.push(`/dashboard/scan/${scan.scan_id}`)}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{scan.file_desc || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          scan.risk_level === 'CRITICAL' ? 'bg-red-500/20 text-red-300' :
                            scan.risk_level === 'HIGH' ? 'bg-orange-500/20 text-orange-300' :
                              scan.risk_level === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-green-500/20 text-green-300'
                        }`}>
                          {scan.risk_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{scan.total_findings || 0}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
