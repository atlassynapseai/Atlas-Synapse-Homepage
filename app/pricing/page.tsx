'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { PRICING_PLANS } from '@/lib/pricing-plans'
import { PricingCard } from '@/components/PricingCard'

export default function PricingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push('/signup')
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

      // Guard: only parse JSON if the response is JSON
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
    <div className="min-h-screen pt-32 pb-20">
      {/* Header */}
      <div className="text-center mb-20 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6"
          style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', paddingBottom: '0.15em', lineHeight: '1.2' }}>
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          Choose the plan that fits your AI governance journey. Always flexible to scale as you grow.
        </p>
        {/* Skool community link */}
        <a
          href="https://www.skool.com/atlas-synapse-ai-systems-9152/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-atlas-primary/40 bg-atlas-primary/10 px-5 py-2 text-sm font-medium text-atlas-primary hover:bg-atlas-primary/20 hover:border-atlas-primary/60 transition-all"
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start">
          {Object.values(PRICING_PLANS).map((plan) => (
            <div key={plan.id} className={`relative ${plan.id === 'premium' ? 'pt-5' : ''}`}>
              {plan.id === 'premium' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-atlas-primary to-atlas-secondary px-5 py-1.5 rounded-full shadow-lg shadow-atlas-primary/40">
                  <span className="text-xs font-bold text-white tracking-wide uppercase">Most Popular</span>
                </div>
              )}
              <PricingCard
                plan={plan}
                isPopular={plan.id === 'premium'}
                onSubscribe={() => handleSubscribe(plan.id)}
                isLoading={loadingPlan === plan.id}
              />
            </div>
          ))}
        </div>
      </div>

      {/* FAQ section */}
      <div className="max-w-4xl mx-auto mt-32 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400">Everything you need to know about our plans</p>
        </div>

        <div className="space-y-6">
          {[
            { q: 'Can I change my plan later?', a: 'Yes! You can upgrade or downgrade your plan anytime. Changes take effect at the end of your billing cycle.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit cards through Stripe. Your payment information is secure and encrypted.' },
            { q: 'Can I cancel my subscription?', a: 'Of course! You can cancel anytime. Your access continues until the end of your billing period.' },
            { q: 'What is the Aegis Prime Auditor?', a: 'Aegis Prime Auditor is our flagship AI governance and audit tooling product. Access level depends on your subscription tier.' },
            { q: 'What are the Q&A sessions?', a: 'Live sessions where you can ask questions about AI governance, compliance, and implementation. Premium and VIP get priority access.' },
            { q: 'What is the AI Governance Roadmap?', a: 'A structured 16-week curriculum covering AI governance frameworks and best practices. Standard tier drip-feeds it weekly; Premium and VIP get instant full access.' },
          ].map((item, idx) => (
            <details key={idx} className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 px-6 py-4 hover:bg-slate-800/60 transition-colors">
                <span className="text-lg font-semibold text-white">{item.q}</span>
                <svg className="h-6 w-6 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="border-x border-b border-white/10 bg-slate-900/40 px-6 py-4 text-slate-300">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
