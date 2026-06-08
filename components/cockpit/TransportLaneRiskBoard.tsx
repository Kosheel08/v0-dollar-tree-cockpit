"use client"

import { cn } from "@/lib/utils"
import { LANE_CARDS, type LaneCard, type StatusLevel } from "./DCTData"
import { ArrowRight } from "lucide-react"

function statusStyles(s: StatusLevel) {
  if (s === "Critical") return { badge: "bg-[var(--status-critical-bg)] text-[var(--status-critical)]", rail: "bg-[var(--status-critical)]" }
  if (s === "Watchlist") return { badge: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)]", rail: "bg-[var(--status-watchlist)]" }
  return { badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)]", rail: "bg-[var(--status-stable)]" }
}

function Pill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-0.5 px-2.5 py-1.5 rounded-lg", highlight ? "bg-muted" : "")}>
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="text-xs font-semibold text-foreground">{value}</span>
    </div>
  )
}

interface TransportLaneRiskBoardProps {
  onSelect: (lane: LaneCard) => void
}

export default function TransportLaneRiskBoard({ onSelect }: TransportLaneRiskBoardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Transportation Lane Risk Board</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Outbound delivery risk by DC-to-region lane, route performance, and trailer utilization
        </p>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {LANE_CARDS.map((lane) => {
          const { badge, rail } = statusStyles(lane.status)
          return (
            <button
              key={lane.id}
              onClick={() => onSelect(lane)}
              className="relative text-left rounded-xl border border-border bg-background overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-150 group"
            >
              <div className={cn("absolute left-0 top-0 bottom-0 w-[3px]", rail)} />
              <div className="pl-4 pr-4 pt-3.5 pb-3 flex flex-col gap-2.5">
                {/* Lane header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      <span>{lane.originDC}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span>{lane.destinationRegion}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{lane.carrier}</p>
                  </div>
                  <span className={cn("shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded", badge)}>
                    {lane.status}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex gap-1 flex-wrap">
                  <Pill label="On-Time" value={`${lane.onTimeDelivery}%`} highlight />
                  <Pill label="Trailer Util." value={`${lane.trailerUtilization}%`} highlight />
                  <Pill label="Cost/Case" value={`$${lane.costPerCase.toFixed(2)}`} highlight />
                  <Pill label="Late Routes" value={`${lane.lateRoutes}`} highlight />
                </div>

                {/* Issue */}
                <p className="text-[11px] text-muted-foreground border-t border-border pt-2 leading-snug">
                  {lane.primaryIssue}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
