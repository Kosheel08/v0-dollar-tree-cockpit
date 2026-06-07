"use client"

import { ArrowRight, FileDown, TrendingUp } from "lucide-react"
import StatusBadge from "./ECTStatusBadge"
import { heroMetrics, drawerPayloads } from "./ECTData"
import type { DrawerPayload } from "./ECTData"
import { cn } from "@/lib/utils"

interface ECTHeroProps {
  onOpenDrawer: (payload: DrawerPayload) => void
  onReviewDecisions: () => void
}

export default function ECTHero({ onOpenDrawer, onReviewDecisions }: ECTHeroProps) {
  return (
    <div className="relative rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
      {/* Subtle green accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />

      <div className="pl-7 pr-6 pt-6 pb-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <StatusBadge status="critical" />
              <span className="text-[11px] text-muted-foreground font-medium">Elevated Risk · Actionable</span>
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight leading-snug">
              Current Supply Chain Posture
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onReviewDecisions}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Review Decisions
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-1.5 border border-border text-xs font-medium text-muted-foreground px-3.5 py-2 rounded-lg hover:bg-muted transition-colors">
              <FileDown className="w-3.5 h-3.5" />
              Export Brief
            </button>
          </div>
        </div>

        {/* Narrative */}
        <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl mb-5">
          {"Dollar Tree's highest supply chain risk is concentrated across five connected areas: demand under-forecasting, constrained allocation readiness, inbound supplier variance, Savannah/Joliet network pressure, and store execution gaps. If leadership approves the recommended actions before the Jun\u00a010 allocation lock, the team can protect an estimated "}<strong className="text-foreground font-semibold">$8.7M in revenue</strong>{" and reduce store exposure from "}<strong className="text-foreground font-semibold">286 stores to 146 stores.</strong>
        </p>

        {/* Hero metrics strip */}
        <div className="grid grid-cols-5 gap-3">
          {heroMetrics.map((m) => {
            const payload = drawerPayloads[m.drawerId]
            return (
              <button
                key={m.drawerId}
                onClick={() => payload && onOpenDrawer(payload)}
                className={cn(
                  "text-left rounded-xl border border-border bg-muted/50 px-4 py-3.5 hover:bg-muted hover:border-primary/30 transition-all group",
                  m.drawerId === "hero-revenue" && "col-span-1"
                )}
              >
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 leading-tight">{m.label}</p>
                <p className={cn(
                  "text-2xl font-bold tracking-tight leading-none",
                  m.drawerId === "hero-revenue" ? "text-[var(--status-critical)]" : m.drawerId === "hero-protected" ? "text-[var(--status-stable)]" : "text-foreground"
                )}>
                  {m.value}
                </p>
                {m.sub && <p className="text-[10px] text-muted-foreground mt-1">{m.sub}</p>}
                <div className="flex items-center gap-1 mt-2 text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View detail</span>
                  <TrendingUp className="w-3 h-3" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
