'use client'

import Link from 'next/link'

interface HeroSectionProps {
  isLoggedIn: boolean
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center text-center py-20 px-4 overflow-hidden">
      {/* Animated orbs background */}
      <div className="absolute top-[5%] left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-400 to-blue-900 blur-[90px] opacity-20 animate-float pointer-events-none" style={{ animationDelay: '0s', animationDuration: '25s' }} />
      <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-purple-400 to-purple-900 blur-[90px] opacity-20 animate-float pointer-events-none" style={{ animationDelay: '7s', animationDuration: '25s' }} />
      <div className="absolute top-[45%] right-[15%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-cyan-400 to-cyan-900 blur-[90px] opacity-20 animate-float pointer-events-none" style={{ animationDelay: '14s', animationDuration: '25s' }} />

      {/* Content */}
      <div className="relative z-10">
        {/* Logo/Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 mb-8 animate-fadeInUp">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Enterprise AI Governance</span>
        </div>

        {/* Main heading */}
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent leading-tight animate-slideDown">
          Setting the Trust Layer of the AI Era
        </h2>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-slate-400 mb-4 font-light tracking-wide animate-slideDown" style={{ animationDelay: '0.3s' }}>
          Sovereign AI Infrastructure
        </p>

        {/* Subtitle */}
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-slideDown" style={{ animationDelay: '0.6s' }}>
          Build auditable, deterministic AI systems for $10M+ enterprises. Complete security, compliance, and control—no vendor lock-in.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-6 justify-center flex-wrap animate-slideDown" style={{ animationDelay: '0.9s' }}>
          {isLoggedIn ? (
            <>
              <Link
                href="/?scroll=portal"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105 transition-all active:scale-95"
              >
                Go to Portal
              </Link>
              <Link
                href="/?scroll=dashboard"
                className="px-8 py-3 rounded-lg border border-white/20 bg-slate-800/60 text-white font-semibold hover:border-white/40 hover:bg-slate-700/60 transition-all"
              >
                View Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth?mode=signup"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105 transition-all active:scale-95"
              >
                Get Started
              </Link>
              <Link
                href="/Aegis-Prime-Auditor/"
                className="px-8 py-3 rounded-lg border border-white/20 bg-slate-800/60 text-white font-semibold hover:border-white/40 hover:bg-slate-700/60 transition-all"
              >
                Free AI Audit
              </Link>
            </>
          )}
        </div>

        {/* Stats/Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-16 border-t border-white/10 max-w-4xl mx-auto">
          <div className="animate-slideDown" style={{ animationDelay: '1.2s' }}>
            <p className="text-2xl md:text-3xl font-bold text-white">$10M+</p>
            <p className="text-sm text-slate-500 mt-1">Min Enterprise Value</p>
          </div>
          <div className="animate-slideDown" style={{ animationDelay: '1.4s' }}>
            <p className="text-2xl md:text-3xl font-bold text-white">100%</p>
            <p className="text-sm text-slate-500 mt-1">Audit Trail Compliance</p>
          </div>
          <div className="animate-slideDown" style={{ animationDelay: '1.6s' }}>
            <p className="text-2xl md:text-3xl font-bold text-white">&lt;1s</p>
            <p className="text-sm text-slate-500 mt-1">Runtime Verification</p>
          </div>
          <div className="animate-slideDown" style={{ animationDelay: '1.8s' }}>
            <p className="text-2xl md:text-3xl font-bold text-white">∞</p>
            <p className="text-sm text-slate-500 mt-1">Vendor Independence</p>
          </div>
        </div>
      </div>
    </section>
  )
}
