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
      {/* Sidebar */}
      <PortalSidebar />

      {/* Main Content */}
      <div className="ml-56 pt-24 px-8 pb-8 min-h-screen space-y-8">
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
