"use client"

// Section 3 — District Execution Scoreboard
// Ranked list with execution score progress bars, metric columns, and
// a status badge per district. Feels like a field-ops performance management board.

import { ChevronRight, Medal } from "lucide-react"
import { districts, type DetailItem, type StatusType } from "./SEData"

function statusBadge(s: StatusType) {
  if (s === "Critical")  return "bg-red-100 text-red-700 border-red-200"
  if (s === "Behind")    return "bg-amber-100 text-amber-700 border-amber-200"
  if (s === "Watchlist") return "bg-blue-100 text-blue-700 border-blue-200"
  if (s === "On Track")  return "bg-emerald-100 text-emerald-700 border-emerald-200"
  return "bg-green-100 text-green-700 border-green-200"
}

function scoreColor(score: number) {
  if (score < 65) return "bg-red-400"
  if (score < 75) return "bg-amber-400"
  if (score < 85) return "bg-emerald-400"
  return "bg-green-500"
}

function rankMedal(rank: number) {
  if (rank === 1) return <Medal className="w-3.5 h-3.5 text-red-500" />
  if (rank === 5) return <Medal className="w-3.5 h-3.5 text-emerald-500" />
  if (rank === 6) return <Medal className="w-3.5 h-3.5 text-green-600" />
  return null
}

interface Props {
  onSelect: (item: DetailItem) => void
}

export default function SEDistrictScoreboard({ onSelect }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground">District Execution Scoreboard</p>
        <p className="text-xs text-muted-foreground mt-0.5">Field execution performance by district, store format, and operating workstream</p>
      </div>

      {/* column headers */}
      <div className="px-5 py-2 border-b border-border bg-muted/30">
        <div className="grid grid-cols-[1.8rem_2fr_1fr_1fr_1fr_1fr_1fr_5rem_2rem] gap-3 items-center">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">#</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">District</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-right">Score</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-right">Cycle Time</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-right">Tasks OD</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-right">Display</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase text-right">Inv. Acc.</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Status</span>
          <span />
        </div>
      </div>

      {/* rows */}
      <div className="divide-y divide-border">
        {districts.map((d, idx) => {
          const score = parseInt(d.meta["Execution Score"])
          const displayPct = parseInt(d.meta["Display Readiness"])
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d)}
              className="w-full px-5 py-3 grid grid-cols-[1.8rem_2fr_1fr_1fr_1fr_1fr_1fr_5rem_2rem] gap-3 items-center text-left hover:bg-muted/50 transition-colors group cursor-pointer"
            >
              {/* rank */}
              <span className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-muted-foreground">{idx + 1}</span>
                {rankMedal(idx + 1)}
              </span>

              {/* district name + issue */}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{d.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{d.meta["Stores"]} stores · {d.rootCauses[0].slice(0, 38)}{d.rootCauses[0].length > 38 ? "…" : ""}</p>
              </div>

              {/* execution score + bar */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-foreground">{score}</span>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${scoreColor(score)}`} style={{ width: `${score}%` }} />
                </div>
              </div>

              {/* cycle time */}
              <p className="text-xs text-right text-foreground font-medium">{d.meta["Cycle Time"]}</p>

              {/* tasks overdue */}
              <p className="text-xs text-right font-semibold text-foreground">{d.meta["Tasks Overdue"]}</p>

              {/* display readiness */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-foreground">{displayPct}%</span>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${scoreColor(displayPct)}`} style={{ width: `${displayPct}%` }} />
                </div>
              </div>

              {/* inv accuracy */}
              <p className="text-xs text-right font-medium text-foreground">{d.meta["Inventory Accuracy"]}</p>

              {/* status badge */}
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border inline-block text-center ${statusBadge(d.status)}`}>
                {d.status}
              </span>

              {/* chevron */}
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
