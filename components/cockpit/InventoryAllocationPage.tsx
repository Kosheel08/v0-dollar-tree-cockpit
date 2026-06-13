"use client"

import { useState } from "react"
import { RefreshCw, Download, Search, Boxes } from "lucide-react"
import { Button } from "@/components/ui/button"
import InvKpiCards from "@/components/cockpit/InvKpiCards"
import InvPositionCockpit from "@/components/cockpit/InvPositionCockpit"
import InvAllocationCuts from "@/components/cockpit/InvAllocationCuts"
import DcImbalanceMatrix from "@/components/cockpit/DcImbalanceMatrix"
import TransferRecommendations from "@/components/cockpit/TransferRecommendations"
import AllocationExceptionReview from "@/components/cockpit/AllocationExceptionReview"
import InvAllocationSummary from "@/components/cockpit/InvAllocationSummary"

const segments  = ["All Segments","Consistent Replenishment","Seasonal / Event","Treasure Hunt / Limited Buy","Promo / Merchant-Driven","Constrained / Exception"]
const regions     = ["All Regions","Southeast","Midwest","Northeast","Southwest","West"]
const nodes       = ["All Nodes","Stores","DCs","In Transit","Available to Allocate"]
const horizons    = ["2 Weeks","4 Weeks","8 Weeks","13 Weeks"]

export default function InventoryAllocationPage() {
  const [segment,  setSegment]  = useState("All Segments")
  const [region,   setRegion]   = useState("All Regions")
  const [node,     setNode]     = useState("All Nodes")
  const [horizon,  setHorizon]  = useState("4 Weeks")
  const [search,   setSearch]   = useState("")

  return (
    <div className="flex flex-col min-h-full">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Inventory &amp; Allocation</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Inventory position, store exposure, allocation priorities, and transfer opportunities across the network
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

        {/* One global filter bar */}
        <div className="mt-4">
          <div className="bg-card border border-border rounded-xl px-4 py-3 flex flex-wrap items-center gap-2.5">
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              {segments.map((c) => <option key={c}>{c}</option>)}
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

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search SKU, segment, DC, store, or region"
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
      <main className="flex-1 px-6 py-6 space-y-8">
        <InvKpiCards />
        <InvPositionCockpit />
        <InvAllocationCuts />
        <DcImbalanceMatrix />
        <TransferRecommendations />
        <AllocationExceptionReview />
        <InvAllocationSummary />
      </main>
    </div>
  )
}
