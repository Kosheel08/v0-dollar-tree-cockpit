"use client"

import { cn } from "@/lib/utils"
import { BOTTLENECKS, type Bottleneck, type StatusLevel } from "./DCTData"
import { Clock } from "lucide-react"

function severityStyles(s: StatusLevel) {
  if (s === "Critical")
    return {
      dot: "bg-[var(--status-critical)]",
      badge: "bg-[var(--status-critical-bg)] text-[var(--status-critical)]",
    }
  return {
    dot: "bg-[var(--status-watchlist)]",
    badge: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)]",
  }
}

const TYPE_ICONS: Record<Bottleneck["type"], string> = {
  Dock: "D",
  Picking: "P",
  Labor: "L",
  Transportation: "T",
}

interface BottleneckPanelProps {
  onSelect: (b: Bottleneck) => void
}

export default function BottleneckPanel({ onSelect }: BottleneckPanelProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Dock, Yard & Labor Bottlenecks</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Operational constraints limiting network flow over the next 7 days
        </p>
      </div>

      <div className="divide-y divide-border">
        {BOTTLENECKS.map((b, i) => {
          const { dot, badge } = severityStyles(b.severity)
          return (
            <button
              key={b.id}
              onClick={() => onSelect(b)}
              className="w-full text-left px-5 py-4 hover:bg-muted/50 transition-colors group flex items-start gap-4"
            >
              {/* Rank + type icon */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                <div className="w-7 h-7 rounded-full border-2 border-border bg-background flex items-center justify-center text-[11px] font-bold text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                  {i + 1}
                </div>
                {i < BOTTLENECKS.length - 1 && (
                  <div className="w-px flex-1 min-h-[16px] bg-border" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className={cn("mt-0.5 w-1.5 h-1.5 rounded-full shrink-0", dot)} />
                    <p className="text-xs font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {b.title}
                    </p>
                  </div>
                  <span className={cn("shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded", badge)}>
                    {b.severity}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-3 flex-wrap">
                  <span className="text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">{b.node}</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded font-medium text-muted-foreground">
                    {b.type}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded font-medium text-muted-foreground">
                    {b.owner}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {b.timing}
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] text-muted-foreground leading-snug">{b.impact}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
