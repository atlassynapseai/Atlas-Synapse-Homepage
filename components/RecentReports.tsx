'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

interface AgentReport {
  id: string
  agent_name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  timestamp: string
  summary: string
}

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-300',
  running: 'bg-blue-500/20 text-blue-300',
  completed: 'bg-green-500/20 text-green-300',
  failed: 'bg-red-500/20 text-red-300',
}

export function RecentReports() {
  const { user, session } = useAuth()
  const [reports, setReports] = useState<AgentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || !session) {
      setLoading(false)
      return
    }

    const fetchReports = async () => {
      try {
        setError('')
        const response = await fetch('/agents/api/agent-runs?limit=3', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        })

        if (response.status === 401) {
          setError('401')
          setReports([])
          return
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch reports: ${response.status}`)
        }

        const data = await response.json()
        setReports(data.data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load reports')
        setReports([])
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [user, session])

  const handleRetry = () => {
    setLoading(true)
    setError('')
    // Trigger refetch by updating session dependency
    if (user && session) {
      fetchReports()
    }
  }

  const fetchReports = async () => {
    try {
      setError('')
      const response = await fetch('/agents/api/agent-runs?limit=3', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })

      if (response.status === 401) {
        setError('401')
        setReports([])
        return
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.status}`)
      }

      const data = await response.json()
      setReports(data.data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load reports')
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  // 401 Unauthorized - Show sign in message
  if (error === '401') {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-900/60 p-8 text-center">
        <p className="text-slate-400 mb-4">Sign in to view your saved reports</p>
        <Link
          href="/auth"
          className="inline-block rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all"
        >
          Sign In
        </Link>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-900/60 p-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-atlas-primary border-t-transparent" />
          <span className="text-slate-400">Loading reports...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error && error !== '401') {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-900/60 p-8">
        <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/50 p-4 text-red-300 text-sm">
          {error}
        </div>
        <button
          onClick={handleRetry}
          className="rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Empty state
  if (reports.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-900/60 p-8 text-center">
        <p className="text-slate-400 mb-4">No saved reports yet. Run an agent to see reports here.</p>
        <a
          href="/agents"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all"
        >
          Run an Agent →
        </a>
      </div>
    )
  }

  // Success state - Display reports
  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div
          key={report.id}
          className="rounded-lg border border-white/10 bg-slate-900/60 p-6 hover:border-white/20 transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{report.agent_name}</h3>
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[report.status]
                  }`}
              >
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-4">{report.summary}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {new Date(report.timestamp).toLocaleDateString()} {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <Link
              href={`/agents/reports/${report.id}`}
              className="rounded-lg bg-gradient-to-r from-atlas-primary to-atlas-secondary px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-all"
            >
              Open Report →
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
