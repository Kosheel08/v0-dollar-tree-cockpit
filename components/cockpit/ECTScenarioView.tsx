"use client"

import StatusBadge from "./ECTStatusBadge"
import ECTSectionHeader from "./ECTSectionHeader"
import { scenarios } from "./ECTData"
import type { DrawerPayload, StatusLevel } from "./ECTData"
import { cn } from "@/lib/utils"

function buildDrawerPayload(s: typeof scenarios[0]): DrawerPayload {
  return {
    title: s.label,
    status: s.status,
    explanation: s.explanation,
    sourceTabs: ["Demand Planning", "Inventory & Allocation", "Supplier & Inbound Flow", "DC Capacity & Transportation", "Store Execution"],
    primarySourceTabId: "inventory",
    metrics: [
      { label: "Revenue at Risk Remaining", value: s.revenueAtRisk },
      { label: "Value Protected", value: s.valueProtected },
      { label: "Stores at Risk", value: `${s.storesAtRisk}` },
      { label: "Service Recovery", value: s.serviceRecovery },
      { label: "Operating Cost", value: s.operatingCost },
    ],
    businessImpact: s.summary,
    recommendedAction: s.id === "recommended"
      ? "Approve all five executive decisions before the Jun 10 allocation lock."
      : s.id === "no-intervention"
      ? "This scenario is not recommended. Review executive decisions to avoid this outcome."
      : "Approve at minimum decisions 1 and 2 to exceed the constrained scenario.",
  }
}

const CARD_RING: Record<string, string> = {
  recommended:     "border-[var(--status-stable)] shadow-md ring-1 ring-[var(--status-stable)]/20",
  "no-intervention": "border-[var(--status-critical)]/40",
  constrained:     "border-[var(--status-watchlist)]/40",
}

interface ECTScenarioViewProps {
  selectedScenario: string
  onSelectScenario: (id: string) => void
  onOpenDrawer: (payload: DrawerPayload) => void
}

export default function ECTScenarioView({ selectedScenario, onSelectScenario, onOpenDrawer }: ECTScenarioViewProps) {
  return (
    <div>
      <ECTSectionHeader
        title="Scenario Impact View"
        subtitle="Executive comparison of business outcomes under different decision paths"
      />
      <div className="grid grid-cols-3 gap-4">
        {scenarios.map((s) => {
          const isSelected = selectedScenario === s.id
          return (
            <div
              key={s.id}
              onClick={() => { onSelectScenario(s.id); onOpenDrawer(buildDrawerPayload(s)) }}
              className={cn(
                "rounded-xl border bg-card shadow-sm cursor-pointer transition-all hover:shadow-md",
                isSelected ? CARD_RING[s.id] ?? "border-primary ring-1 ring-primary/20" : "border-border hover:border-primary/30"
              )}
            >
              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <StatusBadge status={s.status} />
                  {isSelected && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Selected</span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground leading-snug mb-4">{s.label}</h3>

                <div className="space-y-2.5">
                  {[
                    { label: "Revenue at Risk Remaining", value: s.revenueAtRisk, danger: true },
                    { label: "Value Protected", value: s.valueProtected, good: s.valueProtected !== "$0" },
                    { label: "Stores at Risk", value: `${s.storesAtRisk}` },
                    { label: "Service Recovery", value: s.serviceRecovery },
                    { label: "Operating Cost", value: s.operatingCost },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3">
                      <span className="text-[11px] text-muted-foreground">{row.label}</span>
                      <span className={cn(
                        "text-[11px] font-semibold",
                        row.danger ? "text-[var(--status-critical)]" : row.good ? "text-[var(--status-stable)]" : "text-foreground"
                      )}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed mt-4 pt-3 border-t border-border">
                  {s.summary}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
