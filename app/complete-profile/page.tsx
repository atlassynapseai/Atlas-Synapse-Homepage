'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function CompleteProfileInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')

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
        if (profile.phone) setPhone(profile.phone)
        if (profile.company) setCompany(profile.company)
        if (profile.job_title) setJobTitle(profile.job_title)
      }

      setLoading(false)
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company || !jobTitle) {
      setError('Company and Job Title are required.')
      return
    }
    setSaving(true)
    setError('')

    try {
      const { error: upsertError } = await supabase.from('users').upsert({
        id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        phone: phone || null,
        company,
        job_title: jobTitle,
      })

      if (upsertError) throw upsertError

      // Notify team of new OAuth signup
      fetch('/api/notify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          email: user.email,
          phone: phone || null,
          company,
          jobTitle,
          provider: user.app_metadata?.provider || 'oauth',
        }),
      }).catch(() => {})

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

  const inputClass = 'w-full rounded-lg border border-white/10 bg-slate-800/60 px-4 py-3 text-slate-100 placeholder-slate-500 transition-all hover:border-white/20 focus:border-atlas-primary/50 focus:outline-none'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="Atlas Synapse" className="h-8 w-8 object-contain" />
            <span className="font-bold text-white text-base tracking-tight">Atlas Synapse</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-sm text-slate-400">
            Just a few details so we can personalise your experience.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8">
          {error && (
            <div className="mb-5 rounded-lg bg-red-500/20 border border-red-500/30 p-4 text-red-300 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className={inputClass}
                placeholder="Acme Corp"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Job Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                className={inputClass}
                placeholder="CTO / CISO / AI Lead"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+1 555 000 0000"
              />
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
