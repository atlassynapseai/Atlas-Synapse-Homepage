'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { PRICING_PLANS } from '@/lib/pricing-plans'
import { PricingCard } from '@/components/PricingCard'

export function PricingSection() {
  const router = useRouter()
  const { user } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push('/auth?mode=signup')
      return
    }

    setError('')
    setLoadingPlan(planId)

    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId: user.id, email: user.email }),
      })

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('Server error — please try again or contact support.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process subscription')
      setLoadingPlan(null)
    }
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Choose the plan that fits your AI governance journey. Always flexible to scale as you grow.
          </p>
          <a
            href="https://www.skool.com/atlas-synapse-ai-systems-9152/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-400/10 px-5 py-2 text-sm font-medium text-purple-400 hover:bg-purple-400/20 hover:border-purple-400/60 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Already a member? Join our Skool community
          </a>
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-6xl mx-auto mb-8 px-4">
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4 text-red-300 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start">
          {Object.values(PRICING_PLANS).map((plan) => (
            <div key={plan.id} className={`relative ${plan.id === 'premium' ? 'pt-5' : ''}`}>
              {plan.id === 'premium' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-purple-400 to-pink-400 px-5 py-1.5 rounded-full shadow-lg shadow-purple-400/40">
                  <span className="text-xs font-bold text-white tracking-wide uppercase">Most Popular</span>
                </div>
              )}
              <PricingCard
                plan={plan}
                isPopular={plan.id === 'premium'}
                isLoading={loadingPlan === plan.id}
                onSubscribe={() => handleSubscribe(plan.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
