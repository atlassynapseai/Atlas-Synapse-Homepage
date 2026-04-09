'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const SOCIAL_LINKS = [
  { label: 'X / Twitter', href: 'https://x.com/AtlasSynapse' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/atlas-synapse' },
  { label: 'YouTube', href: 'https://www.youtube.com/@AtlasSynapse' },
]

const DIAL_CODES = [
  { dial: '+1', label: '+1 US/CA' },
  { dial: '+44', label: '+44 UK' },
  { dial: '+91', label: '+91 India' },
  { dial: '+61', label: '+61 Australia' },
  { dial: '+64', label: '+64 New Zealand' },
  { dial: '+353', label: '+353 Ireland' },
  { dial: '+27', label: '+27 S. Africa' },
  { dial: '+49', label: '+49 Germany' },
  { dial: '+33', label: '+33 France' },
  { dial: '+34', label: '+34 Spain' },
  { dial: '+39', label: '+39 Italy' },
  { dial: '+31', label: '+31 Netherlands' },
  { dial: '+46', label: '+46 Sweden' },
  { dial: '+47', label: '+47 Norway' },
  { dial: '+45', label: '+45 Denmark' },
  { dial: '+41', label: '+41 Switzerland' },
  { dial: '+43', label: '+43 Austria' },
  { dial: '+32', label: '+32 Belgium' },
  { dial: '+48', label: '+48 Poland' },
  { dial: '+86', label: '+86 China' },
  { dial: '+81', label: '+81 Japan' },
  { dial: '+82', label: '+82 S. Korea' },
  { dial: '+65', label: '+65 Singapore' },
  { dial: '+60', label: '+60 Malaysia' },
  { dial: '+66', label: '+66 Thailand' },
  { dial: '+62', label: '+62 Indonesia' },
  { dial: '+63', label: '+63 Philippines' },
  { dial: '+971', label: '+971 UAE' },
  { dial: '+966', label: '+966 Saudi Arabia' },
  { dial: '+974', label: '+974 Qatar' },
  { dial: '+52', label: '+52 Mexico' },
  { dial: '+55', label: '+55 Brazil' },
  { dial: '+54', label: '+54 Argentina' },
  { dial: '+57', label: '+57 Colombia' },
  { dial: '+20', label: '+20 Egypt' },
  { dial: '+234', label: '+234 Nigeria' },
  { dial: '+254', label: '+254 Kenya' },
  { dial: '+7', label: '+7 Russia' },
]

const HOW_HEARD_OPTIONS = [
  '',
  'Google / Search Engine',
  'LinkedIn',
  'X / Twitter',
  'YouTube',
  'GitHub',
  'Colleague or Referral',
  'Industry Event or Conference',
  'News Article or Press',
  'Prefer not to say',
  'Other',
]

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  '10minutemail.com', 'yopmail.com', 'trashmail.com', 'maildrop.cc',
  'sharklasers.com', 'spam4.me', 'discard.email', 'mailnull.com',
  'spamgourmet.com', 'trashmail.net', 'filzmail.com', 'getonemail.com',
  'dispostable.com', 'tempinbox.com', 'nospam4.us', 'owlpic.com',
  'trashmail.at', 'trashmail.me', 'mt2015.com',
])

const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv'
const MAX_FILE_MB = 10
const MAX_TOTAL_MB = 20

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function validateEmail(email: string): string {
  if (!email.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Enter a valid email address'
  const domain = email.split('@')[1]?.toLowerCase() ?? ''
  if (DISPOSABLE_DOMAINS.has(domain)) return 'Please use a business or personal email address'
  return ''
}

function validatePhone(phone: string): string {
  if (!phone.trim()) return 'Phone number is required'
  const digits = phone.replace(/[\s\-().]/g, '')
  if (!/^\d{6,15}$/.test(digits)) return 'Enter a valid phone number (6–15 digits, no country code)'
  return ''
}

const inputClass = 'w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 transition-all hover:border-white/20 focus:border-purple-400/50 focus:outline-none'
const labelClass = 'block text-sm font-medium text-slate-300 mb-2'

export function ContactSection() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dialCode: '+1',
    company: '', subject: '', message: '', how_heard: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const setField = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
    if (fieldErrors[key]) setFieldErrors(e => ({ ...e, [key]: '' }))
  }

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const next = [...files]
    let totalSize = next.reduce((s, f) => s + f.size, 0)
    for (const file of Array.from(incoming)) {
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`"${file.name}" exceeds the ${MAX_FILE_MB}MB per-file limit`)
        return
      }
      if (totalSize + file.size > MAX_TOTAL_MB * 1024 * 1024) {
        setError(`Total attachments cannot exceed ${MAX_TOTAL_MB}MB`)
        return
      }
      if (!next.find(f => f.name === file.name && f.size === file.size)) {
        next.push(file)
        totalSize += file.size
      }
    }
    setError('')
    setFiles(next)
  }

  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const errors: Record<string, string> = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    const emailErr = validateEmail(form.email)
    if (emailErr) errors.email = emailErr
    const phoneErr = validatePhone(form.phone)
    if (phoneErr) errors.phone = phoneErr
    if (!form.how_heard) errors.how_heard = 'Please let us know how you heard about us'
    if (!form.message.trim()) errors.message = 'Message is required'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('dialCode', form.dialCode)
      fd.append('phone', form.phone)
      fd.append('company', form.company)
      fd.append('subject', form.subject)
      fd.append('message', form.message)
      fd.append('how_heard', form.how_heard)
      files.forEach(f => fd.append('files', f))

      const response = await fetch('/api/contact', { method: 'POST', body: fd })
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
      <section className="py-16">
        <div className="max-w-md mx-auto text-center rounded-2xl border border-white/10 bg-slate-900/60 p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
            <svg className="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Message sent!</h3>
          <p className="text-slate-400 mb-2">
            Thanks for reaching out. We'll get back to you at <span className="text-white">{form.email}</span> within 1–2 business days.
          </p>
          <p className="text-slate-500 text-sm">A confirmation email has been sent to you.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-12 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-1.5 mb-8">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">Get in Touch</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Contact Us
          </h2>
          <p className="text-xl text-slate-400 max-w-xl mx-auto">
            Questions about AI governance, enterprise pricing, or just want to say hello — we're here.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Left — contact info */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Atlas Synapse LLC</h3>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Follow Us</h3>
              <div className="space-y-3">
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 group-hover:border-purple-400/40 group-hover:bg-purple-400/10 transition-all">
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
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

            <div className="rounded-xl border border-purple-400/30 bg-gradient-to-br from-purple-400/10 to-pink-400/10 p-5">
              <p className="text-sm font-semibold text-white mb-1">Ready to get started?</p>
              <p className="text-xs text-slate-400 mb-4">Claim your free AI governance audit.</p>
              <Link href="/Aegis-Prime-Auditor/"
                className="inline-block rounded-full bg-gradient-to-r from-purple-400 to-pink-400 px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-all">
                Claim Free Audit →
              </Link>
            </div>
          </div>

          {/* Right — form */}
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8">
              {error && (
                <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/30 p-4 text-red-300 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Name <span className="text-red-400">*</span></label>
                    <input type="text" value={form.name} onChange={e => setField('name', e.target.value)}
                      className={inputClass} placeholder="Your full name" />
                    {fieldErrors.name && <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Email <span className="text-red-400">*</span></label>
                    <input type="email" value={form.email} onChange={e => setField('email', e.target.value)}
                      className={inputClass} placeholder="you@company.com" />
                    {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className={labelClass}>Phone <span className="text-red-400">*</span></label>
                  <div className="flex">
                    <select
                      value={form.dialCode}
                      onChange={e => setField('dialCode', e.target.value)}
                      className="rounded-l-lg border border-r-0 border-white/10 bg-slate-800/80 px-2 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-purple-400/50 hover:border-white/20 transition-all shrink-0"
                    >
                      {DIAL_CODES.map(d => (
                        <option key={d.dial + d.label} value={d.dial}>{d.label}</option>
                      ))}
                    </select>
                    <input type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)}
                      className="flex-1 rounded-r-lg border border-white/10 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 transition-all hover:border-white/20 focus:border-purple-400/50 focus:outline-none"
                      placeholder="555 000 0000" />
                  </div>
                  {fieldErrors.phone && <p className="mt-1 text-xs text-red-400">{fieldErrors.phone}</p>}
                </div>

                {/* Company + Subject */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Company</label>
                    <input type="text" value={form.company} onChange={e => setField('company', e.target.value)}
                      className={inputClass} placeholder="Your company" />
                  </div>
                  <div>
                    <label className={labelClass}>Subject</label>
                    <input type="text" value={form.subject} onChange={e => setField('subject', e.target.value)}
                      className={inputClass} placeholder="What's this about?" />
                  </div>
                </div>

                {/* How did you hear */}
                <div>
                  <label className={labelClass}>How did you hear about us? <span className="text-red-400">*</span></label>
                  <select
                    value={form.how_heard}
                    onChange={e => setField('how_heard', e.target.value)}
                    className={`${inputClass} ${!form.how_heard ? 'text-slate-500' : ''}`}
                  >
                    {HOW_HEARD_OPTIONS.map(opt => (
                      <option key={opt} value={opt} disabled={opt === ''} className="text-slate-100 bg-slate-800">
                        {opt === '' ? 'Select an option…' : opt}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.how_heard && <p className="mt-1 text-xs text-red-400">{fieldErrors.how_heard}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className={labelClass}>Message <span className="text-red-400">*</span></label>
                  <textarea value={form.message} onChange={e => setField('message', e.target.value)}
                    rows={5} className={`${inputClass} resize-none`}
                    placeholder="Tell us about your AI governance needs, a question, or anything else..." />
                  {fieldErrors.message && <p className="mt-1 text-xs text-red-400">{fieldErrors.message}</p>}
                </div>

                {/* File upload */}
                <div>
                  <label className={labelClass}>
                    Attachments <span className="text-slate-500 font-normal">(optional — images, PDF, Word, Excel, CSV · max {MAX_FILE_MB}MB each)</span>
                  </label>
                  <div
                    className={`relative rounded-lg border-2 border-dashed px-6 py-8 text-center transition-all cursor-pointer ${dragOver ? 'border-purple-400 bg-purple-400/10' : 'border-white/15 bg-slate-800/30 hover:border-white/30 hover:bg-slate-800/50'}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
                  >
                    <input ref={fileInputRef} type="file" multiple accept={ACCEPTED_TYPES}
                      className="hidden" onChange={e => addFiles(e.target.files)} />
                    <svg className="mx-auto mb-3 w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <p className="text-sm text-slate-400">Drag & drop files here, or <span className="text-purple-400 font-medium">browse</span></p>
                    <p className="text-xs text-slate-600 mt-1">Max {MAX_TOTAL_MB}MB total</p>
                  </div>
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {files.map((file, i) => (
                        <li key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-800/40 px-4 py-2.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="text-sm text-slate-300 truncate">{file.name}</span>
                            <span className="text-xs text-slate-500 shrink-0">{formatBytes(file.size)}</span>
                          </div>
                          <button type="button" onClick={() => removeFile(i)}
                            className="ml-3 text-slate-500 hover:text-red-400 transition-colors shrink-0" aria-label="Remove file">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 px-6 py-3 font-semibold text-white disabled:opacity-50 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-purple-400/40">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
