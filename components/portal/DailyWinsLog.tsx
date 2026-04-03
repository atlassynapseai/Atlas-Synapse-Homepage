'use client';

import { DAILY_WINS } from '@/lib/portal-mock-data';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function DailyWinsLog() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl border border-white/15 bg-gradient-to-br from-gradient from-slate-900/40 to-slate-900/10 p-6 backdrop-blur-xl shadow-xl shadow-black/40 flex flex-col overflow-hidden group hover:border-cyan-400/30 transition-all duration-300"
    >
      {/* Top accent gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-60" />

      {/* Hover glow */}
      <div className="absolute -inset-12 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
        Daily Wins Log
      </h3>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-cyan-400/20 scrollbar-track-transparent relative z-10">
        {DAILY_WINS.map((win, idx) => (
          <motion.div
            key={win.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="group/item flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-cyan-400/20"
          >
            <div className="relative mt-0.5 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md opacity-0 group-hover/item:opacity-100 transition-opacity" />
              <CheckCircle2 className="w-4 h-4 text-cyan-400 relative z-10 group-hover/item:scale-110 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200 leading-snug group-hover/item:text-white transition-colors">{win.text}</p>
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                {win.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
