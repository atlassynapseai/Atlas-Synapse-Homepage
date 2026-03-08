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
    // If user is not logged in, redirect to signup
    if (!user) {
      router.push('/signup')
      return
    }

    // If selecting free plan, just redirect to dashboard
    if (planId === 'free') {
      router.push('/dashboard')
      return
    }

    setError('')
    setLoadingPlan(planId)

    try {
      // Create checkout session (this endpoint will be created in Phase 6)
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { sessionUrl } = await response.json()

      // Redirect to Stripe checkout
      if (sessionUrl) {
        window.location.href = sessionUrl
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process subscription')
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] pt-32 pb-20">
      {/* Header */}
      <div className="text-center mb-20 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-atlas-primary to-atlas-secondary">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. Always flexible to scale as you grow.
        </p>
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
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {Object.values(PRICING_PLANS).map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isPopular={plan.id === 'premium'}
              onSubscribe={() => handleSubscribe(plan.id)}
              isLoading={loadingPlan === plan.id}
            />
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
            {
              q: 'Can I change my plan later?',
              a: 'Yes! You can upgrade or downgrade your plan anytime. Changes take effect at the end of your billing cycle.',
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes, start with our free plan to explore all features. Upgrade whenever you\'re ready.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards through Stripe. Your payment information is secure and encrypted.',
            },
            {
              q: 'Can I cancel my subscription?',
              a: 'Of course! You can cancel anytime. Your access continues until the end of your billing period.',
            },
            {
              q: 'Do you offer enterprise plans?',
              a: 'Yes! The VIP plan is our enterprise solution. For custom needs, please contact our sales team.',
            },
            {
              q: 'What if I need help?',
              a: 'Our support team is here to help. Premium and VIP plans include priority support.',
            },
          ].map((item, idx) => (
            <details key={idx} className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 px-6 py-4 hover:bg-slate-800/60 transition-colors">
                <span className="text-lg font-semibold text-white">{item.q}</span>
                <svg
                  className="h-6 w-6 text-slate-400 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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
