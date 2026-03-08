import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Atlas Synapse | Trust Engine for AI Systems',
  description: 'Atlas Synapse is the trust layer for agentic AI — governance, verification, and auditability at the boundaries of your AI systems.',
}

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* Floating background orbs */}
      <div className="orb orb-purple" style={{ top: '-100px', left: '-100px' }} />
      <div className="orb orb-blue" style={{ bottom: '20%', right: '-80px' }} />
      <div className="orb orb-cyan" style={{ top: '50%', left: '30%' }} />

      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5"
        style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(25px)' }}>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <a href="/" className="flex h-10 items-center gap-2.5 animate-slide-in-left">
            <div className="relative h-9 w-9 shrink-0 animate-glow-pulse" style={{ borderRadius: '10px' }}>
              <img src="/logo.png" alt="Atlas Synapse" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Atlas Synapse</span>
          </a>
          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {['About Us','Risks','Solutions','Pricing','Contact'].map((item, i) => (
              <a
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors duration-200 relative group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-atlas-primary to-atlas-secondary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 animate-slide-in-right">
            <Link href="/login" className="hidden text-sm font-medium text-slate-300 hover:text-white transition-colors sm:inline-block">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="relative-sheen sheen rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-5 py-2 text-sm font-semibold text-white hover:shadow-lg hover:shadow-atlas-primary/40 transition-all duration-300 hover:scale-105"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-36 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-atlas-primary/30 bg-atlas-primary/10 px-4 py-1.5 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="h-2 w-2 rounded-full bg-atlas-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-atlas-primary">Live Now — Trusted by AI Teams</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.2s', background: 'linear-gradient(135deg, #fff 0%, #a855f7 60%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            Trust Engine for<br />AI Systems
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.3s' }}>
            Atlas Synapse is the trust layer for agentic AI — governance, verification, and auditability at the boundaries of your AI systems.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/signup" className="btn-primary inline-block">
              Get Started Free
            </Link>
            <a
              href="/solutions"
              className="relative-sheen rounded-xl border border-white/15 bg-white/5 px-7 py-3 font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105"
            >
              See How It Works
            </a>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">The AI Trust Stack</h2>
            <p className="text-slate-400 text-lg">Everything you need to govern, verify, and audit your AI systems</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🛡️',
                title: 'Governance',
                desc: 'Policy validation and drift detection across your entire AI lifecycle. Enforce rules before they become incidents.',
                delay: '0s',
              },
              {
                icon: '✅',
                title: 'Verification',
                desc: 'Output validation, confidence scoring, and intelligent data redaction. Know that your AI is saying what it should.',
                delay: '0.1s',
              },
              {
                icon: '📋',
                title: 'Auditability',
                desc: 'Complete audit trails and evidence packages for compliance. Full transparency at every boundary of your AI systems.',
                delay: '0.2s',
              },
            ].map(({ icon, title, desc, delay }) => (
              <div key={title} className="atlas-card p-8 animate-fade-in-up" style={{ animationDelay: delay }}>
                <div
                  className="text-4xl mb-5 inline-block"
                  style={{ animation: 'bounce 2s ease-in-out infinite', animationDelay: delay }}
                >
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-400">Choose the perfect plan for your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Standard */}
            <div className="atlas-card p-8 animate-fade-in-up" style={{ animationDelay: '0s' }}>
              <h3 className="text-2xl font-bold text-white mb-2">Standard</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black text-white">$100</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">Perfect for small teams</p>
              <Link href="/pricing" className="block w-full text-center rounded-xl border border-white/15 px-4 py-2.5 font-semibold text-white hover:bg-white/10 mb-6 transition-colors">
                Learn More
              </Link>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Full access to Aegis Prime Auditor</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Advanced reporting</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Email support</li>
              </ul>
            </div>

            {/* Premium - popular */}
            <div className="atlas-card p-8 animate-fade-in-up relative animate-border-glow" style={{ animationDelay: '0.1s', borderColor: 'rgba(168,85,247,0.5)' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-atlas-primary to-atlas-secondary px-5 py-1.5 rounded-full shadow-lg shadow-atlas-primary/30">
                <span className="text-xs font-bold text-white tracking-wide uppercase">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black text-white">$300</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">For growing organizations</p>
              <Link href="/pricing" className="relative-sheen sheen block w-full text-center rounded-xl bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-2.5 font-semibold text-white hover:shadow-lg hover:shadow-atlas-primary/40 mb-6 transition-all">
                Subscribe Now
              </Link>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> All Standard features</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Priority support</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Custom integrations</li>
              </ul>
            </div>

            {/* VIP */}
            <div className="atlas-card p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-bold text-white mb-2">VIP</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-black text-white">$1,500</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">Enterprise-grade solution</p>
              <Link href="/pricing" className="block w-full text-center rounded-xl border border-white/15 px-4 py-2.5 font-semibold text-white hover:bg-white/10 mb-6 transition-colors">
                Contact Sales
              </Link>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> All Premium features</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Dedicated support</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> SLA guarantee</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/pricing" className="btn-primary inline-block">
              View All Plans
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 text-center animate-fade-in-up">
          <div className="atlas-card p-12">
            <h2 className="text-4xl font-black text-white mb-4" style={{ background: 'linear-gradient(135deg, #fff 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Ready to Trust Your AI?
            </h2>
            <p className="text-slate-400 text-lg mb-8">Join teams using Atlas Synapse to govern and verify their AI systems.</p>
            <Link href="/signup" className="btn-primary inline-block">
              Start Free Today
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-slate-500 text-sm" style={{ background: 'rgba(15,23,42,0.5)' }}>
        <p>© 2026 Atlas Synapse. All rights reserved.</p>
      </footer>
    </div>
  )
}
