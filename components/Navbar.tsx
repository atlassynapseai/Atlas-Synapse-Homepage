'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const NAV_LINKS = [
  { label: 'How It Works', href: '/#problem' },
  { label: 'Risks', href: '/risks' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Dashboard', href: '/dashboard' },
]

function getInitials(user: any) {
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || '?'
  return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function Navbar() {
  const [authUser, setAuthUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setAuthUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(15,23,42,0.88)', backdropFilter: 'blur(24px)' }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 shrink-0 animate-glow-pulse" style={{ borderRadius: '10px' }}>
            <img src="/logo.png" alt="Atlas Synapse" className="h-full w-full object-contain" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Atlas Synapse</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors relative group"
            >
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-atlas-primary to-atlas-secondary group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {authUser ? (
            <Link href="/dashboard" className="flex items-center gap-2 group">
              {authUser.user_metadata?.avatar_url ? (
                <img
                  src={authUser.user_metadata.avatar_url}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full border border-white/20 object-cover group-hover:border-atlas-primary/60 transition-all"
                />
              ) : (
                <div className="h-8 w-8 rounded-full border border-white/20 bg-gradient-to-br from-atlas-primary to-atlas-secondary flex items-center justify-center text-xs font-bold text-white group-hover:border-atlas-primary/60 transition-all">
                  {getInitials(authUser)}
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate max-w-[120px]">
                {authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0]}
              </span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="relative-sheen sheen rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-5 py-2 text-sm font-semibold text-white hover:shadow-lg hover:shadow-atlas-primary/40 transition-all hover:scale-105"
              >
                Request Demo
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
