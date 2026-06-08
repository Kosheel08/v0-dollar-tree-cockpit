"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"

const positionData = [
  { category: "Seasonal",      onHand: 18.4, allocated: 12.1, available: 6.3,  target: 22.0 },
  { category: "Consumables",   onHand: 26.8, allocated: 19.4, available: 7.4,  target: 30.0 },
  { category: "Party",         onHand: 14.6, allocated: 9.2,  available: 5.4,  target: 16.0 },
  { category: "Household",     onHand: 31.2, allocated: 18.8, available: 12.4, target: 27.0 },
  { category: "Health & Beauty",onHand: 21.5, allocated: 13.6, available: 7.9,  target: 22.0 },
]

const wosRows = [
  { category: "Seasonal",       current: 2.1, target: 3.8, status: "Critical" },
  { category: "Consumables",    current: 2.7, target: 3.5, status: "Critical" },
  { category: "Party",          current: 3.1, target: 3.4, status: "Watchlist" },
  { category: "Household",      current: 5.6, target: 4.2, status: "Overstock" },
  { category: "Health & Beauty",current: 4.0, target: 4.1, status: "Stable" },
]

const readinessChecks = [
  { label: "Demand plan locked",              status: "Complete" },
  { label: "Available inventory confirmed",   status: "Watchlist" },
  { label: "DC capacity verified",            status: "Watchlist" },
  { label: "Case-pack constraints reviewed",  status: "Complete" },
  { label: "Store receiving capacity checked",status: "At risk" },
  { label: "Allocation approval",             status: "Pending" },
]

const wosBadge: Record<string, string> = {
  Critical:  "bg-rose-50 text-rose-700 border-rose-200",
  Watchlist: "bg-amber-50 text-amber-700 border-amber-200",
  Overstock: "bg-amber-50 text-amber-700 border-amber-200",
  Stable:    "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const readinessDot: Record<string, string> = {
  Complete:  "bg-emerald-500",
  Watchlist: "bg-amber-400",
  "At risk": "bg-rose-500",
  Pending:   "bg-slate-400",
}

const readinessBadge: Record<string, string> = {
  Complete:  "text-emerald-700",
  Watchlist: "text-amber-700",
  "At risk": "text-rose-700",
  Pending:   "text-muted-foreground",
}

const PositionTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: ${p.value}M
        </p>
      ))}
    </div>
  )
}

export default function InvPositionCockpit() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left: Inventory Position */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Inventory Position by Category</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            On-hand, allocated, and available inventory across priority categories
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={positionData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }} barSize={14} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `$${v}M`}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={<PositionTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" iconSize={8} />
            <Bar dataKey="onHand"    name="On Hand"    fill="#2d7a4f" fillOpacity={0.85} radius={[3,3,0,0]} />
            <Bar dataKey="allocated" name="Allocated"  fill="#94a3b8" fillOpacity={0.7}  radius={[3,3,0,0]} />
            <Bar dataKey="available" name="Available"  fill="#f59e0b" fillOpacity={0.75} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Insight pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
          <span className="inline-flex items-center px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-md text-[11px] text-rose-700 font-medium">
            Largest shortage risk: Seasonal · $3.6M below target
          </span>
          <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-700 font-medium">
            Largest rebalance pool: Household · $4.2M above target
          </span>
          <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[11px] text-slate-700 font-medium">
            Highest allocation pressure: Consumables · 214 stores requesting flow
          </span>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-4">
        {/* Weeks of Supply Risk */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Weeks of Supply Risk</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Forward coverage vs. target service thresholds
            </p>
          </div>

          <div className="space-y-1">
            {wosRows.map((row) => (
              <div key={row.category} className="flex items-center gap-2 py-2 border-b border-border last:border-0">
                <span className="text-xs font-medium text-foreground flex-1 truncate">{row.category}</span>
                <span className="text-xs font-bold tabular-nums text-foreground w-10 text-right">{row.current}</span>
                <span className="text-[10px] text-muted-foreground w-14">/ {row.target} tgt</span>
                <span className={cn("text-[10px] font-semibold border px-1.5 py-0.5 rounded shrink-0", wosBadge[row.status])}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-2">
            Seasonal and Consumables are below forward coverage thresholds and should be prioritized for allocation.
          </p>
        </div>

        {/* Allocation Readiness Cockpit */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-3 flex-1">
          <div>
            <p className="text-sm font-semibold text-foreground">Allocation Readiness Cockpit</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Operational checks before allocation release
            </p>
          </div>

          <div className="space-y-1">
            {readinessChecks.map((check) => (
              <div key={check.label} className="flex items-center gap-2.5 py-1.5 border-b border-border last:border-0">
                <span className={cn("w-2 h-2 rounded-full shrink-0", readinessDot[check.status])} />
                <span className="text-xs text-foreground flex-1">{check.label}</span>
                <span className={cn("text-[11px] font-semibold shrink-0", readinessBadge[check.status])}>
                  {check.status}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-accent/60 border border-primary/20 rounded-lg px-3 py-2 mt-auto">
            <p className="text-[11px] font-semibold text-primary">Next allocation lock</p>
            <p className="text-xs text-foreground font-medium mt-0.5">Jun 10, 2026 · 5:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}
