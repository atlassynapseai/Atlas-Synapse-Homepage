'use client';

import { OPPORTUNITY_DATA } from '@/lib/portal-mock-data';

export function OpportunitiesPanel() {
  const { missed, correction } = OPPORTUNITY_DATA;

  return (
    <div className="space-y-4">
      {/* Missed Opportunity */}
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 backdrop-blur-sm">
        <p className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-2">
          {missed.title}
        </p>
        <p className="text-sm text-slate-300 mb-3">{missed.problem}</p>
        <p className="text-2xl font-bold text-red-400">{missed.metric}</p>
        <div className="mt-4 text-xs text-slate-500">↓</div>
      </div>

      {/* Atlas Correction */}
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 backdrop-blur-sm">
        <p className="text-xs font-semibold text-green-300 uppercase tracking-wider mb-2">
          {correction.title}
        </p>
        <p className="text-sm text-slate-300 mb-3">{correction.solution}</p>
        <p className="text-2xl font-bold text-green-400">{correction.metric}</p>
      </div>
    </div>
  );
}
