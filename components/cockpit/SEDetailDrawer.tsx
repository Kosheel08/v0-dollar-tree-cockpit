"use client"

import { X, AlertTriangle, CheckCircle2, Clock, TrendingDown, Info } from "lucide-react"
import { DetailItem, StatusType } from "./SEData"

function statusColors(s: StatusType) {
  if (s === "Critical") return { badge: "bg-red-100 text-red-700 border-red-200", rail: "bg-red-500", icon: <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> }
  if (s === "Behind") return { badge: "bg-amber-100 text-amber-700 border-amber-200", rail: "bg-amber-500", icon: <TrendingDown className="w-3.5 h-3.5 text-amber-600" /> }
  if (s === "Watchlist") return { badge: "bg-blue-100 text-blue-700 border-blue-200", rail: "bg-blue-400", icon: <Info className="w-3.5 h-3.5 text-blue-600" /> }
  if (s === "On Track") return { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", rail: "bg-emerald-500", icon: <Clock className="w-3.5 h-3.5 text-emerald-600" /> }
  return { badge: "bg-green-100 text-green-700 border-green-200", rail: "bg-green-500", icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> }
}

interface Props {
  item: DetailItem | null
  open: boolean
  onClose: () => void
}

export default function SEDetailDrawer({ item, open, onClose }: Props) {
  if (!open || !item) return null
  const c = statusColors(item.status)

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* backdrop */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      {/* drawer panel */}
      <div className="w-[480px] max-w-full h-full bg-card border-l border-border flex flex-col shadow-2xl overflow-y-auto">
        {/* header */}
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${c.badge}`}>
                {c.icon}{item.status}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-foreground leading-snug">{item.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* context metadata */}
        <div className="px-6 py-4 border-b border-border bg-muted/40">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Context</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {Object.entries(item.meta).map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] text-muted-foreground">{k}</p>
                <p className="text-xs font-medium text-foreground">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* metrics */}
        <div className="px-6 py-4 border-b border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Key Metrics</p>
          <div className="grid grid-cols-2 gap-3">
            {item.metrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-border bg-background px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground mb-0.5">{m.label}</p>
                <p className="text-sm font-semibold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* root causes */}
        <div className="px-6 py-4 border-b border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Root Causes</p>
          <ul className="space-y-1.5">
            {item.rootCauses.map((rc, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                {rc}
              </li>
            ))}
          </ul>
        </div>

        {/* impact */}
        <div className="px-6 py-4 border-b border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Business Impact</p>
          <p className="text-xs text-foreground leading-relaxed">{item.impact}</p>
        </div>

        {/* recommendation */}
        <div className="px-6 py-4 border-b border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recommended Field Action</p>
          <p className="text-xs text-foreground leading-relaxed">{item.recommendation}</p>
        </div>

        {/* actions */}
        <div className="px-6 py-5 mt-auto">
          <div className="flex gap-3">
            <button className="flex-1 text-xs font-medium px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              {item.primaryAction}
            </button>
            <button className="flex-1 text-xs font-medium px-4 py-2.5 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors">
              {item.secondaryAction}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
