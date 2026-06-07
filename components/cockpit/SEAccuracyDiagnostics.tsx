"use client"

// Section 6 — Inventory Accuracy Diagnostics
// Two-panel layout: Accuracy Risk Drivers (left) + Cycle Count Queue (right).
// Diagnostic feel with warning icons and due dates. Distinct from the network
// inventory positioning language used in Inventory & Allocation tab.

import { AlertTriangle, TrendingDown, Info, Clock, CheckCircle2, ChevronRight, Microscope } from "lucide-react"
import { accuracyDrivers, cycleCountQueue, type DetailItem, type StatusType } from "./SEData"

function rowStyle(s: StatusType) {
  if (s === "Critical")  return { dot: "bg-red-500",    badge: "bg-red-100 text-red-700 border-red-200",    icon: <AlertTriangle className="w-3 h-3 text-red-600" /> }
  if (s === "Behind")    return { dot: "bg-amber-500",  badge: "bg-amber-100 text-amber-700 border-amber-200",  icon: <TrendingDown className="w-3 h-3 text-amber-600" /> }
  if (s === "Watchlist") return { dot: "bg-blue-400",   badge: "bg-blue-100 text-blue-700 border-blue-200",   icon: <Info className="w-3 h-3 text-blue-600" /> }
  if (s === "On Track")  return { dot: "bg-emerald-500",badge: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <Clock className="w-3 h-3 text-emerald-600" /> }
  return { dot: "bg-green-500", badge: "bg-green-100 text-green-700 border-green-200", icon: <CheckCircle2 className="w-3 h-3 text-green-600" /> }
}

interface Props {
  onSelect: (item: DetailItem) => void
}

function DiagRow({ item, onSelect }: { item: DetailItem; onSelect: (i: DetailItem) => void }) {
  const c = rowStyle(item.status)
  const impact = item.meta["Estimated impact"] || item.meta["Counts overdue"] || item.meta["Tasks missing"] || ""
  return (
    <button
      onClick={() => onSelect(item)}
      className="w-full text-left flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-all cursor-pointer group"
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${c.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium text-foreground leading-tight">{item.title}</p>
          <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-muted-foreground">{item.meta["Stores"]} stores</span>
          {impact && <span className="text-[10px] font-semibold text-foreground">{impact}</span>}
          <span className={`inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${c.badge}`}>
            {c.icon}{item.status}
          </span>
        </div>
      </div>
    </button>
  )
}

function CountRow({ item, onSelect }: { item: DetailItem; onSelect: (i: DetailItem) => void }) {
  const c = rowStyle(item.status)
  return (
    <button
      onClick={() => onSelect(item)}
      className="w-full text-left flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-all cursor-pointer group"
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${c.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium text-foreground leading-tight">{item.title}</p>
          <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-muted-foreground">{item.meta["Stores"]} stores</span>
          <span className="text-[10px] text-muted-foreground">Due {item.meta["Due"]}</span>
          <span className={`inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${c.badge}`}>
            {c.icon}{item.status}
          </span>
        </div>
      </div>
    </button>
  )
}

export default function SEAccuracyDiagnostics({ onSelect }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Inventory Accuracy Diagnostics</p>
        <p className="text-xs text-muted-foreground mt-0.5">Cycle count variance, phantom inventory, and shelf verification gaps impacting execution confidence</p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border">
        {/* left — accuracy risk drivers */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-xs font-semibold text-foreground">Accuracy Risk Drivers</p>
          </div>
          <div className="space-y-1">
            {accuracyDrivers.map(item => <DiagRow key={item.id} item={item} onSelect={onSelect} />)}
          </div>
        </div>

        {/* right — cycle count queue */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Microscope className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs font-semibold text-foreground">Cycle Count Queue</p>
          </div>
          <div className="space-y-1">
            {cycleCountQueue.map(item => <CountRow key={item.id} item={item} onSelect={onSelect} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
