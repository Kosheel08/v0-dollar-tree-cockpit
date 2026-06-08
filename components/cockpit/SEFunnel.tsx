"use client"

// Section 2 — Delivery-to-Shelf Execution Funnel
// The signature visual: a horizontal connected process funnel showing where
// execution breaks down at each stage after delivery. Each stage is clickable
// and opens the shared SEDetailDrawer.

import { ChevronRight } from "lucide-react"
import { funnelStages, type DetailItem, type StatusType } from "./SEData"

function stageColor(s: StatusType) {
  if (s === "Critical")  return { bg: "bg-red-50",      border: "border-red-200",   text: "text-red-700",   badge: "bg-red-100 text-red-700 border-red-200",   bar: "bg-red-400"  }
  if (s === "Behind")    return { bg: "bg-amber-50",    border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700 border-amber-200", bar: "bg-amber-400" }
  if (s === "Watchlist") return { bg: "bg-blue-50",     border: "border-blue-200",  text: "text-blue-700",  badge: "bg-blue-100 text-blue-700 border-blue-200",  bar: "bg-blue-400" }
  return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", bar: "bg-emerald-400" }
}

interface Props {
  onSelect: (item: DetailItem) => void
}

export default function SEFunnel({ onSelect }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Delivery-to-Shelf Execution Funnel</p>
        <p className="text-xs text-muted-foreground mt-0.5">Where store execution breaks down after product is delivered</p>
      </div>

      {/* funnel stages */}
      <div className="p-5">
        <div className="flex items-stretch gap-1">
          {funnelStages.map((stage, idx) => {
            const c = stageColor(stage.status)
            const completion = parseInt(stage.meta["Completion"])
            const isLast = idx === funnelStages.length - 1

            return (
              <div key={stage.id} className="flex items-stretch flex-1 min-w-0">
                {/* stage card */}
                <button
                  onClick={() => onSelect(stage)}
                  className={`flex-1 flex flex-col gap-2 p-3 rounded-xl border ${c.bg} ${c.border} text-left cursor-pointer group hover:shadow-md transition-all hover:scale-[1.02]`}
                >
                  {/* stage number + name */}
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-semibold text-muted-foreground">0{idx + 1}</span>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${c.badge}`}>{stage.status}</span>
                  </div>

                  <p className="text-[11px] font-semibold text-foreground leading-tight">{stage.title}</p>

                  {/* completion bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-foreground">{stage.meta["Completion"]}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/70 border border-white overflow-hidden">
                      <div className={`h-full rounded-full ${c.bar}`} style={{ width: stage.meta["Completion"] }} />
                    </div>
                  </div>

                  {/* meta */}
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-muted-foreground">{stage.meta["Store Count"] || stage.meta["Stores"]} stores</p>
                    <p className="text-[10px] text-muted-foreground">Median: {stage.meta["Median Time"]}</p>
                  </div>

                  {/* view details */}
                  <p className={`text-[10px] font-medium mt-auto ${c.text} group-hover:underline`}>View details</p>
                </button>

                {/* connector arrow */}
                {!isLast && (
                  <div className="flex items-center px-0.5 flex-shrink-0">
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* drop-off summary bar */}
        <div className="mt-5 rounded-lg border border-border bg-muted/40 px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Network drop-off</p>
            <div className="flex items-center gap-1">
              {funnelStages.map((stage, idx) => {
                const pct = parseInt(stage.meta["Completion"])
                return (
                  <div key={stage.id} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className={`w-full rounded-sm ${stageColor(stage.status).bar} opacity-80`}
                      style={{ height: `${Math.max(4, Math.round(pct / 5))}px` }}
                    />
                    <span className="text-[9px] text-muted-foreground">{stage.meta["Completion"]}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-muted-foreground">Total drop-off</p>
            <p className="text-sm font-bold text-red-600">−37 pts</p>
            <p className="text-[10px] text-muted-foreground">94% → 57%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
