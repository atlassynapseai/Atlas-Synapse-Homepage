'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const NAV_LINKS = [
  { label: 'How It Works', href: '/#problem' },
  { label: 'Risks', href: '/risks' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

function getInitials(user: any) {
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || '?'
  return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function Navbar() {
  const [authUser, setAuthUser] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setAuthUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setDropdownOpen(false)
    router.push('/')
  }

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
          {authUser && (
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors relative group"
            >
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-atlas-primary to-atlas-secondary group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          )}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {authUser ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 group"
              >
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
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-slate-900/95 shadow-xl backdrop-blur-sm py-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Dashboard
                  </Link>
                  <div className="my-1 border-t border-white/10" />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth"
                className="hidden sm:inline text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Sign In / Sign Up
              </Link>
              <Link
                href="/contact"
                className="hidden sm:inline text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Request Demo
              </Link>
              <Link
                href="/Aegis-Prime-Auditor/"
                className="relative-sheen sheen rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-5 py-2 text-sm font-semibold text-white hover:shadow-lg hover:shadow-atlas-primary/40 transition-all hover:scale-105"
              >
                Free AI Audit →
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
