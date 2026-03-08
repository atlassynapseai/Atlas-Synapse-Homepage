'use client'

import Link from 'next/link'

export const Navbar = ({ user, onLogout }: { user: any | null; onLogout: () => void }) => {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(25px)' }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex h-10 items-center gap-2.5 animate-slide-in-left">
          <div className="relative h-9 w-9 shrink-0 animate-glow-pulse" style={{ borderRadius: '10px' }}>
            <img src="/logo.png" alt="Atlas Synapse" className="h-full w-full object-contain" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">Atlas Synapse</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {['Home', 'About', 'Solutions', 'Pricing'].map((item) => (
            <Link
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors duration-200 relative group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-atlas-primary to-atlas-secondary group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 animate-slide-in-right">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">{user.email}</span>
              <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <button
                onClick={onLogout}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-300 hover:bg-white/10 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-medium text-slate-300 hover:text-white transition-colors sm:inline-block">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="relative-sheen sheen rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-5 py-2 text-sm font-semibold text-white hover:shadow-lg hover:shadow-atlas-primary/40 transition-all duration-300 hover:scale-105"
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
