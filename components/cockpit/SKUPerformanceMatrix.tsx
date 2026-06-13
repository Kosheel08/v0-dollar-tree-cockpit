"use client"

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
  high:   { badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20",         text: "High" },
  medium: { badge: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/20", text: "Medium" },
  low:    { badge: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20",   text: "Low" },
}

interface SKUPerformanceMatrixProps {
  onOpenDrawer: (payload: DrawerPayload) => void
}

export default function SKUPerformanceMatrix({ onOpenDrawer }: SKUPerformanceMatrixProps) {
  return (
    <div>
      <ECTSectionHeader
        title="Segment Performance & Risk"
        subtitle="Comparison of forecast quality, shelf availability, revenue exposure, and automation level by SKU segment"
        className="mb-4"
      />

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_90px_90px_80px_80px_100px_1fr_90px_100px] gap-0 border-b border-border bg-muted/40">
          {["SKU Segment", "SKU Families", "Forecast Acc.", "Bias", "Shelf OOS", "Rev. at Risk", "Recommended Strategy", "Automation", "Status"].map((h) => (
            <div key={h} className="px-3 py-2.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{h}</p>
            </div>
          ))}
        </div>

        {/* Data rows */}
        {segmentCards.map((seg, i) => {
          const sBadge = statusConfig[seg.status]
          const aBadge = automationConfig[seg.automationLevel]
          const strategyDrawer: DrawerPayload = {
            title: `Strategy: ${seg.name}`,
            status: seg.status,
            explanation: seg.strategy,
            signals: [],
            metrics: [
              { label: "SKU families", value: seg.skuFamilies.toLocaleString() },
              { label: "Forecast accuracy", value: seg.forecastAccuracy },
              { label: "Revenue at risk", value: seg.revenueAtRisk },
            ],
            sourceTabs: seg.drawer.sourceTabs,
            actionLabel: seg.drawer.actionLabel,
            actionTabId: seg.drawer.actionTabId,
          }
          const automationDrawer: DrawerPayload = {
            title: `Automation: ${seg.name}`,
            status: seg.status,
            explanation: `${seg.name} has ${seg.automationLevel} automation. ${seg.humanRole}.`,
            signals: [],
            metrics: [
              { label: "Automation level", value: seg.automationLevel.charAt(0).toUpperCase() + seg.automationLevel.slice(1) },
              { label: "Human role", value: seg.humanRole },
              { label: "Confidence threshold", value: "≥ 0.80 for auto-assign" },
            ],
            sourceTabs: [],
          }
          return (
            <div
              key={seg.id}
              className={cn(
                "grid grid-cols-[1fr_90px_90px_80px_80px_100px_1fr_90px_100px] gap-0 hover:bg-muted/30 transition-colors",
                i < segmentCards.length - 1 ? "border-b border-border" : ""
              )}
            >
              {/* Segment name */}
              <button
                onClick={() => onOpenDrawer(seg.drawer)}
                className="px-3 py-3 text-left hover:text-primary transition-colors"
              >
                <p className="text-[12px] font-semibold text-foreground hover:text-primary">{seg.name}</p>
              </button>
              <div className="px-3 py-3 flex items-center">
                <p className="text-[12px] text-foreground font-medium">{seg.skuFamilies.toLocaleString()}</p>
              </div>
              <div className="px-3 py-3 flex items-center">
                <p className="text-[12px] text-foreground font-medium">{seg.forecastAccuracy}</p>
              </div>
              <div className="px-3 py-3 flex items-center">
                <p className={cn("text-[12px] font-medium", seg.forecastBias.startsWith("-") ? "text-[var(--status-critical)]" : "text-foreground")}>
                  {seg.forecastBias}
                </p>
              </div>
              <div className="px-3 py-3 flex items-center">
                <p className="text-[12px] text-foreground font-medium">{seg.shelfOos}</p>
              </div>
              <div className="px-3 py-3 flex items-center">
                <p className="text-[12px] font-semibold text-foreground">{seg.revenueAtRisk}</p>
              </div>
              {/* Strategy — clickable */}
              <button
                onClick={() => onOpenDrawer(strategyDrawer)}
                className="px-3 py-3 text-left hover:text-primary transition-colors"
              >
                <p className="text-[11px] text-muted-foreground hover:text-primary leading-snug">{seg.strategy}</p>
              </button>
              {/* Automation — clickable */}
              <button
                onClick={() => onOpenDrawer(automationDrawer)}
                className="px-3 py-3 flex items-center"
              >
                <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md", aBadge.badge)}>{aBadge.text}</span>
              </button>
              <div className="px-3 py-3 flex items-center">
                <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md", sBadge.badge)}>{sBadge.text}</span>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
        Forecast accuracy and bias show how predictable the segment is. Shelf OOS shows customer-facing availability risk. Revenue at risk helps prioritize where planners should focus. Automation level indicates how much AI can act within guardrails versus requiring human approval.
      </p>
    </div>
  )
}
