'use client'

import { NETWORK_NODES, OPPORTUNITY_MISSED, OPPORTUNITY_CORRECTION } from './mockData'

export default function NetworkGraph() {
  return (
    <div className="ml-56 grid gap-6 px-8 pb-8 md:grid-cols-2">
      {/* Network Visualization */}
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            🌐 Your Business at a Glance
          </h3>
          <p className="text-xs text-slate-400 mt-1">Active Mode • Hub</p>
        </div>

        {/* Simple SVG Network Graph */}
        <svg className="w-full h-64 bg-slate-800/20 rounded-lg" viewBox="0 0 400 300">
          {/* Network lines */}
          <line x1="200" y1="150" x2="80" y2="60" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
          <line x1="200" y1="150" x2="320" y2="60" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
          <line x1="200" y1="150" x2="200" y2="30" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
          <line x1="200" y1="150" x2="80" y2="240" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
          <line x1="200" y1="150" x2="320" y2="240" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
          <line x1="200" y1="150" x2="200" y2="270" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />

          {/* Nodes */}
          <circle cx="200" cy="150" r="20" fill="#06b6d4" opacity="0.8" className="animate-pulse" />
          <circle cx="80" cy="60" r="15" fill="#06b6d4" opacity="0.6" className="animate-pulse" />
          <circle cx="320" cy="60" r="15" fill="#06b6d4" opacity="0.6" className="animate-pulse" />
          <circle cx="200" cy="30" r="12" fill="#06b6d4" opacity="0.5" className="animate-pulse" />
          <circle cx="80" cy="240" r="14" fill="#06b6d4" opacity="0.5" className="animate-pulse" />
          <circle cx="320" cy="240" r="14" fill="#06b6d4" opacity="0.5" className="animate-pulse" />
          <circle cx="200" cy="270" r="12" fill="#06b6d4" opacity="0.5" className="animate-pulse" />

          {/* Center label */}
          <text x="200" y="155" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
            HUB
          </text>
        </svg>
      </div>

      {/* Opportunities Panel */}
      <div className="space-y-4">
        {/* Missed Opportunity */}
        <div className="rounded-xl border border-white/10 bg-red-900/20 p-6 backdrop-blur-sm border-red-500/30">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-red-400">{OPPORTUNITY_MISSED.title}</p>
            <span className="text-lg">⚠️</span>
          </div>
          <p className="text-sm text-slate-300 mb-4">{OPPORTUNITY_MISSED.problem}</p>
          <div className="flex items-baseline justify-between border-t border-red-500/20 pt-3">
            <p className="text-xs text-slate-400">Impact</p>
            <p className="text-2xl font-bold text-red-400">{OPPORTUNITY_MISSED.impact}</p>
          </div>
          <div className="mt-3 text-center">
            <span className="text-2xl">↓</span>
          </div>
        </div>

        {/* Atlas Correction */}
        <div className="rounded-xl border border-white/10 bg-green-900/20 p-6 backdrop-blur-sm border-green-500/30">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-green-400">{OPPORTUNITY_CORRECTION.title}</p>
            <span className="text-lg">✓</span>
          </div>
          <p className="text-sm text-slate-300 mb-4">{OPPORTUNITY_CORRECTION.solution}</p>
          <div className="flex items-baseline justify-between border-t border-green-500/20 pt-3">
            <p className="text-xs text-slate-400">Speed</p>
            <p className="text-2xl font-bold text-green-400">{OPPORTUNITY_CORRECTION.impact}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
