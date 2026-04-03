'use client';

export function PortalSidebar() {
  return (
    <div className="fixed left-0 top-16 w-56 h-[calc(100vh-4rem)] bg-slate-900/40 backdrop-blur border-r border-white/10 p-6 flex flex-col z-40">
      {/* Brand Section */}
      <div className="bg-atlas-primary/10 rounded-lg p-4 mb-8 border border-atlas-primary/20">
        <p className="text-xl font-bold text-atlas-primary">Business Command</p>
        <p className="text-xs text-slate-400 mt-1">System Online</p>
      </div>

      {/* Home Base Button */}
      <button className="w-full bg-atlas-cyan text-slate-900 font-semibold py-3 px-4 rounded-lg mb-6 hover:shadow-lg hover:shadow-atlas-cyan/50 transition-all active:scale-95">
        🏠 Home Base
      </button>

      {/* Navigation Items */}
      <nav className="mb-auto space-y-3">
        <div className="px-4 py-2.5 hover:bg-white/5 rounded-lg text-slate-300 cursor-pointer transition-all">
          🌐 Workroom
        </div>
        <div className="px-4 py-2.5 hover:bg-white/5 rounded-lg text-slate-300 cursor-pointer transition-all">
          🌍 Network
        </div>
        <div className="px-4 py-2.5 hover:bg-white/5 rounded-lg text-slate-300 cursor-pointer transition-all">
          🔐 Vault
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/10 pt-4">
        <div className="bg-atlas-primary/10 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-atlas-primary/30 flex items-center justify-center text-sm font-bold">
              JS
            </div>
            <div className="text-sm">
              <p className="font-semibold text-white">Julius Sanders</p>
              <p className="text-xs text-slate-400">Lead Strategist</p>
            </div>
          </div>
        </div>
        <button className="text-xs text-atlas-cyan hover:text-atlas-secondary transition-colors w-full text-left">
          MESSAGE DIRECT →
        </button>
      </div>
    </div>
  );
}
