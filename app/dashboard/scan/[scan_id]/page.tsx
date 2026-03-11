'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/ProtectedRoute'

interface Finding {
  id: string
  engine: string
  category: string
  severity: string
  message: string
  file: string
  line_start?: number
  snippet?: string
  cwe?: string
}

interface ScanDetail {
  scan_id: string
  file_desc: string
  total_findings: number
  risk_score: number
  risk_level: string
  created_at: string
  result_data: {
    all_findings: Finding[]
    ai_analysis: {
      executive_summary: string
      risk_score: number
      risk_level: string
      top_priorities: string[]
    }
    severity_breakdown: { CRITICAL: number; HIGH: number; MEDIUM: number; LOW: number }
    uploaded_files: string[]
    performance?: { total: number }
  }
}

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-500/20 text-red-300 border-red-500/30',
  ERROR:    'bg-red-500/20 text-red-300 border-red-500/30',
  HIGH:     'bg-orange-500/20 text-orange-300 border-orange-500/30',
  MEDIUM:   'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  WARNING:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  LOW:      'bg-green-500/20 text-green-300 border-green-500/30',
}

function normSeverity(s: string) {
  if (s === 'ERROR') return 'CRITICAL'
  if (s === 'WARNING') return 'MEDIUM'
  return s
}

export default function ScanDetailPage() {
  const { scan_id } = useParams<{ scan_id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [scan, setScan] = useState<ScanDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user || !scan_id) return
    fetch(`/api/scan-results/${scan_id}?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setScan(data)
      })
      .catch(() => setError('Failed to load scan'))
      .finally(() => setLoading(false))
  }, [user, scan_id])

  const downloadMarkdown = () => {
    if (!scan) return
    const ai = scan.result_data?.ai_analysis || {}
    const sb = scan.result_data?.severity_breakdown || {}
    const findings = scan.result_data?.all_findings || []

    const md = [
      `# Atlas Synapse Audit Report`,
      `**Scan ID:** ${scan.scan_id}`,
      `**Files:** ${scan.file_desc}`,
      `**Date:** ${new Date(scan.created_at).toLocaleString()}`,
      `**Risk Level:** ${scan.risk_level} (${scan.risk_score}/100)`,
      ``,
      `## Executive Summary`,
      ai.executive_summary || '—',
      ``,
      `## Top Priorities`,
      ...(ai.top_priorities || []).map((p: string, i: number) => `${i + 1}. ${p}`),
      ``,
      `## Severity Breakdown`,
      `| Level | Count |`,
      `|-------|-------|`,
      `| 🔴 Critical | ${sb.CRITICAL || 0} |`,
      `| 🟠 High | ${sb.HIGH || 0} |`,
      `| 🟡 Medium | ${sb.MEDIUM || 0} |`,
      `| 🟢 Low | ${sb.LOW || 0} |`,
      ``,
      `## Findings (${findings.length} total)`,
      `| Severity | Engine | File | Line | Message |`,
      `|----------|--------|------|------|---------|`,
      ...findings.map(f =>
        `| ${normSeverity(f.severity)} | ${f.engine} | ${f.file} | ${f.line_start || '—'} | ${f.message} |`
      ),
    ].join('\n')

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `atlas-audit-${scan.scan_id}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const findings = scan?.result_data?.all_findings || []
  const filtered = findings.filter(f => {
    const matchSev = filter === 'ALL' || normSeverity(f.severity) === filter
    const matchSearch = !search || f.message.toLowerCase().includes(search.toLowerCase()) ||
      f.file.toLowerCase().includes(search.toLowerCase())
    return matchSev && matchSearch
  })

  const riskColors: Record<string, string> = {
    CRITICAL: 'text-red-300 border-red-500/50 bg-red-500/10',
    HIGH:     'text-orange-300 border-orange-500/50 bg-orange-500/10',
    MEDIUM:   'text-yellow-300 border-yellow-500/50 bg-yellow-500/10',
    LOW:      'text-green-300 border-green-500/50 bg-green-500/10',
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050816] pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Back */}
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8">
            ← Back to Dashboard
          </Link>

          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" />
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-6 text-red-300">{error}</div>
          )}

          {scan && (
            <>
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Audit Report</h1>
                  <p className="text-slate-400 text-sm">{scan.file_desc} · {new Date(scan.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full border text-sm font-semibold ${riskColors[scan.risk_level] || riskColors.MEDIUM}`}>
                    {scan.risk_score}/100 {scan.risk_level}
                  </span>
                  <button
                    onClick={downloadMarkdown}
                    className="rounded-lg bg-slate-800 border border-white/10 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
                  >
                    ↓ Download Report
                  </button>
                </div>
              </div>

              {/* Summary + Priorities */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Executive Summary</h2>
                  <p className="text-slate-200 leading-relaxed">{scan.result_data?.ai_analysis?.executive_summary || '—'}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Top Priorities</h2>
                  <ol className="space-y-2">
                    {(scan.result_data?.ai_analysis?.top_priorities || []).map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-atlas-primary/20 text-atlas-primary text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Severity breakdown */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(level => {
                  const count = scan.result_data?.severity_breakdown?.[level] || 0
                  return (
                    <div key={level} className="rounded-lg border border-white/10 bg-slate-900/60 p-4 text-center">
                      <p className={`text-2xl font-bold ${level === 'CRITICAL' ? 'text-red-400' : level === 'HIGH' ? 'text-orange-400' : level === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>{count}</p>
                      <p className="text-xs text-slate-500 mt-1">{level}</p>
                    </div>
                  )
                })}
              </div>

              {/* Findings table */}
              <div className="rounded-lg border border-white/10 bg-slate-900/60 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-white">Findings <span className="text-slate-500 font-normal text-base">({filtered.length})</span></h2>
                  <div className="flex gap-2 flex-wrap ml-auto">
                    {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
                      <button key={f} onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${filter === f ? 'bg-atlas-primary/20 border-atlas-primary/50 text-atlas-primary' : 'border-white/10 text-slate-400 hover:text-white'}`}>
                        {f}
                      </button>
                    ))}
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="rounded-lg border border-white/10 bg-slate-800/60 px-3 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-atlas-primary/50 w-36"
                    />
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No findings match this filter.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                          <th className="px-5 py-3 text-left">Severity</th>
                          <th className="px-5 py-3 text-left">Engine</th>
                          <th className="px-5 py-3 text-left">File</th>
                          <th className="px-5 py-3 text-left">Line</th>
                          <th className="px-5 py-3 text-left">Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filtered.map((f, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-5 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${SEVERITY_STYLES[f.severity] || SEVERITY_STYLES.LOW}`}>
                                {normSeverity(f.severity)}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-slate-500 text-xs">{f.engine}</td>
                            <td className="px-5 py-3 text-slate-300 font-mono text-xs max-w-[140px] truncate">{f.file}</td>
                            <td className="px-5 py-3 text-slate-500">{f.line_start || '—'}</td>
                            <td className="px-5 py-3 text-slate-300">
                              <div>{f.message}</div>
                              {f.snippet && <div className="mt-1 font-mono text-xs text-slate-600 truncate max-w-xs">{f.snippet}</div>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
