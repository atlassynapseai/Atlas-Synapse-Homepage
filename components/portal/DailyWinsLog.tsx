'use client'

import { DAILY_WINS } from './mockData'

export default function DailyWinsLog() {
  return (
    <div className="ml-56 px-8 pb-8">
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Wins Log</h3>

        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
          {DAILY_WINS.map((win) => (
            <div key={win.id} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
              <div className="mt-1 h-2 w-2 rounded-full bg-atlas-cyan flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300">{win.title}</p>
                <p className="text-xs text-slate-500 mt-1">{win.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
