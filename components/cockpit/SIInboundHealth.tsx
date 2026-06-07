"use client"

import { Truck, AlertTriangle, DollarSign, Clock, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const tiles = [
  {
    title: "Supplier OTIF",
    value: "82.7%",
    subtext: "Target 92%",
    status: "Below target",
    statusColor: "critical",
    icon: Truck,
  },
  {
    title: "At-Risk POs",
    value: "43",
    subtext: "18 critical · 25 watchlist",
    status: "Critical",
    statusColor: "critical",
    icon: AlertTriangle,
  },
  {
    title: "Inbound Value at Risk",
    value: "$9.8M",
    subtext: "Across 5 priority categories",
    status: "High",
    statusColor: "critical",
    icon: DollarSign,
  },
  {
    title: "Avg Lead-Time Variance",
    value: "+4.6 days",
    subtext: "Largest variance in Seasonal",
    status: "Watchlist",
    statusColor: "watchlist",
    icon: Clock,
  },
  {
    title: "ASN Accuracy",
    value: "88.1%",
    subtext: "Short shipments increasing",
    status: "Needs review",
    statusColor: "watchlist",
    icon: FileCheck,
  },
]

const statusStyles: Record<string, string> = {
  critical: "border-l-[var(--status-critical)] bg-[var(--status-critical-bg)]",
  watchlist: "border-l-[var(--status-watchlist)] bg-[var(--status-watchlist-bg)]",
  stable: "border-l-[var(--status-stable)] bg-[var(--status-stable-bg)]",
}

const badgeStyles: Record<string, string> = {
  critical: "bg-rose-100 text-rose-700",
  watchlist: "bg-amber-100 text-amber-700",
  stable: "bg-emerald-100 text-emerald-700",
}

const iconStyles: Record<string, string> = {
  critical: "text-rose-500",
  watchlist: "text-amber-500",
  stable: "text-emerald-600",
}

export default function SIInboundHealth() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {tiles.map((tile) => {
        const Icon = tile.icon
        return (
          <div
            key={tile.title}
            className={cn(
              "bg-card border border-border rounded-xl px-4 py-3.5 border-l-4 flex flex-col gap-2",
              statusStyles[tile.statusColor]
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-medium text-muted-foreground leading-tight">{tile.title}</p>
              <Icon className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", iconStyles[tile.statusColor])} />
            </div>
            <p className="text-xl font-bold text-foreground leading-none">{tile.value}</p>
            <div className="flex flex-col gap-1">
              <p className="text-[11px] text-muted-foreground">{tile.subtext}</p>
              <span
                className={cn(
                  "self-start text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                  badgeStyles[tile.statusColor]
                )}
              >
                {tile.status}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
