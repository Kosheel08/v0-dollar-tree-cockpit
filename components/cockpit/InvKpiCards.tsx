import { Package, AlertTriangle, Warehouse, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

const kpis = [
  {
    title: "Available to Allocate",
    value: "$48.6M",
    supporting: "Across 5 priority categories",
    badge: "Constrained",
    badgeVariant: "critical",
    interpretation: "Sellable inventory available for allocation within 4-week horizon",
    Icon: Package,
  },
  {
    title: "Stockout Exposure",
    value: "214 stores",
    supporting: "Projected within 14 days",
    badge: "Critical",
    badgeVariant: "critical",
    interpretation: "Highest exposure in Seasonal Southeast and Consumables Midwest",
    Icon: AlertTriangle,
  },
  {
    title: "Overstock Value",
    value: "$18.9M",
    supporting: "Above target weeks of supply",
    badge: "Rebalance",
    badgeVariant: "watchlist",
    interpretation: "Inventory available for potential transfer or markdown avoidance",
    Icon: Warehouse,
  },
  {
    title: "Allocation Readiness",
    value: "72%",
    supporting: "Ready before next allocation lock",
    badge: "Watchlist",
    badgeVariant: "watchlist",
    interpretation: "Open constraints include DC capacity, case-pack fit, and store receiving limits",
    Icon: ClipboardList,
  },
]

const badgeStyles: Record<string, string> = {
  improving: "bg-emerald-50 text-emerald-700 border-emerald-200",
  watchlist: "bg-amber-50 text-amber-700 border-amber-200",
  critical: "bg-rose-50 text-rose-700 border-rose-200",
  stable: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

export default function InvKpiCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map(({ title, value, supporting, badge, badgeVariant, interpretation, Icon }) => (
        <div
          key={title}
          className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-none">{title}</p>
            <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>

          <div>
            <p className="text-2xl font-bold text-foreground tracking-tight leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{supporting}</p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border",
                badgeStyles[badgeVariant]
              )}
            >
              {badge}
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-2.5">
            {interpretation}
          </p>
        </div>
      ))}
    </div>
  )
}
