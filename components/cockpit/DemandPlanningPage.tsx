"use client"

import { useState, useRef } from "react"
import { Activity, RefreshCw, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import KpiCards from "@/components/cockpit/KpiCards"
import ForecastAnalytics from "@/components/cockpit/ForecastAnalytics"
import RiskMatrix from "@/components/cockpit/RiskMatrix"
import DemandPlanningSummary from "@/components/cockpit/DemandPlanningSummary"
import AIActionsModule from "@/components/cockpit/AIActionsModule"
import { demandActions, demandApprovals } from "@/components/cockpit/AIActionsData"
import SKUDetailDrawer from "@/components/cockpit/SKUDetailDrawer"
import type { DrawerPayload } from "@/components/cockpit/SKUData"

const skuSegments = [
  "All Segments",
  "Consistent Replenishment",
  "Seasonal / Event",
  "Treasure Hunt / Limited Buy",
  "Promo / Merchant-Driven",
  "Constrained / Exception",
]
const regions  = ["All Regions", "Southeast", "Midwest", "Northeast", "Southwest", "West"]
const horizons = ["4 Weeks", "8 Weeks", "13 Weeks"]

const selectCls =
  "h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"

interface DemandPlanningPageProps {
  onGoToTab?: (tab: string) => void
}

export default function DemandPlanningPage({ onGoToTab }: DemandPlanningPageProps) {
  const [segment, setSegment] = useState("All Segments")
  const [region,  setRegion]  = useState("All Regions")
  const [horizon, setHorizon] = useState("4 Weeks")
  const [search,  setSearch]  = useState("")

  // Summary callout drawer — opens the first approval card drawer
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  const actionsRef = useRef<HTMLElement | null>(null)

  function openSummaryApproval() {
    setDrawerPayload(demandApprovals[0].drawer)
    setDrawerOpen(true)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Section 1: Header + filters ─────────────────────────────────────── */}
      <header className="px-6 pt-6 pb-4 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Demand Planning</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Forecast accuracy, bias, and revenue-at-risk signals by AI-defined SKU segment and region
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700 shrink-0">
              <Activity className="w-3 h-3" />
              Live planning cycle
            </span>
            <span className="text-[11px] text-muted-foreground shrink-0">
              Last refresh: Jun 7, 2026 &middot; 8:30 AM
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <select value={segment} onChange={(e) => setSegment(e.target.value)} className={selectCls}>
            {skuSegments.map((s) => <option key={s}>{s}</option>)}
          </select>

          <select value={region} onChange={(e) => setRegion(e.target.value)} className={selectCls}>
            {regions.map((r) => <option key={r}>{r}</option>)}
          </select>

          <select value={horizon} onChange={(e) => setHorizon(e.target.value)} className={selectCls}>
            {horizons.map((h) => <option key={h}>{h}</option>)}
          </select>

          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search SKU segment, product family, region, or DC"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full text-xs bg-background border border-border rounded-md pl-8 pr-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 px-6 py-6 space-y-8">

        {/* Section 2: KPI summary cards */}
        <KpiCards onGoToTab={onGoToTab} />

        {/* Section 3: Forecast signal visuals */}
        <ForecastAnalytics onGoToTab={onGoToTab} />

        {/* Section 4: Demand Risk Matrix */}
        <RiskMatrix onGoToTab={onGoToTab} />

        {/* Section 5: AI Actions & Human Approvals */}
        <section ref={actionsRef} className="rounded-2xl border border-border bg-card px-6 py-5">
          <AIActionsModule
            actions={demandActions}
            approvals={demandApprovals}
            onGoToTab={onGoToTab ?? (() => {})}
          />
        </section>

        {/* Section 6: Demand Planning Summary */}
        <DemandPlanningSummary onOpenApproval={openSummaryApproval} />
      </main>

      {/* Summary callout drawer */}
      <SKUDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={() => { setDrawerOpen(false); setDrawerPayload(null) }}
        onGoToTab={(tabId) => { onGoToTab?.(tabId); setDrawerOpen(false) }}
      />
    </div>
  )
}
