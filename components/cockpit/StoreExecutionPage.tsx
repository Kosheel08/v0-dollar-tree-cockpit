"use client"

import { useState } from "react"
import { Search, RefreshCw, Download, ChevronDown, Zap } from "lucide-react"
import SEOperatingPulse     from "./SEOperatingPulse"
import SEFunnel             from "./SEFunnel"
import SEDistrictScoreboard from "./SEDistrictScoreboard"
import SEBackroomWorkbench  from "./SEBackroomWorkbench"
import SEPromoTracker       from "./SEPromoTracker"
import SEAccuracyDiagnostics from "./SEAccuracyDiagnostics"
import SEFieldActionQueue   from "./SEFieldActionQueue"
import SEDetailDrawer       from "./SEDetailDrawer"
import type { DetailItem }  from "./SEData"
import AIActionsModule from "./AIActionsModule"
import { storeActions, storeApprovals } from "./AIActionsData"

// ─── filter helpers ────────────────────────────────────────────────────────────
function Select({ label, options }: { label: string; options: string[] }) {
  const [val, setVal] = useState(options[0])
  return (
    <div className="relative">
      <select
        value={val}
        onChange={e => setVal(e.target.value)}
        className="appearance-none text-xs font-medium bg-background border border-border rounded-lg pl-3 pr-7 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
    </div>
  )
}

// ─── page ──────────────────────────────────────────────────────────────────────
interface StoreExecutionPageProps {
  onGoToTab?: (tab: string) => void
}

export default function StoreExecutionPage({ onGoToTab }: StoreExecutionPageProps) {
  const [search, setSearch]           = useState("")
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [selected, setSelected]       = useState<DetailItem | null>(null)

  function openDrawer(item: DetailItem) {
    setSelected(item)
    setDrawerOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── header ── */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Zap className="w-4 h-4 text-primary" />
              <h1 className="text-base font-bold text-foreground">Store Execution</h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Receiving, backroom processing, shelf readiness, task compliance, and field execution after store delivery
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Field execution active
            </span>
            <span className="text-xs text-muted-foreground">Last refresh: Jun 7, 2026 · 8:30 AM</span>
          </div>
        </div>
      </div>

      {/* ── filter bar ── */}
      <div className="border-b border-border bg-card/80 px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            label="District"
            options={["All Districts","District 104 · Atlanta Metro","District 118 · Birmingham","District 132 · Chicago South","District 147 · Philadelphia","District 155 · Phoenix","District 169 · Los Angeles East"]}
          />
          <Select
            label="Store Format"
            options={["All Store Formats","Standard","High-Volume","Small Box","Rural","Urban"]}
          />
          <Select
            label="Workstream"
            options={["All Workstreams","Receiving","Backroom","Shelf Stocking","Promo Setup","Inventory Accuracy"]}
          />
          <Select
            label="Execution Status"
            options={["All Statuses","Critical","Behind","On Track","Complete"]}
          />
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search store, district, task, display, or issue"
              className="w-full text-xs bg-background border border-border rounded-lg pl-8 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />Refresh
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors">
              <Download className="w-3.5 h-3.5" />Export
            </button>
          </div>
        </div>
      </div>

      {/* ── sections ── */}
      <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto">

        {/* S1 — Operating Pulse */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-4 rounded-full bg-primary" />
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Store Operating Pulse</p>
          </div>
          <SEOperatingPulse />
        </section>

        {/* S2 — Delivery-to-Shelf Funnel */}
        <section>
          <SEFunnel onSelect={openDrawer} />
        </section>

        {/* S3 — District Scoreboard */}
        <section>
          <SEDistrictScoreboard onSelect={openDrawer} />
        </section>

        {/* S4 — Backroom Workbench */}
        <section>
          <SEBackroomWorkbench onSelect={openDrawer} />
        </section>

        {/* S5 — Promo Tracker */}
        <section>
          <SEPromoTracker onSelect={openDrawer} />
        </section>

        {/* S6 — Accuracy Diagnostics */}
        <section>
          <SEAccuracyDiagnostics onSelect={openDrawer} />
        </section>

        {/* S7 — Field Action */}
        <section>
          <SEFieldActionQueue onSelect={openDrawer} />
        </section>

        {/* S7b — AI Actions & Human Approvals */}
        <section className="rounded-2xl border border-border bg-card px-6 py-5">
          <AIActionsModule
            actions={storeActions}
            approvals={storeApprovals}
            onGoToTab={onGoToTab ?? (() => {})}
          />
        </section>

        {/* S8 — Summary */}
        <section>
          <div className="rounded-xl border border-primary/30 bg-accent/40 px-6 py-5">
            <p className="text-sm font-semibold text-foreground mb-2">Store Execution Summary</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Store execution risk is concentrated after delivery receipt, especially in backroom sorting, put-to-shelf cycle time, display setup, and inventory accuracy verification. The largest controllable gap is not whether inventory exists in the network, but whether store teams can convert delivered product into verified shelf availability before the selling window.
            </p>
            <div className="flex items-start gap-2 p-3 rounded-lg border border-primary/20 bg-background">
              <span className="w-1 h-full min-h-[2rem] rounded-full bg-primary flex-shrink-0" />
              <p className="text-xs text-foreground leading-relaxed">
                <span className="font-semibold">Recommended next step:</span> Prioritize field actions for backroom aging, endcap completion, and phantom inventory resolution within the next 48 hours.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* ── detail drawer ── */}
      <SEDetailDrawer
        item={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
