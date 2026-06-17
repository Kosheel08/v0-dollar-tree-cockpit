"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import SKUDetailDrawer from "./SKUDetailDrawer"
import type { DrawerPayload } from "./SKUData"

const riskRows = [
  {
    priority: "P1",
    segment: "Seasonal / Event",
    example: "Halloween décor",
    region: "Southeast",
    bias: "-11.4%",
    biasNeg: true,
    revenue: "$3.8M",
    stores: "52",
    aiRec: "Approve temporary forecast uplift",
    status: "Critical",
    drawer: {
      title: "Seasonal / Event · Halloween décor — Southeast",
      status: "critical",
      explanation: "Promotion lift and weather-driven demand exceeded baseline assumptions for Seasonal / Event SKUs in the Southeast. The forecast is running 11.4% below actual velocity, creating a $3.8M revenue exposure across 52 stores before the selling window closes.",
      signals: [
        "Forecast bias: –11.4% vs actual velocity",
        "52 stores with stockout exposure",
        "Selling window pressure — allocation lock approaching",
        "Historical seasonal bias pattern matches current signal",
      ],
      sourceTabs: [
        { label: "Demand Planning",      id: "demand"    },
        { label: "Inventory & Allocation", id: "inventory" },
        { label: "Store Execution",        id: "store-execution" },
      ],
      primarySourceTabId: "demand",
      segment: "Seasonal / Event",
      metrics: [
        { label: "Forecast bias",     value: "–11.4%" },
        { label: "Revenue at risk",   value: "$3.8M"  },
        { label: "Stores exposed",    value: "52"     },
        { label: "Human approval",    value: "Yes — high exposure + short window" },
      ],
      businessImpact: "Allocation may under-support high-velocity Southeast stores during the selling window, resulting in stockouts and lost sales.",
      recommendedAction: "Approve a temporary +12% forecast uplift for selected Southeast Seasonal / Event SKU families and send to Inventory & Allocation for protected push allocation.",
      humanApprovalRequired: true,
      guardrailNote: "AI created the uplift recommendation. No forecast or inventory change has been committed without planner approval.",
    } as DrawerPayload,
  },
  {
    priority: "P1",
    segment: "Consistent Replenishment",
    example: "Paper goods",
    region: "Midwest",
    bias: "-6.7%",
    biasNeg: true,
    revenue: "$2.6M",
    stores: "31",
    aiRec: "Increase near-term baseline",
    status: "Critical",
    drawer: {
      title: "Consistent Replenishment · Paper goods — Midwest",
      status: "critical",
      explanation: "Recent velocity acceleration across high-frequency pantry and household SKUs in the Midwest is outpacing the current baseline forecast. The 6.7% under-forecast bias threatens replenishment quantities and DC flow timing.",
      signals: [
        "Forecast bias: –6.7% vs actual velocity",
        "31 stores with near-term replenishment gap",
        "Recent velocity acceleration signal",
        "DC flow timing dependency",
      ],
      sourceTabs: [
        { label: "Demand Planning",            id: "demand"    },
        { label: "Inventory & Allocation",     id: "inventory" },
        { label: "DC Capacity & Transportation", id: "dc-capacity" },
      ],
      primarySourceTabId: "demand",
      segment: "Consistent Replenishment",
      metrics: [
        { label: "Forecast bias",    value: "–6.7%" },
        { label: "Revenue at risk",  value: "$2.6M" },
        { label: "Stores exposed",   value: "31"    },
        { label: "Human approval",   value: "Yes — impacts replenishment quantities and DC flow" },
      ],
      businessImpact: "Replenishment quantities may remain below near-term demand at 31 Midwest stores if the baseline is not adjusted.",
      recommendedAction: "Approve a +6% 4-week baseline forecast adjustment for selected Midwest Consistent Replenishment SKUs and notify Supply Planning.",
      humanApprovalRequired: true,
      guardrailNote: "No replenishment or DC flow change has been committed without approval.",
    } as DrawerPayload,
  },
  {
    priority: "P2",
    segment: "Promo / Merchant-Driven",
    example: "Party endcap",
    region: "Northeast",
    bias: "-5.2%",
    biasNeg: true,
    revenue: "$1.9M",
    stores: "24",
    aiRec: "Validate promo lift",
    status: "Watchlist",
    drawer: {
      title: "Promo / Merchant-Driven · Party endcap — Northeast",
      status: "watchlist",
      explanation: "Circular promotion timing shifted from the prior planning cycle and the expected promotion lift assumptions have not been confirmed by the merchant team. The current forecast may not reflect actual promo pull-through.",
      signals: [
        "Circular timing shifted vs prior cycle",
        "Promo lift assumption unvalidated",
        "24 stores with forecast uncertainty",
        "Merchant calendar confirmation required",
      ],
      sourceTabs: [
        { label: "Demand Planning", id: "demand"          },
        { label: "Store Execution", id: "store-execution" },
      ],
      primarySourceTabId: "demand",
      segment: "Promo / Merchant-Driven",
      metrics: [
        { label: "Forecast bias",    value: "–5.2%"  },
        { label: "Revenue at risk",  value: "$1.9M"  },
        { label: "Stores exposed",   value: "24"     },
        { label: "Human approval",   value: "Yes — merchant calendar confirmation required" },
      ],
      businessImpact: "If promo lift is not confirmed, stores may receive insufficient product for display execution, reducing sell-through during the promotion window.",
      recommendedAction: "Request merchant confirmation of the promo calendar and validate expected lift before the next forecast lock.",
      humanApprovalRequired: true,
      guardrailNote: "Watchlist status. No forecast or allocation action taken until merchant confirms promo timing.",
    } as DrawerPayload,
  },
  {
    priority: "P2",
    segment: "Treasure Hunt / Limited Buy",
    example: "Home goods",
    region: "Southwest",
    bias: "+2.1%",
    biasNeg: false,
    revenue: "$940K",
    stores: "12",
    aiRec: "Monitor over-forecast",
    status: "Stable",
    drawer: {
      title: "Treasure Hunt / Limited Buy · Home goods — Southwest",
      status: "stable",
      explanation: "Limited SKU sell-through history and inconsistent performance across analog items makes demand estimation uncertain. The slight positive bias (+2.1%) means the plan is currently over-forecasting, which presents a markdown risk if distribution is widened before sell-through data is available.",
      signals: [
        "Limited SKU history — sparse sell-through data",
        "Inconsistent analog item performance",
        "Positive bias: +2.1% (over-forecast)",
        "Markdown risk if over-allocated",
      ],
      sourceTabs: [
        { label: "Demand Planning",    id: "demand"    },
        { label: "Inventory & Allocation", id: "inventory" },
      ],
      primarySourceTabId: "demand",
      segment: "Treasure Hunt / Limited Buy",
      metrics: [
        { label: "Forecast bias",   value: "+2.1%"  },
        { label: "Revenue at risk", value: "$940K"  },
        { label: "Stores exposed",  value: "12"     },
        { label: "Human approval",  value: "No immediate approval — watchlist unless sell-through deteriorates" },
      ],
      businessImpact: "Over-forecasting limited-buy SKUs with sparse history can lead to excess inventory, forced markdowns, and margin impact.",
      recommendedAction: "Monitor sell-through before widening distribution. No immediate demand action required.",
      humanApprovalRequired: false,
      guardrailNote: "Watchlist only. No allocation or forecast change made. Review when sell-through data becomes available.",
    } as DrawerPayload,
  },
  {
    priority: "P3",
    segment: "Constrained / Exception",
    example: "Cleaning",
    region: "West",
    bias: "+0.8%",
    biasNeg: false,
    revenue: "$610K",
    stores: "8",
    aiRec: "No action required",
    status: "Stable",
    drawer: {
      title: "Constrained / Exception · Cleaning — West",
      status: "stable",
      explanation: "A small positive forecast bias (+0.8%) indicates the plan is slightly above actual velocity for these SKUs. Supply and execution data indicate low near-term risk. The SKUs are constrained due to supply-side factors, not demand uncertainty.",
      signals: [
        "Positive bias: +0.8% (minor over-forecast)",
        "Supply and execution data: low near-term risk",
        "Constrained due to supply factors, not demand",
        "Constrained / Exception segment classification",
      ],
      sourceTabs: [
        { label: "Demand Planning",       id: "demand"          },
        { label: "Supplier & Inbound Flow", id: "supplier-inbound" },
      ],
      primarySourceTabId: "demand",
      segment: "Constrained / Exception",
      metrics: [
        { label: "Forecast bias",   value: "+0.8%"  },
        { label: "Revenue at risk", value: "$610K"  },
        { label: "Stores exposed",  value: "8"      },
        { label: "Human approval",  value: "No"     },
      ],
      businessImpact: "Low near-term demand risk for these SKUs. Any exposure is supply-side, not demand-driven.",
      recommendedAction: "No immediate demand action required. Monitor via Supplier & Inbound Flow for supply-side risk.",
      humanApprovalRequired: false,
      guardrailNote: "No action taken. Supply constraint visibility is tracked in Supplier & Inbound Flow.",
    } as DrawerPayload,
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
  Stable:    "bg-emerald-50 text-emerald-700 border-emerald-200",
}

interface RiskMatrixProps {
  onGoToTab?: (tab: string) => void
}

export default function RiskMatrix({ onGoToTab }: RiskMatrixProps) {
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
      <section className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Demand Risk Matrix</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Top forecast risks by SKU segment, region, revenue exposure, and service impact
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted border-b border-border">
                {["Priority", "SKU Segment / Example", "Region", "Bias", "Revenue at Risk", "Stores Exposed", "AI Recommendation", "Status"].map((h) => (
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
                  onClick={() => openDrawer(row.drawer)}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <td className="px-3 py-3 pl-5">
                    <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border", priorityBadge[row.priority])}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-semibold text-foreground">{row.segment}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{row.example}</p>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{row.region}</td>
                  <td className={cn("px-3 py-3 tabular-nums font-semibold whitespace-nowrap", row.biasNeg ? "text-rose-600" : "text-emerald-700")}>
                    {row.bias}
                  </td>
                  <td className="px-3 py-3 tabular-nums font-bold text-foreground whitespace-nowrap">{row.revenue}</td>
                  <td className="px-3 py-3 tabular-nums text-muted-foreground whitespace-nowrap">{row.stores}</td>
                  <td className="px-3 py-3 text-muted-foreground max-w-[180px] leading-snug">{row.aiRec}</td>
                  <td className="px-3 py-3 pr-5">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border whitespace-nowrap", statusBadge[row.status])}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SKUDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={closeDrawer}
        onGoToTab={(tabId) => { onGoToTab?.(tabId); closeDrawer() }}
      />
    </>
  )
}
