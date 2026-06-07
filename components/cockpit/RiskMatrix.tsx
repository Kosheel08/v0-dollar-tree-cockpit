import { cn } from "@/lib/utils"

const riskRows = [
  {
    priority: "P1",
    category: "Seasonal",
    region: "Southeast",
    accuracy: "74.2%",
    bias: "-11.4%",
    revenue: "$3.8M",
    impact: "52 stores",
    action: "Override review + replenishment check",
    status: "Critical",
  },
  {
    priority: "P1",
    category: "Consumables",
    region: "Midwest",
    accuracy: "79.1%",
    bias: "-6.7%",
    revenue: "$2.6M",
    impact: "31 stores",
    action: "Increase near-term forecast",
    status: "Critical",
  },
  {
    priority: "P2",
    category: "Party",
    region: "Northeast",
    accuracy: "82.5%",
    bias: "-5.2%",
    revenue: "$1.9M",
    impact: "24 stores",
    action: "Validate promo assumptions",
    status: "Watchlist",
  },
  {
    priority: "P2",
    category: "Household",
    region: "Southwest",
    accuracy: "89.4%",
    bias: "+2.1%",
    revenue: "$940K",
    impact: "12 stores",
    action: "Monitor over-forecast",
    status: "Stable",
  },
  {
    priority: "P3",
    category: "Health & Beauty",
    region: "West",
    accuracy: "91.0%",
    bias: "+0.8%",
    revenue: "$610K",
    impact: "8 stores",
    action: "No action required",
    status: "Stable",
  },
]

const priorityBadge: Record<string, string> = {
  P1: "bg-rose-50 text-rose-700 border-rose-200",
  P2: "bg-amber-50 text-amber-700 border-amber-200",
  P3: "bg-slate-50 text-slate-600 border-slate-200",
}

const statusBadge: Record<string, string> = {
  Critical: "bg-rose-50 text-rose-700 border-rose-200",
  Watchlist: "bg-amber-50 text-amber-700 border-amber-200",
  Stable: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

export default function RiskMatrix() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Demand Risk Matrix</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Prioritized demand risks based on forecast error, bias, revenue exposure, and service impact
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted border-b border-border">
                {["Priority", "Category", "Region", "Forecast Acc.", "Bias", "Rev at Risk", "Service Impact", "Recommended Action", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap first:pl-5 last:pr-5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riskRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="px-3 py-2.5 pl-5">
                    <span
                      className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border",
                        priorityBadge[row.priority]
                      )}
                    >
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{row.category}</td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{row.region}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-medium text-foreground">{row.accuracy}</td>
                  <td className={cn("px-3 py-2.5 text-right tabular-nums font-semibold", row.bias.startsWith("-") ? "text-rose-600" : "text-emerald-700")}>
                    {row.bias}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-bold text-foreground">{row.revenue}</td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{row.impact}</td>
                  <td className="px-3 py-2.5 text-muted-foreground max-w-[180px]">{row.action}</td>
                  <td className="px-3 py-2.5 pr-5">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border whitespace-nowrap",
                        statusBadge[row.status]
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
