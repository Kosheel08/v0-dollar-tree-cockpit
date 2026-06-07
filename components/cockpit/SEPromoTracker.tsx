"use client"

// Section 5 — Promo & Display Readiness Tracker
// Rows with completion progress bars and photo verification as a unique store-
// execution metric. Visually distinct from prior risk boards via the dual
// completion / photo-verified bar treatment.

import { Camera, ChevronRight, AlertTriangle, TrendingDown, Info, Clock, CheckCircle2 } from "lucide-react"
import { promoItems, type DetailItem, type StatusType } from "./SEData"

function statusStyle(s: StatusType) {
  if (s === "Critical")  return { badge: "bg-red-100 text-red-700 border-red-200",    rail: "bg-red-500",    bar: "bg-red-400" }
  if (s === "Behind")    return { badge: "bg-amber-100 text-amber-700 border-amber-200", rail: "bg-amber-500", bar: "bg-amber-400" }
  if (s === "Watchlist") return { badge: "bg-blue-100 text-blue-700 border-blue-200",   rail: "bg-blue-400",  bar: "bg-blue-300" }
  if (s === "On Track")  return { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", rail: "bg-emerald-500", bar: "bg-emerald-400" }
  return { badge: "bg-green-100 text-green-700 border-green-200", rail: "bg-green-500", bar: "bg-green-400" }
}

function StatusIcon({ s }: { s: StatusType }) {
  const cls = "w-3 h-3"
  if (s === "Critical")  return <AlertTriangle className={cls} />
  if (s === "Behind")    return <TrendingDown className={cls} />
  if (s === "Watchlist") return <Info className={cls} />
  if (s === "On Track")  return <Clock className={cls} />
  return <CheckCircle2 className={cls} />
}

interface Props {
  onSelect: (item: DetailItem) => void
}

export default function SEPromoTracker({ onSelect }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Promo &amp; Display Readiness Tracker</p>
        <p className="text-xs text-muted-foreground mt-0.5">Execution readiness for displays, endcaps, and promotional selling space</p>
      </div>

      {/* column header */}
      <div className="px-5 py-2 bg-muted/30 border-b border-border">
        <div className="grid grid-cols-[2fr_1fr_6rem_6rem_5rem_5rem_4rem_1.5rem] gap-4 items-center">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Task</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Completion</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-center">Complete</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-center flex items-center gap-1 justify-center"><Camera className="w-3 h-3" />Verified</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-center">Due</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-center">Stores</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Status</span>
          <span />
        </div>
      </div>

      <div className="divide-y divide-border">
        {promoItems.map(item => {
          const c = statusStyle(item.status)
          const completionPct = Math.round((item.complete / item.assigned) * 100)
          const photoPct = Math.round((item.photoVerified / item.assigned) * 100)
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left px-5 py-4 grid grid-cols-[2fr_1fr_6rem_6rem_5rem_5rem_4rem_1.5rem] gap-4 items-center hover:bg-muted/40 transition-colors group cursor-pointer"
            >
              {/* task name + issue */}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground leading-tight">{item.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.issue}</p>
              </div>

              {/* dual progress bar */}
              <div className="space-y-1.5">
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] text-muted-foreground">Complete</span>
                    <span className="text-[9px] font-bold text-foreground">{completionPct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${completionPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] text-muted-foreground flex items-center gap-0.5"><Camera className="w-2.5 h-2.5" />Photo</span>
                    <span className="text-[9px] font-bold text-foreground">{photoPct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary/40" style={{ width: `${photoPct}%` }} />
                  </div>
                </div>
              </div>

              {/* complete count */}
              <p className="text-xs font-semibold text-foreground text-center">{item.complete} / {item.assigned}</p>

              {/* photo verified */}
              <p className="text-xs font-medium text-foreground text-center">{item.photoVerified} / {item.assigned}</p>

              {/* due date */}
              <p className="text-xs text-muted-foreground text-center">{item.due}</p>

              {/* assigned stores */}
              <p className="text-xs text-muted-foreground text-center">{item.assigned}</p>

              {/* status badge */}
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${c.badge}`}>
                <StatusIcon s={item.status} />{item.status}
              </span>

              {/* chevron */}
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
