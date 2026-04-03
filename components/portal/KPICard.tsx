'use client';

interface KPICardProps {
  icon: string;
  label: string;
  value: string;
  quote: string;
  metric: string;
  isActive: boolean;
}

export function KPICard({ icon, label, value, quote, metric, isActive }: KPICardProps) {
  return (
    <div
      className={`rounded-xl border backdrop-blur transition-all duration-500 p-6 min-h-64 flex flex-col justify-between
        ${
          isActive
            ? 'border-atlas-primary/50 bg-slate-900/80 shadow-lg shadow-atlas-primary/20'
            : 'border-white/10 bg-slate-900/40 opacity-50'
        }`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <div>
        <p className="text-xl font-bold text-white mb-1">{value}</p>
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">{label}</p>
      </div>
      <div className="text-xs text-slate-500 italic mb-3">{quote}</div>
      <div className="text-xs font-semibold text-atlas-cyan">{metric}</div>
    </div>
  );
}
