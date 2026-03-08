import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Atlas Synapse | Trust Engine for AI Systems',
  description: 'Atlas Synapse is the trust layer for agentic AI — governance, verification, and auditability at the boundaries of your AI systems.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050816]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent pt-6">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 py-0 sm:px-6 lg:px-10">
          <a href="/" className="flex h-10 items-center gap-2.5">
            <div className="relative h-8 w-8 shrink-0">
              <img src="/Atlas-Synapse-Homepage/logo.png" alt="Atlas Synapse" />
            </div>
          </a>
          <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
            <a href="/about" className="px-4 py-2 text-slate-300 hover:text-white">
              About Us
            </a>
            <a href="/risks" className="px-4 py-2 text-slate-300 hover:text-white">
              Risks
            </a>
            <a href="/solutions" className="px-4 py-2 text-slate-300 hover:text-white">
              Solutions
            </a>
            <a href="/pricing" className="px-4 py-2 text-slate-300 hover:text-white">
              Pricing
            </a>
            <a href="/contact" className="px-4 py-2 text-slate-300 hover:text-white">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-slate-300 hover:text-white sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-2 text-sm font-semibold text-white"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-20">
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100 mb-6">
            Trust Layer for AI Systems
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Atlas Synapse is the trust layer for agentic AI — governance, verification, and auditability at the boundaries of your AI systems.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-3 font-semibold text-white hover:opacity-95"
            >
              Get Started
            </Link>
            <a
              href="/solutions"
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-slate-300 hover:bg-white/5"
            >
              Learn More
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-xl font-bold text-slate-100 mb-2">Governance</h3>
              <p className="text-slate-400">Policy validation and drift detection across your AI lifecycle.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-xl font-bold text-slate-100 mb-2">Verification</h3>
              <p className="text-slate-400">Output validation, confidence scoring, and data redaction.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-xl font-bold text-slate-100 mb-2">Auditability</h3>
              <p className="text-slate-400">Complete audit trails and evidence packages for compliance.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-400">Choose the perfect plan for your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-lg border border-white/10 bg-slate-900/60 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Standard</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-white">$100</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">Perfect for small teams</p>
              <Link
                href="/pricing"
                className="block w-full text-center rounded-lg border border-white/20 px-4 py-2 font-semibold text-white hover:bg-white/5 mb-6"
              >
                Learn More
              </Link>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✓ Full access to Aegis Prime Auditor</li>
                <li>✓ Advanced reporting</li>
                <li>✓ Email support</li>
              </ul>
            </div>
            <div className="rounded-lg border-2 border-atlas-primary bg-gradient-to-br from-atlas-primary/10 to-atlas-secondary/10 p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-1 rounded-full">
                <span className="text-sm font-semibold text-white">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-white">$300</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">For growing organizations</p>
              <Link
                href="/pricing"
                className="block w-full text-center rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-2 font-semibold text-white hover:opacity-95 mb-6"
              >
                Subscribe Now
              </Link>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✓ All Standard features</li>
                <li>✓ Priority support</li>
                <li>✓ Custom integrations</li>
              </ul>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-900/60 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">VIP</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-white">$1,500</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">Enterprise-grade solution</p>
              <Link
                href="/pricing"
                className="block w-full text-center rounded-lg border border-white/20 px-4 py-2 font-semibold text-white hover:bg-white/5 mb-6"
              >
                Learn More
              </Link>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✓ All Premium features</li>
                <li>✓ Dedicated support</li>
                <li>✓ SLA guarantee</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/pricing"
              className="inline-block rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-8 py-3 font-semibold text-white hover:opacity-95"
            >
              View All Plans
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
