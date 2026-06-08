"use client"

// Section 4 — Backroom-to-Shelf Workbench
// Three-column kanban-style workbench: Aged in Backroom / Blocked by Labor /
// Ready for Verification. Compact task cards, clearly distinct from supply
// allocation boards used in prior tabs.

import { ChevronRight, AlertTriangle, TrendingDown, Info, Clock, CheckCircle2 } from "lucide-react"
import { workbenchItems, type DetailItem, type StatusType } from "./SEData"

const COLUMNS: { col: 1 | 2 | 3; label: string; sub: string }[] = [
  { col: 1, label: "Aged in Backroom",         sub: "Product delivered but not processed to shelf" },
  { col: 2, label: "Blocked by Labor / Task",  sub: "Tasks open but cannot proceed without action" },
  { col: 3, label: "Ready for Shelf Verification", sub: "Processing complete — verification outstanding" },
]

function statusStyle(s: StatusType) {
  if (s === "Critical")  return { badge: "bg-red-100 text-red-700 border-red-200",    dot: "bg-red-500",   icon: <AlertTriangle className="w-3 h-3" /> }
  if (s === "Behind")    return { badge: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500", icon: <TrendingDown className="w-3 h-3" /> }
  if (s === "Watchlist") return { badge: "bg-blue-100 text-blue-700 border-blue-200",   dot: "bg-blue-400",  icon: <Info className="w-3 h-3" /> }
  if (s === "On Track")  return { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", icon: <Clock className="w-3 h-3" /> }
  return { badge: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500", icon: <CheckCircle2 className="w-3 h-3" /> }
}

interface Props {
  onSelect: (item: DetailItem) => void
}

export default function SEBackroomWorkbench({ onSelect }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Backroom-to-Shelf Workbench</p>
        <p className="text-xs text-muted-foreground mt-0.5">Inventory already in the store but not yet converted into sellable shelf availability</p>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border">
        {COLUMNS.map(({ col, label, sub }) => {
          const items = workbenchItems.filter(w => w.column === col)
          return (
            <div key={col} className="p-4">
              {/* column header */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{sub}</p>
              </div>
              {/* cards */}
              <div className="space-y-2">
                {items.map(item => {
                  const c = statusStyle(item.status)
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelect(item)}
                      className="w-full text-left rounded-lg border border-border bg-background hover:bg-muted/50 hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="p-3">
                        {/* status dot + badge */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
                            <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${c.badge}`}>
                              {c.icon}{item.status}
                            </span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                        </div>
                        {/* title */}
                        <p className="text-[11px] font-semibold text-foreground leading-tight mb-2">{item.title}</p>
                        {/* sub-metrics */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.sub1}</span>
                          <span className="text-[10px] font-semibold text-foreground">{item.sub2}</span>
                        </div>
                        {/* view details */}
                        <p className="text-[10px] text-primary font-medium mt-2 group-hover:underline">View details</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
