'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { TrendingUp, MapPin, Activity, X, BarChart3, ArrowRight, Zap, CheckCircle, Info } from 'lucide-react';

interface OperationsHubProps {
  data: any; 
  isMobile?: boolean;
}

export const OperationsHub: React.FC<OperationsHubProps> = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState<any | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div className="space-y-6 relative">
      
      {/* --- THE SIMPLIFIER: METRICS WITH TRANSLATIONS --- */}
      <div id="tour-metrics" className="grid md:grid-cols-3 gap-6">
        {data.metrics.map((metric: any, idx: number) => (
          <GlassCard 
            key={idx} 
            className="p-6 group cursor-pointer hover:border-synapse-400/50 transition-all flex flex-col justify-between" 
            hoverEffect
            onClick={() => setSelectedMetric(metric)}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:text-synapse-400 transition-colors">
                  <metric.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" /> {metric.trend}
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left">{metric.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-synapse-400">{metric.label}</div>
            </div>
            
            {/* The Translation Label */}
            <div className="mt-4 pt-4 border-t border-white/5">
               <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Info className="w-3 h-3 text-synapse-400" />
                  <span className="italic">"{metric.translation}"</span>
               </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* --- THE MIRROR: INTERACTIVE MAP & LEAK DETECTOR --- */}
        <GlassCard className="md:col-span-2 p-6 relative overflow-hidden min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-synapse-400" /> 
              Your Business at a Glance
            </h3>
            <div className="flex gap-2">
               <div className="text-[10px] text-slate-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-synapse-400"></div> Active Node</div>
               <div className="text-[10px] text-slate-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white"></div> Hub</div>
            </div>
          </div>
          
          {/* THE MIRROR VISUALIZATION */}
          <div className="absolute top-16 right-6 z-20 hidden md:block w-48">
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg mb-2 backdrop-blur-md">
                 <div className="text-[10px] text-red-300 font-bold uppercase mb-1">Missed Opportunity</div>
                 <div className="text-xs text-white">{data.mirror.leakLabel}</div>
                 <div className="text-lg font-bold text-red-400">{data.mirror.leakValue}</div>
              </div>
              <div className="flex justify-center -my-3 relative z-30">
                 <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />
              </div>
              <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg mt-2 backdrop-blur-md">
                 <div className="text-[10px] text-green-300 font-bold uppercase mb-1">Atlas Correction</div>
                 <div className="text-xs text-white">{data.mirror.recoveredLabel}</div>
                 <div className="text-lg font-bold text-green-400">{data.mirror.recoveredValue}</div>
              </div>
          </div>

          <div className="relative flex-1 bg-black/40 rounded-lg border border-white/5 flex items-center justify-center overflow-hidden cursor-crosshair group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-synapse-900/20 to-transparent" />
              
              {/* Central Hub */}
              <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20 group-hover:shadow-[0_0_30px_rgba(255,255,255,1)] transition-shadow" />
              <div className="absolute w-32 h-32 border border-synapse-400/20 rounded-full animate-ping pointer-events-none" />
              
              {/* Interactive Nodes */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedNode(`Node-${100+i}`)}
                  className="absolute w-3 h-3 bg-synapse-400 rounded-full hover:scale-150 hover:bg-white transition-all focus:outline-none z-30"
                  style={{ 
                    transform: `rotate(${deg}deg) translate(100px) rotate(-${deg}deg)`,
                    boxShadow: '0 0 10px rgba(0, 242, 255, 0.6)'
                  }}
                />
              ))}
              
              {/* Connecting Lines */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <div 
                  key={i}
                  className="absolute w-[100px] h-[1px] bg-gradient-to-r from-white/20 to-synapse-400/20 origin-left pointer-events-none"
                  style={{ 
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${deg}deg)`,
                  }}
                />
              ))}

              {/* Node Status Tooltip Overlay */}
              <AnimatePresence>
                {selectedNode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 bg-slate-900/90 border border-synapse-400/30 p-4 rounded-lg backdrop-blur-md shadow-2xl z-40 w-48"
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-bold text-xs">{selectedNode}</span>
                        <button onClick={() => setSelectedNode(null)}><X className="w-3 h-3 text-slate-500 hover:text-white"/></button>
                     </div>
                     <div className="space-y-1 text-[10px] text-slate-400">
                        <div className="flex justify-between"><span>Status:</span> <span className="text-green-400">Online</span></div>
                        <div className="flex justify-between"><span>Latency:</span> <span className="text-white">12ms</span></div>
                        <div className="flex justify-between"><span>Load:</span> <span className="text-white">34%</span></div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </GlassCard>

        {/* Quick Actions / Feed */}
        <div className="space-y-6">
           <GlassCard className="p-6 h-full flex flex-col">
              <h3 className="font-bold text-white text-sm mb-4">Daily Wins Log</h3>
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 {[1,2,3,4].map((_, i) => (
                    <div key={i} className="flex gap-3 items-start">
                       <div className="mt-1 w-1.5 h-1.5 rounded-full bg-synapse-400 shrink-0" />
                       <div>
                          <p className="text-xs text-slate-300">Route A-12 optimized for weather conditions.</p>
                          <p className="text-[10px] text-slate-600 font-mono mt-0.5">14:0{i} PM</p>
                       </div>
                    </div>
                 ))}
              </div>
           </GlassCard>
        </div>
      </div>

      {/* DEEP DIVE MODAL */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMetric(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-synapse-400/10 rounded-lg text-synapse-400">
                      <selectedMetric.icon className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-white">{selectedMetric.label} Analysis</h3>
                     <p className="text-xs text-slate-400">System Deep-Dive</p>
                   </div>
                </div>
                <button onClick={() => setSelectedMetric(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 grid md:grid-cols-2 gap-8">
                 <div>
                    <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Performance Breakdown</h4>
                    <div className="space-y-4">
                       <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                          <div className="text-xs text-slate-500 mb-1">Current Metric</div>
                          <div className="text-2xl font-bold text-white">{selectedMetric.value}</div>
                          <div className="text-xs text-green-400 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Optimal Range</div>
                       </div>
                       <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                          <div className="text-xs text-slate-500 mb-1">Impact Translation</div>
                          <div className="text-sm font-medium text-slate-300">{selectedMetric.translation}</div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Historical Trend</h4>
                    {/* SVG Chart Representation */}
                    <div className="h-40 w-full bg-black/20 rounded-lg border border-white/5 relative overflow-hidden flex items-end">
                       <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                             <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00F2FF" stopOpacity="0.4"/>
                                <stop offset="100%" stopColor="#00F2FF" stopOpacity="0"/>
                             </linearGradient>
                          </defs>
                          {/* Smooth Curve */}
                          <path 
                            d="M0,80 C40,70 60,85 90,40 S140,20 200,10" 
                            fill="none" 
                            stroke="#00F2FF" 
                            strokeWidth="2" 
                          />
                          <path 
                            d="M0,80 C40,70 60,85 90,40 S140,20 200,10 V100 H0 Z" 
                            fill="url(#chartGradient)" 
                            stroke="none"
                          />
                       </svg>
                       <div className="absolute top-2 right-2 text-[10px] text-synapse-400 font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur">+45% vs Avg</div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                       Atlas algorithms have stabilized this metric 45% above industry average through continuous predictive modeling.
                    </p>
                 </div>
              </div>
              
              <div className="p-4 bg-white/5 border-t border-white/10 text-center">
                 <button onClick={() => setSelectedMetric(null)} className="text-xs font-bold text-white hover:text-synapse-400 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                    Close Analysis <ArrowRight className="w-3 h-3" />
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};