"use client"

// Section 1 — Store Operating Pulse
// Compact horizontal strip of 6 operational metrics with left accent rails.
// Intentionally denser and smaller than the executive KPI cards used in prior tabs.

import { AlertTriangle, TrendingDown, Clock, Info, CheckCircle2 } from "lucide-react"
import type { StatusType } from "./SEData"

const pulseMetrics: { title: string; value: string; sub: string; status: StatusType }[] = [
  { title: "Execution Score",        value: "78.6",      sub: "Target 88",                        status: "Behind"    },
  { title: "Delivery-to-Shelf",      value: "31.4 hrs",  sub: "Target <24 hrs",                   status: "Behind"    },
  { title: "Backroom Aging",         value: "$4.3M",     sub: "Inventory >48 hrs in backroom",    status: "Critical"  },
  { title: "Task Completion",        value: "67%",       sub: "412 tasks overdue",                status: "Behind"    },
  { title: "Display Readiness",      value: "59%",       sub: "Promo setups complete",            status: "Critical"  },
  { title: "Inventory Accuracy",     value: "92.1%",     sub: "Cycle count variance",             status: "Watchlist" },
]

function railColor(s: StatusType) {
  if (s === "Critical")  return "bg-red-500"
  if (s === "Behind")    return "bg-amber-500"
  if (s === "Watchlist") return "bg-blue-400"
  if (s === "On Track")  return "bg-emerald-500"
  return "bg-green-500"
}

function badgeStyle(s: StatusType) {
  if (s === "Critical")  return "bg-red-100 text-red-700 border-red-200"
  if (s === "Behind")    return "bg-amber-100 text-amber-700 border-amber-200"
  if (s === "Watchlist") return "bg-blue-100 text-blue-700 border-blue-200"
  if (s === "On Track")  return "bg-emerald-100 text-emerald-700 border-emerald-200"
  return "bg-green-100 text-green-700 border-green-200"
}

function StatusIcon({ s }: { s: StatusType }) {
  const cls = "w-3 h-3"
  if (s === "Critical")  return <AlertTriangle className={`${cls} text-red-600`} />
  if (s === "Behind")    return <TrendingDown className={`${cls} text-amber-600`} />
  if (s === "Watchlist") return <Info className={`${cls} text-blue-600`} />
  if (s === "On Track")  return <Clock className={`${cls} text-emerald-600`} />
  return <CheckCircle2 className={`${cls} text-green-600`} />
}

export default function SEOperatingPulse() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {pulseMetrics.map((m) => (
        <div key={m.title} className="relative flex gap-0 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          {/* left accent rail */}
          <div className={`w-1 flex-shrink-0 ${railColor(m.status)}`} />
          <div className="flex-1 px-3 py-3">
            <p className="text-[10px] font-medium text-muted-foreground leading-tight mb-1.5">{m.title}</p>
            <p className="text-lg font-bold text-foreground leading-none mb-1">{m.value}</p>
            <p className="text-[10px] text-muted-foreground leading-tight mb-2">{m.sub}</p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${badgeStyle(m.status)}`}>
              <StatusIcon s={m.status} />{m.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
