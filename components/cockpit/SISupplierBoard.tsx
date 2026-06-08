"use client"

import { cn } from "@/lib/utils"

interface Supplier {
  name: string
  category: string
  dc: string
  otif: number
  fillRate: number
  ltVariance: string
  inboundValue: string
  status: "Critical" | "Watchlist" | "Rebalance" | "Stable"
  recommendation: string
}

const suppliers: Supplier[] = [
  {
    name: "GreenLeaf Seasonal Imports",
    category: "Seasonal",
    dc: "Savannah DC",
    otif: 74.8,
    fillRate: 81.2,
    ltVariance: "+6.8 days",
    inboundValue: "$3.9M",
    status: "Critical",
    recommendation: "Expedite priority POs supporting Southeast Seasonal demand.",
  },
  {
    name: "ValuePack Consumables Co.",
    category: "Consumables",
    dc: "Joliet DC",
    otif: 78.5,
    fillRate: 84.1,
    ltVariance: "+4.9 days",
    inboundValue: "$2.7M",
    status: "Critical",
    recommendation: "Prioritize short-shipped SKUs for Midwest replenishment.",
  },
  {
    name: "BrightParty Goods",
    category: "Party",
    dc: "Chesapeake DC",
    otif: 83.9,
    fillRate: 89.0,
    ltVariance: "+3.1 days",
    inboundValue: "$1.4M",
    status: "Watchlist",
    recommendation: "Confirm promo-timing PO release before allocation.",
  },
  {
    name: "HomeBase Essentials",
    category: "Household",
    dc: "Marietta DC",
    otif: 91.6,
    fillRate: 96.2,
    ltVariance: "-0.8 days",
    inboundValue: "$2.2M",
    status: "Rebalance",
    recommendation: "Slow or redirect inbound flow to avoid Southwest overstock.",
  },
  {
    name: "CareWell Beauty Supply",
    category: "Health & Beauty",
    dc: "San Bernardino DC",
    otif: 94.1,
    fillRate: 97.4,
    ltVariance: "+0.4 days",
    inboundValue: "$1.1M",
    status: "Stable",
    recommendation: "Maintain current inbound plan.",
  },
  {
    name: "Everyday Basics Manufacturing",
    category: "Consumables",
    dc: "Olive Branch DC",
    otif: 86.7,
    fillRate: 91.8,
    ltVariance: "+2.2 days",
    inboundValue: "$1.8M",
    status: "Watchlist",
    recommendation: "Monitor next ASN and receiving appointment.",
  },
]

const statusBadge: Record<Supplier["status"], string> = {
  Critical:  "bg-rose-100 text-rose-700",
  Watchlist: "bg-amber-100 text-amber-700",
  Rebalance: "bg-blue-100 text-blue-700",
  Stable:    "bg-emerald-100 text-emerald-700",
}

const statusBorder: Record<Supplier["status"], string> = {
  Critical:  "border-t-rose-400",
  Watchlist: "border-t-amber-400",
  Rebalance: "border-t-blue-400",
  Stable:    "border-t-emerald-400",
}

const otifColor = (v: number) =>
  v < 80 ? "bg-rose-400" : v < 88 ? "bg-amber-400" : "bg-emerald-500"

const ltColor = (s: string) =>
  s.startsWith("+") && parseFloat(s) > 4
    ? "bg-rose-100 text-rose-700"
    : s.startsWith("+") && parseFloat(s) > 1
    ? "bg-amber-100 text-amber-700"
    : s.startsWith("-")
    ? "bg-blue-100 text-blue-700"
    : "bg-emerald-100 text-emerald-700"

function ScoreBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <span className="text-[10px] font-semibold text-foreground">{value}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", otifColor(value))}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function SISupplierBoard() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Supplier Performance Board</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Supplier reliability, fill-rate, lead-time variance, and category exposure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {suppliers.map((s) => (
          <div
            key={s.name}
            className={cn(
              "border border-border border-t-2 rounded-xl bg-background flex flex-col gap-3 p-4",
              statusBorder[s.status]
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground leading-tight">{s.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.category} · {s.dc}</p>
              </div>
              <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0", statusBadge[s.status])}>
                {s.status}
              </span>
            </div>

            {/* Score bars */}
            <div className="flex flex-col gap-2">
              <ScoreBar value={s.otif} label="OTIF" />
              <ScoreBar value={s.fillRate} label="Fill Rate" />
            </div>

            {/* Meta row */}
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Lead-time:</span>
                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold", ltColor(s.ltVariance))}>
                  {s.ltVariance}
                </span>
              </div>
              <span className="font-semibold text-foreground">{s.inboundValue}</span>
            </div>

            {/* Recommendation */}
            <div className="border-t border-border pt-2.5">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Rec: </span>
                {s.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
