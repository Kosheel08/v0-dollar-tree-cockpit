"use client"

import { ArrowRight, ChevronRight } from "lucide-react"
import StatusBadge from "./ECTStatusBadge"
import ECTSectionHeader from "./ECTSectionHeader"
import { riskFlowStages } from "./ECTData"
import type { DrawerPayload, StatusLevel } from "./ECTData"
import { cn } from "@/lib/utils"

function buildDrawerPayload(stage: typeof riskFlowStages[0]): DrawerPayload {
  return {
    title: stage.label + " — Risk Flow",
    status: stage.status,
    explanation: stage.explanation,
    sourceTabs: [stage.sourceTab],
    primarySourceTabId: stage.sourceTabId,
    metrics: [
      { label: "Signal", value: stage.signal },
      { label: "Impact", value: stage.impact },
    ],
    businessImpact: stage.impact,
    recommendedAction: `Review the ${stage.sourceTab} tab for full detail and available actions.`,
  }
}

const STATUS_BORDER: Record<StatusLevel, string> = {
  critical:    "border-t-[var(--status-critical)]",
  watchlist:   "border-t-[var(--status-watchlist)]",
  stable:      "border-t-[var(--status-stable)]",
  recommended: "border-t-[var(--status-improving)]",
  "high-risk": "border-t-[var(--status-critical)]",
}

interface ECTRiskFlowProps {
  onOpenDrawer: (payload: DrawerPayload) => void
  onGoToTab: (tabId: string) => void
}

export default function ECTRiskFlow({ onOpenDrawer, onGoToTab }: ECTRiskFlowProps) {
  return (
    <div>
      <ECTSectionHeader
        title="End-to-End Risk Flow"
        subtitle="Where risk is entering the operating model and how it moves toward store service"
      />

      <div className="flex items-stretch gap-0">
        {riskFlowStages.map((stage, i) => (
          <div key={stage.id} className="flex items-stretch flex-1 min-w-0">
            {/* Stage card */}
            <div
              className={cn(
                "flex-1 min-w-0 rounded-xl border border-border border-t-2 bg-card shadow-sm overflow-hidden",
                STATUS_BORDER[stage.status]
              )}
            >
              {/* Top */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-foreground tracking-tight uppercase">{stage.label}</span>
                  <StatusBadge status={stage.status} />
                </div>
                <p className="text-[11px] text-muted-foreground font-medium mb-2">{stage.signal}</p>
                <p className="text-xs font-semibold text-foreground leading-snug">{stage.impact}</p>
              </div>

              {/* Explanation */}
              <div className="px-4 pb-3">
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{stage.explanation}</p>
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex items-center gap-2 border-t border-border pt-3 mt-1">
                <button
                  onClick={() => onOpenDrawer(buildDrawerPayload(stage))}
                  className="text-[11px] text-primary font-semibold hover:underline"
                >
                  View explanation
                </button>
                <span className="text-border text-xs">·</span>
                <button
                  onClick={() => onGoToTab(stage.sourceTabId)}
                  className="text-[11px] text-muted-foreground font-medium hover:text-foreground flex items-center gap-0.5 transition-colors"
                >
                  Go to tab <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Arrow connector */}
            {i < riskFlowStages.length - 1 && (
              <div className="flex items-center px-1 shrink-0">
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
