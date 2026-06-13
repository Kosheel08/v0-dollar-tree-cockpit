"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"
import SKUDetailDrawer from "./SKUDetailDrawer"
import type { DrawerPayload } from "./SKUData"

const chartData = [
  { segment: "Consistent Replenishment", short: "Cons. Replen.", onHand: 26.8, allocated: 19.4, available: 7.4,  target: 30.0 },
  { segment: "Seasonal / Event",         short: "Seasonal",      onHand: 18.4, allocated: 12.1, available: 6.3,  target: 22.0 },
  { segment: "Promo / Merchant-Driven",  short: "Promo",         onHand: 14.6, allocated: 9.2,  available: 5.4,  target: 16.0 },
  { segment: "Treasure Hunt / Limited Buy", short: "Treasure Hunt", onHand: 31.2, allocated: 18.8, available: 12.4, target: 27.0 },
  { segment: "Constrained / Exception",  short: "Constrained",  onHand: 21.5, allocated: 13.6, available: 7.9,  target: 22.0 },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{name: string; value: number; color: string}>; label?: string }) {
  if (!active || !payload?.length) return null
  const row = chartData.find((d) => d.short === label)
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2.5 text-xs min-w-[170px]">
      <p className="font-semibold text-gray-800 mb-1.5">{row?.segment ?? label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="inline-block w-2 h-2 rounded-sm" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-medium text-gray-800">${p.value}M</span>
        </div>
      ))}
    </div>
  )
}

const chips: Array<{ label: string; cls: string; drawer: DrawerPayload }> = [
  {
    label: "Largest shortage risk: Seasonal / Event · $3.6M below target",
    cls: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    drawer: {
      title: "Seasonal / Event — Largest Shortage Risk",
      status: "critical",
      explanation: "Seasonal / Event inventory is $3.6M below target across the network, with the highest concentration at Savannah DC serving Southeast stores. Available inventory (6.3M) is well below the 22.0M target, and forward WOS of 2.1 weeks is significantly below the 3.8-week threshold.",
      signals: ["$3.6M below target", "Available: $6.3M vs $22.0M target", "WOS: 2.1 vs 3.8 threshold", "72 Southeast stores exposed"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "Demand Planning", id: "demand" }],
      primarySourceTabId: "inventory",
      segment: "Seasonal / Event",
      metrics: [{ label: "Shortage", value: "$3.6M below target" }, { label: "WOS", value: "2.1 weeks" }, { label: "Stores exposed", value: "72" }],
      businessImpact: "$2.8M service risk if protected allocation is not approved before the selling window.",
      recommendedAction: "Approve Seasonal / Event protected push allocation in the AI Actions section.",
    },
  },
  {
    label: "Largest rebalance pool: Treasure Hunt / Limited Buy · $4.2M above target",
    cls: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    drawer: {
      title: "Treasure Hunt / Limited Buy — Largest Rebalance Pool",
      status: "stable",
      explanation: "Treasure Hunt / Limited Buy inventory is $4.2M above target at Marietta DC in the Southwest. With a WOS of 5.6 weeks against a 4.2-week target, this pool can be transferred to support the Southeast demand shortage without requiring new receipts.",
      signals: ["$4.2M above target at Marietta DC", "WOS: 5.6 vs 4.2 threshold", "Southeast absorption capacity available", "Transfer candidate to Savannah DC"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "DC Capacity & Transportation", id: "dc-capacity" }],
      primarySourceTabId: "inventory",
      segment: "Treasure Hunt / Limited Buy",
      metrics: [{ label: "Overstock", value: "$4.2M above target" }, { label: "WOS", value: "5.6 weeks" }, { label: "Transfer route", value: "Marietta → Savannah DC" }],
      businessImpact: "$720K carrying risk if excess inventory remains in the Southwest. Transfer reduces markdown exposure.",
      recommendedAction: "Approve the Treasure Hunt controlled transfer in the AI Actions section.",
    },
  },
  {
    label: "Highest allocation pressure: Consistent Replenishment · 214 stores requesting flow",
    cls: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    drawer: {
      title: "Consistent Replenishment — Highest Allocation Pressure",
      status: "watchlist",
      explanation: "214 stores are requesting replenishment flow for Consistent Replenishment SKUs, with the highest concentration in the Midwest (Joliet DC catchment). WOS of 2.7 weeks is below the 3.5-week service threshold, and recent velocity acceleration has increased near-term demand pressure.",
      signals: ["214 stores requesting flow", "WOS: 2.7 vs 3.5 threshold", "Velocity acceleration in Midwest", "Joliet DC flow competition with Seasonal push"],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }, { label: "Demand Planning", id: "demand" }],
      primarySourceTabId: "inventory",
      segment: "Consistent Replenishment",
      metrics: [{ label: "Stores requesting", value: "214" }, { label: "WOS", value: "2.7 weeks" }, { label: "DC constraint", value: "Joliet DC" }],
      businessImpact: "$1.9M lost sales risk if replenishment flow is not prioritized before the allocation lock.",
      recommendedAction: "Prioritize Consistent Replenishment in the Inventory Imbalance Matrix alongside Seasonal / Event P1 actions.",
    },
  },
]

const chartDrawer: DrawerPayload = {
  title: "Inventory Position by SKU Segment",
  status: "watchlist",
  explanation: "This chart shows on-hand, allocated, and available inventory across all five AI-defined SKU segments. The gap between available inventory and target reveals where shortage and overstock risk is concentrated. Seasonal / Event and Consistent Replenishment are both below target available inventory, while Treasure Hunt / Limited Buy is above target.",
  signals: ["5 SKU segments with inventory position data", "Seasonal / Event: $3.6M below target", "Treasure Hunt: $4.2M above target", "Overall network: $48.6M available to allocate"],
  sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }],
  primarySourceTabId: "inventory",
  metrics: [
    { label: "Consistent Repl. available",  value: "$7.4M vs $30.0M target" },
    { label: "Seasonal available",           value: "$6.3M vs $22.0M target" },
    { label: "Treasure Hunt available",      value: "$12.4M vs $27.0M target" },
    { label: "Overall available",            value: "$48.6M" },
  ],
  businessImpact: "The inventory position chart reveals that network-level availability masks significant segment-level imbalances. Two segments are below target and one is above — rebalancing is needed.",
  recommendedAction: "Prioritize Seasonal / Event and Consistent Replenishment in the allocation and review the Treasure Hunt transfer opportunity.",
}

interface InvPositionChartProps {
  onGoToTab?: (tab: string) => void
}

export default function InvPositionChart({ onGoToTab }: InvPositionChartProps) {
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  function openDrawer(p: DrawerPayload) { setDrawerPayload(p); setDrawerOpen(true) }
  function closeDrawer()               { setDrawerOpen(false); setDrawerPayload(null) }

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Header — clickable */}
        <button
          onClick={() => openDrawer(chartDrawer)}
          className="w-full flex items-start justify-between gap-4 px-5 pt-5 pb-3 text-left group hover:bg-muted/30 transition-colors"
        >
          <div>
            <p className="text-[13px] font-semibold text-foreground">Inventory Position by SKU Segment</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              On-hand, allocated, and available inventory across AI-defined SKU segments
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
        </button>

        {/* Chart */}
        <div className="px-5 pb-2" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="short"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}M`}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={<CustomTooltip />}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
              <Bar dataKey="onHand"    name="On Hand"    fill="#2d7a3a" radius={[3,3,0,0]} />
              <Bar dataKey="allocated" name="Allocated"  fill="#64748b" radius={[3,3,0,0]} />
              <Bar dataKey="available" name="Available"  fill="#d97706" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insight chips */}
        <div className="px-5 pb-5 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => openDrawer(chip.drawer)}
              className={cn("text-[10px] font-medium border px-2.5 py-1 rounded-full transition-colors", chip.cls)}
            >
              {chip.label}
            </button>
          ))}
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
