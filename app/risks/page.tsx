import Link from 'next/link'

const RISKS = [
  {
    icon: '⚖️',
    title: 'Regulatory Risk',
    subtitle: 'Compliance & Enforcement',
    color: 'from-yellow-500/20 to-orange-500/20',
    border: 'border-yellow-500/30',
    accent: 'text-yellow-400',
    description:
      'When AI decisions aren\'t traceable, regulators have nothing to audit. A single unexplainable output can trigger enforcement action, fines, or mandatory remediation programs — all of which compound over time.',
    examples: [
      'NYDFS Part 500 violations from unaudited AI decisions',
      'GDPR enforcement for unexplainable automated decisions',
      'SEC scrutiny of AI-driven financial recommendations',
      'HIPAA breaches from uncontrolled AI outputs in healthcare',
    ],
    stat: { value: '$4.5M', label: 'avg. regulatory fine for AI non-compliance' },
  },
  {
    icon: '📉',
    title: 'Financial Risk',
    subtitle: 'Revenue & Remediation',
    color: 'from-red-500/20 to-pink-500/20',
    border: 'border-red-500/30',
    accent: 'text-red-400',
    description:
      'Unchecked AI decisions don\'t just fail once — they scale failure. The cost of remediating a single AI-driven financial error multiplies across every downstream system that trusted that output.',
    examples: [
      'Chargeback spikes from AI-approved fraudulent transactions',
      'Revenue loss from false positives blocking legitimate users',
      'Remediation costs scaling with automated system reach',
      'Customer refunds from incorrect AI-generated pricing',
    ],
    stat: { value: '3.4×', label: 'higher remediation cost without an audit trail' },
  },
  {
    icon: '🛡️',
    title: 'Trust Risk',
    subtitle: 'Brand & Customer Confidence',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    accent: 'text-blue-400',
    description:
      'Public trust erodes the moment an AI output is wrong and unverifiable. Once customers or partners lose confidence in your AI systems, rebuilding that trust takes far longer than preventing the failure would have.',
    examples: [
      'Viral incidents from AI chatbots giving harmful advice',
      'Partner contract losses after unvetted AI integrations',
      'Customer churn from opaque automated decisions',
      'Press scrutiny after AI model behavior is questioned',
    ],
    stat: { value: '67%', label: 'of users distrust AI systems after one bad experience' },
  },
  {
    icon: '🔐',
    title: 'Data Risk',
    subtitle: 'PII & Sensitive Exposure',
    color: 'from-purple-500/20 to-violet-500/20',
    border: 'border-purple-500/30',
    accent: 'text-purple-400',
    description:
      'Sensitive data in prompts or AI outputs can reach the wrong systems silently. Without active masking and logging at every boundary, PII leaks, IP exposure, and data sovereignty violations go undetected.',
    examples: [
      'PII in LLM prompts sent to third-party model providers',
      'Unredacted customer data in AI-generated reports',
      'Trade secrets exposed through AI-assisted code generation',
      'Cross-tenant data leakage in multi-tenant AI systems',
    ],
    stat: { value: '$8.6M', label: 'avg. cost of a data breach involving AI systems' },
  },
]

export default function RisksPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <div className="text-center mb-20 px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-red-400">AI Risk Analysis</span>
        </div>
        <h1
          className="text-5xl md:text-6xl font-bold mb-6"
          style={{
            background: 'linear-gradient(135deg,#f97316,#ef4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            paddingBottom: '0.15em',
            lineHeight: '1.2',
          }}
        >
          When trust fails,<br />damage compounds.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          Unchecked AI decisions don't fail once — they cascade across every system that trusted that output.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/solutions"
            className="rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all hover:scale-105"
          >
            See How We Fix This →
          </Link>
          <Link
            href="/?scroll=pricing"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-all"
          >
            View Plans
          </Link>
        </div>
      </div>

      {/* Risk cards */}
      <div className="max-w-6xl mx-auto px-4 space-y-8 mb-24">
        {RISKS.map((risk, i) => (
          <div
            key={i}
            className={`rounded-2xl border ${risk.border} bg-gradient-to-br ${risk.color} p-8`}
          >
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Left: title + stat */}
              <div>
                <div className="text-4xl mb-4">{risk.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-1">{risk.title}</h2>
                <p className={`text-sm font-semibold uppercase tracking-wider mb-6 ${risk.accent}`}>
                  {risk.subtitle}
                </p>
                <div className={`rounded-xl border ${risk.border} bg-black/20 p-4`}>
                  <p className={`text-3xl font-black mb-1 ${risk.accent}`}>{risk.stat.value}</p>
                  <p className="text-xs text-slate-400">{risk.stat.label}</p>
                </div>
              </div>

              {/* Middle: description */}
              <div>
                <p className="text-slate-300 leading-relaxed mb-4">{risk.description}</p>
              </div>

              {/* Right: examples */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Real-world examples</p>
                <ul className="space-y-2">
                  {risk.examples.map((ex, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-red-400 mt-0.5 shrink-0">▸</span>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="rounded-2xl border border-atlas-primary/30 bg-gradient-to-br from-atlas-primary/10 to-atlas-secondary/10 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            These risks are solvable.
          </h2>
          <p className="text-slate-400 mb-8">
            Atlas Synapse gives your AI systems a trust layer — governance, input validation,
            output verification, and a full audit trail at every boundary.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/solutions"
              className="rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-8 py-3 font-semibold text-white hover:opacity-90 transition-all hover:scale-105"
            >
              Explore Solutions
            </Link>
            <Link
              href="/?scroll=pricing"
              className="rounded-full border border-white/20 px-8 py-3 font-semibold text-slate-300 hover:bg-white/5 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
