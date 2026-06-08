"use client"

// Section 7 — Field Action Queue
// Vertical command-list layout with priority numbers, linked issue, expected
// impact, owner, timing, and two action buttons. Intentionally different from
// the 3-card action pattern used in prior tabs.

import { ChevronRight, AlertTriangle, TrendingDown, Info, Clock } from "lucide-react"
import { fieldActions, type DetailItem, type StatusType } from "./SEData"

function priorityColor(p: string) {
  if (p === "1" || p === "2") return "bg-red-500 text-white"
  if (p === "3" || p === "4") return "bg-amber-500 text-white"
  return "bg-blue-400 text-white"
}

function statusIcon(s: StatusType) {
  if (s === "Critical")  return <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
  if (s === "Behind")    return <TrendingDown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
  if (s === "Watchlist") return <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
  return <Clock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
}

interface Props {
  onSelect: (item: DetailItem) => void
}

export default function SEFieldActionQueue({ onSelect }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Field Action Queue</p>
        <p className="text-xs text-muted-foreground mt-0.5">Store execution actions ranked by urgency, controllability, and sales enablement</p>
      </div>

      <div className="divide-y divide-border">
        {fieldActions.map(action => {
          const priority = action.meta["Priority"]
          const owner    = action.meta["Owner"]
          const timing   = action.meta["Timing"]
          const linked   = action.meta["Linked issue"]
          const impact   = action.metrics[0]?.value || ""
          return (
            <div
              key={action.id}
              className="px-5 py-4 flex items-start gap-4 hover:bg-muted/40 transition-colors group"
            >
              {/* priority badge */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${priorityColor(priority)}`}>
                {priority}
              </div>

              {/* content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-sm font-semibold text-foreground leading-tight">{action.title}</p>
                  {statusIcon(action.status)}
                </div>

                {/* linked issue */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] text-muted-foreground">Linked:</span>
                  <span className="text-[10px] font-medium text-foreground">{linked}</span>
                </div>

                {/* meta row */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Expected Impact</p>
                    <p className="text-[11px] font-semibold text-foreground">{impact}</p>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Owner</p>
                    <p className="text-[11px] font-medium text-foreground">{owner}</p>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Timing</p>
                    <p className="text-[11px] font-medium text-foreground">{timing}</p>
                  </div>
                </div>

                {/* buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelect(action)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    {action.primaryAction}
                  </button>
                  <button
                    onClick={() => onSelect(action)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors"
                  >
                    {action.secondaryAction}
                  </button>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
