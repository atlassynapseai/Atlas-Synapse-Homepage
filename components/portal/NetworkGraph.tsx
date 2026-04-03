'use client';

import { NETWORK_NODES, NETWORK_CONNECTIONS } from '@/lib/portal-mock-data';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export function NetworkGraph() {
  const WIDTH = 600;
  const HEIGHT = 300;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-transparent p-6 md:p-8 backdrop-blur-xl shadow-xl shadow-black/40 overflow-hidden group hover:border-cyan-400/30 transition-all duration-300"
    >
      {/* Top accent gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-60" />

      {/* Radial background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
        <MapPin className="w-4 h-4 text-cyan-400" />
        Your Business at a Glance
      </h3>

      <svg width="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="min-h-64 relative z-10">
        {/* Glow filter definition */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Network Edges with animation */}
        <motion.g>
          {NETWORK_CONNECTIONS.map((conn, idx) => {
            const from = NETWORK_NODES[conn[0]];
            const to = NETWORK_NODES[conn[1]];
            return (
              <motion.line
                key={`line-${idx}`}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke="rgba(0, 242, 255, 0.25)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: idx * 0.1 }}
                filter="url(#glow)"
                className="hover:stroke-cyan-400 transition-all duration-300"
              />
            );
          })}
        </motion.g>

        {/* Network Nodes with enhanced effects */}
        {NETWORK_NODES.map((node, idx) => {
          const isHub = idx === Math.floor(NETWORK_NODES.length / 2);
          return (
            <g key={`node-${node.id}`}>
              {/* Outer glow ring for active nodes */}
              {!isHub && (
                <motion.circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r="20"
                  fill="rgba(0, 242, 255, 0.1)"
                  initial={{ r: 20, opacity: 0 }}
                  whileInView={{ r: 24, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              )}

              {/* Main node circle */}
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={isHub ? "14" : "12"}
                fill={isHub ? '#fff' : '#06b6d4'}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={isHub ? '' : 'hover:r-16 transition-all'}
                filter={isHub ? "url(#glow)" : ""}
                whileHover={isHub ? { scale: 1.3 } : { scale: 1.25 }}
              />

              {/* Hub center glow */}
              {isHub && (
                <motion.circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r="14"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  initial={{ r: 14, opacity: 0 }}
                  whileInView={{ r: 18, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 flex gap-6 text-xs text-slate-400 relative z-10 flex-wrap"
      >
        <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
          <motion.span
            className="w-3 h-3 rounded-full bg-cyan-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>Active Node</span>
        </span>
        <span className="flex items-center gap-2 hover:text-white transition-colors">
          <motion.span
            className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <span>Hub</span>
        </span>
      </motion.div>
    </motion.div>
  );
}
