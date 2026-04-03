'use client';

import { PortalSidebar } from './PortalSidebar';
import { KPIDashboard } from './KPIDashboard';
import { NetworkGraph } from './NetworkGraph';
import { OpportunitiesPanel } from './OpportunitiesPanel';
import { DailyWinsLog } from './DailyWinsLog';
import { ChatBot } from './ChatBot';

export function Portal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-atlas-bg via-slate-900 to-atlas-elevated">
      {/* Navbar placeholder (would be shared with homepage) */}
      <div className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-atlas-bg/80 backdrop-blur flex items-center px-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-atlas-primary/30 flex items-center justify-center">
            🌐
          </div>
          <span className="font-bold text-white">ATLAS SYNAPSE</span>
        </div>
      </div>

      {/* Sidebar */}
      <PortalSidebar />

      {/* Main Content */}
      <div className="ml-56 pt-20 px-8 pb-8 min-h-screen space-y-8">
        {/* KPI Dashboard Section */}
        <section>
          <KPIDashboard />
        </section>

        {/* Network Graph + Opportunities + Daily Wins */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NetworkGraph />
          </div>
          <div className="space-y-6">
            <OpportunitiesPanel />
            <DailyWinsLog />
          </div>
        </section>
      </div>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
