"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import SKUDetailDrawer from "./SKUDetailDrawer"
import type { DrawerPayload } from "./SKUData"

const kpis: Array<{
  title: string
  value: string
  subtext: string
  badge: string
  badgeCls: string
  footer: string
  drawer: DrawerPayload
}> = [
  {
    title: "Available to Allocate",
    value: "$48.6M",
    subtext: "Sellable inventory available for release",
    badge: "Constrained",
    badgeCls: "bg-orange-50 text-orange-700 border-orange-200",
    footer: "Available inventory within the selected planning horizon",
    drawer: {
      title: "Available to Allocate — $48.6M",
      status: "watchlist",
      explanation: "Available to Allocate represents sellable inventory that can be released within the selected planning horizon. Not all on-hand inventory qualifies — some is already allocated, inbound in transit, reserved for replenishment cycles, or constrained by DC or case-pack limitations.",
      signals: ["$48.6M sellable and unallocated", "Excludes: already allocated, inbound, reserved inventory", "Constrained by DC capacity and case-pack fit", "72% allocation readiness against plan"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "DC Capacity & Transportation", id: "dc-capacity" }],
      primarySourceTabId: "inventory",
      metrics: [
        { label: "Available",         value: "$48.6M" },
        { label: "Allocation readiness", value: "72%" },
        { label: "Open constraints",  value: "DC capacity, case-pack fit, store receiving" },
      ],
      businessImpact: "The $48.6M available pool must be prioritized by AI-defined SKU segment and service risk — not distributed evenly. Seasonal / Event and Consistent Replenishment carry the highest exposure.",
      recommendedAction: "Review the Inventory Imbalance Matrix to understand which SKU segments and nodes are most constrained.",
    },
  },
  {
    title: "Stockout Exposure",
    value: "214 stores",
    subtext: "Projected within 14 days",
    badge: "Critical",
    badgeCls: "bg-red-50 text-red-700 border-red-200",
    footer: "Highest exposure in Seasonal / Event and Consistent Replenishment SKUs",
    drawer: {
      title: "Stockout Exposure — 214 Stores",
      status: "critical",
      explanation: "214 stores are projected to face stockout risk within 14 days if allocation is not adjusted. Risk is concentrated in Seasonal / Event SKUs in the Southeast (72 stores) and Consistent Replenishment SKUs in the Midwest (58 stores). Combined, these two segments account for over 60% of total exposure.",
      signals: ["214 stores at stockout risk within 14 days", "Seasonal / Event Southeast: 72 stores exposed", "Consistent Replenishment Midwest: 58 stores exposed", "Below forward coverage thresholds in both segments"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "Demand Planning", id: "demand" }],
      primarySourceTabId: "inventory",
      metrics: [
        { label: "Stores at risk",    value: "214" },
        { label: "Highest exposure",  value: "Seasonal / Event · Southeast" },
        { label: "Second exposure",   value: "Consistent Replenishment · Midwest" },
        { label: "Days to stockout",  value: "< 14 days without action" },
      ],
      businessImpact: "$2.8M service risk from Seasonal / Event exposure alone. Consistent Replenishment adds $1.9M lost sales risk in the Midwest.",
      recommendedAction: "Prioritize Seasonal / Event and Consistent Replenishment in the Inventory Imbalance Matrix and approve P1 allocations before the Jun 10 lock.",
    },
  },
  {
    title: "Overstock Value",
    value: "$18.9M",
    subtext: "Above target weeks of supply",
    badge: "Rebalance",
    badgeCls: "bg-blue-50 text-blue-700 border-blue-200",
    footer: "Inventory available for transfer or markdown avoidance",
    drawer: {
      title: "Overstock Value — $18.9M",
      status: "stable",
      explanation: "Overstock does not automatically represent a problem — it becomes valuable when it can be transferred to higher-risk demand pools. $18.9M of inventory is above target weeks of supply, primarily in Treasure Hunt / Limited Buy SKUs in the Southwest. The Marietta DC has the largest overstock pool ($4.2M) and is a candidate for controlled transfer to Southeast demand.",
      signals: ["$18.9M above target WOS", "Treasure Hunt / Limited Buy · Southwest largest pool", "Marietta DC: $4.2M available for transfer", "Southeast demand pool has higher absorption capacity"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "DC Capacity & Transportation", id: "dc-capacity" }],
      primarySourceTabId: "inventory",
      metrics: [
        { label: "Overstock value",   value: "$18.9M" },
        { label: "Largest pool",      value: "Treasure Hunt / Limited Buy · $4.2M" },
        { label: "Transfer candidate", value: "Marietta DC → Savannah DC" },
        { label: "Carrying risk",     value: "$720K if not rebalanced" },
      ],
      businessImpact: "Transferring excess Treasure Hunt inventory from Marietta DC to the Southeast demand pool reduces carrying risk and supports under-stocked stores without requiring new receipts.",
      recommendedAction: "Review and approve the Treasure Hunt controlled transfer in the System Actions & Human Approvals section.",
    },
  },
  {
    title: "Allocation Readiness",
    value: "72%",
    subtext: "Ready before next allocation lock",
    badge: "Watchlist",
    badgeCls: "bg-amber-50 text-amber-700 border-amber-200",
    footer: "Open constraints include DC capacity, case-pack fit, and store receiving limits",
    drawer: {
      title: "Allocation Readiness — 72%",
      status: "watchlist",
      explanation: "Only 72% of the planned allocation is currently executable before the next allocation lock. The remaining 28% is blocked by DC capacity constraints (primarily Joliet and Chesapeake DCs), case-pack fit issues for high-velocity SKUs, inbound timing variance, and store receiving limits at high-volume locations.",
      signals: ["72% allocation readiness vs plan", "DC capacity constraints: Joliet, Chesapeake", "Case-pack fit issues on priority SKUs", "Inbound timing variance on Seasonal PO", "Store receiving limits at high-volume stores"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "DC Capacity & Transportation", id: "dc-capacity" }, { label: "Supplier & Inbound Flow", id: "supplier-inbound" }],
      primarySourceTabId: "inventory",
      metrics: [
        { label: "Readiness",         value: "72%" },
        { label: "DC constraints",    value: "Joliet + Chesapeake" },
        { label: "Inbound variance",  value: "Savannah seasonal PO" },
        { label: "Store limits",      value: "High-volume receiving" },
      ],
      businessImpact: "A 28% allocation gap means stores may not receive inventory on time even if approval is granted. DC and supplier constraints need to be resolved in parallel.",
      recommendedAction: "Review DC constraints in DC Capacity & Transportation and inbound timing in Supplier & Inbound Flow.",
    },
  },
]

interface InvKpiCards2Props {
  onGoToTab?: (tab: string) => void
}

export default function InvKpiCards2({ onGoToTab }: InvKpiCards2Props) {
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  function openDrawer(p: DrawerPayload) { setDrawerPayload(p); setDrawerOpen(true) }
  function closeDrawer()               { setDrawerOpen(false); setDrawerPayload(null) }

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <button
            key={k.title}
            onClick={() => openDrawer(k.drawer)}
            className="group flex flex-col gap-2.5 bg-card border border-border rounded-2xl p-4 text-left hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide leading-tight">{k.title}</p>
              <span className={cn("text-[10px] font-semibold border px-1.5 py-0.5 rounded-md shrink-0", k.badgeCls)}>{k.badge}</span>
            </div>

            <div>
              <p className="text-2xl font-bold text-foreground tabular-nums leading-none">{k.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{k.subtext}</p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground leading-snug">{k.footer}</p>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </button>
        ))}
      </div>

      <SKUDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={closeDrawer}
        onGoToTab={(id) => { if (onGoToTab) onGoToTab(id); closeDrawer() }}
      />
    </>
  )
}
