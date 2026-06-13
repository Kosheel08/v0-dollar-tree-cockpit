"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import SKUDetailDrawer from "./SKUDetailDrawer"
import type { DrawerPayload, StatusLevel } from "./SKUData"

const rows: Array<{
  segment: string
  wos: number
  target: number
  status: StatusLevel
  statusLabel: string
  drawer: DrawerPayload
}> = [
  {
    segment: "Seasonal / Event",
    wos: 2.1,
    target: 3.8,
    status: "critical",
    statusLabel: "Critical",
    drawer: {
      title: "Seasonal / Event — WOS 2.1 vs 3.8 Target",
      status: "critical",
      explanation: "Seasonal / Event SKUs have only 2.1 weeks of forward supply coverage against a 3.8-week service threshold. This segment carries the highest stockout risk in the network and is the primary driver of the 214-store exposure metric. The short selling window amplifies urgency — if inventory does not flow before the window opens, the revenue opportunity is lost entirely.",
      signals: ["WOS: 2.1 weeks vs 3.8 threshold", "72 Southeast stores below coverage", "Selling window approaching", "Short window limits recovery options"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "Demand Planning", id: "demand" }],
      primarySourceTabId: "inventory",
      segment: "Seasonal / Event",
      metrics: [
        { label: "WOS",              value: "2.1 weeks" },
        { label: "Target",           value: "3.8 weeks" },
        { label: "Gap",              value: "−1.7 weeks" },
        { label: "Stores exposed",   value: "72" },
        { label: "Financial impact", value: "$2.8M service risk" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$2.8M service risk and 72 Southeast stores exposed. Short selling window means there is no recovery time if allocation is not approved before Jun 10 lock.",
      recommendedAction: "Approve Seasonal / Event protected push allocation in the AI Actions section to prioritize flow to the 72 highest-risk stores.",
    },
  },
  {
    segment: "Consistent Replenishment",
    wos: 2.7,
    target: 3.5,
    status: "critical",
    statusLabel: "Critical",
    drawer: {
      title: "Consistent Replenishment — WOS 2.7 vs 3.5 Target",
      status: "critical",
      explanation: "Consistent Replenishment SKUs have 2.7 weeks of forward coverage against a 3.5-week service threshold. The gap is driven by recent velocity acceleration in the Midwest — replenishment demand has increased while available supply at Joliet DC remains constrained.",
      signals: ["WOS: 2.7 weeks vs 3.5 threshold", "58 Midwest stores below coverage", "Velocity acceleration in paper goods", "Joliet DC flow constraint"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "Demand Planning", id: "demand" }],
      primarySourceTabId: "inventory",
      segment: "Consistent Replenishment",
      metrics: [
        { label: "WOS",              value: "2.7 weeks" },
        { label: "Target",           value: "3.5 weeks" },
        { label: "Gap",              value: "−0.8 weeks" },
        { label: "Stores exposed",   value: "58" },
        { label: "Financial impact", value: "$1.9M lost sales risk" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$1.9M lost sales risk and 58 Midwest stores at coverage gap. Baseline replenishment protection has been applied by AI within guardrails.",
      recommendedAction: "Confirm replenishment protection and prioritize Consistent Replenishment flow in the allocation plan alongside Seasonal / Event.",
    },
  },
  {
    segment: "Promo / Merchant-Driven",
    wos: 3.1,
    target: 3.4,
    status: "watchlist",
    statusLabel: "Watchlist",
    drawer: {
      title: "Promo / Merchant-Driven — WOS 3.1 vs 3.4 Target",
      status: "watchlist",
      explanation: "Promo / Merchant-Driven SKUs are slightly below the 3.4-week service threshold at 3.1 weeks coverage. Risk is manageable but dependent on promotion timing confirmation. If the Party endcap promotion timing shifts further, the allocation strategy needs to adjust before the forecast lock.",
      signals: ["WOS: 3.1 weeks vs 3.4 threshold", "31 Northeast stores below coverage", "Promo timing unconfirmed", "Partial allocation hold in place"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "Demand Planning", id: "demand" }],
      primarySourceTabId: "inventory",
      segment: "Promo / Merchant-Driven",
      metrics: [
        { label: "WOS",              value: "3.1 weeks" },
        { label: "Target",           value: "3.4 weeks" },
        { label: "Gap",              value: "−0.3 weeks" },
        { label: "Stores exposed",   value: "31" },
        { label: "Financial impact", value: "$860K service risk" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$860K service risk if promo timing is not validated before forecast lock. AI has held partial allocation pending merchant confirmation.",
      recommendedAction: "Validate Promo / Merchant-Driven lift assumptions in Demand Planning before the forecast lock.",
    },
  },
  {
    segment: "Treasure Hunt / Limited Buy",
    wos: 5.6,
    target: 4.2,
    status: "stable",
    statusLabel: "Overstock",
    drawer: {
      title: "Treasure Hunt / Limited Buy — WOS 5.6 vs 4.2 Target",
      status: "stable",
      explanation: "Treasure Hunt / Limited Buy inventory is above target at 5.6 weeks versus a 4.2-week threshold, primarily at Marietta DC in the Southwest. This creates a rebalance opportunity: the $4.2M excess pool can be transferred to the Southeast demand pool where Seasonal / Event is under-stocked.",
      signals: ["WOS: 5.6 weeks vs 4.2 threshold", "+1.4 weeks above threshold", "Marietta DC: $4.2M rebalance pool", "Southeast absorption capacity available"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "DC Capacity & Transportation", id: "dc-capacity" }],
      primarySourceTabId: "inventory",
      segment: "Treasure Hunt / Limited Buy",
      metrics: [
        { label: "WOS",              value: "5.6 weeks" },
        { label: "Target",           value: "4.2 weeks" },
        { label: "Surplus",          value: "+1.4 weeks" },
        { label: "Rebalance pool",   value: "$4.2M at Marietta DC" },
        { label: "Carrying risk",    value: "$720K if not transferred" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$720K carrying and markdown risk if excess inventory remains in the Southwest. Transfer to Southeast reduces risk and supports shortage coverage.",
      recommendedAction: "Approve Treasure Hunt controlled transfer from Marietta DC to Southeast demand pool.",
    },
  },
  {
    segment: "Constrained / Exception",
    wos: 4.0,
    target: 4.1,
    status: "stable",
    statusLabel: "Stable",
    drawer: {
      title: "Constrained / Exception — WOS 4.0 vs 4.1 Target",
      status: "stable",
      explanation: "Constrained / Exception SKUs are near target at 4.0 weeks versus a 4.1-week threshold. Inventory is broadly balanced, and store exposure is limited to 9 locations. However, supplier fill-rate variance means executable supply may be lower than on-hand suggests — the fallback allocation scenario ensures planners have a reviewed contingency if constraints tighten.",
      signals: ["WOS: 4.0 weeks vs 4.1 threshold", "9 stores exposed", "Supplier fill-rate variance monitored", "Fallback allocation scenario created"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "Supplier & Inbound Flow", id: "supplier-inbound" }],
      primarySourceTabId: "inventory",
      segment: "Constrained / Exception",
      metrics: [
        { label: "WOS",              value: "4.0 weeks" },
        { label: "Target",           value: "4.1 weeks" },
        { label: "Gap",              value: "−0.1 weeks" },
        { label: "Stores exposed",   value: "9" },
        { label: "Financial impact", value: "$240K monitored" },
      ],
      humanApprovalRequired: false,
      businessImpact: "$240K monitored exposure. The fallback scenario is ready for approval if supplier constraints worsen.",
      recommendedAction: "Maintain current allocation and approve the constrained fallback scenario as a contingency.",
    },
  },
]

const statusCls: Record<string, string> = {
  Critical:   "bg-red-50 text-red-700 border-red-200",
  Watchlist:  "bg-amber-50 text-amber-700 border-amber-200",
  Overstock:  "bg-blue-50 text-blue-700 border-blue-200",
  Stable:     "bg-emerald-50 text-emerald-700 border-emerald-200",
}

interface InvWOSRiskProps {
  onGoToTab?: (tab: string) => void
}

export default function InvWOSRisk({ onGoToTab }: InvWOSRiskProps) {
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  function openDrawer(p: DrawerPayload) { setDrawerPayload(p); setDrawerOpen(true) }
  function closeDrawer()               { setDrawerOpen(false); setDrawerPayload(null) }

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-border">
          <p className="text-[13px] font-semibold text-foreground">Weeks of Supply Risk</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Forward coverage versus target service thresholds by SKU segment
          </p>
        </div>

        <div className="divide-y divide-border">
          {rows.map((row) => {
            const pct = Math.min((row.wos / (row.target * 1.5)) * 100, 100)
            const isShort = row.wos < row.target

            return (
              <button
                key={row.segment}
                onClick={() => openDrawer(row.drawer)}
                className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-muted/30 transition-colors group"
              >
                {/* Segment */}
                <div className="w-52 shrink-0">
                  <p className="text-[12px] font-semibold text-foreground leading-snug">{row.segment}</p>
                </div>

                {/* Progress bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-foreground tabular-nums">{row.wos}w</span>
                    <span className="text-[10px] text-muted-foreground">vs {row.target}w target</span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", isShort ? "bg-red-400" : "bg-emerald-400")}
                      style={{ width: `${pct}%` }}
                    />
                    {/* Target marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-foreground/30"
                      style={{ left: `${Math.min((row.target / (row.target * 1.5)) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Status badge */}
                <span className={cn("text-[10px] font-semibold border px-2 py-0.5 rounded-md shrink-0 w-20 text-center", statusCls[row.statusLabel])}>
                  {row.statusLabel}
                </span>

                <span className="text-muted-foreground group-hover:text-primary transition-colors shrink-0">›</span>
              </button>
            )
          })}
        </div>

        <div className="px-5 py-3 bg-muted/30 border-t border-border">
          <p className="text-[11px] text-muted-foreground">
            Seasonal / Event and Consistent Replenishment are below forward coverage thresholds and should be prioritized for allocation.
          </p>
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
