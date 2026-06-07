"use client"

import { ArrowRight, ExternalLink } from "lucide-react"
import StatusBadge from "./ECTStatusBadge"
import ECTSectionHeader from "./ECTSectionHeader"
import { sourceSummaryCards } from "./ECTData"
import type { DrawerPayload } from "./ECTData"
import { cn } from "@/lib/utils"

function buildDrawerPayload(card: typeof sourceSummaryCards[0]): DrawerPayload {
  return {
    title: card.tabLabel,
    status: card.status,
    explanation: card.explanation,
    sourceTabs: [card.tabLabel],
    primarySourceTabId: card.tabId,
    metrics: [
      { label: card.mainLabel, value: card.mainMetric },
      { label: "Risk signal", value: card.riskMetric },
      { label: "Business impact", value: card.businessImpact },
    ],
    businessImpact: card.businessImpact,
    recommendedAction: card.topAction,
  }
}

const TAB_LABELS: Record<string, string> = {
  "demand": "Demand Planning",
  "inventory": "Inventory & Allocation",
  "supplier-inbound": "Supplier & Inbound Flow",
  "dc-capacity": "DC Capacity & Transportation",
  "store-execution": "Store Execution",
}

interface ECTSourceSummaryCardsProps {
  onOpenDrawer: (payload: DrawerPayload) => void
  onGoToTab: (tabId: string) => void
}

export default function ECTSourceSummaryCards({ onOpenDrawer, onGoToTab }: ECTSourceSummaryCardsProps) {
  return (
    <div>
      <ECTSectionHeader
        title="Source Tab Summaries"
        subtitle="Executive rollup of the detailed operating tabs"
      />
      <div className="grid grid-cols-5 gap-3">
        {sourceSummaryCards.map((card) => (
          <div
            key={card.id}
            className="relative rounded-xl border border-border bg-card shadow-sm flex flex-col hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onOpenDrawer(buildDrawerPayload(card))}
          >
            {/* Top */}
            <div className="px-4 pt-4 pb-3 border-b border-border">
              <div className="flex items-start justify-between gap-1 mb-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-tight">{card.tabLabel}</span>
                <StatusBadge status={card.status} />
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight leading-none">{card.mainMetric}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{card.mainLabel}</p>
            </div>

            {/* Risk + Impact */}
            <div className="px-4 py-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground">Risk signal</span>
                <span className="text-[11px] font-semibold text-[var(--status-critical)]">{card.riskMetric}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground">Business impact</span>
                <span className="text-[11px] font-semibold text-foreground">{card.businessImpact}</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="px-4 pb-3 flex-1">
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{card.explanation}</p>
            </div>

            {/* Action */}
            <div className="px-4 pb-3 mt-auto">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Top action</p>
              <p className="text-[11px] text-foreground leading-snug line-clamp-2">{card.topAction}</p>
            </div>

            {/* Footer buttons */}
            <div
              className="px-4 py-3 border-t border-border flex items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onOpenDrawer(buildDrawerPayload(card))}
                className="text-[11px] text-primary font-semibold hover:underline"
              >
                View explanation
              </button>
              <span className="text-border text-xs">·</span>
              <button
                onClick={() => onGoToTab(card.tabId)}
                className="text-[11px] text-muted-foreground font-medium hover:text-foreground flex items-center gap-0.5 transition-colors"
              >
                Open tab <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
