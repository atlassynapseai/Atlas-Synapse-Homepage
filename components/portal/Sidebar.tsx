'use client'

import { useAuth } from '@/lib/auth-context'

interface SidebarItem {
  icon: string
  label: string
  id: string
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { icon: '🏠', label: 'Home Base', id: 'home' },
  { icon: '💼', label: 'Workroom', id: 'workroom' },
  { icon: '🌐', label: 'Network', id: 'network' },
  { icon: '🔒', label: 'Vault', id: 'vault' },
]

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="fixed left-0 top-16 flex h-[calc(100vh-4rem)] w-56 flex-col bg-slate-900/40 backdrop-blur p-6 border-r border-white/10">
      {/* Logo/Brand */}
      <div className="mb-8 rounded-lg bg-atlas-primary/10 p-4 text-center">
        <div className="text-2xl font-bold text-atlas-primary mb-1">Business Command</div>
        <div className="text-xs text-slate-400">System Online</div>
      </div>

      {/* Home Base Button */}
      <button className="mb-6 w-full rounded-lg bg-atlas-cyan text-slate-900 font-semibold py-3 px-4 transition-all hover:shadow-lg hover:shadow-atlas-cyan/50 active:scale-95">
        🏠 Home Base
      </button>

      {/* Navigation Items */}
      <nav className="mb-auto space-y-3">
        {SIDEBAR_ITEMS.slice(1).map((item) => (
          <button
            key={item.id}
            className="w-full text-left rounded-lg px-4 py-2.5 text-slate-300 transition-all hover:bg-white/5 hover:text-white"
          >
            <span className="text-lg mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-white/10 pt-4">
        <div className="rounded-lg bg-atlas-blue/10 p-4 mb-4">
          <p className="text-xs font-semibold text-atlas-blue uppercase tracking-wider mb-2">Your Architect</p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-atlas-primary/30 flex items-center justify-center text-sm font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'J'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Julius Sanders</p>
              <p className="text-xs text-slate-400">Lead Strategist</p>
            </div>
          </div>
        </div>
        <button className="w-full text-center text-xs font-semibold text-atlas-cyan hover:text-atlas-secondary transition-colors">
          MESSAGE DIRECT →
        </button>
      </div>
    </aside>
  )
}
