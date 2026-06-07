import { Target, AlertTriangle, DollarSign, Store } from "lucide-react"
import { cn } from "@/lib/utils"

const kpis = [
  {
    title: "Forecast Accuracy",
    value: "86.4%",
    supporting: "+2.1 pts vs prior cycle",
    badge: "Improving",
    badgeVariant: "improving",
    interpretation: "Weighted accuracy across active demand plans",
    Icon: Target,
  },
  {
    title: "Forecast Bias",
    value: "-4.8%",
    supporting: "Under-forecasting demand",
    badge: "Action Needed",
    badgeVariant: "watchlist",
    interpretation: "Bias concentrated in Seasonal and Party",
    Icon: AlertTriangle,
  },
  {
    title: "Revenue at Risk",
    value: "$12.4M",
    supporting: "86 high-exposure SKUs",
    badge: "Critical",
    badgeVariant: "critical",
    interpretation: "Projected lost sales if no intervention",
    Icon: DollarSign,
  },
  {
    title: "Service Risk",
    value: "138 stores",
    supporting: "Projected stockout exposure",
    badge: "Watchlist",
    badgeVariant: "watchlist",
    interpretation: "Store-level exposure within 8-week horizon",
    Icon: Store,
  },
]

const badgeStyles: Record<string, string> = {
  improving: "bg-[var(--status-improving-bg)] text-[var(--status-improving)] border-[var(--status-improving)]/20",
  watchlist: "bg-[var(--status-watchlist-bg)] text-amber-700 border-amber-200",
  critical: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border-[var(--status-critical)]/20",
  stable: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border-[var(--status-stable)]/20",
}

export default function KpiCards() {
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
