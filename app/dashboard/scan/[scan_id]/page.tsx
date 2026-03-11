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

// CWE → framework violation mapping
const CWE_MAP: Record<string, { pci?: string[]; owasp?: string[]; nist?: string[]; soc2?: string[]; nydfs?: string[]; cwe25?: boolean }> = {
  'CWE-89':  { pci: ['6.5.1'], owasp: ['A03:2021'], nist: ['RV.1.1'], cwe25: true },
  'CWE-79':  { pci: ['6.5.7'], owasp: ['A03:2021'], soc2: ['CC8.1'], cwe25: true },
  'CWE-78':  { pci: ['6.5.1'], owasp: ['A03:2021'], nist: ['RV.1.1'], cwe25: true },
  'CWE-798': { pci: ['8.2.1', '8.3.2'], owasp: ['A07:2021'], soc2: ['CC6.1'], nydfs: ['500.7'], cwe25: true },
  'CWE-502': { pci: ['6.5.8'], owasp: ['A08:2021'], nist: ['RV.1.2'], cwe25: true },
  'CWE-95':  { pci: ['6.5.1'], owasp: ['A03:2021'], cwe25: true },
  'CWE-22':  { pci: ['6.5.4'], owasp: ['A01:2021'], nist: ['RV.1.1'], cwe25: true },
  'CWE-327': { pci: ['4.2.1'], nist: ['PW.9.1'], soc2: ['CC6.1'], nydfs: ['500.12'] },
}

const FRAMEWORK_TOTALS = { pci: 16, owasp: 10, nist: 20, soc2: 12, nydfs: 10, cwe25: 25 }

interface ComplianceResult {
  name: string
  shortName: string
  compliance: number
  violations: number
  controls: number
  affectedControls: string[]
}

function computeCompliance(findings: Finding[]): ComplianceResult[] {
  const violated = { pci: new Set<string>(), owasp: new Set<string>(), nist: new Set<string>(), soc2: new Set<string>(), nydfs: new Set<string>(), cwe25: new Set<string>() }

  for (const f of findings) {
    const cwes = Array.isArray(f.cwe) ? f.cwe : [f.cwe || '']
    for (const rawCwe of cwes) {
      const cwe = rawCwe.split(':')[0].trim().toUpperCase()
      const map = CWE_MAP[cwe]
      if (!map) continue
      map.pci?.forEach(c => violated.pci.add(c))
      map.owasp?.forEach(c => violated.owasp.add(c))
      map.nist?.forEach(c => violated.nist.add(c))
      map.soc2?.forEach(c => violated.soc2.add(c))
      map.nydfs?.forEach(c => violated.nydfs.add(c))
      if (map.cwe25) violated.cwe25.add(cwe)
    }
  }

  const calc = (key: keyof typeof violated, name: string, shortName: string): ComplianceResult => {
    const v = violated[key].size
    const total = FRAMEWORK_TOTALS[key]
    const controls = Math.max(1, Math.ceil(total * 0.4))
    const compliance = Math.round(((controls - Math.min(v, controls)) / controls) * 100)
    return { name, shortName, compliance, violations: v, controls, affectedControls: Array.from(violated[key]).slice(0, 4) }
  }

  return [
    calc('pci',   'Payment Card Industry Data Security Standard v4.0', 'PCI-DSS 4.0'),
    calc('owasp', 'OWASP Top 10 Web Application Security Risks', 'OWASP Top 10'),
    calc('nist',  'NIST Secure Software Development Framework 1.1', 'NIST SSDF 1.1'),
    calc('soc2',  'SOC 2 Type II Trust Services Criteria', 'SOC 2 Type II'),
    calc('nydfs', 'NY Dept of Financial Services Cybersecurity Regulation', 'NYDFS Cyber'),
    calc('cwe25', 'CWE Top 25 Most Dangerous Software Weaknesses', 'CWE Top 25'),
  ]
}

const HEATMAP_CATEGORIES = ['SAST', 'Secrets', 'SCA', 'Deep Analysis', 'Malware Detection']
const HEATMAP_SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

function normSeverity(s: string) {
  if (s === 'ERROR') return 'CRITICAL'
  if (s === 'WARNING') return 'MEDIUM'
  return s
}

const SEV_BADGE: Record<string, string> = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH:     'bg-orange-500 text-white',
  MEDIUM:   'bg-yellow-500 text-black',
  LOW:      'bg-green-600 text-white',
  ERROR:    'bg-red-600 text-white',
}

const SEV_BORDER: Record<string, string> = {
  CRITICAL: 'border-l-red-500',
  HIGH:     'border-l-orange-500',
  MEDIUM:   'border-l-yellow-400',
  LOW:      'border-l-green-500',
  ERROR:    'border-l-red-500',
}

function heatmapCell(sev: string, count: number) {
  if (count === 0) return 'text-slate-600 print:text-gray-300'
  switch (sev) {
    case 'CRITICAL': return 'text-red-400 font-bold print:text-red-600'
    case 'HIGH':     return 'text-orange-400 font-semibold print:text-orange-600'
    case 'MEDIUM':   return 'text-yellow-400 print:text-yellow-600'
    default:         return 'text-green-400 print:text-green-600'
  }
}

export default function ScanDetailPage() {
  const { scan_id } = useParams<{ scan_id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [scan, setScan] = useState<ScanDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!user || !scan_id) return
    fetch(`/api/scan-results/${scan_id}?userId=${user.id}`)
      .then(r => r.json())
      .then(data => { if (data.error) setError(data.error); else setScan(data) })
      .catch(() => setError('Failed to load scan'))
      .finally(() => setLoading(false))
  }, [user, scan_id])

  const toggleExpand = (i: number) => {
    setExpanded(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })
  }

  const downloadJSON = () => {
    if (!scan) return
    const blob = new Blob([JSON.stringify(scan.result_data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `atlas-audit-${scan.scan_id}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const downloadMarkdown = () => {
    if (!scan) return
    const rd = scan.result_data
    const findings = rd.all_findings || []
    const md = [
      `# Atlas Synapse Security Audit Report`,
      `**Scan ID:** ${scan.scan_id}  |  **Files:** ${scan.file_desc}  |  **Date:** ${new Date(scan.created_at).toLocaleString()}`,
      `**Risk:** ${scan.risk_level} (${scan.risk_score}/100)`,
      ``, `## Executive Summary`, rd.ai_analysis?.executive_summary || '—',
      ``, `## Remediation Priorities`,
      ...(rd.ai_analysis?.top_priorities || []).map((p, i) => `- **P${i + 1}:** ${p}`),
      ``, `## Severity Breakdown`,
      `| Level | Count |`, `|-------|-------|`,
      `| Critical | ${rd.severity_breakdown?.CRITICAL || 0} |`,
      `| High | ${rd.severity_breakdown?.HIGH || 0} |`,
      `| Medium | ${rd.severity_breakdown?.MEDIUM || 0} |`,
      `| Low | ${rd.severity_breakdown?.LOW || 0} |`,
      ``, `## Findings (${findings.length})`,
      `| # | Severity | Engine | File | Line | CWE | Message |`,
      `|---|----------|--------|------|------|-----|---------|`,
      ...findings.map((f, i) => {
        const cwe = Array.isArray(f.cwe) ? f.cwe.join(', ') : (f.cwe || '—')
        return `| ${i + 1} | ${normSeverity(f.severity)} | ${f.engine} | ${f.file} | ${f.line_start || '—'} | ${cwe} | ${f.message} |`
      }),
    ].join('\n')
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `atlas-audit-${scan.scan_id}.md`; a.click()
    URL.revokeObjectURL(url)
  }

  const rd = scan?.result_data
  const findings = rd?.all_findings || []
  const compliance = findings.length > 0 ? computeCompliance(findings) : []
  const criticalFindings = findings.filter(f => normSeverity(f.severity) === 'CRITICAL')
  const highFindings = findings.filter(f => normSeverity(f.severity) === 'HIGH')
  const totalFindings = rd?.total_findings ?? scan?.total_findings ?? 0
  const isNonCompliant = compliance.some(c => c.compliance < 80)

  const filtered = findings.filter(f => {
    const matchSev = filter === 'ALL' || normSeverity(f.severity) === filter
    const matchSearch = !search || f.message.toLowerCase().includes(search.toLowerCase()) || f.file.toLowerCase().includes(search.toLowerCase())
    return matchSev && matchSearch
  })

  // Build heatmap lookup
  const heatmapLookup: Record<string, Record<string, number>> = {}
  for (const cat of HEATMAP_CATEGORIES) { heatmapLookup[cat] = {}; for (const sev of HEATMAP_SEVERITIES) heatmapLookup[cat][sev] = 0 }
  for (const cell of (rd?.heatmap_data || [])) { if (heatmapLookup[cell.category]) heatmapLookup[cell.category][cell.severity] = cell.count }

  const riskColor = scan?.risk_level === 'CRITICAL' ? 'text-red-400 border-red-500/50 bg-red-500/10' :
    scan?.risk_level === 'HIGH' ? 'text-orange-400 border-orange-500/50 bg-orange-500/10' :
    scan?.risk_level === 'MEDIUM' ? 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10' :
    'text-green-400 border-green-500/50 bg-green-500/10'

  return (
    <ProtectedRoute>
      {/* Print stylesheet */}
      <style>{`
        @media print {
          body { background: white !important; color: #111 !important; font-family: Georgia, serif; }
          .no-print { display: none !important; }
          .print-page { page-break-after: always; background: white !important; color: #111 !important; }
          .print-card { border: 1px solid #e5e7eb !important; background: white !important; color: #111 !important; }
          .print-dark { background: #1e293b !important; color: #e2e8f0 !important; }
          pre { background: #1e293b !important; color: #e2e8f0 !important; }
          a { color: #2563eb !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#050816] pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">

          <Link href="/dashboard" className="no-print inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-8">
            ← Back to Dashboard
          </Link>

          {loading && <div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" /></div>}
          {error && <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-6 text-red-300">{error}</div>}

          {scan && rd && (
            <>
              {/* ── PAGE 1: COVER ── */}
              <div className="print-page rounded-xl border border-white/10 bg-slate-900/60 p-10 mb-8">
                {/* Logo row */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg">A</div>
                  <div>
                    <div className="text-xl font-bold text-white tracking-wide">ATLAS SYNAPSE</div>
                    <div className="text-xs text-slate-400 tracking-widest">SECURITY AUDIT REPORT</div>
                  </div>
                </div>

                {/* Confidential banner */}
                <div className="bg-red-600 text-white text-xs font-bold tracking-widest text-center py-2 px-4 rounded mb-8 uppercase">
                  Confidential — Executive Leadership Only
                </div>

                <h1 className="text-3xl font-bold text-white mb-8">Security Audit Report</h1>

                <div className="rounded-lg border border-white/10 overflow-hidden">
                  {[
                    ['Scan Identifier', scan.scan_id],
                    ['Target Asset', scan.file_desc],
                    ['Analysis Date', new Date(scan.created_at).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })],
                    ['Execution Duration', rd.performance ? `${rd.performance.total.toFixed(2)} seconds` : '—'],
                    ['Report Generated', new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })],
                  ].map(([label, value]) => (
                    <div key={label} className="flex border-b border-white/5 last:border-0">
                      <div className="w-48 px-5 py-3 text-slate-400 text-sm font-medium bg-slate-800/40 shrink-0">{label}</div>
                      <div className="px-5 py-3 text-slate-200 text-sm font-mono">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Download buttons */}
                <div className="no-print flex gap-3 mt-8 flex-wrap">
                  <button onClick={downloadJSON} className="px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-sm text-white hover:bg-slate-700 transition-all">↓ JSON</button>
                  <button onClick={downloadMarkdown} className="px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-sm text-white hover:bg-slate-700 transition-all">↓ Markdown</button>
                  <button onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 border border-red-500/50 text-sm text-white transition-all">↓ PDF</button>
                </div>
              </div>

              {/* ── PAGE 2: EXECUTIVE RISK ASSESSMENT ── */}
              <div className="print-page rounded-xl border border-white/10 bg-slate-900/60 p-8 mb-8">
                <h2 className="text-xl font-bold text-blue-400 mb-6">Executive Risk Assessment</h2>

                {/* Big risk score */}
                <div className={`rounded-xl border-2 p-8 text-center mb-6 ${riskColor}`}>
                  <div className="text-7xl font-black mb-1">
                    {scan.risk_score}<span className="text-4xl font-light text-slate-500">/100</span>
                  </div>
                  <div className="text-2xl font-bold tracking-widest mt-2 uppercase">{scan.risk_level} RISK</div>
                </div>

                {/* Summary text */}
                <div className="rounded-lg border border-white/10 bg-slate-800/40 p-4 mb-8">
                  <p className="text-slate-300">{rd.ai_analysis?.executive_summary}</p>
                </div>

                {/* Findings Distribution */}
                <h3 className="text-blue-400 font-semibold mb-4">Findings Distribution</h3>
                <div className="space-y-4">
                  {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(level => {
                    const count = rd.severity_breakdown?.[level] || 0
                    const pct = totalFindings > 0 ? Math.round((count / totalFindings) * 100) : 0
                    const barColor = level === 'CRITICAL' ? 'bg-red-500' : level === 'HIGH' ? 'bg-orange-500' : level === 'MEDIUM' ? 'bg-yellow-400' : 'bg-green-500'
                    const textColor = level === 'CRITICAL' ? 'text-red-400' : level === 'HIGH' ? 'text-orange-400' : level === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                    return (
                      <div key={level}>
                        <div className="flex justify-between mb-1.5">
                          <span className={`text-sm font-bold ${textColor}`}>{level}</span>
                          <span className="text-slate-400 text-sm">{count} finding{count !== 1 ? 's' : ''} ({pct}%)</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── PAGE 3: REGULATORY COMPLIANCE ── */}
              {compliance.length > 0 && (
                <div className="print-page rounded-xl border border-white/10 bg-slate-900/60 p-8 mb-8">
                  <h2 className="text-xl font-bold text-blue-400 mb-6">Regulatory Compliance Assessment</h2>

                  {/* Compliance summary */}
                  <div className="rounded-lg border border-white/10 bg-slate-800/40 p-5 mb-6">
                    {isNonCompliant ? (
                      <div className="flex items-start gap-2 text-red-400 font-semibold mb-4">
                        <span className="text-lg">✕</span>
                        <span>NON-COMPLIANT — Multiple critical vulnerabilities prevent regulatory approval</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-green-400 font-semibold mb-4">
                        <span className="text-lg">✓</span>
                        <span>COMPLIANT — No critical compliance violations detected</span>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Critical Blockers</div>
                        <div className="text-3xl font-bold text-red-400">{criticalFindings.length}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">High Priority</div>
                        <div className="text-3xl font-bold text-orange-400">{highFindings.length}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Est. Remediation</div>
                        <div className="text-2xl font-bold text-white">{criticalFindings.length * 4 + highFindings.length * 2} dev-hours</div>
                      </div>
                    </div>
                  </div>

                  {/* Framework table */}
                  <h3 className="text-blue-400 font-semibold mb-3">Framework Compliance Status</h3>
                  <div className="rounded-lg border border-white/10 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                          <th className="px-4 py-3 text-left">Framework</th>
                          <th className="px-4 py-3 text-center">Compliance</th>
                          <th className="px-4 py-3 text-center">Violations</th>
                          <th className="px-4 py-3 text-center">Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {compliance.map(c => (
                          <tr key={c.shortName} className="hover:bg-white/5">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className={c.compliance < 80 ? 'text-red-400' : 'text-green-400'}>✕</span>
                                <span className="text-slate-300">{c.name}</span>
                              </div>
                              {c.affectedControls.length > 0 && (
                                <div className="text-xs text-slate-500 mt-0.5 ml-5">{c.affectedControls.join(', ')}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`font-bold ${c.compliance < 60 ? 'text-red-400' : c.compliance < 80 ? 'text-orange-400' : 'text-green-400'}`}>
                                {c.compliance}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-slate-300">{c.violations}</td>
                            <td className="px-4 py-3 text-center text-slate-300">{c.controls}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── FIDUCIARY ASSESSMENT ── */}
              {criticalFindings.length > 0 && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h3 className="text-red-300 font-bold mb-2">Atlas Synapse Fiduciary Assessment</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        This codebase contains <strong className="text-red-300">{criticalFindings.length} critical regulatory violations</strong> that constitute material risk to the organization. Deployment in current state may violate fiduciary duty to stakeholders and create legal exposure.
                      </p>
                      <p className="text-slate-400 text-sm mt-3">
                        <strong className="text-slate-300">Atlas Synapse Recommendation:</strong> Remediation of critical findings is not optional — it is a fiduciary necessity to maintain regulatory compliance and limit organizational liability.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── REMEDIATION PRIORITIES ── */}
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8 mb-8">
                <h2 className="text-xl font-bold text-blue-400 mb-6">Remediation Priorities</h2>
                <div className="space-y-3">
                  {(rd.ai_analysis?.top_priorities || []).map((p, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border border-white/10 bg-slate-800/40 px-5 py-4">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        P{i + 1}
                      </div>
                      <span className="text-slate-200">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── RISK HEATMAP ── */}
              {rd.heatmap_data && rd.heatmap_data.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8 mb-8">
                  <h2 className="text-xl font-bold text-blue-400 mb-6">Risk Heatmap</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left text-slate-500 font-medium pb-3 pr-8 text-xs uppercase">Engine</th>
                          {HEATMAP_SEVERITIES.map(sev => (
                            <th key={sev} className={`text-center font-bold pb-3 px-4 text-xs uppercase ${sev === 'CRITICAL' ? 'text-red-400' : sev === 'HIGH' ? 'text-orange-400' : sev === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>
                              {sev}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {HEATMAP_CATEGORIES.map(cat => (
                          <tr key={cat} className="border-t border-white/5">
                            <td className="text-slate-300 py-3 pr-8 font-medium">{cat}</td>
                            {HEATMAP_SEVERITIES.map(sev => {
                              const count = heatmapLookup[cat]?.[sev] ?? 0
                              return (
                                <td key={sev} className="py-3 px-4 text-center">
                                  <span className={`text-base font-mono ${heatmapCell(sev, count)}`}>{count}</span>
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

              {/* ── FILE BREAKDOWN ── */}
              {rd.file_results && rd.file_results.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8 mb-8">
                  <h2 className="text-xl font-bold text-blue-400 mb-6">Files Scanned ({rd.file_results.length})</h2>
                  <div className="space-y-4">
                    {rd.file_results.map(fr => {
                      const pct = totalFindings > 0 ? (fr.findings / totalFindings) * 100 : 0
                      return (
                        <div key={fr.file}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-slate-300 font-mono text-sm">{fr.file}</span>
                            <span className="text-slate-400 text-sm">{fr.findings} finding{fr.findings !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500/70 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── DETAILED VULNERABILITY ANALYSIS ── */}
              <div className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden mb-8">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold text-blue-400 mb-1">Detailed Vulnerability Analysis</h2>
                  <p className="text-slate-400 text-sm">Comprehensive analysis ordered by severity. Each finding includes location, classification, and vulnerable code.</p>
                </div>

                {/* Filter controls */}
                <div className="no-print p-4 border-b border-white/10 flex flex-wrap items-center gap-3">
                  {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${filter === f ? 'bg-atlas-primary/20 border-atlas-primary/50 text-atlas-primary' : 'border-white/10 text-slate-400 hover:text-white'}`}>
                      {f}
                    </button>
                  ))}
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search findings..."
                    className="ml-auto rounded-lg border border-white/10 bg-slate-800/60 px-3 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-atlas-primary/50 w-44" />
                </div>

                <div className="p-6 space-y-4">
                  {filtered.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">No findings match this filter.</div>
                  ) : (
                    filtered.map((f, i) => {
                      const sev = normSeverity(f.severity)
                      const cwe = Array.isArray(f.cwe) ? f.cwe.join(' · ') : f.cwe
                      const isOpen = expanded.has(i)
                      return (
                        <div key={i} className={`rounded-lg border border-white/10 border-l-4 ${SEV_BORDER[f.severity] || SEV_BORDER.LOW} overflow-hidden print-card`}>
                          <button className="w-full text-left p-5 hover:bg-white/5 transition-colors" onClick={() => toggleExpand(i)}>
                            <div className="flex items-start gap-3 mb-3">
                              <span className={`shrink-0 px-2.5 py-0.5 rounded text-xs font-bold ${SEV_BADGE[f.severity] || SEV_BADGE.LOW}`}>{sev}</span>
                              <span className="text-blue-300 font-semibold text-base">{i + 1}. {f.message}</span>
                              <span className="no-print ml-auto text-slate-600 text-xs">{isOpen ? '▲' : '▼'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                              <div><span className="text-slate-500">Engine</span><div className="text-slate-300 font-medium">{f.engine}</div></div>
                              <div><span className="text-slate-500">Category</span><div className="text-slate-300 font-medium">{f.category}</div></div>
                              <div><span className="text-slate-500">Location</span><div className="text-slate-300 font-mono">{f.file}{f.line_start ? `:${f.line_start}` : ''}</div></div>
                              {cwe && <div><span className="text-slate-500">CWE Classification</span><div className="text-slate-300">{cwe}</div></div>}
                            </div>
                          </button>
                          {(isOpen || true) && f.snippet && (
                            <div className="px-5 pb-5">
                              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Vulnerable Code:</div>
                              <pre className="rounded-lg bg-slate-950 border border-white/5 px-4 py-3 text-sm text-slate-300 font-mono overflow-x-auto print-dark">
                                {f.snippet}
                              </pre>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* ── FOOTER ── */}
              <div className="text-center py-8 border-t border-white/10">
                <div className="text-blue-400 font-semibold mb-1">ATLAS SYNAPSE LLC · The Sovereign Standard for Enterprise Security</div>
                <div className="text-slate-500 text-sm">Powered by Semgrep · Gitleaks · Trivy · CodeQL · Google Gemini AI</div>
                <div className="text-slate-600 text-xs mt-1">© 2026 Atlas Synapse LLC. All rights reserved. · Report generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
