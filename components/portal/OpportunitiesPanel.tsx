'use client';

import { OPPORTUNITY_DATA } from '@/lib/portal-mock-data';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export function OpportunitiesPanel() {
  const { missed, correction } = OPPORTUNITY_DATA;

  return (
    <div className="space-y-4">
      {/* Missed Opportunity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative rounded-xl border border-red-500/40 bg-gradient-to-br from-red-500/15 to-red-500/5 p-6 backdrop-blur-md hover:border-red-500/60 hover:bg-red-500/20 transition-all duration-300 shadow-lg shadow-red-500/10"
      >
        {/* Glow effect */}
        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

        <p className="text-xs font-bold text-red-300 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          {missed.title}
        </p>
        <p className="text-sm text-slate-300 mb-3">{missed.problem}</p>
        <p className="text-2xl font-bold text-red-400 group-hover:text-red-300 transition-colors">{missed.metric}</p>
      </motion.div>

      {/* Arrow Separator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex justify-center -my-2 relative z-10"
      >
        <div className="p-2 rounded-full bg-gradient-to-b from-slate-700 to-slate-800 border border-slate-600">
          <ArrowDown className="w-4 h-4 text-slate-400" />
        </div>
      </motion.div>

      {/* Atlas Correction */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="group relative rounded-xl border border-green-500/40 bg-gradient-to-br from-green-500/15 to-green-500/5 p-6 backdrop-blur-md hover:border-green-500/60 hover:bg-green-500/20 transition-all duration-300 shadow-lg shadow-green-500/10"
      >
        {/* Glow effect */}
        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

        <p className="text-xs font-bold text-green-300 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {correction.title}
        </p>
        <p className="text-sm text-slate-300 mb-3">{correction.solution}</p>
        <p className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors">{correction.metric}</p>
      </motion.div>
    </div>
  );
}
