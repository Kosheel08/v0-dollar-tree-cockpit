"use client"

import { cn } from "@/lib/utils"

const dcRows = [
  { dc: "Savannah DC",       region: "Southeast", pos: 18, value: "$4.8M", appt: "76%", dock: "Tight",    risk: "Critical",  action: "Re-sequence appointments" },
  { dc: "Joliet DC",         region: "Midwest",   pos: 14, value: "$3.6M", appt: "81%", dock: "Tight",    risk: "Critical",  action: "Prioritize consumables receipts" },
  { dc: "Chesapeake DC",     region: "Northeast", pos: 9,  value: "$2.1M", appt: "87%", dock: "Moderate", risk: "Watchlist", action: "Confirm Party promo receipts" },
  { dc: "Marietta DC",       region: "Southwest", pos: 12, value: "$3.2M", appt: "93%", dock: "Open",     risk: "Rebalance", action: "Slow Household receipts" },
  { dc: "San Bernardino DC", region: "West",      pos: 7,  value: "$1.4M", appt: "96%", dock: "Open",     risk: "Stable",    action: "Maintain plan" },
  { dc: "Olive Branch DC",   region: "Central",   pos: 10, value: "$2.2M", appt: "89%", dock: "Moderate", risk: "Watchlist", action: "Monitor appointment backlog" },
]

const ltDrivers = [
  { driver: "Supplier production delay",     impact: "+2.1 days", pct: 100 },
  { driver: "Late ASN / documentation gap",  impact: "+1.4 days", pct: 67  },
  { driver: "DC appointment congestion",     impact: "+0.8 days", pct: 38  },
  { driver: "Carrier availability",          impact: "+0.6 days", pct: 29  },
  { driver: "Import handoff delay",          impact: "+0.4 days", pct: 19  },
]

const riskBadge: Record<string, string> = {
  Critical:  "bg-rose-100 text-rose-700",
  Watchlist: "bg-amber-100 text-amber-700",
  Rebalance: "bg-blue-100 text-blue-700",
  Stable:    "bg-emerald-100 text-emerald-700",
}

const dockBadge: Record<string, string> = {
  Tight:    "text-rose-600 font-semibold",
  Moderate: "text-amber-600",
  Open:     "text-emerald-600",
}

export default function SIDCReceiptReadiness() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Left — DC Receipt Readiness table */}
      <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">DC Receipt Readiness</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Receiving appointment, labor, and dock readiness for inbound volume
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {["DC", "Region", "POs", "Value", "Appt %", "Dock", "Risk", "Action"].map((h) => (
                  <th key={h} className="text-left pb-2.5 pr-3 font-semibold text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dcRows.map((row) => (
                <tr key={row.dc} className="hover:bg-muted/40 transition-colors">
                  <td className="py-2.5 pr-3 font-medium text-foreground whitespace-nowrap">{row.dc}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">{row.region}</td>
                  <td className="py-2.5 pr-3 text-foreground">{row.pos}</td>
                  <td className="py-2.5 pr-3 font-medium text-foreground">{row.value}</td>
                  <td className="py-2.5 pr-3 text-foreground">{row.appt}</td>
                  <td className={cn("py-2.5 pr-3 whitespace-nowrap", dockBadge[row.dock])}>{row.dock}</td>
                  <td className="py-2.5 pr-3">
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold", riskBadge[row.risk])}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right — Lead-Time Variance Drivers */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Lead-Time Variance Drivers</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Ranked by average impact on inbound ETA</p>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          {ltDrivers.map((d, i) => (
            <div key={d.driver} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                  <span className="text-xs text-foreground leading-tight">{d.driver}</span>
                </div>
                <span className="text-xs font-semibold text-foreground shrink-0">{d.impact}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden ml-6">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-border">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Documentation and appointment compliance are controllable drivers and should be addressed before the next allocation lock.
          </p>
        </div>
      </div>
    </div>
  )
}
