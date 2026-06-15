"use client"

import { useState } from "react"
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
import { ChevronRight } from "lucide-react"
import SKUDetailDrawer from "./SKUDetailDrawer"
import type { DrawerPayload } from "./SKUData"

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
  { segment: "Consistent Replen.", bias: 1.8 },
  { segment: "Seasonal / Event",   bias: -9.6 },
  { segment: "Promo / Merch.",     bias: -5.1 },
  { segment: "Treasure Hunt",      bias: -3.2 },
  { segment: "Constrained",        bias: 0.7 },
]

// ─── drawer payloads ──────────────────────────────────────────────────────────

const chartDrawer: DrawerPayload = {
  title: "Forecast Accuracy Trend",
  status: "stable",
  explanation: "Forecast accuracy has improved consistently over the past four planning cycles, rising from 78.2% in January W1 to 86.4% in April W3. The target is 88%. Improvement is driven by better stable-SKU forecasting in Consistent Replenishment, while Seasonal / Event continues to lag and represents the largest remaining gap.",
  signals: [
    "Jan W1: 78.2% → Apr W3: 86.4%",
    "+8.2 pts improvement over the period",
    "Target: 88% (–1.6 pts remaining)",
    "Seasonal / Event is largest drag at –5.4 pts vs best",
  ],
  sourceTabs: [{ label: "Demand Planning", id: "demand" }],
  primarySourceTabId: "demand",
  businessImpact: "Each percentage point of accuracy improvement reduces unnecessary inventory and stockout exposure. Closing the remaining gap to 88% is primarily dependent on improving Seasonal / Event forecast logic.",
  recommendedAction: "Approve the Seasonal / Event forecast uplift to improve accuracy for the highest-risk segment.",
  humanApprovalRequired: false,
  metrics: [
    { label: "Current accuracy",  value: "86.4%" },
    { label: "Target",            value: "88%" },
    { label: "Gap to target",     value: "–1.6 pts" },
    { label: "Best segment",      value: "Consistent Replenishment · 91.2%" },
  ],
}

const chipDrawers: DrawerPayload[] = [
  {
    title: "Best Segment: Consistent Replenishment · 91.2%",
    status: "stable",
    explanation: "Consistent Replenishment SKUs achieve 91.2% forecast accuracy — the best performance across all five AI-defined segments. Stable demand patterns and predictable replenishment cycles make these SKUs the most reliable to forecast.",
    signals: ["Accuracy: 91.2%", "Stable demand pattern", "Positive forecast bias: +1.8%", "Consistent velocity signals"],
    sourceTabs: [{ label: "Demand Planning", id: "demand" }],
    primarySourceTabId: "demand",
    businessImpact: "Strong Consistent Replenishment accuracy anchors overall plan quality and supports reliable DC flow for high-frequency pantry and household SKUs.",
    recommendedAction: "No action required. Maintain current forecast logic for Consistent Replenishment.",
    humanApprovalRequired: false,
    metrics: [
      { label: "Forecast accuracy",  value: "91.2%" },
      { label: "Forecast bias",      value: "+1.8%" },
      { label: "Segment profile",    value: "Stable, high-frequency" },
    ],
  },
  {
    title: "Largest Gap: Seasonal / Event · –5.4 pts",
    status: "critical",
    explanation: "Seasonal / Event SKUs carry the largest accuracy gap at –5.4 points versus the best-performing segment. The primary driver is an under-forecast bias of –9.6% — velocity and promotion lift are consistently exceeding baseline assumptions during the selling window.",
    signals: ["Accuracy gap: –5.4 pts vs best segment", "Forecast bias: –9.6%", "Revenue at risk: $3.8M (Southeast)", "Selling window pressure"],
    sourceTabs: [{ label: "Demand Planning", id: "demand" }],
    primarySourceTabId: "demand",
    businessImpact: "The –9.6% under-forecast bias in Seasonal / Event SKUs is the single largest driver of revenue-at-risk exposure on this tab.",
    recommendedAction: "Approve the Seasonal / Event forecast uplift in the System Actions & Human Approvals section.",
    humanApprovalRequired: true,
    metrics: [
      { label: "Accuracy gap",    value: "–5.4 pts" },
      { label: "Forecast bias",   value: "–9.6%" },
      { label: "Revenue at risk", value: "$3.8M" },
    ],
  },
  {
    title: "Variance: Moderate",
    status: "watchlist",
    explanation: "Overall forecast variance is rated Moderate — driven primarily by Seasonal / Event and Promo / Merchant-Driven SKUs. Variance is expected to improve as the Seasonal / Event uplift is approved and analog forecasting is applied to Treasure Hunt / Limited Buy.",
    signals: ["Two under-forecast segments at material bias levels", "Promo / Merchant-Driven bias: –5.1%", "Treasure Hunt / Limited Buy bias: –3.2%", "Variance decreasing over recent cycles"],
    sourceTabs: [{ label: "Demand Planning", id: "demand" }],
    primarySourceTabId: "demand",
    businessImpact: "Moderate variance means plan confidence is sufficient for stable SKUs but intervention is needed for event-driven and promo categories before allocation lock.",
    recommendedAction: "Resolve P1 demand risk rows and approve pending uplifts to reduce variance before the next forecast lock.",
    humanApprovalRequired: false,
    metrics: [
      { label: "Variance rating",         value: "Moderate" },
      { label: "Segments contributing",   value: "Seasonal / Event, Promo / Merchant-Driven" },
      { label: "Expected direction",      value: "Improving (pending approvals)" },
    ],
  },
]

const biasDrawer: DrawerPayload = {
  title: "Forecast Bias by SKU Segment",
  status: "watchlist",
  explanation: "Forecast bias varies significantly across the five AI-defined SKU segments. Seasonal / Event (–9.6%) and Promo / Merchant-Driven (–5.1%) are under-forecast, meaning actual demand is running above the plan. Consistent Replenishment (+1.8%) and Constrained / Exception (+0.7%) show slight positive bias. Treasure Hunt / Limited Buy is slightly negative at –3.2% due to limited sell-through history.",
  signals: ["Seasonal / Event: –9.6%", "Promo / Merchant-Driven: –5.1%", "Treasure Hunt / Limited Buy: –3.2%", "Consistent Replenishment: +1.8%"],
  sourceTabs: [{ label: "Demand Planning", id: "demand" }],
  primarySourceTabId: "demand",
  businessImpact: "Concentrated under-forecast bias drives the majority of the $12.4M revenue-at-risk figure. Approving uplifts for the two most biased segments addresses most of the exposure.",
  recommendedAction: "Approve Seasonal / Event uplift and validate Promo / Merchant-Driven assumptions in the Human Approvals section.",
  humanApprovalRequired: true,
  metrics: [
    { label: "Seasonal / Event",             value: "–9.6%" },
    { label: "Promo / Merchant-Driven",       value: "–5.1%" },
    { label: "Treasure Hunt / Limited Buy",   value: "–3.2%" },
    { label: "Consistent Replenishment",      value: "+1.8%" },
    { label: "Constrained / Exception",       value: "+0.7%" },
  ],
}

// ─── custom tooltips ──────────────────────────────────────────────────────────

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

// ─── component ────────────────────────────────────────────────────────────────

interface ForecastAnalyticsProps {
  onGoToTab?: (tab: string) => void
}

export default function ForecastAnalytics({ onGoToTab }: ForecastAnalyticsProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  function openDrawer(payload: DrawerPayload) {
    setDrawerPayload(payload)
    setDrawerOpen(true)
  }
  function closeDrawer() {
    setDrawerOpen(false)
    setDrawerPayload(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Left: Accuracy Trend — spans 3 cols */}
        <button
          onClick={() => openDrawer(chartDrawer)}
          className="lg:col-span-3 bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4 text-left hover:border-primary/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">Forecast Accuracy Trend</p>
              <p className="text-xs text-muted-foreground mt-0.5">Weighted forecast accuracy by planning cycle</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={accuracyData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="cycle" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[75, 92]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} iconType="circle" iconSize={7} />
              <Line type="monotone" dataKey="accuracy" name="Forecast Accuracy" stroke="#2d7a4f" strokeWidth={2} dot={{ r: 3, fill: "#2d7a4f", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="target" name="Target (88%)" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>

          {/* Insight chips */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-border" onClick={(e) => e.stopPropagation()}>
            {[
              { label: "Best segment: Consistent Replenishment · 91.2%", style: "bg-emerald-50 border-emerald-200 text-emerald-700", drawer: chipDrawers[0] },
              { label: "Largest gap: Seasonal / Event · -5.4 pts",         style: "bg-rose-50 border-rose-200 text-rose-700",       drawer: chipDrawers[1] },
              { label: "Variance: Moderate",                                style: "bg-amber-50 border-amber-200 text-amber-700",    drawer: chipDrawers[2] },
            ].map(({ label, style, drawer }) => (
              <button
                key={label}
                onClick={(e) => { e.stopPropagation(); openDrawer(drawer) }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-md text-[11px] font-medium hover:opacity-80 transition-opacity ${style}`}
              >
                {label}
              </button>
            ))}
          </div>
        </button>

        {/* Right: Bias chart — spans 2 cols */}
        <button
          onClick={() => openDrawer(biasDrawer)}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-3 text-left hover:border-primary/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">Forecast Bias by SKU Segment</p>
              <p className="text-xs text-muted-foreground mt-0.5">Negative values indicate under-forecasting</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={biasData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="segment" tick={{ fontSize: 9.5, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={34} />
              <Tooltip content={<BiasTooltip />} />
              <ReferenceLine y={0} stroke="var(--border)" />
              <Bar dataKey="bias" radius={[3, 3, 0, 0]}>
                {biasData.map((entry, i) => (
                  <Cell key={i} fill={entry.bias >= 0 ? "#2d7a4f" : "#ef4444"} fillOpacity={entry.bias >= 0 ? 0.7 : 0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-2">
            Seasonal / Event and Promo / Merchant-Driven are the primary drivers of under-forecast exposure.
          </p>
        </button>
      </div>

      <SKUDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={closeDrawer}
        onGoToTab={(tabId) => { onGoToTab?.(tabId); closeDrawer() }}
      />
    </>
  )
}
