"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { summaryMetrics } from "./SKUData"
import type { DrawerPayload, StatusLevel } from "./SKUData"

const statusConfig: Record<StatusLevel, { rail: string; badge: string; text: string }> = {
  critical:       { rail: "bg-[var(--status-critical)]",  badge: "bg-[var(--status-critical-bg)] text-[var(--status-critical)]",   text: "Critical" },
  watchlist:      { rail: "bg-[var(--status-watchlist)]", badge: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)]",  text: "Watchlist" },
  stable:         { rail: "bg-[var(--status-stable)]",    badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)]",       text: "Stable" },
  "needs-approval": { rail: "bg-amber-500",               badge: "bg-amber-50 text-amber-700",                                     text: "Needs Approval" },
  completed:      { rail: "bg-[var(--status-stable)]",    badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)]",       text: "Completed" },
  pending:        { rail: "bg-amber-500",                 badge: "bg-amber-50 text-amber-700",                                     text: "Pending" },
  approved:       { rail: "bg-[var(--status-stable)]",    badge: "bg-[var(--status-improving-bg)] text-[var(--status-improving)]", text: "Approved" },
}

interface SKUSummaryStripProps {
  onOpenDrawer: (payload: DrawerPayload) => void
}

export default function SKUSummaryStrip({ onOpenDrawer }: SKUSummaryStripProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {summaryMetrics.map((m) => {
        const cfg = statusConfig[m.status]
        return (
          <button
            key={m.title}
            onClick={() => onOpenDrawer(m.drawer)}
            className="relative bg-card border border-border rounded-xl px-4 py-3.5 text-left hover:border-primary/40 hover:shadow-sm transition-all group overflow-hidden"
          >
            {/* Left accent rail */}
            <span className={cn("absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full", cfg.rail)} />

            <div className="flex items-start justify-between gap-1 mb-2">
              <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md", cfg.badge)}>
                {cfg.text}
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
            </div>

            <p className="text-[11px] font-medium text-muted-foreground mb-0.5 leading-tight">{m.title}</p>
            <p className="text-[22px] font-bold text-foreground leading-none tracking-tight">{m.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{m.subtext}</p>
          </button>
        )
      })}
    </div>
  )
}
