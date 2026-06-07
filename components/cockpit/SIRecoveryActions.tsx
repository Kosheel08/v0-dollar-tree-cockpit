"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RecoveryAction {
  priority: number
  title: string
  linkedRisk: string
  impact: string
  owner: string
  timing: string
  primaryLabel: string
  secondaryLabel: string
  urgency: "critical" | "watchlist" | "moderate" | "low"
}

const actions: RecoveryAction[] = [
  {
    priority: 1,
    title: "Expedite Seasonal PO-78421 into Savannah DC",
    linkedRisk: "Seasonal Southeast allocation shortfall",
    impact: "Protects $1.6M inbound value and 42 stores",
    owner: "Inbound Planning",
    timing: "Next 24 hours",
    primaryLabel: "Approve Expedite",
    secondaryLabel: "View PO detail",
    urgency: "critical",
  },
  {
    priority: 2,
    title: "Recover Consumables short shipment with substitute SKUs",
    linkedRisk: "Midwest replenishment pressure",
    impact: "Reduces $1.1M lost sales risk",
    owner: "Supplier Management",
    timing: "48 hours",
    primaryLabel: "Request Recovery",
    secondaryLabel: "View substitute options",
    urgency: "critical",
  },
  {
    priority: 3,
    title: "Confirm Party receipt date before promo allocation",
    linkedRisk: "Northeast Party promo uncertainty",
    impact: "Avoids $860K misallocation risk",
    owner: "Merchant + Inbound Planning",
    timing: "Before promo lock",
    primaryLabel: "Request Confirmation",
    secondaryLabel: "View promo POs",
    urgency: "watchlist",
  },
  {
    priority: 4,
    title: "Slow Household receipts into Marietta DC",
    linkedRisk: "Southwest overstock",
    impact: "Reduces $720K carrying risk",
    owner: "Inventory Planning",
    timing: "This week",
    primaryLabel: "Adjust Flow",
    secondaryLabel: "View DC plan",
    urgency: "moderate",
  },
]

const urgencyBadge: Record<RecoveryAction["urgency"], string> = {
  critical:  "bg-rose-100 text-rose-700",
  watchlist: "bg-amber-100 text-amber-700",
  moderate:  "bg-blue-100 text-blue-700",
  low:       "bg-muted text-muted-foreground",
}

const priorityRing: Record<RecoveryAction["urgency"], string> = {
  critical:  "border-rose-300 text-rose-700 bg-rose-50",
  watchlist: "border-amber-300 text-amber-700 bg-amber-50",
  moderate:  "border-blue-300 text-blue-700 bg-blue-50",
  low:       "border-border text-muted-foreground bg-muted",
}

export default function SIRecoveryActions() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Recovery Action Center</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Recommended inbound recovery actions ranked by service impact and feasibility
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <div
            key={action.priority}
            className="flex flex-col sm:flex-row items-start gap-4 bg-background border border-border rounded-xl px-4 py-4"
          >
            {/* Priority bubble */}
            <div
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0",
                priorityRing[action.urgency]
              )}
            >
              {action.priority}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex flex-wrap items-start gap-2">
                <p className="text-sm font-semibold text-foreground leading-snug flex-1">{action.title}</p>
                <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0", urgencyBadge[action.urgency])}>
                  {action.timing}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Linked risk: </span>
                  <span className="text-foreground">{action.linkedRisk}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Impact: </span>
                  <span className="font-medium text-foreground">{action.impact}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Owner: </span>
                  <span className="text-foreground">{action.owner}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-center">
              <Button size="sm" className="h-8 text-xs bg-foreground text-background hover:bg-foreground/90">
                {action.primaryLabel}
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs">
                {action.secondaryLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
