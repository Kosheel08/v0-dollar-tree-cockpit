"use client"

import { ChevronRight, CheckCircle2, Clock, AlertCircle, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { decisionLog } from "./SKUData"
import type { DrawerPayload, StatusLevel } from "./SKUData"
import ECTSectionHeader from "./ECTSectionHeader"

const statusConfig: Record<StatusLevel, { icon: typeof CheckCircle2; iconClass: string; badge: string; text: string }> = {
  completed:        { icon: CheckCircle2, iconClass: "text-[var(--status-stable)]",   badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20",         text: "Completed" },
  watchlist:        { icon: Eye,          iconClass: "text-[var(--status-watchlist)]", badge: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/20", text: "Watchlist" },
  "needs-approval": { icon: AlertCircle,  iconClass: "text-amber-500",                badge: "bg-amber-50 text-amber-700 border border-amber-200",                                                          text: "Needs Approval" },
  pending:          { icon: Clock,        iconClass: "text-amber-500",                badge: "bg-amber-50 text-amber-700 border border-amber-200",                                                          text: "Pending Approval" },
  critical:         { icon: AlertCircle,  iconClass: "text-[var(--status-critical)]", badge: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20",   text: "Critical" },
  stable:           { icon: CheckCircle2, iconClass: "text-[var(--status-stable)]",   badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20",         text: "Stable" },
  approved:         { icon: CheckCircle2, iconClass: "text-[var(--status-stable)]",   badge: "bg-[var(--status-improving-bg)] text-[var(--status-improving)] border border-[var(--status-improving)]/20", text: "Approved" },
}

interface SKUDecisionLogProps {
  onOpenDrawer: (payload: DrawerPayload) => void
}

export default function SKUDecisionLog({ onOpenDrawer }: SKUDecisionLogProps) {
  return (
    <div>
      <ECTSectionHeader
        title="AI Decision Log"
        subtitle="Recent AI classification, recommendation, and routing actions"
        className="mb-4"
      />

      <div className="space-y-2.5">
        {decisionLog.map((entry, i) => {
          const cfg = statusConfig[entry.status]
          const Icon = cfg.icon
          return (
            <button
              key={entry.id}
              onClick={() => onOpenDrawer(entry.drawer)}
              className="w-full bg-card border border-border rounded-xl px-5 py-4 text-left hover:border-primary/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Status icon */}
                <div className={cn("mt-0.5 shrink-0", cfg.iconClass)}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <p className="text-[13px] font-semibold text-foreground leading-snug">{entry.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-muted-foreground">{entry.timestamp}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-2.5">
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Reason  </span>
                      <span className="text-[11px] text-muted-foreground">{entry.reason}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Action  </span>
                      <span className="text-[11px] text-muted-foreground">{entry.actionTaken}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md", cfg.badge)}>{cfg.text}</span>
                    <span className="text-[11px] text-muted-foreground">Related: {entry.relatedTab.label}</span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
