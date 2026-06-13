"use client"

import { useState } from "react"
import { RefreshCw, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import SIInboundHealth from "./SIInboundHealth"
import SIInboundPipeline from "./SIInboundPipeline"
import SISupplierBoard from "./SISupplierBoard"
import SIPORiskLanes from "./SIPORiskLanes"
import SIDCReceiptReadiness from "./SIDCReceiptReadiness"
import SIRecoveryActions from "./SIRecoveryActions"
import SIFlowSummary from "./SIFlowSummary"
import AIActionsModule from "./AIActionsModule"
import { supplierActions, supplierApprovals } from "./AIActionsData"

const supplierOptions = [
  "All Suppliers",
  "GreenLeaf Seasonal Imports",
  "ValuePack Consumables Co.",
  "BrightParty Goods",
  "HomeBase Essentials",
  "CareWell Beauty Supply",
  "Everyday Basics Manufacturing",
]

const segmentOptions = [
  "All Segments",
  "Consistent Replenishment",
  "Seasonal / Event",
  "Treasure Hunt / Limited Buy",
  "Promo / Merchant-Driven",
  "Constrained / Exception",
]

const dcOptions = [
  "All DCs",
  "Savannah DC",
  "Joliet DC",
  "Chesapeake DC",
  "Marietta DC",
  "San Bernardino DC",
  "Olive Branch DC",
]

const riskOptions = ["All Statuses", "Critical", "Watchlist", "Stable", "Recovering"]

const selectCls =
  "h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"

interface SupplierInboundPageProps {
  onGoToTab?: (tab: string) => void
}

export default function SupplierInboundPage({ onGoToTab }: SupplierInboundPageProps) {
  const [supplier, setSupplier] = useState("All Suppliers")
  const [segment, setSegment] = useState("All Segments")
  const [dc, setDc] = useState("All DCs")
  const [riskStatus, setRiskStatus] = useState("All Statuses")
  const [search, setSearch] = useState("")

  return (
    <div className="flex flex-col gap-5 px-6 py-5 max-w-[1400px] mx-auto w-full">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">Supplier &amp; Inbound Flow</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Supplier performance, purchase order risk, inbound ETA variance, and DC receipt readiness
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            Inbound cycle active
          </span>
          <span className="text-xs text-muted-foreground">Last refresh: Jun 7, 2026 &middot; 8:30 AM</span>
        </div>
      </div>

      {/* Global filter bar */}
      <div className="bg-card border border-border rounded-xl px-4 py-3 flex flex-wrap items-center gap-2.5">
        <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className={selectCls}>
          {supplierOptions.map((o) => <option key={o}>{o}</option>)}
        </select>

        <select value={segment} onChange={(e) => setSegment(e.target.value)} className={selectCls}>
          {segmentOptions.map((o) => <option key={o}>{o}</option>)}
        </select>

        <select value={dc} onChange={(e) => setDc(e.target.value)} className={selectCls}>
          {dcOptions.map((o) => <option key={o}>{o}</option>)}
        </select>

        <select value={riskStatus} onChange={(e) => setRiskStatus(e.target.value)} className={selectCls}>
          {riskOptions.map((o) => <option key={o}>{o}</option>)}
        </select>

        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search supplier, PO, SKU family, DC, or region"
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

      {/* Section 1 — Inbound Health Overview */}
      <SIInboundHealth />

      {/* Section 2 — Inbound Flow Pipeline */}
      <SIInboundPipeline />

      {/* Section 3 — Supplier Performance Board */}
      <SISupplierBoard />

      {/* Section 4 — PO Risk Lanes */}
      <SIPORiskLanes />

      {/* Section 5 — DC Receipt Readiness */}
      <SIDCReceiptReadiness />

      {/* Section 6 — Recovery Action Center */}
      <SIRecoveryActions />

      {/* Section 6b — AI Actions & Human Approvals */}
      <section className="rounded-2xl border border-border bg-card px-6 py-5">
        <AIActionsModule
          actions={supplierActions}
          approvals={supplierApprovals}
          onGoToTab={onGoToTab ?? (() => {})}
        />
      </section>

      {/* Section 7 — Summary */}
      <SIFlowSummary />

    </div>
  )
}
