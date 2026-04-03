'use client'

import Navbar from '@/components/Navbar'
import { Portal } from '@/components/portal/Portal'

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-atlas-bg via-slate-900 to-atlas-elevated">
      <Navbar />
      <div className="pt-20">
        <Portal />
      </div>
    </main>
  )
}
