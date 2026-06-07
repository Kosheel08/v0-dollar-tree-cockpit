import { cn } from "@/lib/utils"

const rows = [
  {
    priority: "P1",
    category: "Seasonal",
    region: "Southeast",
    node: "Savannah DC",
    position: "Short $3.6M",
    positionSign: "short",
    wos: "2.1",
    storeExposure: "72 stores",
    financialImpact: "$2.8M at risk",
    action: "Allocate protected inventory + expedite inbound",
    status: "Critical",
  },
  {
    priority: "P1",
    category: "Consumables",
    region: "Midwest",
    node: "Joliet DC",
    position: "Short $2.4M",
    positionSign: "short",
    wos: "2.7",
    storeExposure: "58 stores",
    financialImpact: "$1.9M at risk",
    action: "Prioritize replenishment to high-velocity stores",
    status: "Critical",
  },
  {
    priority: "P2",
    category: "Party",
    region: "Northeast",
    node: "Chesapeake DC",
    position: "Short $1.1M",
    positionSign: "short",
    wos: "3.1",
    storeExposure: "31 stores",
    financialImpact: "$860K at risk",
    action: "Hold partial allocation pending promo confirmation",
    status: "Watchlist",
  },
  {
    priority: "P2",
    category: "Household",
    region: "Southwest",
    node: "Marietta DC",
    position: "Over $4.2M",
    positionSign: "over",
    wos: "5.6",
    storeExposure: "18 stores",
    financialImpact: "$720K carrying risk",
    action: "Transfer excess to Southeast demand pool",
    status: "Rebalance",
  },
  {
    priority: "P3",
    category: "Health & Beauty",
    region: "West",
    node: "San Bernardino DC",
    position: "Balanced",
    positionSign: "balanced",
    wos: "4.0",
    storeExposure: "9 stores",
    financialImpact: "$240K monitored",
    action: "Maintain current allocation",
    status: "Stable",
  },
]

const priorityBadge: Record<string, string> = {
  P1: "bg-rose-50 text-rose-700 border-rose-200",
  P2: "bg-amber-50 text-amber-700 border-amber-200",
  P3: "bg-slate-50 text-slate-600 border-slate-200",
}

const statusBadge: Record<string, string> = {
  Critical:  "bg-rose-50 text-rose-700 border-rose-200",
  Watchlist: "bg-amber-50 text-amber-700 border-amber-200",
  Rebalance: "bg-amber-50 text-amber-700 border-amber-200",
  Stable:    "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const positionColor: Record<string, string> = {
  short:    "text-rose-700 font-semibold",
  over:     "text-amber-700 font-semibold",
  balanced: "text-emerald-700 font-semibold",
}

export default function DcImbalanceMatrix() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">DC / Store Imbalance Matrix</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Prioritized inventory imbalances by node, region, category, and service impact
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted border-b border-border">
                {["Priority","Category","Region","Primary Node","Inv. Position","WOS","Store Exposure","Financial Impact","Recommended Action","Status"].map((h) => (
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
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-2.5 pl-5">
                    <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border", priorityBadge[row.priority])}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{row.category}</td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{row.region}</td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{row.node}</td>
                  <td className={cn("px-3 py-2.5 whitespace-nowrap tabular-nums", positionColor[row.positionSign])}>
                    {row.position}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-medium text-foreground">{row.wos}</td>
                  <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{row.storeExposure}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-foreground whitespace-nowrap">{row.financialImpact}</td>
                  <td className="px-3 py-2.5 text-muted-foreground max-w-[200px]">{row.action}</td>
                  <td className="px-3 py-2.5 pr-5">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border whitespace-nowrap", statusBadge[row.status])}>
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
