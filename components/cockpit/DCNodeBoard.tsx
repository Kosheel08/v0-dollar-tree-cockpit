"use client"

import { cn } from "@/lib/utils"
import { DC_NODES, type DCNode, type StatusLevel } from "./DCTData"
import type { Dispatch, SetStateAction } from "react"

function statusRailColor(s: StatusLevel) {
  if (s === "Critical") return "bg-[var(--status-critical)]"
  if (s === "Watchlist") return "bg-[var(--status-watchlist)]"
  if (s === "Recovering") return "bg-[var(--status-improving)]"
  return "bg-[var(--status-stable)]"
}

function statusTextColor(s: StatusLevel) {
  if (s === "Critical") return "text-[var(--status-critical)]"
  if (s === "Watchlist") return "text-[var(--status-watchlist)]"
  if (s === "Recovering") return "text-[var(--status-improving)]"
  return "text-[var(--status-stable)]"
}

function UtilBar({ value, status }: { value: number; status: StatusLevel }) {
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className={cn(
          "h-full rounded-full",
          status === "Critical" && "bg-[var(--status-critical)]",
          status === "Watchlist" && "bg-[var(--status-watchlist)]",
          status === "Stable" && "bg-[var(--status-stable)]",
          status === "Recovering" && "bg-[var(--status-improving)]",
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

function NodeStat({
  label,
  value,
  status,
  showBar,
}: {
  label: string
  value: string
  status?: StatusLevel
  showBar?: boolean
}) {
  const numVal = parseFloat(value)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="text-[11px] font-semibold text-foreground">{value}</span>
      </div>
      {showBar && status && !isNaN(numVal) && <UtilBar value={numVal} status={status} />}
    </div>
  )
}

interface DCNodeBoardProps {
  onSelect: (dc: DCNode) => void
  filter: string
}

export default function DCNodeBoard({ onSelect, filter }: DCNodeBoardProps) {
  const filtered = DC_NODES.filter((dc) => {
    if (!filter || filter === "all") return true
    return dc.name.toLowerCase().includes(filter.toLowerCase()) ||
      dc.region.toLowerCase().includes(filter.toLowerCase()) ||
      dc.status.toLowerCase().includes(filter.toLowerCase())
  })

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-semibold text-foreground">DC Operating Node Board</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Capacity, throughput, backlog, and service risk by distribution center
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((dc) => (
          <button
            key={dc.id}
            onClick={() => onSelect(dc)}
            className={cn(
              "relative text-left rounded-xl border border-border bg-background overflow-hidden",
              "hover:shadow-md hover:border-primary/30 transition-all duration-150 group",
            )}
          >
            {/* Status rail */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-[3px]", statusRailColor(dc.status))} />

            <div className="pl-4 pr-4 pt-3.5 pb-3 flex flex-col gap-2.5">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {dc.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{dc.region}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded",
                    dc.status === "Critical" && "bg-[var(--status-critical-bg)] text-[var(--status-critical)]",
                    dc.status === "Watchlist" && "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)]",
                    dc.status === "Stable" && "bg-[var(--status-stable-bg)] text-[var(--status-stable)]",
                    dc.status === "Recovering" && "bg-[var(--status-improving-bg)] text-[var(--status-improving)]",
                  )}
                >
                  {dc.status}
                </span>
              </div>

              {/* Outbound cases hero */}
              <div className="flex items-center gap-2 py-1.5 px-2.5 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-[10px] text-muted-foreground">Outbound Cases</p>
                  <p className="text-sm font-bold text-foreground">{dc.outboundCases}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] text-muted-foreground">Trailer Dwell</p>
                  <p className={cn("text-sm font-bold", dc.trailerDwell > 12 ? statusTextColor(dc.status) : "text-foreground")}>
                    {dc.trailerDwell} hrs
                  </p>
                </div>
              </div>

              {/* Utilization bars */}
              <div className="space-y-2">
                <NodeStat
                  label="Capacity"
                  value={`${dc.capacityUtilization}%`}
                  status={dc.status}
                  showBar
                />
                <NodeStat
                  label="Dock"
                  value={`${dc.dockUtilization}%`}
                  status={dc.status}
                  showBar
                />
                <NodeStat
                  label="Labor"
                  value={`${dc.laborCoverage}%`}
                  status={dc.laborCoverage < 90 ? "Watchlist" : "Stable"}
                  showBar
                />
              </div>

              {/* Action */}
              <p className="text-[11px] text-muted-foreground border-t border-border pt-2 leading-snug">
                {dc.action}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
