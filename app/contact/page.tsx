'use client'

import { useState } from 'react'
import Link from 'next/link'

const SOCIAL_LINKS = [
  { label: 'X / Twitter', href: 'https://x.com/AtlasSynapse', icon: '𝕏' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/atlas-synapse', icon: 'in' },
  { label: 'YouTube', href: 'https://www.youtube.com/@AtlasSynapse', icon: '▶' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to send message')
      setSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-start justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-slate-900/60 p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
            <svg className="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Message sent!</h2>
          <p className="text-slate-400 mb-6">
            Thanks for reaching out. We'll get back to you at <span className="text-white">{form.email}</span> shortly.
          </p>
          <Link href="/" className="text-sm text-atlas-secondary hover:text-atlas-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Header */}
      <div className="text-center mb-16 px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-atlas-primary/30 bg-atlas-primary/10 px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-atlas-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-atlas-primary">Get in Touch</span>
        </div>
        <h1
          className="text-5xl md:text-6xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg,#a855f7,#ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            paddingBottom: '0.15em',
            lineHeight: '1.2',
          }}
        >
          Contact Us
        </h1>
        <p className="text-xl text-slate-400 max-w-xl mx-auto">
          Questions about AI governance, enterprise pricing, or just want to say hello — we're here.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-5 gap-12">

        {/* Left — contact info */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Atlas Synapse LLC</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <svg className="w-4 h-4 text-atlas-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <a href="mailto:company@atlassynapseai.com" className="text-sm text-slate-300 hover:text-white transition-colors">
                    company@atlassynapseai.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Follow Us</h3>
            <div className="space-y-3">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 group-hover:border-atlas-primary/40 group-hover:bg-atlas-primary/10 transition-all">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-atlas-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      {label === 'X / Twitter' && <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />}
                      {label === 'LinkedIn' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />}
                      {label === 'YouTube' && <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />}
                    </svg>
                  </span>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-xl border border-atlas-primary/30 bg-gradient-to-br from-atlas-primary/10 to-atlas-secondary/10 p-5">
            <p className="text-sm font-semibold text-white mb-1">Ready to get started?</p>
            <p className="text-xs text-slate-400 mb-4">Claim your free AI governance audit.</p>
            <Link
              href="/signup"
              className="inline-block rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-all"
            >
              Claim Free Audit →
            </Link>
          </div>
        </div>

        {/* Right — form */}
        <div className="md:col-span-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8">
            {error && (
              <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/30 p-4 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 transition-all hover:border-white/20 focus:border-atlas-primary/50 focus:outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 transition-all hover:border-white/20 focus:border-atlas-primary/50 focus:outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 transition-all hover:border-white/20 focus:border-atlas-primary/50 focus:outline-none"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message <span className="text-red-400">*</span></label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 transition-all hover:border-white/20 focus:border-atlas-primary/50 focus:outline-none resize-none"
                  placeholder="Tell us about your AI governance needs, a question, or anything else..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-3 font-semibold text-white disabled:opacity-50 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-atlas-primary/40"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
