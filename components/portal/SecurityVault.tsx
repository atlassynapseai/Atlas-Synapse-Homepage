'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { ShieldCheck, Lock, Eye, Activity, Key, FileCheck, AlertCircle, CheckCircle } from 'lucide-react';

export const SecurityVault: React.FC = () => {
  const [logOffset, setLogOffset] = useState(0);

  // Animate the scrolling logs
  useEffect(() => {
    const interval = setInterval(() => {
      setLogOffset(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const logs = Array.from({ length: 20 }).map((_, i) => ({
    id: `LOG-${1000 + i + logOffset}`,
    msg: `Securing file #${8392 + i + logOffset} [Safe]`,
    status: 'SECURE'
  }));

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">

      {/* LEFT COLUMN: STATUS & BADGE */}
      <div className="w-full md:w-1/3 space-y-6">
        {/* Clearance Badge */}
        <GlassCard className="text-center relative overflow-hidden !bg-slate-900 border-synapse-400/20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-synapse-400 to-transparent" />

          <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 border-4 border-slate-900 shadow-[0_0_30px_rgba(0,242,255,0.1)] relative">
            <ShieldCheck className="w-10 h-10 text-synapse-400" />
            <div className="absolute inset-0 border border-synapse-400/30 rounded-full animate-ping" />
          </div>

          <h2 className="text-white font-bold font-display text-xl">Administrator</h2>
          <p className="text-synapse-400 text-xs font-bold uppercase tracking-widest mb-6">Level 4 Clearance</p>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-2 bg-white/5 rounded border border-white/5">
              <div className="text-[10px] text-slate-500 uppercase">Login Type</div>
              <div className="text-xs text-white font-bold">Biometric</div>
            </div>
            <div className="p-2 bg-white/5 rounded border border-white/5">
              <div className="text-[10px] text-slate-500 uppercase">Session</div>
              <div className="text-xs text-green-400 font-bold">Active</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/5 text-left">
            <p className="text-xs text-slate-300 leading-relaxed">
              Your business life is locked behind bank-level encryption. Only you and your Lead Architect have the keys.
            </p>
          </div>
        </GlassCard>

        {/* Health Gauge */}
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Health</span>
            <Activity className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-4xl font-mono font-bold text-white mb-2">99.99%</div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
          </div>
          <p className="text-[10px] text-slate-500 mt-2">No intrusions detected in last 24h.</p>
        </GlassCard>
      </div>

      {/* RIGHT COLUMN: LIVE LEDGER */}
      <div className="flex-1">
        <GlassCard className="h-full flex flex-col relative overflow-hidden !bg-black">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-synapse-400" />
              <h3 className="font-bold text-white text-sm">Live Security Check</h3>
            </div>
            <div className="px-2 py-1 bg-synapse-400/10 text-synapse-400 text-[10px] font-bold uppercase rounded border border-synapse-400/20 animate-pulse">
              Live Stream
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative z-10">
            {/* Header Row */}
            <div className="grid grid-cols-12 text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 px-2">
              <div className="col-span-3">Check ID</div>
              <div className="col-span-6">Action</div>
              <div className="col-span-3 text-right">Result</div>
            </div>

            {/* Scrolling Logs */}
            <div className="space-y-1 font-mono text-xs overflow-hidden h-[400px] relative">
              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

              {logs.slice(0, 14).map((log, i) => (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1 - (i * 0.05), x: 0 }}
                  className="grid grid-cols-12 px-2 py-2 border-b border-white/5 text-slate-300 items-center"
                >
                  <div className="col-span-3 text-synapse-400 opacity-70">{log.id}</div>
                  <div className="col-span-6 truncate">{log.msg}</div>
                  <div className="col-span-3 text-right text-green-500 font-bold text-[10px] flex items-center justify-end gap-1">
                    {log.status} <CheckCircle className="w-3 h-3" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};