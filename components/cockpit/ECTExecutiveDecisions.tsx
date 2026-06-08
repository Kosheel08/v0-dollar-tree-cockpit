"use client"

import { ArrowRight, Clock, DollarSign, Users, ChevronRight } from "lucide-react"
import StatusBadge from "./ECTStatusBadge"
import ECTSectionHeader from "./ECTSectionHeader"
import { executiveDecisions } from "./ECTData"
import type { DrawerPayload } from "./ECTData"
import { cn } from "@/lib/utils"

function buildDrawerPayload(dec: typeof executiveDecisions[0]): DrawerPayload {
  return {
    title: dec.title,
    status: dec.status,
    explanation: dec.rationale,
    sourceTabs: dec.sourceTabs,
    primarySourceTabId: dec.primarySourceTabId,
    metrics: [
      { label: "Value protected", value: dec.valueProtected },
      { label: "Stores impacted", value: `${dec.storesImpacted} stores` },
      { label: "Owner", value: dec.owner },
      { label: "Deadline", value: dec.deadline },
    ],
    businessImpact: `Protecting ${dec.valueProtected} across ${dec.storesImpacted} stores if actioned by ${dec.deadline}.`,
    recommendedAction: `Assign to ${dec.owner} and confirm action plan before ${dec.deadline}.`,
  }
}

interface ECTExecutiveDecisionsProps {
  onOpenDrawer: (payload: DrawerPayload) => void
  onGoToTab: (tabId: string) => void
}

export default function ECTExecutiveDecisions({ onOpenDrawer, onGoToTab }: ECTExecutiveDecisionsProps) {
  return (
    <div>
      <ECTSectionHeader
        title="Top Executive Decisions"
        subtitle="Cross-functional actions leadership should approve before the next lock"
      />
      <div className="space-y-2.5">
        {executiveDecisions.map((dec, i) => (
          <div
            key={dec.id}
            className="rounded-xl border border-border bg-card shadow-sm hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onOpenDrawer(buildDrawerPayload(dec))}
          >
            <div className="px-5 py-4 flex items-start gap-4">
              {/* Index */}
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {i + 1}
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap mb-2">
                  <StatusBadge status={dec.status} />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {dec.sourceTabs.map((t) => (
                      <span key={t} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium border border-border">{t}</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground leading-snug mb-2">{dec.title}</p>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <DollarSign className="w-3 h-3 text-[var(--status-stable)]" />
                    <span className="font-semibold text-[var(--status-stable)]">{dec.valueProtected}</span>
                    <span>protected</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{dec.storesImpacted} stores</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{dec.deadline}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">Owner: <span className="text-foreground font-medium">{dec.owner}</span></span>
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex items-center gap-2 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onOpenDrawer(buildDrawerPayload(dec))}
                  className="text-[11px] text-primary font-semibold hover:underline whitespace-nowrap"
                >
                  View rationale
                </button>
                <button
                  onClick={() => onGoToTab(dec.primarySourceTabId)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium hover:text-foreground transition-colors whitespace-nowrap"
                >
                  Drill into source <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
