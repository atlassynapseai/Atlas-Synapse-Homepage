'use client'

import { PricingPlan } from '@/lib/pricing-plans'
import { useState } from 'react'

interface PricingCardProps {
  plan: PricingPlan
  isPopular?: boolean
  onSubscribe: () => void
  isLoading?: boolean
}

export function PricingCard({ plan, isPopular = false, onSubscribe, isLoading = false }: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 ${
        isPopular
          ? 'border-atlas-primary/50 bg-gradient-to-br from-atlas-primary/10 to-atlas-secondary/10 shadow-2xl shadow-atlas-primary/20 scale-105'
          : 'border-white/10 bg-slate-900/60 hover:border-white/20'
      }`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
          <div className="rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-1">
            <span className="text-sm font-semibold text-white">Most Popular</span>
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Plan name and price */}
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-5xl font-bold text-white">${plan.price}</span>
            {plan.price > 0 && <span className="text-slate-400 ml-2">/month</span>}
          </div>
          {plan.price === 0 && <p className="text-slate-400 text-sm mt-1">Forever free</p>}
        </div>

        {/* Subscribe button */}
        {plan.price > 0 && (
          <button
            onClick={onSubscribe}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 mb-8 ${
              isPopular
                ? 'bg-gradient-to-r from-atlas-primary to-atlas-secondary text-white hover:shadow-lg hover:shadow-atlas-primary/50 disabled:opacity-50'
                : 'border border-white/20 text-white hover:border-white/40 hover:bg-slate-800/60 disabled:opacity-50'
            }`}
          >
            {isLoading ? 'Processing...' : 'Subscribe Now'}
          </button>
        )}

        {/* Free plan button */}
        {plan.price === 0 && (
          <button
            onClick={onSubscribe}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-semibold border border-white/20 text-white hover:border-white/40 hover:bg-slate-800/60 transition-all duration-200 mb-8 disabled:opacity-50"
          >
            {isLoading ? 'Getting started...' : 'Get Started'}
          </button>
        )}

        {/* Features list */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Features included</p>
          <ul className="space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <svg className="w-5 h-5 text-atlas-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
