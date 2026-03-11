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
  cwe?: string | string[]
}

interface HeatmapCell {
  count: number
  category: string
  severity: string
  normalized: number
  risk_weight: number
}

interface FileResult {
  file: string
  findings: number
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
    heatmap_data?: HeatmapCell[]
    file_results?: FileResult[]
    uploaded_files: string[]
    files_scanned?: number
    total_findings?: number
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

const HEATMAP_CATEGORIES = ['SAST', 'Secrets', 'SCA', 'Deep Analysis', 'Malware Detection']
const HEATMAP_SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

function normSeverity(s: string) {
  if (s === 'ERROR') return 'CRITICAL'
  if (s === 'WARNING') return 'MEDIUM'
  return s
}

function heatmapCellStyle(sev: string, count: number) {
  if (count === 0) return 'text-slate-600 bg-slate-800/30'
  switch (sev) {
    case 'CRITICAL': return 'text-red-300 bg-red-500/25 font-bold'
    case 'HIGH':     return 'text-orange-300 bg-orange-500/25 font-semibold'
    case 'MEDIUM':   return 'text-yellow-300 bg-yellow-500/20'
    case 'LOW':      return 'text-green-300 bg-green-500/20'
    default:         return 'text-slate-400 bg-slate-800/30'
  }
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
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

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

  const toggleExpand = (i: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const downloadJSON = () => {
    if (!scan) return
    const blob = new Blob([JSON.stringify(scan.result_data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `atlas-audit-${scan.scan_id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadMarkdown = () => {
    if (!scan) return
    const rd = scan.result_data
    const ai = rd.ai_analysis || {}
    const sb = rd.severity_breakdown || {}
    const findings = rd.all_findings || []

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
      `| Critical | ${sb.CRITICAL || 0} |`,
      `| High | ${sb.HIGH || 0} |`,
      `| Medium | ${sb.MEDIUM || 0} |`,
      `| Low | ${sb.LOW || 0} |`,
      ``,
      `## Findings (${findings.length} total)`,
      `| Severity | Engine | File | Line | CWE | Message |`,
      `|----------|--------|------|------|-----|---------|`,
      ...findings.map(f => {
        const cwe = Array.isArray(f.cwe) ? f.cwe.join(', ') : (f.cwe || '—')
        return `| ${normSeverity(f.severity)} | ${f.engine} | ${f.file} | ${f.line_start || '—'} | ${cwe} | ${f.message} |`
      }),
    ].join('\n')

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `atlas-audit-${scan.scan_id}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const riskColors: Record<string, string> = {
    CRITICAL: 'text-red-300 border-red-500/50 bg-red-500/10',
    HIGH:     'text-orange-300 border-orange-500/50 bg-orange-500/10',
    MEDIUM:   'text-yellow-300 border-yellow-500/50 bg-yellow-500/10',
    LOW:      'text-green-300 border-green-500/50 bg-green-500/10',
  }

  const rd = scan?.result_data
  const findings = rd?.all_findings || []
  const filtered = findings.filter(f => {
    const matchSev = filter === 'ALL' || normSeverity(f.severity) === filter
    const matchSearch = !search ||
      f.message.toLowerCase().includes(search.toLowerCase()) ||
      f.file.toLowerCase().includes(search.toLowerCase()) ||
      (f.engine || '').toLowerCase().includes(search.toLowerCase())
    return matchSev && matchSearch
  })

  // Build heatmap lookup matrix
  const heatmapLookup: Record<string, Record<string, number>> = {}
  for (const cat of HEATMAP_CATEGORIES) {
    heatmapLookup[cat] = {}
    for (const sev of HEATMAP_SEVERITIES) heatmapLookup[cat][sev] = 0
  }
  for (const cell of (rd?.heatmap_data || [])) {
    if (heatmapLookup[cell.category]) heatmapLookup[cell.category][cell.severity] = cell.count
  }

  const totalFindings = rd?.total_findings ?? scan?.total_findings ?? 0

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

          {scan && rd && (
            <>
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Audit Report</h1>
                  <p className="text-slate-400 text-sm">
                    {scan.file_desc} · {new Date(scan.created_at).toLocaleString()}
                    {rd.performance && ` · ${rd.performance.total.toFixed(1)}s`}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-4 py-1.5 rounded-full border text-sm font-semibold ${riskColors[scan.risk_level] || riskColors.MEDIUM}`}>
                    RISK: {scan.risk_score}/100 {scan.risk_level}
                  </span>
                  <button
                    onClick={downloadJSON}
                    className="rounded-lg bg-slate-800 border border-white/10 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
                  >
                    ↓ JSON
                  </button>
                  <button
                    onClick={downloadMarkdown}
                    className="rounded-lg bg-slate-800 border border-white/10 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
                  >
                    ↓ Markdown
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="rounded-lg bg-red-600/80 hover:bg-red-600 border border-red-500/50 px-4 py-1.5 text-sm font-semibold text-white transition-all"
                  >
                    ↓ PDF
                  </button>
                </div>
              </div>

              {/* Severity Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(level => {
                  const count = rd.severity_breakdown?.[level] || 0
                  const color = level === 'CRITICAL' ? 'text-red-400' : level === 'HIGH' ? 'text-orange-400' : level === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                  return (
                    <div key={level} className="rounded-lg border border-white/10 bg-slate-900/60 p-4 text-center">
                      <p className={`text-3xl font-bold ${color}`}>{count}</p>
                      <p className="text-xs text-slate-500 mt-1">{level}</p>
                    </div>
                  )
                })}
              </div>

              {/* Summary + Priorities */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Executive Summary</h2>
                  <p className="text-slate-200 leading-relaxed">{rd.ai_analysis?.executive_summary || '—'}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Top Priorities</h2>
                  <ol className="space-y-2">
                    {(rd.ai_analysis?.top_priorities || []).map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-atlas-primary/20 text-atlas-primary text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Risk Heatmap */}
              {rd.heatmap_data && rd.heatmap_data.length > 0 && (
                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6 mb-8">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Risk Heatmap</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left text-slate-500 font-medium pb-3 pr-6 text-xs uppercase">Engine / Category</th>
                          {HEATMAP_SEVERITIES.map(sev => (
                            <th key={sev} className={`text-center font-semibold pb-3 px-4 text-xs uppercase ${sev === 'CRITICAL' ? 'text-red-400' : sev === 'HIGH' ? 'text-orange-400' : sev === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>
                              {sev}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {HEATMAP_CATEGORIES.map(cat => (
                          <tr key={cat} className="border-t border-white/5">
                            <td className="text-slate-300 py-3 pr-6 font-medium text-sm">{cat}</td>
                            {HEATMAP_SEVERITIES.map(sev => {
                              const count = heatmapLookup[cat]?.[sev] ?? 0
                              return (
                                <td key={sev} className="py-3 px-4 text-center">
                                  <span className={`inline-block w-10 py-1 rounded text-sm ${heatmapCellStyle(sev, count)}`}>{count}</span>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* File Breakdown */}
              {rd.file_results && rd.file_results.length > 0 && (
                <div className="rounded-lg border border-white/10 bg-slate-900/60 p-6 mb-8">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Files Scanned ({rd.file_results.length})
                  </h2>
                  <div className="space-y-3">
                    {rd.file_results.map(fr => {
                      const pct = totalFindings > 0 ? (fr.findings / totalFindings) * 100 : 0
                      return (
                        <div key={fr.file}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-slate-300 font-mono text-xs">{fr.file}</span>
                            <span className="text-slate-500 text-xs">{fr.findings} finding{fr.findings !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500/60 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Audit Log */}
              <div className="rounded-lg border border-white/10 bg-slate-900/60 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-white">
                    Audit Log <span className="text-slate-500 font-normal text-base">({filtered.length})</span>
                  </h2>
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
                  <div className="divide-y divide-white/5">
                    {filtered.map((f, i) => {
                      const sev = normSeverity(f.severity)
                      const cwe = Array.isArray(f.cwe) ? f.cwe.join(', ') : f.cwe
                      const isOpen = expanded.has(i)
                      return (
                        <div key={i}>
                          <button
                            className="w-full text-left px-5 py-4 hover:bg-white/5 transition-colors"
                            onClick={() => toggleExpand(i)}
                          >
                            <div className="flex items-start gap-3 flex-wrap">
                              <span className={`inline-flex shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold border ${SEVERITY_STYLES[f.severity] || SEVERITY_STYLES.LOW}`}>
                                {sev}
                              </span>
                              <span className="text-slate-200 text-sm font-medium flex-1">{f.message}</span>
                              <span className="text-slate-600 text-xs">{isOpen ? '▲' : '▼'}</span>
                            </div>
                            <div className="flex gap-4 mt-1.5 text-xs text-slate-500 flex-wrap pl-0">
                              <span className="font-mono">{f.file}{f.line_start ? `:${f.line_start}` : ''}</span>
                              <span>· {f.engine}</span>
                              <span>· {f.category}</span>
                              {cwe && <span>· {cwe}</span>}
                            </div>
                          </button>
                          {isOpen && f.snippet && (
                            <div className="px-5 pb-4">
                              <pre className="rounded-lg bg-slate-950 border border-white/5 px-4 py-3 text-xs text-slate-300 font-mono overflow-x-auto">
                                {f.snippet}
                              </pre>
                            </div>
                          )}
                        </div>
                      )
                    })}
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
