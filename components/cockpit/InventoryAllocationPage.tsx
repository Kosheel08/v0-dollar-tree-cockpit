"use client"

import { useRef, useState } from "react"
import { RefreshCw, Download, Search, Boxes } from "lucide-react"
import { Button } from "@/components/ui/button"
import InvKpiCards2 from "@/components/cockpit/InvKpiCards2"
import InvPositionChart from "@/components/cockpit/InvPositionChart"
import InvWOSRisk from "@/components/cockpit/InvWOSRisk"
import InvImbalanceMatrix from "@/components/cockpit/InvImbalanceMatrix"
import InvAllocationSummary2 from "@/components/cockpit/InvAllocationSummary2"
import AIActionsModule from "@/components/cockpit/AIActionsModule"
import { inventoryActions, inventoryApprovals } from "@/components/cockpit/AIActionsData"

const segments = [
  "All Segments",
  "Consistent Replenishment",
  "Seasonal / Event",
  "Treasure Hunt / Limited Buy",
  "Promo / Merchant-Driven",
  "Constrained / Exception",
]
const regions = ["All Regions", "Southeast", "Midwest", "Northeast", "Southwest", "West"]
const nodes = [
  "All Nodes",
  "Savannah DC",
  "Joliet DC",
  "Chesapeake DC",
  "Marietta DC",
  "San Bernardino DC",
  "Olive Branch DC",
]
const horizons = ["Next 4 Weeks", "Next 8 Weeks", "Season Window"]

interface InventoryAllocationPageProps {
  onGoToTab?: (tab: string) => void
}

export default function InventoryAllocationPage({ onGoToTab }: InventoryAllocationPageProps) {
  const [segment,  setSegment]  = useState("All Segments")
  const [region,   setRegion]   = useState("All Regions")
  const [node,     setNode]     = useState("All Nodes")
  const [horizon,  setHorizon]  = useState("Next 4 Weeks")
  const [search,   setSearch]   = useState("")

  const approvalsRef = useRef<HTMLDivElement>(null)

  function scrollToApprovals() {
    approvalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Inventory &amp; Allocation</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Inventory position, shortage exposure, overstock risk, and allocation priorities by AI-defined SKU segment and region
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
              <Boxes className="w-3 h-3" />
              Allocation cycle open
            </span>
            <span className="text-[11px] text-muted-foreground">
              Last refresh: Jun 7, 2026 &middot; 8:30 AM
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4">
          <div className="bg-card border border-border rounded-xl px-4 py-3 flex flex-wrap items-center gap-2.5">
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              {segments.map((s) => <option key={s}>{s}</option>)}
            </select>

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              {regions.map((r) => <option key={r}>{r}</option>)}
            </select>

            <select
              value={node}
              onChange={(e) => setNode(e.target.value)}
              className="h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              {nodes.map((n) => <option key={n}>{n}</option>)}
            </select>

            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value)}
              className="h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              {horizons.map((h) => <option key={h}>{h}</option>)}
            </select>

            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search SKU segment, product family, DC, store, or region"
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
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 px-6 py-6 space-y-6">

        {/* Section 2 — KPI Summary Cards */}
        <InvKpiCards2 onGoToTab={onGoToTab} />

        {/* Section 3 — Inventory Signal Visuals */}
        <div className="grid grid-cols-2 gap-4">
          <InvPositionChart onGoToTab={onGoToTab} />
          <InvWOSRisk onGoToTab={onGoToTab} />
        </div>

        {/* Section 4 — Inventory Imbalance Matrix */}
        <InvImbalanceMatrix onGoToTab={onGoToTab} />

        {/* Section 5 — AI Actions & Human Approvals */}
        <div ref={approvalsRef} className="rounded-2xl border border-border bg-card px-6 py-5">
          <AIActionsModule
            actions={inventoryActions}
            approvals={inventoryApprovals}
            onGoToTab={onGoToTab ?? (() => {})}
          />
        </div>

        {/* Section 6 — Inventory & Allocation Summary */}
        <InvAllocationSummary2 onOpenApprovals={scrollToApprovals} />

      </main>
    </div>
  )
}
