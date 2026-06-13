"use client"

import { Bot, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DrawerPayload } from "./SKUData"

export type AgentStatus = "completed" | "routed" | "watchlist"

export interface AgentAction {
  id: string
  timestamp: string
  title: string
  sourceTab: string
  sourceTabId: string
  segment: string
  detected: string
  actionTaken: string
  status: AgentStatus
  drawer: DrawerPayload
}

const STATUS_CONFIG: Record<AgentStatus, { label: string; dot: string; badge: string; icon: typeof CheckCircle2 }> = {
  completed: {
    label: "Completed",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  routed: {
    label: "Routed for approval",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  watchlist: {
    label: "Watchlist",
    dot: "bg-orange-400",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    icon: AlertCircle,
  },
}

const SEGMENT_CHIP = "text-[10px] font-medium bg-primary/8 text-primary border border-primary/20 px-1.5 py-0.5 rounded-md"
const TAB_CHIP    = "text-[10px] font-medium bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded-md"

const agentActions: AgentAction[] = [
  {
    id: "ai-1",
    timestamp: "Today · 8:12 AM",
    title: "Classified 340 SKU families as Seasonal / Event",
    sourceTab: "AI-Driven SKU Segmentation",
    sourceTabId: "sku-segmentation",
    segment: "Seasonal / Event",
    detected: "Short selling window, seasonal demand spike, and limited post-event replenishment value",
    actionTaken: "Assigned segment and recommended pre-window push strategy",
    status: "completed",
    drawer: {
      title: "Classified 340 SKU families as Seasonal / Event",
      status: "completed",
      explanation: "AI detected a short selling window, seasonal demand velocity, and limited post-event value across 340 SKU families and autonomously assigned the Seasonal / Event segment.",
      signals: ["Short selling window signal", "Seasonal velocity acceleration", "Post-event inventory risk", "Historical markdown pattern"],
      sourceTabs: ["AI-Driven SKU Segmentation"],
      primarySourceTabId: "sku-segmentation",
      segment: "Seasonal / Event",
      segmentStrategy: "Pre-window push allocation with protected inventory before selling window opens",
      metrics: [
        { label: "SKU families classified", value: "340" },
        { label: "Segment assigned", value: "Seasonal / Event" },
        { label: "Strategy applied", value: "Pre-window push" },
      ],
      businessImpact: "Ensures the correct planning strategy is applied before the selling window, protecting $3.8M in seasonal revenue.",
      recommendedAction: "Confirm segment assignments and review pre-window push allocation recommendation.",
      humanApprovalRequired: false,
      guardrailNote: "Classification is within autonomous guardrails — no revenue commitment was made without approval.",
    },
  },
  {
    id: "ai-2",
    timestamp: "Today · 8:15 AM",
    title: "Detected under-forecast bias in Seasonal / Event SKUs",
    sourceTab: "Demand Planning",
    sourceTabId: "demand",
    segment: "Seasonal / Event",
    detected: "Actual velocity running 8.9% above baseline forecast",
    actionTaken: "Created forecast uplift recommendation and linked it to protected allocation",
    status: "routed",
    drawer: {
      title: "Detected under-forecast bias in Seasonal / Event SKUs",
      status: "routed",
      explanation: "AI detected that Seasonal / Event SKUs are running 8.9% above baseline forecast, indicating meaningful under-forecast bias that threatens allocation accuracy before the selling window.",
      signals: ["Velocity delta +8.9% vs baseline", "Seasonal / Event segment classification", "Allocation lock deadline proximity", "Historical seasonal bias pattern"],
      sourceTabs: ["Demand Planning", "Inventory & Allocation"],
      primarySourceTabId: "demand",
      segment: "Seasonal / Event",
      segmentStrategy: "Forecast uplift + protected pre-window allocation",
      metrics: [
        { label: "Velocity delta", value: "+8.9% above forecast" },
        { label: "Revenue at risk", value: "$3.8M" },
        { label: "Recommendation", value: "Forecast uplift + allocation push" },
      ],
      businessImpact: "If not corrected, under-forecast bias will result in under-allocation to high-velocity stores ahead of the selling window.",
      recommendedAction: "Approve the forecast uplift and protected allocation recommendation in Demand Planning.",
      humanApprovalRequired: true,
      guardrailNote: "Uplift recommendation requires planner approval before allocation lock — high revenue exposure prevents autonomous action.",
    },
  },
  {
    id: "ai-3",
    timestamp: "Today · 8:18 AM",
    title: "Prioritized available inventory for high-risk Seasonal / Event stores",
    sourceTab: "Inventory & Allocation",
    sourceTabId: "inventory",
    segment: "Seasonal / Event",
    detected: "214 stores with stockout exposure and 72% allocation readiness",
    actionTaken: "Ranked store clusters by absorption capacity and service risk",
    status: "completed",
    drawer: {
      title: "Prioritized available inventory for high-risk Seasonal / Event stores",
      status: "completed",
      explanation: "AI identified 214 stores with active stockout exposure and only 72% allocation readiness across Seasonal / Event SKUs, then autonomously ranked store clusters by absorption capacity and service risk to inform prioritized allocation.",
      signals: ["214 stores with stockout exposure", "72% allocation readiness", "Store absorption capacity ranking", "Seasonal / Event segment priority"],
      sourceTabs: ["Inventory & Allocation"],
      primarySourceTabId: "inventory",
      segment: "Seasonal / Event",
      segmentStrategy: "Pre-window push allocation with service-risk store prioritization",
      metrics: [
        { label: "Stores with stockout exposure", value: "214" },
        { label: "Allocation readiness", value: "72%" },
        { label: "Store clusters ranked", value: "8 clusters" },
      ],
      businessImpact: "Store prioritization ensures available inventory flows to the highest-risk stores before the allocation lock.",
      recommendedAction: "Review ranked store clusters and approve pre-window push allocation.",
      humanApprovalRequired: true,
      guardrailNote: "Ranking was autonomous. Final allocation decision requires human approval due to revenue exposure.",
    },
  },
  {
    id: "ai-4",
    timestamp: "Today · 8:21 AM",
    title: "Flagged inbound constraint for Constrained / Exception SKUs",
    sourceTab: "Supplier & Inbound Flow",
    sourceTabId: "supplier-inbound",
    segment: "Constrained / Exception",
    detected: "43 at-risk POs and supplier fill-rate variance on priority SKUs",
    actionTaken: "Linked supplier risk to impacted allocation decisions",
    status: "watchlist",
    drawer: {
      title: "Flagged inbound constraint for Constrained / Exception SKUs",
      status: "watchlist",
      explanation: "AI detected 43 at-risk POs and fill-rate variance on supplier-limited priority SKUs in the Constrained / Exception segment and linked these constraints to active allocation decisions.",
      signals: ["43 at-risk POs", "Supplier fill-rate variance", "Constrained / Exception segment flag", "Allocation lock deadline proximity"],
      sourceTabs: ["Supplier & Inbound Flow", "Inventory & Allocation"],
      primarySourceTabId: "supplier-inbound",
      segment: "Constrained / Exception",
      segmentStrategy: "Human-reviewed fallback allocation with supplier risk surfaced",
      metrics: [
        { label: "At-risk POs", value: "43" },
        { label: "Fill-rate variance", value: "Present on priority SKUs" },
        { label: "Linked allocation decisions", value: "3 open approvals" },
      ],
      businessImpact: "Constrained inbound limits recovery options and may require partial allocation and SKU-level substitution.",
      recommendedAction: "Review Constrained / Exception fallback allocation and approve supplier-limited SKU handling.",
      humanApprovalRequired: true,
      guardrailNote: "Watchlist status — constraint is flagged but no allocation action was taken without human review.",
    },
  },
  {
    id: "ai-5",
    timestamp: "Today · 8:24 AM",
    title: "Linked DC capacity pressure to SKU segment priorities",
    sourceTab: "DC Capacity & Transportation",
    sourceTabId: "dc-capacity",
    segment: "Seasonal / Event + Consistent Replenishment",
    detected: "Savannah and Joliet capacity pressure affecting priority outbound flow",
    actionTaken: "Recommended wave re-sequencing for high-priority segment shipments",
    status: "completed",
    drawer: {
      title: "Linked DC capacity pressure to SKU segment priorities",
      status: "completed",
      explanation: "AI detected capacity pressure at Savannah and Joliet DCs that is directly affecting outbound flow for Seasonal / Event and Consistent Replenishment segments, and recommended wave re-sequencing to protect priority shipments.",
      signals: ["Savannah DC at 94% capacity", "Joliet DC at 91% capacity", "Seasonal / Event segment outbound priority", "Consistent Replenishment replenishment cycle risk"],
      sourceTabs: ["DC Capacity & Transportation"],
      primarySourceTabId: "dc-capacity",
      segment: "Seasonal / Event + Consistent Replenishment",
      segmentStrategy: "Wave re-sequencing to protect Seasonal / Event outbound flow before allocation lock",
      metrics: [
        { label: "DCs with capacity pressure", value: "Savannah, Joliet" },
        { label: "Priority segments affected", value: "Seasonal / Event, Consistent Replenishment" },
        { label: "Recommendation", value: "Wave re-sequencing" },
      ],
      businessImpact: "Capacity pressure threatens on-time delivery to 214 at-risk stores for Seasonal / Event SKUs.",
      recommendedAction: "Approve wave re-sequencing recommendation in DC Capacity & Transportation.",
      humanApprovalRequired: false,
      guardrailNote: "Re-sequencing recommendation is within autonomous planning guardrails. Physical execution requires DC manager confirmation.",
    },
  },
  {
    id: "ai-6",
    timestamp: "Today · 8:27 AM",
    title: "Identified Store Execution dependency for Promo / Merchant-Driven SKUs",
    sourceTab: "Store Execution",
    sourceTabId: "store-execution",
    segment: "Promo / Merchant-Driven",
    detected: "Display readiness below threshold for promo-related SKU families",
    actionTaken: "Flagged field execution dependency before allocation lock",
    status: "watchlist",
    drawer: {
      title: "Identified Store Execution dependency for Promo / Merchant-Driven SKUs",
      status: "watchlist",
      explanation: "AI detected that display readiness for Promo / Merchant-Driven SKU families is below threshold across a subset of stores, creating a field execution dependency that could make early allocation ineffective.",
      signals: ["Display readiness below threshold", "Promo / Merchant-Driven segment classification", "Allocation lock deadline proximity", "Store execution capacity constraint"],
      sourceTabs: ["Store Execution", "Inventory & Allocation"],
      primarySourceTabId: "store-execution",
      segment: "Promo / Merchant-Driven",
      segmentStrategy: "Delay full promo push pending display readiness confirmation",
      metrics: [
        { label: "Stores below display threshold", value: "Promo SKU families" },
        { label: "Segment", value: "Promo / Merchant-Driven" },
        { label: "Dependency", value: "Display readiness before allocation lock" },
      ],
      businessImpact: "Allocating before display readiness causes inventory to sit in backroom, degrading promo sell-through and wasting allocation capacity.",
      recommendedAction: "Approve the store execution dependency rule to delay promo push for unready stores.",
      humanApprovalRequired: true,
      guardrailNote: "Watchlist — dependency is flagged but no allocation decision was delayed without human approval.",
    },
  },
]

interface SKUAgentLogProps {
  onOpenDrawer: (payload: DrawerPayload) => void
  onGoToTab: (tab: string) => void
}

export default function SKUAgentLog({ onOpenDrawer, onGoToTab }: SKUAgentLogProps) {
  return (
    <section>
      {/* Section header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center shrink-0">
            <Bot className="w-3 h-3 text-primary-foreground" />
          </div>
          <p className="text-[13px] font-semibold text-foreground">AI Actions Completed</p>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed ml-7">
          Autonomous classification, detection, and routing actions completed across the cockpit within approved guardrails
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[9px] top-3 bottom-3 w-px bg-border" aria-hidden="true" />

        <div className="space-y-2">
          {agentActions.map((action) => {
            const cfg = STATUS_CONFIG[action.status]
            const Icon = cfg.icon
            return (
              <button
                key={action.id}
                onClick={() => onOpenDrawer(action.drawer)}
                className="relative w-full flex items-start gap-3 bg-card border border-border rounded-xl px-4 py-3.5 text-left hover:border-primary/40 hover:shadow-sm transition-all group pl-7"
              >
                {/* Status dot on timeline */}
                <span className={cn("absolute left-[5px] top-[18px] w-[9px] h-[9px] rounded-full ring-2 ring-background shrink-0", cfg.dot)} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-muted-foreground font-medium">{action.timestamp}</span>
                      <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-semibold border px-1.5 py-0.5 rounded-md", cfg.badge)}>
                        <Icon className="w-2.5 h-2.5" />
                        {cfg.label}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                  </div>

                  <p className="text-[12.5px] font-semibold text-foreground leading-snug mb-1.5">{action.title}</p>

                  <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                    <span className={TAB_CHIP}>{action.sourceTab}</span>
                    <span className={SEGMENT_CHIP}>{action.segment}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground/70">Detected: </span>{action.detected}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground/70">Action: </span>{action.actionTaken}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
