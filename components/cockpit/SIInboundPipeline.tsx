"use client"

import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface Stage {
  label: string
  pos: number
  value: string
  atRisk: number
  status: "Critical" | "Watchlist" | "Recovering" | "Stable"
}

const stages: Stage[] = [
  { label: "Supplier Commit",        pos: 126, value: "$32.4M", atRisk: 9,  status: "Watchlist"  },
  { label: "PO Confirmed",           pos: 104, value: "$28.7M", atRisk: 11, status: "Watchlist"  },
  { label: "ASN Received",           pos: 81,  value: "$21.3M", atRisk: 14, status: "Critical"   },
  { label: "In Transit",             pos: 62,  value: "$18.9M", atRisk: 7,  status: "Recovering" },
  { label: "DC Appt / Receipt",      pos: 48,  value: "$14.6M", atRisk: 2,  status: "Stable"     },
]

const statusBadge: Record<Stage["status"], string> = {
  Critical:   "bg-rose-100 text-rose-700",
  Watchlist:  "bg-amber-100 text-amber-700",
  Recovering: "bg-blue-100 text-blue-700",
  Stable:     "bg-emerald-100 text-emerald-700",
}

const statusAccent: Record<Stage["status"], string> = {
  Critical:   "border-rose-300",
  Watchlist:  "border-amber-300",
  Recovering: "border-blue-300",
  Stable:     "border-emerald-300",
}

const riskAccent: Record<Stage["status"], string> = {
  Critical:   "text-rose-600 font-semibold",
  Watchlist:  "text-amber-600 font-semibold",
  Recovering: "text-blue-600",
  Stable:     "text-emerald-600",
}

export default function SIInboundPipeline() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Inbound Flow Pipeline</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Purchase order flow from supplier commit through DC receipt
        </p>
      </div>

      {/* Pipeline stages */}
      <div className="flex flex-wrap items-stretch gap-0">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex items-stretch">
            {/* Stage card */}
            <div
              className={cn(
                "flex flex-col gap-2 px-4 py-3.5 border rounded-xl bg-background min-w-[140px] flex-1",
                statusAccent[stage.status]
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide leading-tight">
                  {stage.label}
                </p>
                <span
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0",
                    statusBadge[stage.status]
                  )}
                >
                  {stage.status}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-lg font-bold text-foreground leading-none">{stage.pos} POs</p>
                <p className="text-xs text-muted-foreground">{stage.value}</p>
              </div>
              <div className="flex items-center gap-1.5 mt-auto pt-1 border-t border-border">
                <span className={cn("text-xs", riskAccent[stage.status])}>{stage.atRisk} at risk</span>
              </div>
            </div>

            {/* Arrow connector */}
            {i < stages.length - 1 && (
              <div className="flex items-center px-1.5 text-muted-foreground shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Insight callout */}
      <div className="mt-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-semibold">Insight: </span>
          ASN gaps and short shipments are the largest upstream drivers of current allocation risk, especially for Seasonal Southeast and Consumables Midwest.
        </p>
      </div>
    </div>
  )
}
