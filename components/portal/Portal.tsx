'use client'

import Sidebar from './Sidebar'
import KPIDashboard from './KPIDashboard'
import NetworkGraph from './NetworkGraph'
import DailyWinsLog from './DailyWinsLog'
import ChatBot from './ChatBot'

export default function Portal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col">
        {/* KPI Dashboard */}
        <KPIDashboard />

        {/* Network Graph + Opportunities */}
        <NetworkGraph />

        {/* Daily Wins Log */}
        <DailyWinsLog />
      </div>

      {/* Chatbot */}
      <ChatBot />
    </div>
  )
}
