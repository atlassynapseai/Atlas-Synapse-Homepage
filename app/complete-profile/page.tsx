'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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

const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv'
const MAX_FILE_MB = 10
const MAX_TOTAL_MB = 20

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function validatePhone(phone: string): string {
  if (!phone.trim()) return 'Phone number is required'
  const digits = phone.replace(/[\s\-().]/g, '')
  if (!/^\d{6,15}$/.test(digits)) return 'Enter a valid phone number (6–15 digits, no country code)'
  return ''
}

function CompleteProfileInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    company: '', jobTitle: '', phone: '', dialCode: '+1',
    subject: '', how_heard: '', message: ''
  })
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace('/login')
        return
      }
      setUser(user)

      // Pre-fill if profile partially exists
      const { data: profile } = await supabase
        .from('users')
        .select('phone, company, job_title')
        .eq('id', user.id)
        .single()

      if (profile) {
        if (profile.company) setForm(f => ({ ...f, company: profile.company }))
        if (profile.job_title) setForm(f => ({ ...f, jobTitle: profile.job_title }))
        if (profile.phone) {
          // Parse stored phone format: "+1 555 000 0000"
          const phoneMatch = profile.phone.match(/^(\+\d+)\s(.*)$/)
          if (phoneMatch) {
            setForm(f => ({ ...f, dialCode: phoneMatch[1], phone: phoneMatch[2] }))
          }
        }
      }

      setLoading(false)
    })
  }, [router])

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

    // Validation
    if (!form.company.trim()) errors.company = 'Company is required'
    if (!form.jobTitle.trim()) errors.jobTitle = 'Job Title is required'
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else {
      const phoneErr = validatePhone(form.phone)
      if (phoneErr) errors.phone = phoneErr
    }
    if (!form.subject.trim()) errors.subject = 'Subject is required'
    if (!form.how_heard) errors.how_heard = 'Please select how you heard about us'
    if (!form.message.trim()) errors.message = 'Message is required'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setSaving(true)

    try {
      // Combine dial code and phone for storage
      const fullPhone = `${form.dialCode} ${form.phone}`

      // Save profile to users table
      const { error: upsertError } = await supabase.from('users').upsert({
        id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        phone: fullPhone,
        company: form.company,
        job_title: form.jobTitle,
      })

      if (upsertError) throw upsertError

      // Also save to contact_submissions for team record
      const formData = new FormData()
      formData.append('name', user.user_metadata?.full_name || user.user_metadata?.name || '')
      formData.append('email', user.email!)
      formData.append('dialCode', form.dialCode)
      formData.append('phone', form.phone)
      formData.append('company', form.company)
      formData.append('subject', form.subject)
      formData.append('how_heard', form.how_heard)
      formData.append('message', form.message)

      files.forEach(file => formData.append('files', file))

      const contactRes = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      })

      if (!contactRes.ok) {
        const data = await contactRes.json()
        throw new Error(data.error || 'Failed to save contact info')
      }

      // Notify team of profile completion
      fetch('/api/notify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          email: user.email,
          phone: fullPhone,
          company: form.company,
          jobTitle: form.jobTitle,
          subject: form.subject,
          how_heard: form.how_heard,
          message: form.message,
          provider: user.app_metadata?.provider || 'oauth',
        }),
      }).catch(() => { })

      // Link any pending scan result from OAuth flow
      const pendingScanId = sessionStorage.getItem('pendingScanId')
      if (pendingScanId) {
        await fetch('/api/scan-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, scanId: pendingScanId }),
        })
        sessionStorage.removeItem('pendingScanId')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 transition-all hover:border-white/20 focus:border-atlas-primary/50 focus:outline-none'
  const labelClass = 'block text-sm font-medium text-slate-300 mb-2'
  const errorClass = 'text-xs text-red-400 mt-1'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="Atlas Synapse" className="h-8 w-8 object-contain" />
            <span className="font-bold text-white text-base tracking-tight">Atlas Synapse</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-sm text-slate-400">
            Just a few details so we can personalize your experience.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8">
          {error && (
            <div className="mb-5 rounded-lg bg-red-500/20 border border-red-500/30 p-4 text-red-300 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company & Job Title */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  Company <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={e => setField('company', e.target.value)}
                  className={inputClass}
                  placeholder="Acme Corp"
                  required
                />
                {fieldErrors.company && <div className={errorClass}>{fieldErrors.company}</div>}
              </div>

              <div>
                <label className={labelClass}>
                  Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={e => setField('jobTitle', e.target.value)}
                  className={inputClass}
                  placeholder="CTO / CISO / AI Lead"
                  required
                />
                {fieldErrors.jobTitle && <div className={errorClass}>{fieldErrors.jobTitle}</div>}
              </div>
            </div>

            {/* Phone with Country Code */}
            <div>
              <label className={labelClass}>
                Phone <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={form.dialCode}
                  onChange={e => setField('dialCode', e.target.value)}
                  className="w-28 rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2.5 text-slate-100 transition-all hover:border-white/20 focus:border-atlas-primary/50 focus:outline-none"
                >
                  {DIAL_CODES.map(d => (
                    <option key={d.dial} value={d.dial}>{d.label}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setField('phone', e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="555 000 0000"
                  required
                />
              </div>
              {fieldErrors.phone && <div className={errorClass}>{fieldErrors.phone}</div>}
            </div>

            {/* Subject */}
            <div>
              <label className={labelClass}>
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setField('subject', e.target.value)}
                className={inputClass}
                placeholder="What's this about?"
                required
              />
              {fieldErrors.subject && <div className={errorClass}>{fieldErrors.subject}</div>}
            </div>

            {/* How did you hear about us */}
            <div>
              <label className={labelClass}>
                How did you hear about us? <span className="text-red-400">*</span>
              </label>
              <select
                value={form.how_heard}
                onChange={e => setField('how_heard', e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select an option...</option>
                {HOW_HEARD_OPTIONS.filter(o => o).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {fieldErrors.how_heard && <div className={errorClass}>{fieldErrors.how_heard}</div>}
            </div>

            {/* Message */}
            <div>
              <label className={labelClass}>
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={e => setField('message', e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Tell us about your project or any questions..."
                required
              />
              {fieldErrors.message && <div className={errorClass}>{fieldErrors.message}</div>}
            </div>

            {/* Attachments */}
            <div>
              <label className={labelClass}>
                Attachments <span className="text-slate-500 font-normal">(optional — images, PDF, Word, Excel, CSV - max 10MB each)</span>
              </label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-all ${dragOver ? 'border-atlas-primary bg-atlas-primary/10' : 'border-white/10 hover:border-white/20'}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPTED_TYPES}
                  onChange={e => addFiles(e.target.files)}
                  className="hidden"
                />
                <svg className="mx-auto mb-2 h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm text-slate-400">Drag & drop files here, or click to browse</p>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-slate-800/40 p-3">
                      <span className="text-sm text-slate-300 truncate">{file.name} ({formatBytes(file.size)})</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Continue to Dashboard →'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full text-center text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              Skip for now
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" />
      </div>
    }>
      <CompleteProfileInner />
    </Suspense>
  )
}
