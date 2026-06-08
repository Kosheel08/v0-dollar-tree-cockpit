"use client"

import { cn } from "@/lib/utils"
import type { StatusLevel } from "./DCTData"

const STEPS = ["Receiving", "Putaway", "Picking", "Shipping", "Yard"] as const
type Step = (typeof STEPS)[number]

const HEATMAP_DATA: {
  dc: string
  values: Record<Step, { value: number; status: StatusLevel }>
}[] = [
  {
    dc: "Savannah DC",
    values: {
      Receiving: { value: 92, status: "Critical" },
      Putaway: { value: 88, status: "Watchlist" },
      Picking: { value: 95, status: "Critical" },
      Shipping: { value: 96, status: "Critical" },
      Yard: { value: 94, status: "Critical" },
    },
  },
  {
    dc: "Joliet DC",
    values: {
      Receiving: { value: 86, status: "Watchlist" },
      Putaway: { value: 83, status: "Watchlist" },
      Picking: { value: 94, status: "Critical" },
      Shipping: { value: 91, status: "Critical" },
      Yard: { value: 89, status: "Watchlist" },
    },
  },
  {
    dc: "Chesapeake DC",
    values: {
      Receiving: { value: 79, status: "Stable" },
      Putaway: { value: 82, status: "Stable" },
      Picking: { value: 88, status: "Watchlist" },
      Shipping: { value: 84, status: "Watchlist" },
      Yard: { value: 80, status: "Stable" },
    },
  },
  {
    dc: "Marietta DC",
    values: {
      Receiving: { value: 71, status: "Stable" },
      Putaway: { value: 74, status: "Stable" },
      Picking: { value: 78, status: "Stable" },
      Shipping: { value: 76, status: "Stable" },
      Yard: { value: 70, status: "Stable" },
    },
  },
  {
    dc: "San Bernardino DC",
    values: {
      Receiving: { value: 74, status: "Stable" },
      Putaway: { value: 79, status: "Stable" },
      Picking: { value: 82, status: "Stable" },
      Shipping: { value: 77, status: "Stable" },
      Yard: { value: 73, status: "Stable" },
    },
  },
  {
    dc: "Olive Branch DC",
    values: {
      Receiving: { value: 84, status: "Watchlist" },
      Putaway: { value: 81, status: "Stable" },
      Picking: { value: 87, status: "Watchlist" },
      Shipping: { value: 86, status: "Watchlist" },
      Yard: { value: 83, status: "Watchlist" },
    },
  },
]

function cellBg(status: StatusLevel) {
  if (status === "Critical") return "bg-[var(--status-critical-bg)] hover:brightness-95"
  if (status === "Watchlist") return "bg-[var(--status-watchlist-bg)] hover:brightness-95"
  return "bg-[var(--status-stable-bg)] hover:brightness-95"
}

function cellText(status: StatusLevel) {
  if (status === "Critical") return "text-[var(--status-critical)]"
  if (status === "Watchlist") return "text-[var(--status-watchlist)]"
  return "text-[var(--status-stable)]"
}

interface CapacityHeatmapProps {
  onSelect: (cell: { dc: string; step: string; value: number; status: StatusLevel }) => void
}

export default function CapacityHeatmap({ onSelect }: CapacityHeatmapProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Capacity Heatmap</p>
        <p className="text-xs text-muted-foreground mt-0.5">Operational pressure by DC and process step</p>
      </div>

      <div className="p-4 overflow-x-auto">
        <div className="min-w-[560px]">
          {/* Column headers */}
          <div className="grid grid-cols-[160px_repeat(5,1fr)] gap-1.5 mb-1.5">
            <div />
            {STEPS.map((step) => (
              <div key={step} className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide py-1">
                {step}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-1.5">
            {HEATMAP_DATA.map((row) => (
              <div key={row.dc} className="grid grid-cols-[160px_repeat(5,1fr)] gap-1.5 items-center">
                <div className="text-xs font-medium text-foreground pr-2 truncate">{row.dc}</div>
                {STEPS.map((step) => {
                  const cell = row.values[step]
                  return (
                    <button
                      key={step}
                      onClick={() => onSelect({ dc: row.dc, step, value: cell.value, status: cell.status })}
                      className={cn(
                        "rounded-lg py-3 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer",
                        cellBg(cell.status),
                      )}
                    >
                      <span className={cn("text-sm font-bold leading-none", cellText(cell.status))}>
                        {cell.value}
                      </span>
                      <span className={cn("text-[9px] font-semibold uppercase tracking-wide", cellText(cell.status))}>
                        {cell.status === "Critical" ? "Crit" : cell.status === "Watchlist" ? "Watch" : "OK"}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Legend</span>
            {(["Critical", "Watchlist", "Stable"] as StatusLevel[]).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded-sm", cellBg(s).split(" ")[0])} />
                <span className="text-[11px] text-muted-foreground">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
