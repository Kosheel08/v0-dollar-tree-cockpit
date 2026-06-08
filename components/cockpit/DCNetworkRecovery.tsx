"use client"

import { cn } from "@/lib/utils"
import { Clock, User } from "lucide-react"

const ACTIONS = [
  {
    priority: 1,
    title: "Re-sequence Savannah outbound waves",
    constraint: "Shipping dock utilization 96%",
    impact: "Protects delivery windows for 72 Southeast stores",
    effort: "Medium",
    owner: "DC Operations",
    timing: "Next 24 hours",
    primaryBtn: "Approve Wave Change",
    secondaryBtn: "View wave plan",
  },
  {
    priority: 2,
    title: "Prioritize Joliet Consumables pick waves",
    constraint: "Picking utilization 94%",
    impact: "Reduces service risk for 58 Midwest stores",
    effort: "Low",
    owner: "Warehouse Operations",
    timing: "48 hours",
    primaryBtn: "Prioritize Picks",
    secondaryBtn: "View order queue",
  },
  {
    priority: 3,
    title: "Add overflow route capacity from Savannah",
    constraint: "Trailer utilization 97%",
    impact: "Reduces late route risk on 18 routes",
    effort: "Medium",
    owner: "Transportation",
    timing: "This week",
    primaryBtn: "Add Capacity",
    secondaryBtn: "View lane detail",
  },
  {
    priority: 4,
    title: "Use Marietta spare capacity for rebalance moves",
    constraint: "Marietta utilization 78%",
    impact: "Supports Household transfer without adding expedite cost",
    effort: "Low",
    owner: "Network Planning",
    timing: "This week",
    primaryBtn: "Approve Move",
    secondaryBtn: "View transfer plan",
  },
]

function effortColor(e: string) {
  return e === "Low"
    ? "bg-[var(--status-stable-bg)] text-[var(--status-stable)]"
    : "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)]"
}

export default function DCNetworkRecovery() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Network Recovery Actions</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Recommended operational moves ranked by service protection and feasibility
        </p>
      </div>

      <div className="px-5 py-4">
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[17px] top-8 bottom-8 w-px bg-border" />

          <div className="space-y-3">
            {ACTIONS.map((a) => (
              <div key={a.priority} className="flex items-start gap-4">
                {/* Priority node */}
                <div className="shrink-0 w-9 h-9 rounded-full border-2 border-border bg-card flex items-center justify-center text-sm font-bold text-foreground z-10">
                  {a.priority}
                </div>

                {/* Card */}
                <div className="flex-1 border border-border rounded-xl bg-background px-4 py-3.5 hover:border-primary/30 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-semibold text-foreground leading-snug">{a.title}</p>
                    <span className={cn("shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded", effortColor(a.effort))}>
                      {a.effort} effort
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <span className="text-[11px] text-muted-foreground">
                      Constraint:{" "}
                      <span className="font-medium text-foreground">{a.constraint}</span>
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Impact: <span className="font-medium text-foreground">{a.impact}</span>
                  </p>

                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <User className="w-3 h-3" />
                      {a.owner}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {a.timing}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button className="bg-foreground text-background text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                      {a.primaryBtn}
                    </button>
                    <button className="border border-border text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-foreground">
                      {a.secondaryBtn}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
