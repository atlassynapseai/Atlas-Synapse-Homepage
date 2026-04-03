'use client'

interface KPICardProps {
  title: string
  value: string
  icon: string
  badge: string
  tagline: string
}

export default function KPICard({ title, value, icon, badge, tagline }: KPICardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-atlas-primary/50 hover:shadow-lg hover:shadow-atlas-primary/20">
      {/* Icon + Badge */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-3xl">{icon}</span>
        <span className="inline-block rounded-full bg-atlas-cyan/20 px-2.5 py-0.5 text-xs font-semibold text-atlas-cyan">
          {badge}
        </span>
      </div>

      {/* Value */}
      <p className="mb-1 text-4xl font-bold text-white">{value}</p>

      {/* Title */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      {/* Tagline */}
      <p className="text-sm italic text-slate-500">{tagline}</p>
    </div>
  )
}
