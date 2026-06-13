"use client"

import { useState } from "react"
import { RefreshCw, Download, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DrawerPayload } from "./SKUData"
import SKUDetailDrawer from "./SKUDetailDrawer"
import SKUSummaryStrip from "./SKUSummaryStrip"
import SKUSegmentCards from "./SKUSegmentCards"
import SKUClassificationFlow from "./SKUClassificationFlow"
import SKUPerformanceMatrix from "./SKUPerformanceMatrix"
import SKUDecisionLog from "./SKUDecisionLog"
import SKUApprovalWorkbench from "./SKUApprovalWorkbench"
import SKUSummaryBrief from "./SKUSummaryBrief"

const CATEGORIES = ["All Categories", "Consumables", "Seasonal", "Party", "Household", "Health & Beauty"]
const SEGMENTS   = ["All Segments", "Consistent Replenishment", "Seasonal / Event", "Treasure Hunt / Limited Buy", "Promo / Merchant-Driven", "Constrained / Exception"]
const REGIONS    = ["All Regions", "Southeast", "Midwest", "Northeast", "Southwest", "West"]
const STATUSES   = ["All Statuses", "Critical", "Watchlist", "Stable", "Needs Approval"]

export default function SKUSegmentationPage({ onGoToTab }: { onGoToTab: (tab: string) => void }) {
  const [category, setCategory]       = useState("All Categories")
  const [segment, setSegment]         = useState("All Segments")
  const [region, setRegion]           = useState("All Regions")
  const [riskStatus, setRiskStatus]   = useState("All Statuses")
  const [search, setSearch]           = useState("")
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  const openDrawer = (payload: DrawerPayload) => {
    setDrawerPayload(payload)
    setDrawerOpen(true)
  }
  const closeDrawer = () => setDrawerOpen(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-8 py-5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-[18px] font-bold text-foreground tracking-tight">AI-Driven SKU Segmentation</h1>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed ml-9">
              AI-classified SKU segments, fit-for-purpose strategies, and human approval actions across the Dollar Tree assortment
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[11px] font-semibold bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/30 px-2.5 py-1 rounded-full">
              AI segmentation active
            </span>
            <span className="text-[11px] text-muted-foreground">Last refresh: Jun 7, 2026 · 8:30 AM</span>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-card border-b border-border px-8 py-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          {[
            { value: category,   setter: setCategory,   options: CATEGORIES },
            { value: segment,    setter: setSegment,    options: SEGMENTS },
            { value: region,     setter: setRegion,     options: REGIONS },
            { value: riskStatus, setter: setRiskStatus, options: STATUSES },
          ].map(({ value, setter, options }) => (
            <select
              key={options[0]}
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="text-[12px] bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
            >
              {options.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
          <input
            type="text"
            placeholder="Search SKU family, category, segment, or decision"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[12px] bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 min-w-[280px]"
          />
          <div className="flex items-center gap-1.5 ml-auto">
            <button className="flex items-center gap-1.5 text-[12px] font-medium border border-border bg-card text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button className="flex items-center gap-1.5 text-[12px] font-medium border border-border bg-card text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="px-8 py-6 space-y-10">
        {/* S1 — Summary strip */}
        <SKUSummaryStrip onOpenDrawer={openDrawer} />

        {/* S2 — Segment cards */}
        <SKUSegmentCards onOpenDrawer={openDrawer} />

        {/* S3 — Classification flow */}
        <SKUClassificationFlow onOpenDrawer={openDrawer} />

        {/* S4 — Performance matrix */}
        <SKUPerformanceMatrix onOpenDrawer={openDrawer} />

        {/* S5 — Decision log */}
        <SKUDecisionLog onOpenDrawer={openDrawer} />

        {/* S6 — Approval workbench */}
        <SKUApprovalWorkbench onOpenDrawer={openDrawer} />

        {/* S7 — Summary brief */}
        <SKUSummaryBrief />
      </div>

      {/* Detail drawer */}
      <SKUDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={closeDrawer}
        onGoToTab={(tabId) => { onGoToTab(tabId); closeDrawer() }}
      />
    </div>
  )
}
