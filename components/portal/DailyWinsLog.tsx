'use client';

import { DAILY_WINS } from '@/lib/portal-mock-data';

export function DailyWinsLog() {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Daily Wins Log</h3>
      <div className="space-y-3 flex-1 overflow-y-auto max-h-72">
        {DAILY_WINS.map((win) => (
          <div key={win.id} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-b-0">
            <span className="text-atlas-cyan text-lg">●</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300">{win.text}</p>
              <p className="text-xs text-slate-500 mt-1">{win.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
