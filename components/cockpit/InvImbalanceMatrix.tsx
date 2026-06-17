"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import SKUDetailDrawer from "./SKUDetailDrawer"
import type { DrawerPayload } from "./SKUData"

const rows: Array<{
  priority: "P1" | "P2" | "P3"
  segmentLabel: string
  segment: string
  region: string
  node: string
  position: string
  positionType: "short" | "over" | "balanced"
  wos: string
  storesExposed: string
  financialImpact: string
  aiRec: string
  status: string
  statusCls: string
  drawer: DrawerPayload
}> = [
  {
    priority: "P1",
    segmentLabel: "Seasonal / Event · Halloween décor",
    segment: "Seasonal / Event",
    region: "Southeast",
    node: "Savannah DC",
    position: "Short $3.6M",
    positionType: "short",
    wos: "2.1",
    storesExposed: "72",
    financialImpact: "$2.8M service risk",
    aiRec: "Reserve inventory for high-risk stores",
    status: "Critical",
    statusCls: "bg-red-50 text-red-700 border-red-200",
    drawer: {
      title: "Seasonal / Event · Halloween décor — Savannah DC",
      status: "critical",
      explanation: "Demand Planning flagged a Seasonal / Event under-forecast in the Southeast, but available inventory is constrained at Savannah DC. 72 stores face stockout exposure within the selling window. AI has ranked stores by absorption capacity and recommends a protected push allocation pending planner approval.",
      signals: ["Inventory short $3.6M vs target", "WOS: 2.1 weeks vs 3.8 threshold", "72 Southeast stores exposed", "Savannah DC capacity constrained", "Selling window approaching"],
      sourceTabs: [
        { label: "Demand Planning", id: "demand" },
        { label: "DC Capacity & Transportation", id: "dc-capacity" },
        { label: "Store Execution", id: "store-execution" },
      ],
      primarySourceTabId: "inventory",
      segment: "Seasonal / Event",
      segmentStrategy: "Protected push to highest-absorption stores before selling window",
      metrics: [
        { label: "Position",         value: "Short $3.6M" },
        { label: "WOS",              value: "2.1 weeks" },
        { label: "Target WOS",       value: "3.8 weeks" },
        { label: "Stores exposed",   value: "72" },
        { label: "Financial impact", value: "$2.8M service risk" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$2.8M service risk and 72 stores exposed. Short selling window means there is no recovery window if allocation misses the lock.",
      recommendedAction: "Reserve available Seasonal / Event inventory for 72 high-risk stores and approve protected push allocation before Jun 10 lock.",
      guardrailNote: "AI has ranked stores by absorption capacity. Final allocation requires planner approval.",
      actionLabel: "Go to Demand Planning",
      actionTabId: "demand",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    priority: "P1",
    segmentLabel: "Consistent Replenishment · Paper goods",
    segment: "Consistent Replenishment",
    region: "Midwest",
    node: "Joliet DC",
    position: "Short $2.4M",
    positionType: "short",
    wos: "2.7",
    storesExposed: "58",
    financialImpact: "$1.9M lost sales risk",
    aiRec: "Prioritize replenishment flow",
    status: "Critical",
    statusCls: "bg-red-50 text-red-700 border-red-200",
    drawer: {
      title: "Consistent Replenishment · Paper goods — Joliet DC",
      status: "critical",
      explanation: "Recent velocity acceleration increased replenishment need for everyday SKUs in Midwest stores. Joliet DC is the primary flow node and is constrained by competing Seasonal push demand. AI has protected baseline replenishment volume within guardrails — human approval is required to confirm the replenishment prioritization before allocation lock.",
      signals: ["Velocity acceleration on paper goods", "Joliet DC: competing demand with Seasonal push", "WOS: 2.7 weeks vs 3.5 threshold", "58 stores below coverage threshold"],
      sourceTabs: [
        { label: "Demand Planning", id: "demand" },
        { label: "DC Capacity & Transportation", id: "dc-capacity" },
      ],
      primarySourceTabId: "inventory",
      segment: "Consistent Replenishment",
      segmentStrategy: "Prioritize replenishment flow to high-velocity Midwest stores",
      metrics: [
        { label: "Position",         value: "Short $2.4M" },
        { label: "WOS",              value: "2.7 weeks" },
        { label: "Target WOS",       value: "3.5 weeks" },
        { label: "Stores exposed",   value: "58" },
        { label: "Financial impact", value: "$1.9M lost sales risk" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$1.9M lost sales risk and 58 Midwest stores at coverage gap. Adjustment impacts replenishment quantities and outbound DC flow.",
      recommendedAction: "Prioritize available flow to high-velocity Midwest stores while monitoring Joliet DC capacity.",
      guardrailNote: "Baseline replenishment protection applied within guardrails. Prioritization confirmation requires planner sign-off.",
      actionLabel: "Go to Demand Planning",
      actionTabId: "demand",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    priority: "P2",
    segmentLabel: "Promo / Merchant-Driven · Party endcap",
    segment: "Promo / Merchant-Driven",
    region: "Northeast",
    node: "Chesapeake DC",
    position: "Short $1.1M",
    positionType: "short",
    wos: "3.1",
    storesExposed: "31",
    financialImpact: "$860K service risk",
    aiRec: "Hold partial allocation pending promo confirmation",
    status: "Watchlist",
    statusCls: "bg-amber-50 text-amber-700 border-amber-200",
    drawer: {
      title: "Promo / Merchant-Driven · Party endcap — Chesapeake DC",
      status: "watchlist",
      explanation: "Allocation should be aligned with promotion timing and store display readiness. The circular promotion timing shifted from the prior planning cycle. AI has held partial allocation at Chesapeake DC until merchant confirmation and display readiness are validated.",
      signals: ["Circular timing shift vs prior cycle", "Partial allocation hold in place", "WOS: 3.1 weeks vs 3.4 threshold", "31 Northeast stores exposed"],
      sourceTabs: [
        { label: "Demand Planning", id: "demand" },
        { label: "Store Execution", id: "store-execution" },
      ],
      primarySourceTabId: "inventory",
      segment: "Promo / Merchant-Driven",
      segmentStrategy: "Hold partial allocation pending merchant confirmation and store readiness",
      metrics: [
        { label: "Position",         value: "Short $1.1M" },
        { label: "WOS",              value: "3.1 weeks" },
        { label: "Target WOS",       value: "3.4 weeks" },
        { label: "Stores exposed",   value: "31" },
        { label: "Financial impact", value: "$860K service risk" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$860K service risk if promo allocation is released without confirmation. Store execution may not be ready for display.",
      recommendedAction: "Hold partial allocation until merchant confirmation and display readiness are validated.",
      guardrailNote: "AI has flagged and held partial allocation. Release requires merchandising confirmation.",
      actionLabel: "Go to Demand Planning",
      actionTabId: "demand",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    priority: "P2",
    segmentLabel: "Treasure Hunt / Limited Buy · Home goods",
    segment: "Treasure Hunt / Limited Buy",
    region: "Southwest",
    node: "Marietta DC",
    position: "Over $4.2M",
    positionType: "over",
    wos: "5.6",
    storesExposed: "18",
    financialImpact: "$720K carrying risk",
    aiRec: "Transfer excess to Southeast demand pool",
    status: "Rebalance",
    statusCls: "bg-blue-50 text-blue-700 border-blue-200",
    drawer: {
      title: "Treasure Hunt / Limited Buy · Home goods — Marietta DC",
      status: "stable",
      explanation: "Inventory is above target in Southwest while Southeast has higher absorption and shortage risk. AI recommends transferring part of the excess pool from Marietta DC to Savannah DC if lane capacity is available. This reduces carrying risk and supports the Southeast demand shortage without new receipts.",
      signals: ["$4.2M above target at Marietta DC", "WOS: 5.6 vs 4.2 threshold", "Southeast absorption pool available", "Transfer route: Marietta → Savannah DC"],
      sourceTabs: [
        { label: "DC Capacity & Transportation", id: "dc-capacity" },
      ],
      primarySourceTabId: "inventory",
      segment: "Treasure Hunt / Limited Buy",
      segmentStrategy: "Controlled transfer from overstock pool to high-absorption demand region",
      metrics: [
        { label: "Position",         value: "Over $4.2M" },
        { label: "WOS",              value: "5.6 weeks" },
        { label: "Target WOS",       value: "4.2 weeks" },
        { label: "Stores exposed",   value: "18" },
        { label: "Financial impact", value: "$720K carrying risk" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$720K carrying and markdown risk if excess remains in Southwest. Transfer reduces risk and improves Southeast coverage.",
      recommendedAction: "Transfer part of excess pool from Marietta DC to Savannah DC subject to transportation and receiving capacity.",
      guardrailNote: "Transfer affects DC capacity and transportation schedule — requires planner approval.",
      actionLabel: "Go to DC Capacity & Transportation",
      actionTabId: "dc-capacity",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    priority: "P3",
    segmentLabel: "Constrained / Exception · Cleaning",
    segment: "Constrained / Exception",
    region: "West",
    node: "San Bernardino DC",
    position: "Balanced",
    positionType: "balanced",
    wos: "4.0",
    storesExposed: "9",
    financialImpact: "$240K monitored",
    aiRec: "Maintain current allocation",
    status: "Stable",
    statusCls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    drawer: {
      title: "Constrained / Exception · Cleaning — San Bernardino DC",
      status: "stable",
      explanation: "Inventory is near target and store exposure is limited to 9 locations. Supplier fill-rate variance is being monitored but has not yet created a significant supply gap. The fallback allocation scenario is available if constraints worsen.",
      signals: ["WOS: 4.0 vs 4.1 threshold", "9 stores exposed", "Supplier fill-rate variance monitored", "Fallback scenario created and ready"],
      sourceTabs: [
        { label: "Supplier & Inbound Flow", id: "supplier-inbound" },
      ],
      primarySourceTabId: "inventory",
      segment: "Constrained / Exception",
      segmentStrategy: "Monitor and maintain current allocation with fallback ready",
      metrics: [
        { label: "Position",         value: "Balanced" },
        { label: "WOS",              value: "4.0 weeks" },
        { label: "Target WOS",       value: "4.1 weeks" },
        { label: "Stores exposed",   value: "9" },
        { label: "Financial impact", value: "$240K monitored" },
      ],
      humanApprovalRequired: false,
      businessImpact: "$240K monitored exposure. No immediate action required, but fallback scenario is ready if supplier constraints worsen.",
      recommendedAction: "Maintain current allocation and monitor supplier and inbound constraints.",
      guardrailNote: "No immediate approval required. Fallback available on demand.",
      actionLabel: "Go to Supplier & Inbound Flow",
      actionTabId: "supplier-inbound",
      secondaryLabel: "Mark for Review",
    },
  },
]

const priorityCls: Record<string, string> = {
  P1: "bg-red-50 text-red-700 border-red-200 font-bold",
  P2: "bg-amber-50 text-amber-700 border-amber-200 font-semibold",
  P3: "bg-muted text-muted-foreground border-border font-medium",
}

const positionCls: Record<string, string> = {
  short:    "text-red-600 font-semibold",
  over:     "text-blue-600 font-semibold",
  balanced: "text-emerald-600 font-semibold",
}

interface InvImbalanceMatrixProps {
  onGoToTab?: (tab: string) => void
}

export default function InvImbalanceMatrix({ onGoToTab }: InvImbalanceMatrixProps) {
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  function openDrawer(p: DrawerPayload) { setDrawerPayload(p); setDrawerOpen(true) }
  function closeDrawer()               { setDrawerOpen(false); setDrawerPayload(null) }

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-border">
          <p className="text-[13px] font-semibold text-foreground">Inventory Imbalance Matrix</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Prioritized inventory imbalances by SKU segment, region, node, coverage, and financial exposure
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Priority", "SKU Segment / Example", "Region", "Primary Node", "Inventory Position", "WOS", "Stores Exposed", "Financial Impact", "AI Recommendation", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr
                  key={row.segmentLabel}
                  onClick={() => openDrawer(row.drawer)}
                  className="hover:bg-muted/30 transition-colors cursor-pointer group"
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={cn("text-[10px] border px-1.5 py-0.5 rounded-md", priorityCls[row.priority])}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-[11px] font-semibold text-foreground leading-snug whitespace-nowrap">{row.segmentLabel}</p>
                  </td>
                  <td className="px-3 py-3 text-[11px] text-foreground whitespace-nowrap">{row.region}</td>
                  <td className="px-3 py-3 text-[11px] text-foreground whitespace-nowrap">{row.node}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={cn("text-[11px]", positionCls[row.positionType])}>{row.position}</span>
                  </td>
                  <td className="px-3 py-3 text-[11px] text-foreground whitespace-nowrap tabular-nums">{row.wos}</td>
                  <td className="px-3 py-3 text-[11px] text-foreground whitespace-nowrap tabular-nums">{row.storesExposed}</td>
                  <td className="px-3 py-3 text-[11px] text-foreground whitespace-nowrap">{row.financialImpact}</td>
                  <td className="px-3 py-3 text-[11px] text-muted-foreground max-w-[180px]">
                    <button
                      onClick={(e) => { e.stopPropagation(); openDrawer(row.drawer) }}
                      className="text-left text-primary hover:underline leading-snug"
                    >
                      {row.aiRec}
                    </button>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <button
                      onClick={(e) => { e.stopPropagation(); openDrawer(row.drawer) }}
                      className={cn("text-[10px] font-semibold border px-1.5 py-0.5 rounded-md", row.statusCls)}
                    >
                      {row.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
