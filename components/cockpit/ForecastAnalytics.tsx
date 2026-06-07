"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"

const accuracyData = [
  { cycle: "Jan W1", accuracy: 78.2, target: 88 },
  { cycle: "Jan W3", accuracy: 81.0, target: 88 },
  { cycle: "Feb W1", accuracy: 80.4, target: 88 },
  { cycle: "Feb W3", accuracy: 83.1, target: 88 },
  { cycle: "Mar W1", accuracy: 84.0, target: 88 },
  { cycle: "Mar W3", accuracy: 82.7, target: 88 },
  { cycle: "Apr W1", accuracy: 85.3, target: 88 },
  { cycle: "Apr W3", accuracy: 86.4, target: 88 },
]

const biasData = [
  { category: "Household", bias: 1.8 },
  { category: "Consumables", bias: -3.2 },
  { category: "Seasonal", bias: -9.6 },
  { category: "Party", bias: -5.1 },
  { category: "H&B", bias: 0.7 },
]

const revenueRisk = [
  { category: "Seasonal", value: "$3.8M", raw: 3.8, status: "Critical", stores: "52 stores" },
  { category: "Consumables", value: "$2.6M", raw: 2.6, status: "Critical", stores: "31 stores" },
  { category: "Party", value: "$1.9M", raw: 1.9, status: "Watchlist", stores: "24 stores" },
  { category: "Household", value: "$940K", raw: 0.94, status: "Stable", stores: "12 stores" },
  { category: "Health & Beauty", value: "$610K", raw: 0.61, status: "Stable", stores: "8 stores" },
]

const statusBadge: Record<string, string> = {
  Critical: "bg-rose-50 text-rose-700 border-rose-200",
  Watchlist: "bg-amber-50 text-amber-700 border-amber-200",
  Stable: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  )
}

const BiasTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs" style={{ color: p.value >= 0 ? "#2d7a4f" : "#dc2626" }}>
          Bias: {p.value > 0 ? "+" : ""}{p.value}%
        </p>
      ))}
    </div>
  )
}

export default function ForecastAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left: Accuracy Trend */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Forecast Accuracy Trend</p>
          <p className="text-xs text-muted-foreground mt-0.5">Weighted forecast accuracy by planning cycle</p>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={accuracyData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="cycle"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[75, 92]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              width={38}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              name="Forecast Accuracy"
              stroke="#2d7a4f"
              strokeWidth={2}
              dot={{ r: 3, fill: "#2d7a4f", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Insight pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-[11px] text-emerald-700 font-medium">
            Best category: Household · 91.2%
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-md text-[11px] text-rose-700 font-medium">
            Largest deterioration: Seasonal · -5.4 pts
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-700 font-medium">
            Variance: Moderate
          </span>
        </div>
      </div>

      {/* Right col */}
      <div className="flex flex-col gap-4">
        {/* Bias chart */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Forecast Bias by Category</p>
            <p className="text-xs text-muted-foreground mt-0.5">Negative values indicate under-forecasting</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={biasData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={34}
              />
              <Tooltip content={<BiasTooltip />} />
              <ReferenceLine y={0} stroke="var(--border)" />
              <Bar dataKey="bias" radius={[3, 3, 0, 0]}>
                {biasData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.bias >= 0 ? "#2d7a4f" : "#ef4444"}
                    fillOpacity={entry.bias >= 0 ? 0.7 : 0.75}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-2">
            Seasonal and Party are the primary drivers of under-forecast exposure.
          </p>
        </div>

        {/* Revenue at Risk */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-3 flex-1">
          <div>
            <p className="text-sm font-semibold text-foreground">Revenue at Risk Cockpit</p>
            <p className="text-xs text-muted-foreground mt-0.5">Risk concentration by category and horizon</p>
          </div>
          <div className="space-y-1.5">
            {revenueRisk.map(({ category, value, status, stores }, i) => (
              <div
                key={category}
                className="flex items-center gap-2 py-1.5 border-b border-border last:border-0"
              >
                <span className="text-[11px] font-medium text-muted-foreground w-4 shrink-0">{i + 1}</span>
                <span className="text-xs font-medium text-foreground flex-1 truncate">{category}</span>
                <span className="text-xs font-bold text-foreground tabular-nums w-14 text-right">{value}</span>
                <span
                  className={cn(
                    "text-[10px] font-semibold border px-1.5 py-0.5 rounded shrink-0 w-16 text-center",
                    statusBadge[status]
                  )}
                >
                  {status}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0 w-14 text-right">{stores}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
