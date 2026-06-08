"use client"

import { cn } from "@/lib/utils"

const METRICS = [
  {
    title: "Network Throughput",
    value: "91.3%",
    subtext: "Of planned daily volume",
    status: "Watchlist" as const,
  },
  {
    title: "DCs at Capacity Risk",
    value: "3",
    subtext: "Savannah, Joliet, Chesapeake",
    status: "Critical" as const,
  },
  {
    title: "Outbound Cases",
    value: "1.84M",
    subtext: "Next 7 days",
    status: "High volume" as const,
  },
  {
    title: "Trailer Dwell",
    value: "18.6 hrs",
    subtext: "Target below 12 hrs",
    status: "Above target" as const,
  },
  {
    title: "On-Time Store Delivery",
    value: "87.9%",
    subtext: "Target 94%",
    status: "Below target" as const,
  },
  {
    title: "Expedite Cost Risk",
    value: "$640K",
    subtext: "If no re-sequencing",
    status: "Watchlist" as const,
  },
]

type MetricStatus = "Critical" | "Watchlist" | "High volume" | "Above target" | "Below target"

function railColor(status: MetricStatus) {
  if (status === "Critical") return "bg-[var(--status-critical)]"
  if (status === "Watchlist" || status === "Above target" || status === "Below target")
    return "bg-[var(--status-watchlist)]"
  return "bg-[var(--status-stable)]"
}

function dotColor(status: MetricStatus) {
  if (status === "Critical") return "text-[var(--status-critical)]"
  if (status === "Watchlist" || status === "Above target" || status === "Below target")
    return "text-[var(--status-watchlist)]"
  return "text-[var(--status-stable)]"
}

export default function DCTCommandStrip() {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-xl overflow-hidden border border-border">
      {METRICS.map((m) => (
        <div key={m.title} className="relative bg-card px-4 py-3.5 flex flex-col gap-1.5 overflow-hidden">
          {/* Left rail */}
          <div className={cn("absolute left-0 top-0 bottom-0 w-[3px]", railColor(m.status as MetricStatus))} />
          <p className="text-[11px] text-muted-foreground font-medium leading-tight">{m.title}</p>
          <p className="text-xl font-bold text-foreground leading-none tracking-tight">{m.value}</p>
          <div className="flex items-center gap-1">
            <span className={cn("text-[10px] font-semibold", dotColor(m.status as MetricStatus))}>
              {m.status}
            </span>
            <span className="text-[10px] text-muted-foreground">· {m.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
