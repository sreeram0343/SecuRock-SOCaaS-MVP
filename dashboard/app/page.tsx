
"use client"

import RiskScore from "@/components/RiskScore"
import NarrativeFeed from "@/components/NarrativeFeed"
import AuthGuard from "@/components/AuthGuard"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">SecuRock SOC</h1>
              <p className="text-muted-foreground">Production-Grade Security Operations</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium">System Online</span>
            </div>
          </div>

          {/* Core Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Left Column: Metrics */}
            <div className="space-y-6">
              <RiskScore score={0.25} /> {/* Dynamic in real app */}

              <div className="bg-card border rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold mb-2">Active Agents</h3>
                <div className="text-3xl font-bold">42</div>
              </div>
            </div>

            {/* Right Column: Feed (Spans 2 cols) */}
            <div className="md:col-span-2">
              <NarrativeFeed />
            </div>

          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
