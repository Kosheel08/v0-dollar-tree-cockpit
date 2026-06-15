"use client"

import { useState } from "react"
import { Target, AlertTriangle, DollarSign, Store, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import SKUDetailDrawer from "./SKUDetailDrawer"
import type { DrawerPayload } from "./SKUData"

const kpiDrawers: DrawerPayload[] = [
  {
    title: "Forecast Accuracy — 86.4%",
    status: "stable",
    explanation: "Forecast accuracy is measured as weighted mean absolute percentage accuracy (MAPA) across all active demand plans. The current cycle is running at 86.4%, up +2.1 pts from the prior cycle — an improving trend but still below the 88% planning target.",
    signals: ["Current cycle: 86.4%", "+2.1 pts vs prior cycle", "Target: 88%", "Best segment: Consistent Replenishment · 91.2%"],
    sourceTabs: [{ label: "Demand Planning", id: "demand" }],
    primarySourceTabId: "demand",
    businessImpact: "Accuracy improvement is driven by better stable-SKU forecasting. Seasonal / Event still lags and is the primary driver of the remaining gap to target.",
    recommendedAction: "Focus accuracy improvement efforts on Seasonal / Event and Promo / Merchant-Driven SKUs before the next planning cycle.",
    humanApprovalRequired: false,
    metrics: [
      { label: "Current accuracy", value: "86.4%" },
      { label: "Prior cycle", value: "84.3% (–2.1 pts)" },
      { label: "Target", value: "88%" },
      { label: "Gap to target", value: "–1.6 pts" },
    ],
  },
  {
    title: "Forecast Bias — -4.8%",
    status: "watchlist",
    explanation: "A bias of -4.8% means the plan is systematically under-forecasting actual demand. The bias is not uniform — it is concentrated in Seasonal / Event (-9.6%) and Promo / Merchant-Driven (-5.1%) SKU segments, while Consistent Replenishment shows a slight positive bias (+1.8%).",
    signals: ["Overall bias: -4.8%", "Seasonal / Event: -9.6%", "Promo / Merchant-Driven: -5.1%", "Consistent Replenishment: +1.8%"],
    sourceTabs: [{ label: "Demand Planning", id: "demand" }],
    primarySourceTabId: "demand",
    businessImpact: "Under-forecast bias leads to under-allocation to high-velocity stores, increasing stockout risk and lost sales exposure.",
    recommendedAction: "Review uplift approvals for Seasonal / Event and Promo / Merchant-Driven SKUs in the System Actions & Human Approvals section.",
    humanApprovalRequired: true,
    metrics: [
      { label: "Overall bias", value: "-4.8%" },
      { label: "Seasonal / Event", value: "-9.6%" },
      { label: "Promo / Merchant-Driven", value: "-5.1%" },
      { label: "Treasure Hunt / Limited Buy", value: "-3.2%" },
    ],
  },
  {
    title: "Revenue at Risk — $12.4M",
    status: "critical",
    explanation: "$12.4M represents the projected lost sales exposure across flagged SKU families if no forecast intervention is made before the next allocation lock. The top five visible risks in the Demand Risk Matrix total approximately $9.85M — these represent the highest-priority rows. The remaining exposure is distributed across additional SKU families not shown in the summary table.",
    signals: ["Total exposure: $12.4M", "Top 5 risks: ~$9.85M", "86 high-exposure SKU families", "Allocation lock approaching"],
    sourceTabs: [{ label: "Demand Planning", id: "demand" }],
    primarySourceTabId: "demand",
    businessImpact: "Revenue at risk is projected lost sales exposure — not guaranteed loss. Approving forecast uplifts and allocation corrections is expected to protect the majority of this exposure.",
    recommendedAction: "Address P1 rows in the Demand Risk Matrix and approve the Seasonal / Event forecast uplift before allocation lock.",
    humanApprovalRequired: true,
    metrics: [
      { label: "Total revenue at risk", value: "$12.4M" },
      { label: "Top 5 visible risks", value: "~$9.85M" },
      { label: "High-exposure SKU families", value: "86" },
      { label: "P1 risks", value: "$6.4M (Seasonal + CR)" },
    ],
  },
  {
    title: "Service Risk — 138 Stores",
    status: "watchlist",
    explanation: "138 stores are projected to face stockout exposure within the 8-week planning horizon if current forecast bias is not corrected. This is store-level exposure — it does not represent the full chain impact, but rather the subset of stores with the highest combination of forecast error and insufficient projected inventory.",
    signals: ["138 stores at projected stockout exposure", "8-week horizon", "Bias-driven under-allocation", "Concentrated in Southeast and Midwest"],
    sourceTabs: [{ label: "Demand Planning", id: "demand" }, { label: "Inventory & Allocation", id: "inventory" }],
    primarySourceTabId: "demand",
    businessImpact: "Store-level stockout risk translates directly to lost sales and reduced customer experience at affected locations.",
    recommendedAction: "Review store-level exposure in Inventory & Allocation after approving forecast corrections.",
    humanApprovalRequired: false,
    metrics: [
      { label: "Stores at risk", value: "138" },
      { label: "Horizon", value: "8 weeks" },
      { label: "Highest exposure region", value: "Southeast" },
      { label: "Segments driving risk", value: "Seasonal / Event, CR" },
    ],
  },
]

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
    interpretation: "Bias concentrated in Seasonal / Event and Promo / Merchant-Driven SKUs",
    Icon: AlertTriangle,
  },
  {
    title: "Revenue at Risk",
    value: "$12.4M",
    supporting: "86 high-exposure SKU families",
    badge: "Critical",
    badgeVariant: "critical",
    interpretation: "Projected lost sales if no forecast intervention",
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
  improving:     "bg-[var(--status-improving-bg)] text-[var(--status-improving)] border-[var(--status-improving)]/20",
  watchlist:     "bg-[var(--status-watchlist-bg)] text-amber-700 border-amber-200",
  critical:      "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border-[var(--status-critical)]/20",
  stable:        "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border-[var(--status-stable)]/20",
}

interface KpiCardsProps {
  onGoToTab?: (tab: string) => void
}

export default function KpiCards({ onGoToTab }: KpiCardsProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  function openDrawer(payload: DrawerPayload) {
    setDrawerPayload(payload)
    setDrawerOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ title, value, supporting, badge, badgeVariant, interpretation, Icon }, idx) => (
          <button
            key={title}
            onClick={() => openDrawer(kpiDrawers[idx])}
            className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 shadow-sm text-left hover:border-primary/40 hover:shadow-md transition-all group"
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
              <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border", badgeStyles[badgeVariant])}>
                {badge}
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-2.5">
              {interpretation}
            </p>
          </button>
        ))}
      </div>

      <SKUDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={() => { setDrawerOpen(false); setDrawerPayload(null) }}
        onGoToTab={(tabId) => { onGoToTab?.(tabId); setDrawerOpen(false) }}
      />
    </>
  )
}
