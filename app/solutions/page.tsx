import Link from 'next/link'

const LAYERS = [
  {
    icon: '✅',
    tag: 'VERIFY',
    title: 'Output Verification',
    description: 'Every AI output is scored, redacted where necessary, and logged before it reaches your users or downstream systems. Nothing leaves unexamined.',
    points: [
      'Confidence scoring on every model output',
      'Automatic PII and sensitive data redaction',
      'Immutable output audit log with timestamps',
      'Threshold-based blocking for low-confidence results',
    ],
    color: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/30',
    accent: 'text-green-400',
    tag_bg: 'bg-green-500/20 border-green-500/40',
  },
  {
    icon: '🔍',
    tag: 'VALIDATE',
    title: 'Input Validation',
    description: 'Risky inputs are masked, blocked, or rerouted before they ever reach your model. Stop prompt injection, PII leakage, and policy violations at the boundary.',
    points: [
      'Prompt injection and jailbreak detection',
      'PII masking before inputs reach the model',
      'Keyword and intent-based routing rules',
      'Configurable block/allow lists per use case',
    ],
    color: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/30',
    accent: 'text-blue-400',
    tag_bg: 'bg-blue-500/20 border-blue-500/40',
  },
  {
    icon: '📋',
    tag: 'GOVERN',
    title: 'Policy Enforcement',
    description: 'Define your AI governance policy once. Atlas Synapse enforces it everywhere — across models, teams, and integrations — consistently and automatically.',
    points: [
      'Centralised policy definition and versioning',
      'Enforcement across all connected AI systems',
      'Role-based access to AI capabilities',
      'Real-time policy violation alerts',
    ],
    color: 'from-purple-500/10 to-violet-500/10',
    border: 'border-purple-500/30',
    accent: 'text-purple-400',
    tag_bg: 'bg-purple-500/20 border-purple-500/40',
  },
]

const AUDIT_ENTRIES = [
  { key: 'event_type', value: 'output_verified', ok: true },
  { key: 'pii_detected', value: 'true → redacted', ok: true },
  { key: 'confidence_score', value: '0.94', ok: true },
  { key: 'policy_applied', value: 'v2.1.0', ok: true },
  { key: 'audit_event_written', value: 'immutable', ok: true },
]

export default function SolutionsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero */}
      <div className="text-center mb-20 px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-atlas-primary/30 bg-atlas-primary/10 px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-atlas-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-atlas-primary">What We Offer</span>
        </div>
        <h1
          className="text-5xl md:text-6xl font-bold mb-6"
          style={{
            background: 'linear-gradient(135deg,#a855f7,#ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            paddingBottom: '0.15em',
            lineHeight: '1.2',
          }}
        >
          One Trust Stack.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-4">
          Govern policy. Validate inputs. Verify outputs.
        </p>
        <p className="text-slate-500 max-w-xl mx-auto mb-8">
          A single layer that sits between your team and your AI systems — enforcing rules,
          catching risks, and writing an audit trail at every step.
        </p>
        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { icon: '📜', label: 'Audit Trail' },
            { icon: '🛡️', label: 'Policy Enforcement' },
            { icon: '🎛️', label: 'Input Controls' },
            { icon: '✅', label: 'Output Verification' },
          ].map(({ icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
              {icon} {label}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/pricing"
            className="rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            href="/risks"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-all"
          >
            View the Risks
          </Link>
        </div>
      </div>

      {/* Three layers */}
      <div className="max-w-6xl mx-auto px-4 space-y-6 mb-24">
        {LAYERS.map((layer, i) => (
          <div
            key={i}
            className={`rounded-2xl border ${layer.border} bg-gradient-to-br ${layer.color} p-8`}
          >
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Tag + title */}
              <div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-widest mb-4 ${layer.tag_bg} ${layer.accent}`}>
                  {layer.icon} {layer.tag}
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">{layer.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{layer.description}</p>
              </div>

              {/* Points */}
              <div className="md:col-span-2">
                <div className="grid sm:grid-cols-2 gap-3">
                  {layer.points.map((point, j) => (
                    <div key={j} className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 p-4">
                      <svg className={`w-5 h-5 shrink-0 mt-0.5 ${layer.accent}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-slate-300">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audit log demo */}
      <div className="max-w-6xl mx-auto px-4 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-atlas-primary mb-4">Full Observability</p>
            <h2 className="text-3xl font-bold text-white mb-4">Every decision. On record.</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Every input validated, every output verified, every policy applied — written to an
              immutable audit log. When regulators ask, you have answers. When something goes wrong,
              you know exactly where and why.
            </p>
            <ul className="space-y-3">
              {['Tamper-proof event log for every AI interaction', 'Exportable reports for compliance and audit', 'Searchable history across all AI sessions', 'Retention policies configurable per regulation'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <svg className="w-4 h-4 text-atlas-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Audit log visual */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-slate-500 text-xs ml-2">audit_event.log</span>
            </div>
            <div className="space-y-3">
              {AUDIT_ENTRIES.map(({ key, value, ok }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-500">{key}</span>
                  <span className="flex items-center gap-1.5 text-green-400">
                    {ok && <span className="text-green-500">✓</span>}
                    {value}
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-slate-500">status</span>
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-bold">COMPLIANT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="rounded-2xl border border-atlas-primary/30 bg-gradient-to-br from-atlas-primary/10 to-atlas-secondary/10 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to add a trust layer?
          </h2>
          <p className="text-slate-400 mb-8">
            Join the Atlas Synapse community and start building AI systems your stakeholders
            can actually trust.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pricing"
              className="rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-8 py-3 font-semibold text-white hover:opacity-90 transition-all hover:scale-105"
            >
              View Plans
            </Link>
            <Link
              href="/auth?mode=signup"
              className="rounded-full border border-white/20 px-8 py-3 font-semibold text-slate-300 hover:bg-white/5 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
