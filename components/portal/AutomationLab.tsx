'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Bot, Terminal, Play, Pause, RefreshCw, X, ChevronRight, Cpu } from 'lucide-react';

interface BotData {
  name: string;
  status: 'active' | 'learning' | 'idle';
  efficiency: string;
}

interface AutomationLabProps {
  bots: BotData[];
}

export const AutomationLab: React.FC<AutomationLabProps> = ({ bots }) => {
  const [selectedBot, setSelectedBot] = useState<BotData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  // Fix: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout to avoid namespace errors in browser environments
  const logInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate Logic Stream when a bot is selected
  useEffect(() => {
    if (selectedBot) {
      setLogs(["Initializing Logic Core...", `Connecting to ${selectedBot.name} instance...`, "Stream Active."]);

      logInterval.current = setInterval(() => {
        const actions = [
          "AUDIT: Detected $450 in duplicate billing... Corrected.",
          "OUTREACH: 4 clients re-booked for next week.",
          "SYNC: Quickbooks updated with new expense data.",
          "OPTIMIZING: Vendor contract renegotiated automatically.",
          "WAIT: Pending user approval for large transaction...",
          "LEAD: New prospect captured from website form.",
        ];
        const randomLog = actions[Math.floor(Math.random() * actions.length)];

        // Fix: Manual timestamp formatting to avoid TS error with fractionalSecondDigits
        const d = new Date();
        const timeStr = d.toLocaleTimeString([], { hour12: false });
        const ms = d.getMilliseconds().toString().padStart(3, '0').slice(0, 2);
        const timestamp = `${timeStr}.${ms}`;

        setLogs(prev => {
          const newLogs = [...prev, `[${timestamp}] ${randomLog}`];
          return newLogs.slice(-12); // Keep last 12 lines
        });
      }, 800);
    } else {
      if (logInterval.current) clearInterval(logInterval.current);
    }

    return () => {
      if (logInterval.current) clearInterval(logInterval.current);
    };
  }, [selectedBot]);

  return (
    <div className="h-full flex flex-col gap-6">
      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <Bot className="w-8 h-8 text-synapse-400" /> The Workroom
            </h2>
            <p className="text-slate-400">Manage your digital helpers and see how they make decisions.</p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-3xl font-bold text-white">{bots.length}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Digital Team</div>
          </div>
        </div>

        {/* AGENT LIST */}
        <div className="grid md:grid-cols-2 gap-4">
          {bots.map((bot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`
                p-4 rounded-xl border transition-all cursor-pointer group flex items-center justify-between
                ${selectedBot?.name === bot.name
                  ? 'bg-synapse-400/10 border-synapse-400/50 shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}
              `}
              onClick={() => setSelectedBot(bot)}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${bot.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}
                `}>
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{bot.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${bot.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">{bot.status}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-mono font-bold text-synapse-400">{bot.efficiency}</div>
                <div className="text-[10px] text-slate-500">Success Rate</div>
              </div>

              <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${selectedBot?.name === bot.name ? 'rotate-900 text-synapse-400' : 'group-hover:translate-x-1'}`} />
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* NEURAL LOGIC STREAM (Conditional Render) */}
      <AnimatePresence mode="wait">
        {selectedBot ? (
          <motion.div
            key="logs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="bg-black !border-synapse-400/20 relative overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-synapse-400" />
                  <span className="text-sm font-mono font-bold text-white uppercase">{selectedBot.name}_LOGIC_CORE</span>
                </div>
                <button onClick={() => setSelectedBot(null)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Logs */}
              <div className="font-mono text-xs space-y-2 h-48 overflow-y-auto custom-scrollbar flex flex-col justify-end">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-l-2 border-synapse-400/20 pl-3 py-0.5"
                  >
                    <span className="text-synapse-400 mr-2">{'>'}</span>
                    <span className="text-slate-300">{log}</span>
                  </motion.div>
                ))}
              </div>

              {/* Status Bar */}
              <div className="mt-4 pt-2 border-t border-white/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live Execution
                </div>
                <div>Mem: 64MB | CPU: 12%</div>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-2xl"
          >
            <div className="text-center text-slate-500">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Select an agent above to see how they think.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};