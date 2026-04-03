'use client';

import { NETWORK_NODES, NETWORK_CONNECTIONS } from '@/lib/portal-mock-data';

export function NetworkGraph() {
  const WIDTH = 600;
  const HEIGHT = 300;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        📍 Your Business at a Glance
      </h3>
      <svg width="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="min-h-64">
        {/* Network Edges */}
        {NETWORK_CONNECTIONS.map((conn, idx) => {
          const from = NETWORK_NODES[conn[0]];
          const to = NETWORK_NODES[conn[1]];
          return (
            <line
              key={`line-${idx}`}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Network Nodes */}
        {NETWORK_NODES.map((node, idx) => (
          <g key={`node-${node.id}`}>
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="12"
              fill={idx === Math.floor(NETWORK_NODES.length / 2) ? '#fff' : '#06b6d4'}
              className={idx === Math.floor(NETWORK_NODES.length / 2) ? '' : 'animate-pulse'}
              opacity={idx === Math.floor(NETWORK_NODES.length / 2) ? '1' : '0.8'}
            />
          </g>
        ))}
      </svg>
      <div className="mt-4 flex gap-4 text-xs text-slate-400">
        <span>● <span className="text-atlas-cyan">Active Node</span></span>
        <span>● <span className="text-white">Hub</span></span>
      </div>
    </div>
  );
}
