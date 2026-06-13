"use client"

import { useState } from "react"
import { CheckCircle2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { approvalCards } from "./SKUData"
import type { DrawerPayload, StatusLevel } from "./SKUData"
import ECTSectionHeader from "./ECTSectionHeader"

const statusConfig: Record<StatusLevel, { badge: string; text: string }> = {
  critical:         { badge: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20",     text: "Critical" },
  watchlist:        { badge: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/20",   text: "Watchlist" },
  stable:           { badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20",           text: "Stable" },
  "needs-approval": { badge: "bg-amber-50 text-amber-700 border border-amber-200",                                                          text: "Needs Review" },
  completed:        { badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20",           text: "Completed" },
  pending:          { badge: "bg-amber-50 text-amber-700 border border-amber-200",                                                          text: "Pending Approval" },
  approved:         { badge: "bg-[var(--status-improving-bg)] text-[var(--status-improving)] border border-[var(--status-improving)]/20",  text: "Approved" },
}

interface SKUApprovalWorkbenchProps {
  onOpenDrawer: (payload: DrawerPayload) => void
}

export default function SKUApprovalWorkbench({ onOpenDrawer }: SKUApprovalWorkbenchProps) {
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set())

  const handleApprove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setApprovedIds((prev) => new Set([...prev, id]))
  }

  return (
    <div>
      <ECTSectionHeader
        title="Human Approval Workbench"
        subtitle="High-impact SKU decisions where AI recommends action but requires planner approval"
        className="mb-4"
      />

      <div className="grid grid-cols-2 gap-4">
        {approvalCards.map((card) => {
          const isApproved = approvedIds.has(card.id)
          const effectiveStatus: StatusLevel = isApproved ? "approved" : card.status
          const cfg = statusConfig[effectiveStatus]

          return (
            <button
              key={card.id}
              onClick={() => onOpenDrawer(card.drawer)}
              className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/40 hover:shadow-sm transition-all group flex flex-col gap-3"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border">
                  {card.segment}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md", cfg.badge)}>{cfg.text}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </div>

              {/* Title */}
              <p className="text-[13px] font-semibold text-foreground leading-snug">{card.title}</p>

              {/* Recommendation */}
              <div className="bg-muted/60 rounded-lg px-3 py-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">AI recommendation</p>
                <p className="text-[12px] text-foreground leading-snug">{card.recommendation}</p>
              </div>

              {/* Why + value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">Why approval needed</p>
                  <p className="text-[11px] text-foreground leading-snug">{card.whyApproval}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">Value at risk</p>
                  <p className="text-[16px] font-bold text-foreground">{card.valueAtRisk}</p>
                  <p className="text-[11px] text-muted-foreground">{card.owner}</p>
                </div>
              </div>

              {/* Actions */}
              {isApproved ? (
                <div className="flex items-center gap-2 pt-1 border-t border-border mt-auto">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--status-stable)]" />
                  <span className="text-[12px] font-semibold text-[var(--status-stable)]">Approved</span>
                </div>
              ) : (
                <div className="flex gap-2 pt-1 border-t border-border mt-auto" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleApprove(e, card.id)}
                    className="flex-1 text-xs font-semibold bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {card.primaryLabel}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenDrawer(card.drawer) }}
                    className="flex-1 text-xs font-semibold border border-border bg-card text-foreground py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    {card.secondaryLabel}
                  </button>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
