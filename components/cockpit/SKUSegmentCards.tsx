"use client"

import { ChevronRight, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { segmentCards } from "./SKUData"
import type { DrawerPayload, StatusLevel, AutomationLevel } from "./SKUData"
import ECTSectionHeader from "./ECTSectionHeader"

const statusConfig: Record<StatusLevel, { badge: string; text: string }> = {
  critical:         { badge: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20",     text: "Critical" },
  watchlist:        { badge: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/20",   text: "Watchlist" },
  stable:           { badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20",           text: "Stable" },
  "needs-approval": { badge: "bg-amber-50 text-amber-700 border border-amber-200",                                                          text: "Needs Approval" },
  completed:        { badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20",           text: "Completed" },
  pending:          { badge: "bg-amber-50 text-amber-700 border border-amber-200",                                                          text: "Pending" },
  approved:         { badge: "bg-[var(--status-improving-bg)] text-[var(--status-improving)] border border-[var(--status-improving)]/20",  text: "Approved" },
}

const automationConfig: Record<AutomationLevel, { badge: string; text: string }> = {
  high:   { badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20",     text: "High automation" },
  medium: { badge: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/20", text: "Medium automation" },
  low:    { badge: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20",   text: "Low automation" },
}

interface SKUSegmentCardsProps {
  onOpenDrawer: (payload: DrawerPayload) => void
}

export default function SKUSegmentCards({ onOpenDrawer }: SKUSegmentCardsProps) {
  return (
    <div>
      <ECTSectionHeader
        title="SKU Segment Overview"
        subtitle="AI-assigned SKU segments and fit-for-purpose planning strategies"
        className="mb-5"
      />
      <div className="grid grid-cols-3 gap-4">
        {segmentCards.map((card) => {
          const sBadge = statusConfig[card.status]
          const aBadge = automationConfig[card.automationLevel]
          return (
            <button
              key={card.id}
              onClick={() => onOpenDrawer(card.drawer)}
              className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/40 hover:shadow-sm transition-all group flex flex-col gap-3"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md", sBadge.badge)}>{sBadge.text}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>

              {/* Name + definition */}
              <div>
                <p className="text-[13px] font-semibold text-foreground leading-tight mb-1">{card.name}</p>
                <p className="text-[12px] text-muted-foreground leading-snug line-clamp-3">{card.definition}</p>
              </div>

              {/* Strategy */}
              <div className="bg-muted/60 rounded-lg px-3 py-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Strategy</p>
                <p className="text-[12px] text-foreground leading-snug">{card.strategy}</p>
              </div>

              {/* Metrics cluster */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {[
                  { label: "SKU Families", value: card.skuFamilies.toLocaleString() },
                  { label: "Forecast Acc.", value: card.forecastAccuracy },
                  { label: "Shelf OOS", value: card.shelfOos },
                  { label: "Rev. at Risk", value: card.revenueAtRisk },
                ].map((m) => (
                  <div key={m.label}>
                    <p className="text-[10px] text-muted-foreground">{m.label}</p>
                    <p className="text-[12px] font-semibold text-foreground">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-border mt-auto">
                <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md", aBadge.badge)}>{aBadge.text}</span>
                <p className="text-[11px] text-muted-foreground">{card.humanRole}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
