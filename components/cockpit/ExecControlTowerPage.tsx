"use client"

import { useState, useRef } from "react"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Users,
  Zap,
  Package,
  BarChart2,
  Layers,
  Truck,
  Warehouse,
  Store,
  Bot,
  X,
  Bookmark,
  TrendingDown,
  Activity,
  Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { StatusLevel } from "./ECTData"

// ─── Types ────────────────────────────────────────────────────────────────────

interface DrawerPayload {
  title: string
  status: StatusLevel
  explanation: string
  sourceTabs: string[]
  primarySourceTabId: string
  metrics: { label: string; value: string }[]
  businessImpact: string
  recommendedAction: string
  decision?: string
  protectedValue?: string
  openModule?: string
  riskIfNotApproved?: string
  relatedNodes?: string[]
  trigger?: string
  dataSignals?: string[]
  whyNoApproval?: string
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { label: string; dot: string; badge: string }> = {
  critical:  { label: "Critical",   dot: "bg-[var(--status-critical)]",  badge: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/25"  },
  watchlist: { label: "Watchlist",  dot: "bg-[var(--status-watchlist)]", badge: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/25" },
  stable:    { label: "Stable",     dot: "bg-[var(--status-stable)]",    badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/25"          },
  behind:    { label: "Behind",     dot: "bg-[var(--status-watchlist)]", badge: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/25" },
}

function StatusDot({ status, size = "md" }: { status: string; size?: "sm" | "md" }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.stable
  return (
    <span className={cn(
      "rounded-full shrink-0",
      size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2",
      cfg.dot
    )} />
  )
}

function StatusBadge({ status, className }: { status: string; className?: string }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.stable
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
      cfg.badge,
      className
    )}>
      <StatusDot status={status} size="sm" />
      {cfg.label}
    </span>
  )
}

// ─── Value chain nodes (5 operating modules only) ────────────────────────────

const CHAIN_NODES = [
  {
    id: "demand",
    name: "Demand Planning",
    status: "critical",
    signal: "-4.8% forecast bias",
    valueTag: "$3.4M uplift + allocation decision",
    primaryIssue: "Seasonal / Event under-forecast",
    openLink: "Open Demand Planning",
    icon: BarChart2,
    tabId: "demand",
    drawer: {
      title: "Demand Planning",
      status: "critical" as StatusLevel,
      explanation: "Seasonal / Event demand is under-forecast by -4.8%, creating downstream allocation pressure. The system has flagged the bias and created an uplift recommendation, but planner approval is required before the June 30 lock.",
      sourceTabs: ["Demand Planning"],
      primarySourceTabId: "demand",
      metrics: [
        { label: "Forecast bias", value: "-4.8% (Seasonal / Event)" },
        { label: "Stores affected", value: "214" },
        { label: "Value at risk", value: "$3.4M" },
        { label: "Approval required", value: "Yes — uplift requires planner sign-off" },
      ],
      businessImpact: "Under-forecast bias in Seasonal / Event creates late-cycle allocation pressure with a narrowing recovery window before the selling period.",
      recommendedAction: "Approve the Seasonal / Event forecast uplift before the June 30 lock.",
      decision: "Approve Seasonal / Event forecast uplift and protected allocation",
      protectedValue: "$3.4M",
      openModule: "Demand Planning",
      riskIfNotApproved: "Allocation engine locks in under-forecast position for the full planning cycle.",
      relatedNodes: ["Demand Planning", "Inventory & Allocation"],
    },
  },
  {
    id: "inventory",
    name: "Inventory & Allocation",
    status: "critical",
    signal: "214 stores exposed",
    valueTag: "Protected allocation",
    primaryIssue: "Allocation readiness constrained",
    openLink: "Open Inventory & Allocation",
    icon: Package,
    tabId: "inventory",
    drawer: {
      title: "Inventory & Allocation",
      status: "critical" as StatusLevel,
      explanation: "Inventory is available at the network level, but allocation readiness is constrained by forecast uncertainty and inbound risk. 214 stores are exposed heading into the selling window.",
      sourceTabs: ["Inventory & Allocation"],
      primarySourceTabId: "inventory",
      metrics: [
        { label: "Available to allocate", value: "$48.6M" },
        { label: "Stores exposed", value: "214" },
        { label: "Allocation readiness", value: "72%" },
        { label: "Approval required", value: "Yes — protected allocation requires sign-off" },
      ],
      businessImpact: "Positioning inventory at the right stores before the lock is the single highest-leverage action before June 30.",
      recommendedAction: "Approve protected push allocation for high-risk Seasonal / Event stores.",
      decision: "Approve protected push allocation",
      protectedValue: "$3.4M combined",
      openModule: "Inventory & Allocation",
      riskIfNotApproved: "214 stores remain undersupplied heading into selling window.",
      relatedNodes: ["Demand Planning", "Inventory & Allocation"],
    },
  },
  {
    id: "supplier-inbound",
    name: "Supplier & Inbound Flow",
    status: "watchlist",
    signal: "43 at-risk POs",
    valueTag: "$1.6M expedite decision",
    primaryIssue: "Delayed Seasonal PO",
    openLink: "Open Supplier & Inbound Flow",
    icon: Truck,
    tabId: "supplier-inbound",
    drawer: {
      title: "Supplier & Inbound Flow",
      status: "watchlist" as StatusLevel,
      explanation: "GreenLeaf Seasonal Imports PO-78421 has slipped 7 days and may miss the Savannah DC receiving window. 43 at-risk POs are connected to downstream store exposure.",
      sourceTabs: ["Supplier & Inbound Flow"],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "Supplier OTIF", value: "82.7%" },
        { label: "At-risk POs", value: "43" },
        { label: "Combined exposure", value: "$2.7M" },
        { label: "Approval required", value: "Yes — expedite cost requires approval" },
      ],
      businessImpact: "Inbound risk not resolved early collapses into allocation shortfalls with no recovery time before the selling window.",
      recommendedAction: "Approve the expedite for GreenLeaf PO-78421 into Savannah DC.",
      decision: "Expedite delayed Seasonal / Event inbound PO into Savannah DC",
      protectedValue: "$1.6M",
      openModule: "Supplier & Inbound Flow",
      riskIfNotApproved: "42 stores miss Seasonal / Event inventory. Window closes permanently after June 28.",
      relatedNodes: ["Supplier & Inbound Flow", "DC Capacity & Transportation"],
    },
  },
  {
    id: "dc-capacity",
    name: "DC Capacity & Transportation",
    status: "critical",
    signal: "3 DCs at capacity risk",
    valueTag: "$1.2M wave change",
    primaryIssue: "Savannah / Joliet pressure",
    openLink: "Open DC Capacity & Transportation",
    icon: Warehouse,
    tabId: "dc-capacity",
    drawer: {
      title: "DC Capacity & Transportation",
      status: "critical" as StatusLevel,
      explanation: "Savannah DC is operating at 96% capacity with 22.4 hrs trailer dwell. Re-sequencing outbound waves to prioritize 72 high-risk Seasonal / Event stores protects $1.2M but may delay lower-priority replenishment.",
      sourceTabs: ["DC Capacity & Transportation"],
      primarySourceTabId: "dc-capacity",
      metrics: [
        { label: "Savannah DC capacity", value: "96%" },
        { label: "Joliet DC capacity", value: "93%" },
        { label: "DCs at risk", value: "3 (Savannah, Joliet, Chesapeake)" },
        { label: "Approval required", value: "Yes — operational tradeoff" },
      ],
      businessImpact: "DC bottlenecks at Savannah and Joliet are compressing delivery windows for Seasonal / Event SKUs across 72 stores.",
      recommendedAction: "Approve the Savannah outbound wave re-sequencing before the next outbound window.",
      decision: "Re-sequence Savannah outbound waves",
      protectedValue: "$1.2M",
      openModule: "DC Capacity & Transportation",
      riskIfNotApproved: "72 stores miss priority delivery window. Savannah pressure compounds through cycle.",
      relatedNodes: ["DC Capacity & Transportation", "Store Execution"],
    },
  },
  {
    id: "store-execution",
    name: "Store Execution",
    status: "behind",
    signal: "$4.3M aged in backroom",
    valueTag: "$1.8M field action",
    primaryIssue: "Backroom and display execution gaps",
    openLink: "Open Store Execution",
    icon: Store,
    tabId: "store-execution",
    drawer: {
      title: "Store Execution",
      status: "critical" as StatusLevel,
      explanation: "126 stores have Seasonal / Event and Promo inventory delivered but not processed to shelf. $4.3M is aging in backrooms. Display readiness sits at 59% across the network.",
      sourceTabs: ["Store Execution"],
      primarySourceTabId: "store-execution",
      metrics: [
        { label: "Backroom aging >48 hrs", value: "$4.3M" },
        { label: "Stores affected", value: "126" },
        { label: "Delivery-to-shelf cycle", value: "31.4 hrs (target 20 hrs)" },
        { label: "Display readiness", value: "59% network average" },
      ],
      businessImpact: "Every hour of backroom aging during the selling window reduces effective sell-through. Field labor reprioritization is the fastest recovery lever.",
      recommendedAction: "Approve field action for backroom aging clearance and display setup.",
      decision: "Clear backroom aging and display setup backlog",
      protectedValue: "$1.8M",
      openModule: "Store Execution",
      riskIfNotApproved: "$1.8M remains unavailable to customers during the selling window.",
      relatedNodes: ["Store Execution"],
    },
  },
]

const RISK_PATH_IDS = new Set(["demand", "inventory", "supplier-inbound", "dc-capacity", "store-execution"])

// ─── Priority decisions ───────────────────────────────────────────────────────

const PRIORITY_DECISIONS = [
  {
    id: "pd-1",
    rank: 1,
    title: "Approve Seasonal / Event forecast uplift and protected allocation",
    sourceModules: "Demand Planning + Inventory & Allocation",
    primarySourceTabId: "demand",
    segment: "Seasonal / Event",
    valueProtected: "$3.4M",
    storesImpacted: "72 stores",
    urgency: "June 30 · 5:00 PM",
    owner: "Demand Planning + Allocation",
    whyApproval: "Forecast change and constrained allocation tradeoff require planner sign-off.",
    primaryLabel: "Approve",
    secondaryLabel: "Review Rationale",
    openModuleLabel: "Open Demand Planning",
    openModuleTabId: "demand",
    dependencyTag: "Demand → Inventory",
    riskIfNotApproved: "Allocation engine locks in under-forecast position for the full planning cycle.",
    decisionRationale: "The system detected -4.8% Seasonal / Event under-forecast bias and ranked 72 high-risk stores for protected push allocation. Approving before the June 30 lock allows the allocation engine to reposition inventory, protecting an estimated $3.4M in directional seasonal revenue.",
    relatedNodes: ["Demand Planning", "Inventory & Allocation"],
  },
  {
    id: "pd-2",
    rank: 2,
    title: "Clear backroom aging and display setup backlog",
    sourceModules: "Store Execution",
    primarySourceTabId: "store-execution",
    segment: "Seasonal / Event + Promo / Merchant-Driven",
    valueProtected: "$1.8M",
    storesImpacted: "126 stores",
    urgency: "48 hours",
    owner: "Field Operations",
    whyApproval: "Requires field labor reprioritization and district manager action.",
    primaryLabel: "Approve Field Action",
    secondaryLabel: "Review Rationale",
    openModuleLabel: "Open Store Execution",
    openModuleTabId: "store-execution",
    dependencyTag: "Store → Shelf",
    riskIfNotApproved: "$1.8M remains unavailable to customers during the selling window.",
    decisionRationale: "126 stores have Seasonal / Event and Promo / Merchant-Driven inventory delivered but not processed to shelf. $4.3M is aging in backrooms across District 104 (Atlanta Metro) and District 147 (Philadelphia). Prioritizing backroom-to-shelf execution before the selling window is the fastest recovery lever.",
    relatedNodes: ["Store Execution"],
  },
  {
    id: "pd-3",
    rank: 3,
    title: "Expedite delayed Seasonal / Event inbound PO into Savannah DC",
    sourceModules: "Supplier & Inbound Flow",
    primarySourceTabId: "supplier-inbound",
    segment: "Seasonal / Event",
    valueProtected: "$1.6M",
    storesImpacted: "42 stores",
    urgency: "Next 24 hours",
    owner: "Inbound Planning",
    whyApproval: "Expedite cost and inbound recovery tradeoff require approval.",
    primaryLabel: "Approve Expedite",
    secondaryLabel: "Review Rationale",
    openModuleLabel: "Open Supplier & Inbound Flow",
    openModuleTabId: "supplier-inbound",
    dependencyTag: "Supplier → DC",
    riskIfNotApproved: "42 stores miss Seasonal / Event inventory. Window closes permanently after June 28.",
    decisionRationale: "GreenLeaf Seasonal Imports PO-78421 has slipped 7 days and may miss the Savannah DC receiving window before the June 30 allocation lock. Expedite cost requires management approval.",
    relatedNodes: ["Supplier & Inbound Flow", "DC Capacity & Transportation"],
  },
  {
    id: "pd-4",
    rank: 4,
    title: "Re-sequence Savannah outbound waves",
    sourceModules: "DC Capacity & Transportation",
    primarySourceTabId: "dc-capacity",
    segment: "Seasonal / Event",
    valueProtected: "$1.2M",
    storesImpacted: "72 stores",
    urgency: "Next 24 hours",
    owner: "DC Operations + Transportation",
    whyApproval: "Operational tradeoff may delay lower-priority shipments.",
    primaryLabel: "Approve Wave Change",
    secondaryLabel: "Review Rationale",
    openModuleLabel: "Open DC Capacity & Transportation",
    openModuleTabId: "dc-capacity",
    dependencyTag: "DC → Transportation",
    riskIfNotApproved: "72 stores miss priority delivery window. Savannah pressure compounds through cycle.",
    decisionRationale: "Savannah DC is operating at 96% capacity with 22.4 hrs trailer dwell. Re-sequencing outbound waves to prioritize 72 high-risk Seasonal / Event stores protects $1.2M in estimated delivery value but may delay lower-priority replenishment shipments.",
    relatedNodes: ["DC Capacity & Transportation"],
  },
  {
    id: "pd-5",
    rank: 5,
    title: "Approve constrained substitute recovery",
    sourceModules: "Supplier & Inbound Flow + Inventory & Allocation",
    primarySourceTabId: "supplier-inbound",
    segment: "Constrained / Exception",
    valueProtected: "$700K",
    storesImpacted: "31 stores",
    urgency: "Before June 30 lock",
    owner: "Supplier Management + Inventory Planning",
    whyApproval: "Substitution affects supplier commitments, allocation, and merchandising.",
    primaryLabel: "Approve Recovery",
    secondaryLabel: "Review Rationale",
    openModuleLabel: "Open Supplier & Inbound Flow",
    openModuleTabId: "supplier-inbound",
    dependencyTag: "Supplier → Inventory",
    riskIfNotApproved: "31 Midwest stores below replenishment threshold for the cycle.",
    decisionRationale: "ValuePack Consumables PO-78104 shipped at 82% fill versus 96% expected, creating a replenishment gap at 31 Midwest stores. Using substitute SKUs or alternative supplier recovery closes the gap but requires cross-functional approval.",
    relatedNodes: ["Supplier & Inbound Flow", "Inventory & Allocation"],
  },
]

// ─── System actions ───────────────────────────────────────────────────────────

const SYSTEM_ACTIONS = [
  {
    id: "sa-1",
    title: "Classified SKU families into five operating segments",
    sourceModule: "SKU Strategy Segmentation",
    sourceTabId: "sku-segmentation",
    segment: "All Segments",
    systemAction: "Assigned SKU families to fit-for-purpose planning and fulfillment strategies",
    status: "completed" as const,
    drawer: {
      title: "Classified SKU families into five operating segments",
      status: "stable" as StatusLevel,
      explanation: "The system analyzed 2,180 SKU families using behavior, merchant intent, history depth, store absorption, and supply constraints. Each family was assigned to one of five planning segments with a fit-for-purpose strategy.",
      sourceTabs: ["SKU Strategy Segmentation"],
      primarySourceTabId: "sku-segmentation",
      metrics: [
        { label: "SKU families analyzed", value: "2,180" },
        { label: "Segments assigned", value: "5" },
        { label: "Require human review", value: "174" },
        { label: "Approval required", value: "No — within guardrails" },
      ],
      businessImpact: "Segmentation-led planning enables fit-for-purpose logic across the cockpit. Without it, every SKU defaults to the same replenishment and allocation logic.",
      recommendedAction: "Open the SKU Strategy Segmentation module to review segment assignments.",
      trigger: "Planning cycle start · Jun 6, 2026",
      dataSignals: ["SKU behavior analysis", "Merchant intent signals", "History depth scoring", "Store absorption data", "Supply constraint flags"],
      whyNoApproval: "SKU classification within defined segment rules operates within approved guardrails. No individual classification requires human sign-off.",
    },
  },
  {
    id: "sa-2",
    title: "Detected Seasonal / Event under-forecast bias",
    sourceModule: "Demand Planning",
    sourceTabId: "demand",
    segment: "Seasonal / Event",
    systemAction: "Created forecast uplift recommendation and linked it to revenue-at-risk",
    status: "completed" as const,
    drawer: {
      title: "Detected Seasonal / Event under-forecast bias",
      status: "critical" as StatusLevel,
      explanation: "The system detected a persistent -4.8% forecast bias in Seasonal / Event SKU families, comparing rolling actuals against current plan. The bias was linked to downstream allocation shortfalls at 214 stores and an estimated $3.4M in protected value if the uplift is approved before June 30.",
      sourceTabs: ["Demand Planning", "SKU Strategy Segmentation"],
      primarySourceTabId: "demand",
      metrics: [
        { label: "Forecast bias detected", value: "-4.8% (Seasonal / Event)" },
        { label: "Stores affected", value: "214" },
        { label: "Value at risk", value: "$3.4M" },
        { label: "Approval required", value: "Yes — uplift requires planner sign-off" },
      ],
      businessImpact: "Under-forecast bias in Seasonal / Event creates late-cycle allocation pressure with a narrowing recovery window before the selling period.",
      recommendedAction: "Approve the Seasonal / Event forecast uplift in the Demand Planning module before June 30.",
      trigger: "Rolling bias detection · Jun 7 · 6:14 AM",
      dataSignals: ["Rolling actual vs plan comparison", "Seasonal velocity acceleration", "Segment bias pattern", "Downstream allocation impact model"],
      whyNoApproval: "Bias detection is autonomous. The uplift recommendation was created but not applied — it requires planner approval before the allocation lock.",
    },
  },
  {
    id: "sa-3",
    title: "Ranked store clusters by absorption capacity",
    sourceModule: "Inventory & Allocation",
    sourceTabId: "inventory",
    segment: "Seasonal / Event",
    systemAction: "Prioritized high-risk stores for protected allocation",
    status: "completed" as const,
    drawer: {
      title: "Ranked store clusters by absorption capacity",
      status: "stable" as StatusLevel,
      explanation: "The system scored all stores in the Seasonal / Event allocation pool by absorption capacity — combining sales velocity, backroom capacity, display readiness, and inbound timing. High-risk stores were ranked for protected push allocation before the June 30 lock.",
      sourceTabs: ["Inventory & Allocation", "Demand Planning"],
      primarySourceTabId: "inventory",
      metrics: [
        { label: "Stores ranked", value: "214" },
        { label: "High-risk tier", value: "72 stores" },
        { label: "Value protected if approved", value: "$3.4M" },
        { label: "Approval required", value: "Yes — protected allocation requires sign-off" },
      ],
      businessImpact: "Ranking by absorption capacity ensures that inventory reaches the stores most likely to sell it, not just the stores nearest to the DC.",
      recommendedAction: "Approve the protected push allocation in the Inventory & Allocation module.",
      trigger: "Allocation scoring run · Jun 7 · 7:02 AM",
      dataSignals: ["Sales velocity by store", "Backroom capacity data", "Display readiness score", "Inbound timing estimate", "Segment assignment"],
      whyNoApproval: "Store ranking is autonomous and within guardrails. The allocation action itself requires planner approval — the ranking only creates the decision-ready order.",
    },
  },
  {
    id: "sa-4",
    title: "Linked supplier PO risk to allocation exposure",
    sourceModule: "Supplier & Inbound Flow",
    sourceTabId: "supplier-inbound",
    segment: "Seasonal / Event + Consistent Replenishment",
    systemAction: "Connected delayed and short-shipped POs to impacted store exposure",
    status: "watchlist" as const,
    drawer: {
      title: "Linked supplier PO risk to allocation exposure",
      status: "watchlist" as StatusLevel,
      explanation: "The system identified 43 at-risk POs across Seasonal / Event and Consistent Replenishment segments and connected each delayed or short-shipped PO to the downstream store allocation exposure it creates.",
      sourceTabs: ["Supplier & Inbound Flow", "Inventory & Allocation"],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "At-risk POs linked", value: "43" },
        { label: "Combined exposure", value: "$2.7M" },
        { label: "Segments", value: "Seasonal / Event + Consistent Replenishment" },
        { label: "Approval required", value: "Expedite and recovery — yes" },
      ],
      businessImpact: "Linking PO risk to store allocation surfaces the downstream impact of inbound delays, enabling faster recovery prioritization before options narrow.",
      recommendedAction: "Approve the GreenLeaf expedite and ValuePack recovery actions in the Supplier module.",
      trigger: "PO status scan · Jun 7 · 7:45 AM",
      dataSignals: ["PO status feed", "ASN timing data", "Fill rate comparison", "Store allocation exposure model"],
      whyNoApproval: "Signal linking is autonomous. Expedite and recovery approvals are routed to human owners because they carry cost and commitment impact.",
    },
  },
  {
    id: "sa-5",
    title: "Flagged store execution dependency for promo push",
    sourceModule: "Store Execution",
    sourceTabId: "store-execution",
    segment: "Promo / Merchant-Driven",
    systemAction: "Linked display readiness gaps to allocation dependency",
    status: "watchlist" as const,
    drawer: {
      title: "Flagged store execution dependency for promo push",
      status: "watchlist" as StatusLevel,
      explanation: "The system detected that 53 stores in District 147 have Promo / Merchant-Driven inventory staged but displays not set. Releasing full promo allocation to stores without confirmed display readiness risks backroom overflow and wasted allocation capacity.",
      sourceTabs: ["Store Execution", "Inventory & Allocation"],
      primarySourceTabId: "store-execution",
      metrics: [
        { label: "Stores flagged", value: "53" },
        { label: "Value at risk", value: "$520K" },
        { label: "Display readiness", value: "59% network average" },
        { label: "Approval required", value: "Yes — dependency rule requires field + merchandising sign-off" },
      ],
      businessImpact: "Promo allocation to stores without display readiness wastes inventory, degrades sell-through, and inflates backroom aging.",
      recommendedAction: "Approve the display-readiness dependency rule in the Store Execution module.",
      trigger: "Display readiness scan · Jun 7 · 8:12 AM",
      dataSignals: ["Display compliance data", "Allocation staging status", "District task completion rate", "Backroom capacity signal"],
      whyNoApproval: "Dependency flagging is autonomous. The allocation hold requires human field and merchandising sign-off because it affects store labor and promo timing.",
    },
  },
]

// ─── Module strip ─────────────────────────────────────────────────────────────

const MODULE_STRIP = [
  { id: "sku-segmentation", label: "SKU Strategy",      status: "stable",    metric: "2,180 SKU families segmented", tabId: "sku-segmentation" },
  { id: "demand",           label: "Demand",            status: "critical",  metric: "-4.8% forecast bias",          tabId: "demand"           },
  { id: "inventory",        label: "Inventory",         status: "critical",  metric: "214 stores exposed",           tabId: "inventory"        },
  { id: "supplier-inbound", label: "Supplier / Inbound",status: "watchlist", metric: "43 at-risk POs",               tabId: "supplier-inbound" },
  { id: "dc-capacity",      label: "DC / Transport",    status: "critical",  metric: "3 DCs at capacity risk",       tabId: "dc-capacity"      },
  { id: "store-execution",  label: "Store Execution",   status: "critical",  metric: "$4.3M aged in backroom",       tabId: "store-execution"  },
]

// ─── Detail drawer ────────────────────────────────────────────────────────────

const DRAWER_STATUS_CFG: Record<string, { label: string; classes: string }> = {
  critical:  { label: "Critical",   classes: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20"   },
  watchlist: { label: "Watchlist",  classes: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/20" },
  stable:    { label: "Stable",     classes: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20"          },
}

function ECTDetailDrawer({
  open,
  payload,
  onClose,
  onGoToTab,
  onApprove,
}: {
  open: boolean
  payload: DrawerPayload | null
  onClose: () => void
  onGoToTab: (tabId: string) => void
  onApprove?: () => void
}) {
  if (!open || !payload) return null
  const badge = DRAWER_STATUS_CFG[payload.status] ?? DRAWER_STATUS_CFG.stable

  return (
    <>
      <div className="fixed inset-0 bg-foreground/10 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-[440px] bg-card border-l border-border z-50 flex flex-col shadow-xl overflow-hidden">
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border shrink-0">
          <div className="flex-1 min-w-0">
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide mb-1.5", badge.classes)}>
              {badge.label}
            </span>
            <h3 className="text-[14px] font-semibold text-foreground leading-snug">{payload.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">What this means</p>
            <p className="text-sm text-foreground leading-relaxed">{payload.explanation}</p>
          </div>

          {payload.metrics.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Key metrics</p>
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {payload.metrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between px-4 py-2.5 bg-card">
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                    <span className="text-xs font-semibold text-foreground">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {payload.decision && (
            <div className="rounded-xl border border-primary/20 bg-accent p-4 space-y-1.5">
              <p className="text-[11px] font-semibold text-primary uppercase tracking-widest">Decision required</p>
              <p className="text-sm font-medium text-foreground">{payload.decision}</p>
              {payload.protectedValue && (
                <div className="flex items-center gap-1.5 mt-2">
                  <DollarSign className="w-3.5 h-3.5 text-[var(--status-stable)]" />
                  <span className="text-xs font-semibold text-[var(--status-stable)]">{payload.protectedValue} estimated value protected</span>
                </div>
              )}
            </div>
          )}

          {payload.riskIfNotApproved && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Risk if not approved</p>
              <p className="text-sm text-foreground leading-relaxed">{payload.riskIfNotApproved}</p>
            </div>
          )}

          {payload.trigger && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Trigger</p>
              <p className="text-sm text-foreground">{payload.trigger}</p>
            </div>
          )}

          {payload.dataSignals && payload.dataSignals.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Data signals used</p>
              <ul className="space-y-1">
                {payload.dataSignals.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-xs text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {payload.whyNoApproval && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Why human approval was not required</p>
              <p className="text-sm text-foreground leading-relaxed">{payload.whyNoApproval}</p>
            </div>
          )}

          {payload.relatedNodes && payload.relatedNodes.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Related value chain nodes</p>
              <div className="flex flex-wrap gap-1.5">
                {payload.relatedNodes.map((n) => (
                  <span key={n} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border font-medium">{n}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Business impact</p>
            <p className="text-sm text-foreground leading-relaxed">{payload.businessImpact}</p>
          </div>

          {payload.sourceTabs.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Source module</p>
              <div className="flex flex-wrap gap-1.5">
                {payload.sourceTabs.map((t) => (
                  <span key={t} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border space-y-2 shrink-0">
          {onApprove && (
            <button
              onClick={() => { onApprove(); onClose() }}
              className="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
            </button>
          )}
          <div className="flex gap-2.5">
            {payload.primarySourceTabId && (
              <button
                onClick={() => { onGoToTab(payload.primarySourceTabId); onClose() }}
                className="flex-1 flex items-center justify-center gap-1.5 border border-border bg-card text-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
              >
                Open {payload.openModule ?? "module"} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 border border-border bg-card text-muted-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" /> Mark for review
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

// ─── Orbit node preview data ──────────────────────────────────────────────────

const ORBIT_NODES = [
  {
    id: "demand",
    angle: -90,
    icon: BarChart2,
    label: "Demand",
    status: "critical",
    tabId: "demand",
    decisionIdx: 0, // pd-1
    preview: {
      title: "Demand signal",
      signal: "-4.8% forecast bias",
      insight: "Seasonal / Event demand is under-forecast.",
      decision: "Forecast uplift + protected allocation",
      value: "$3.4M estimated",
    },
  },
  {
    id: "inventory",
    angle: -18,
    icon: Package,
    label: "Inventory",
    status: "critical",
    tabId: "inventory",
    decisionIdx: 0, // also pd-1
    preview: {
      title: "Inventory signal",
      signal: "214 stores exposed",
      insight: "Inventory exists, but allocation readiness is constrained.",
      decision: "Protected push allocation",
      value: "Included in $3.4M decision",
    },
  },
  {
    id: "supplier-inbound",
    angle: 54,
    icon: Truck,
    label: "Supplier",
    status: "watchlist",
    tabId: "supplier-inbound",
    decisionIdx: 2, // pd-3
    preview: {
      title: "Supplier signal",
      signal: "43 at-risk POs",
      insight: "Delayed and short-shipped POs narrow recovery options.",
      decision: "Expedite delayed Seasonal PO",
      value: "$1.6M estimated",
    },
  },
  {
    id: "dc-capacity",
    angle: 126,
    icon: Warehouse,
    label: "DC / Transport",
    status: "critical",
    tabId: "dc-capacity",
    decisionIdx: 3, // pd-4
    preview: {
      title: "Network signal",
      signal: "3 DCs at capacity risk",
      insight: "Savannah and Joliet pressure may delay priority flow.",
      decision: "Re-sequence outbound waves",
      value: "$1.2M estimated",
    },
  },
  {
    id: "store-execution",
    angle: 198,
    icon: Store,
    label: "Store",
    status: "behind",
    tabId: "store-execution",
    decisionIdx: 1, // pd-2
    preview: {
      title: "Store signal",
      signal: "$4.3M aged in backroom",
      insight: "Delivered inventory is not converting to shelf availability fast enough.",
      decision: "Clear backroom aging and display backlog",
      value: "$1.8M estimated",
    },
  },
]

// ─── Status config extended for "behind" ─────────────────────────────────────

const STATUS_CFG_EXT: Record<string, { color: string; bg: string; border: string; ring: string }> = {
  critical:  { color: "text-[var(--status-critical)]",  bg: "bg-[var(--status-critical-bg)]",  border: "border-[var(--status-critical)]/30",  ring: "ring-[var(--status-critical)]/40"  },
  watchlist: { color: "text-[var(--status-watchlist)]", bg: "bg-[var(--status-watchlist-bg)]", border: "border-[var(--status-watchlist)]/30", ring: "ring-[var(--status-watchlist)]/40" },
  stable:    { color: "text-[var(--status-stable)]",    bg: "bg-[var(--status-stable-bg)]",    border: "border-[var(--status-stable)]/30",    ring: "ring-[var(--status-stable)]/40"    },
  behind:    { color: "text-[var(--status-watchlist)]", bg: "bg-[var(--status-watchlist-bg)]", border: "border-[var(--status-watchlist)]/30", ring: "ring-[var(--status-watchlist)]/40" },
}

// ─── Capability pillar drawer payloads ───────────────────────────────────────

const CAPABILITY_DRAWERS: Record<string, DrawerPayload> = {
  detect: {
    title: "Detect",
    status: "stable",
    explanation: "Detect combines signals from demand plans, inventory position, supplier and PO status, DC capacity, transportation performance, and store execution readiness to find where risk is building.",
    sourceTabs: ["Demand Planning", "Inventory & Allocation", "Supplier & Inbound Flow", "DC Capacity & Transportation", "Store Execution"],
    primarySourceTabId: "demand",
    metrics: [
      { label: "Signal sources", value: "6 operating modules" },
      { label: "SKU families analyzed", value: "2,180" },
      { label: "At-risk signals active", value: "5" },
    ],
    businessImpact: "Early risk detection across the full value chain narrows the window between signal and action, giving planners time to intervene before risk compounds.",
    recommendedAction: "Review the Priority Decision Stack to see ranked actions from detected risk.",
  },
  decide: {
    title: "Decide",
    status: "stable",
    explanation: "Decide ranks recommended actions based on estimated value protected, urgency, store exposure, and dependencies across the operating chain.",
    sourceTabs: ["All operating modules"],
    primarySourceTabId: "demand",
    metrics: [
      { label: "Priority decisions ranked", value: "5" },
      { label: "Total value at stake", value: "$18.1M" },
      { label: "Estimated value protected", value: "$8.7M (if all approved)" },
    ],
    businessImpact: "Ranking decisions by value, urgency, and dependency gives planners a clear starting point for limited approval bandwidth before the June 30 lock.",
    recommendedAction: "Review the Priority Decision Stack below to approve ranked actions.",
  },
  execute: {
    title: "Execute",
    status: "stable",
    explanation: "Execute completes low-risk system actions within guardrails and sends high-impact tradeoffs to human approval, including forecast changes, constrained allocations, expedite costs, and field labor priorities.",
    sourceTabs: ["All operating modules"],
    primarySourceTabId: "sku-segmentation",
    metrics: [
      { label: "System actions completed", value: "5" },
      { label: "Decisions routed for approval", value: "5" },
      { label: "Within guardrail threshold", value: "Yes" },
    ],
    businessImpact: "Automating within-guardrail actions reduces planning overhead while ensuring high-impact tradeoffs always reach a human decision-maker.",
    recommendedAction: "Review System Actions Completed below to see what was automated.",
  },
}

// ─── Decision engine visual (interactive) ────────────────────────────────────

function DecisionEngineVisual({
  activeNode,
  onNodeClick,
}: {
  activeNode: string | null
  onNodeClick: (id: string) => void
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none" aria-label="Decision engine signal diagram">
      {/* Pulsing rings */}
      <span className="absolute w-48 h-48 rounded-full border border-primary/10 animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />
      <span className="absolute w-36 h-36 rounded-full border border-primary/15 animate-ping pointer-events-none" style={{ animationDuration: "2.2s", animationDelay: "0.4s" }} />
      {/* Static orbit rings */}
      <span className="absolute w-52 h-52 rounded-full border border-primary/8 pointer-events-none" />
      <span className="absolute w-40 h-40 rounded-full border border-primary/12 pointer-events-none" />
      <span className="absolute w-28 h-28 rounded-full border border-primary/18 pointer-events-none" />

      {/* Center node */}
      <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex flex-col items-center justify-center shadow-lg gap-0.5 pointer-events-none">
        <Cpu className="w-6 h-6 text-primary" />
        <span className="text-[7px] font-bold text-primary uppercase tracking-wide leading-none">Engine</span>
      </div>

      {/* Orbit nodes */}
      {ORBIT_NODES.map(({ id, angle, icon: Icon, label, status }) => {
        const rad = (angle * Math.PI) / 180
        const r = 88
        const x = 50 + (r / 1.6) * Math.cos(rad)
        const y = 50 + (r / 1.6) * Math.sin(rad)
        const cfg = STATUS_CFG_EXT[status] ?? STATUS_CFG_EXT.stable
        const isActive = activeNode === id
        const isPulse = status === "critical" || status === "behind"

        return (
          <button
            key={id}
            className={cn(
              "absolute flex flex-col items-center gap-0.5 z-10 group transition-transform duration-200",
              isActive ? "scale-125" : "scale-100 hover:scale-110"
            )}
            style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${isActive ? 1.25 : 1})` }}
            onClick={() => onNodeClick(id)}
            aria-label={`${label} signal node`}
          >
            <div className={cn(
              "w-9 h-9 rounded-xl border-2 flex items-center justify-center shadow-sm transition-all duration-200",
              cfg.bg, cfg.border,
              isActive ? cn("ring-2", cfg.ring, "shadow-md") : ""
            )}>
              <Icon className={cn("w-4 h-4", cfg.color)} />
              {isPulse && !isActive && (
                <span className={cn(
                  "absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse",
                  status === "critical" ? "bg-[var(--status-critical)]" : "bg-[var(--status-watchlist)]"
                )} />
              )}
            </div>
            <span className={cn(
              "text-[8px] font-semibold whitespace-nowrap transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

interface ExecControlTowerPageProps {
  onGoToTab: (tabId: string) => void
}

export default function ExecControlTowerPage({ onGoToTab }: ExecControlTowerPageProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)
  const [drawerApproveId, setDrawerApproveId] = useState<string | null>(null)
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, "pending" | "approved">>({})
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null)
  const [activeOrbitNode, setActiveOrbitNode] = useState<string>("demand")

  const decisionsRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  function openDrawer(payload: DrawerPayload, approveId?: string) {
    setDrawerPayload(payload)
    setDrawerApproveId(approveId ?? null)
    setDrawerOpen(true)
  }
  function closeDrawer() {
    setDrawerOpen(false)
    setDrawerPayload(null)
    setDrawerApproveId(null)
  }
  function handleGoToTab(tabId: string) {
    closeDrawer()
    onGoToTab(tabId)
  }
  function scrollToDecisions() {
    decisionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  function scrollToMap() {
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  function approve(id: string) {
    setApprovalStatuses(s => ({ ...s, [id]: "approved" }))
  }
  function handleOrbitNodeClick(nodeId: string) {
    setActiveOrbitNode(nodeId)
    // scroll to matching decision if we can find it
    const node = ORBIT_NODES.find(n => n.id === nodeId)
    if (node && decisionsRef.current) {
      const dec = PRIORITY_DECISIONS[node.decisionIdx]
      if (dec) {
        setSelectedDecision(dec.id)
        setTimeout(() => decisionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80)
      }
    }
  }

  const approvedCount = Object.values(approvalStatuses).filter(v => v === "approved").length
  const approvedValue = [3.4, 1.8, 1.6, 1.2, 0.7]
    .filter((_, i) => approvalStatuses[`pd-${i + 1}`] === "approved")
    .reduce((s, v) => s + v, 0)

  const activePreview = ORBIT_NODES.find(n => n.id === activeOrbitNode)?.preview ?? null

  return (
    <div className="min-h-screen bg-background">

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — PREMIUM HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-border bg-card overflow-hidden">
        <div className="px-8 py-8">
          <div className="flex items-stretch gap-8">

            {/* Left: content */}
            <div className="flex-1 min-w-0 flex flex-col">

              {/* Badge + refresh */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[10px] font-semibold text-primary bg-accent border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-widest">
                  Executive View
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-[10px] text-muted-foreground font-medium">Last refresh: Jun 7, 2026 · 8:30 AM</span>
              </div>

              {/* Title */}
              <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-none mb-2 text-balance">
                Executive Decision Engine
              </h1>

              {/* New punchier headline */}
              <p className="text-[15px] font-semibold text-foreground leading-snug mb-1.5 text-balance max-w-xl">
                Turn supply chain signals into approved actions before risk reaches the shelf.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mb-5">
                From SKU strategy to shelf availability, the engine detects risk, ranks decisions, and routes high-impact tradeoffs for human approval.
              </p>

              {/* ── Capability pillars — horizontal, more visual ── */}
              <div className="flex items-stretch gap-0 mb-5">
                {(["detect", "decide", "execute"] as const).map((key, i) => {
                  const cfg = {
                    detect:  { label: "Detect",  icon: Activity,     copy: "Finds risk across demand, inventory, inbound flow, network capacity, and store execution." },
                    decide:  { label: "Decide",  icon: Zap,          copy: "Ranks actions by value, urgency, and operational dependency." },
                    execute: { label: "Execute", icon: CheckCircle2, copy: "Automates within guardrails and routes tradeoffs for approval." },
                  }[key]
                  const Icon = cfg.icon
                  return (
                    <div key={key} className="flex items-stretch">
                      <button
                        onClick={() => openDrawer(CAPABILITY_DRAWERS[key])}
                        className="group flex flex-col items-start rounded-xl border border-border bg-background px-4 py-3.5 text-left hover:border-primary/40 hover:bg-accent hover:shadow-md transition-all w-[178px]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-4.5 h-4.5 text-primary" />
                          </div>
                          <span className="text-[13px] font-extrabold text-foreground uppercase tracking-wider">{cfg.label}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-snug group-hover:text-foreground transition-colors">{cfg.copy}</p>
                      </button>
                      {i < 2 && (
                        <div className="flex items-center px-2 text-primary/30">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* ── Decision value strip — punchier ── */}
              <div className="rounded-2xl border border-border bg-background px-5 py-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Decision opportunity</p>
                    <p className="text-[13px] font-semibold text-foreground leading-snug">
                      5 priority decisions can protect an estimated{" "}
                      <span className="text-[var(--status-stable)] font-bold">$8.7M</span>{" "}
                      before the June 30 decision lock.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--status-critical)] bg-[var(--status-critical-bg)] border border-[var(--status-critical)]/20 px-2.5 py-1 rounded-full shrink-0 ml-3">
                    <Clock className="w-3 h-3" />
                    June 30 · 5:00 PM
                  </span>
                </div>

                {/* Ribbon flow */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <div className="rounded-xl border border-[var(--status-critical)]/25 bg-[var(--status-critical-bg)] px-4 py-2.5 text-center min-w-[110px]">
                    <p className="text-[17px] font-bold text-[var(--status-critical)] leading-none">$18.1M</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">total exposure</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  <div className="rounded-xl border border-border bg-muted px-4 py-2.5 text-center min-w-[100px]">
                    <p className="text-[17px] font-bold text-foreground leading-none">5</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">decisions</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  {/* Hero number */}
                  <div className="rounded-xl border-2 border-[var(--status-stable)]/40 bg-[var(--status-stable-bg)] px-5 py-2.5 text-center min-w-[130px] shadow-sm">
                    <p className="text-[30px] font-extrabold text-[var(--status-stable)] leading-none">$8.7M</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">estimated protected</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  <div className="rounded-xl border border-[var(--status-watchlist)]/25 bg-[var(--status-watchlist-bg)] px-4 py-2.5 text-center min-w-[120px]">
                    <div className="flex items-center justify-center gap-1.5">
                      <p className="text-[17px] font-bold text-muted-foreground leading-none">286</p>
                      <ArrowRight className="w-3 h-3 text-[var(--status-stable)] shrink-0" />
                      <p className="text-[17px] font-bold text-[var(--status-stable)] leading-none">146</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">stores at risk</p>
                  </div>
                </div>

                {approvedCount > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--status-stable)] mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {approvedCount} approved · ${approvedValue.toFixed(1)}M protected so far
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground italic">
                  All figures are directional estimates. Value protected is conditional on approval before the decision lock.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={scrollToDecisions}
                  className="flex items-center gap-2 bg-primary text-primary-foreground text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Review Priority Decisions <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollToMap}
                  className="flex items-center gap-2 border border-border text-foreground text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-muted transition-colors"
                >
                  View Decision Map
                </button>
              </div>
            </div>

            {/* Right: interactive decision engine visual */}
            <div className="hidden lg:flex flex-col items-center gap-3 w-[280px] shrink-0">
              {/* Circle */}
              <div className="relative w-[240px] h-[240px]">
                <DecisionEngineVisual
                  activeNode={activeOrbitNode}
                  onNodeClick={handleOrbitNodeClick}
                />
              </div>

              {/* Preview card — shows below the circle */}
              {activePreview && (
                <div className="w-full rounded-xl border border-primary/20 bg-accent px-4 py-3 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold text-foreground">{activePreview.title}</p>
                    <span className="text-[10px] font-semibold text-[var(--status-stable)] bg-[var(--status-stable-bg)] border border-[var(--status-stable)]/20 px-1.5 py-0.5 rounded-md whitespace-nowrap">{activePreview.value}</span>
                  </div>
                  <p className="text-[12px] font-semibold text-primary">{activePreview.signal}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug">{activePreview.insight}</p>
                  <div className="pt-1 border-t border-border">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Decision</p>
                    <p className="text-[10px] text-foreground leading-snug">{activePreview.decision}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <div className="px-8 py-7 space-y-10 max-w-[1600px]">

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2 — PRIORITY DECISION STACK
        ══════════════════════════════════════════════════════════════════ */}
        <section ref={decisionsRef}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-foreground tracking-tight mb-0.5">Priority Decision Stack</h2>
              <p className="text-xs text-muted-foreground">Ranked by value protected, urgency, and dependency across the value chain.</p>
            </div>
            {approvedCount > 0 && (
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--status-stable)] bg-[var(--status-stable-bg)] border border-[var(--status-stable)]/25 px-3 py-1.5 rounded-lg shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {approvedCount} of 5 approved
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            {PRIORITY_DECISIONS.map((dec) => {
              const isApproved = approvalStatuses[dec.id] === "approved"
              const isSelected = selectedDecision === dec.id
              const decDrawer: DrawerPayload = {
                title: dec.title,
                status: dec.rank <= 3 ? "critical" : "watchlist",
                explanation: dec.decisionRationale,
                sourceTabs: [dec.sourceModules],
                primarySourceTabId: dec.primarySourceTabId,
                metrics: [
                  { label: "Value protected (estimated)", value: dec.valueProtected },
                  { label: "Stores impacted", value: dec.storesImpacted },
                  { label: "Urgency", value: dec.urgency },
                  { label: "Owner", value: dec.owner },
                  { label: "SKU segment", value: dec.segment },
                ],
                businessImpact: dec.riskIfNotApproved,
                recommendedAction: `Approve: ${dec.title}`,
                decision: dec.title,
                protectedValue: dec.valueProtected,
                openModule: dec.openModuleLabel.replace("Open ", ""),
                riskIfNotApproved: dec.riskIfNotApproved,
                relatedNodes: dec.relatedNodes,
              }

              return (
                <div
                  key={dec.id}
                  className={cn(
                    "rounded-xl border bg-card shadow-sm transition-all",
                    isApproved
                      ? "border-[var(--status-stable)]/30 bg-[var(--status-stable-bg)]/50"
                      : isSelected
                      ? "border-primary/40 shadow-md"
                      : "border-border hover:border-primary/30 hover:shadow-md cursor-pointer"
                  )}
                  onClick={() => !isApproved && setSelectedDecision(isSelected ? null : dec.id)}
                >
                  <div className="px-5 py-4 flex items-start gap-4">
                    {/* Rank */}
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 transition-colors",
                      isApproved ? "bg-[var(--status-stable)] text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {isApproved ? <CheckCircle2 className="w-4 h-4" /> : dec.rank}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        {isApproved
                          ? <span className="text-[11px] font-semibold text-[var(--status-stable)] bg-[var(--status-stable-bg)] border border-[var(--status-stable)]/20 px-2 py-0.5 rounded-md">Approved</span>
                          : <span className={cn(
                              "text-[11px] font-semibold px-2 py-0.5 rounded-md border",
                              dec.rank <= 4
                                ? "text-[var(--status-critical)] bg-[var(--status-critical-bg)] border-[var(--status-critical)]/20"
                                : "text-[var(--status-watchlist)] bg-[var(--status-watchlist-bg)] border-[var(--status-watchlist)]/20"
                            )}>
                              {dec.rank <= 4 ? "Pending Approval" : "Needs Review"}
                            </span>
                        }
                        {/* Dependency tag */}
                        <span className="text-[10px] font-semibold text-primary bg-accent border border-primary/15 px-1.5 py-0.5 rounded font-mono">
                          {dec.dependencyTag}
                        </span>
                        <span className="text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded font-medium">
                          {dec.segment}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-foreground leading-snug mb-2">{dec.title}</p>

                      <div className="flex items-center gap-4 flex-wrap text-[11px]">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="w-3 h-3 text-[var(--status-stable)]" />
                          <span className="font-semibold text-[var(--status-stable)]">{dec.valueProtected} estimated</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Store className="w-3 h-3" />
                          <span>{dec.storesImpacted}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{dec.urgency}</span>
                        </div>
                        <span className="text-muted-foreground">
                          Owner: <span className="font-medium text-foreground">{dec.owner}</span>
                        </span>
                      </div>

                      {/* Expanded rationale */}
                      {isSelected && !isApproved && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-[11px] font-semibold text-muted-foreground mb-1">Why approval is needed</p>
                          <p className="text-[11px] text-foreground leading-snug mb-2">{dec.whyApproval}</p>
                          <p className="text-[11px] font-semibold text-muted-foreground mb-1">Decision rationale</p>
                          <p className="text-[11px] text-muted-foreground leading-snug">{dec.decisionRationale}</p>
                          {dec.relatedNodes.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                              <span className="text-[10px] text-muted-foreground">Chain nodes:</span>
                              {dec.relatedNodes.map(n => (
                                <span key={n} className="text-[10px] bg-muted border border-border px-1.5 py-0.5 rounded font-medium">{n}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                      {isApproved ? (
                        <button
                          onClick={() => openDrawer(decDrawer)}
                          className="text-[11px] font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          View approval
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => approve(dec.id)}
                            className="text-[11px] font-semibold text-primary-foreground bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                          >
                            {dec.primaryLabel}
                          </button>
                          <button
                            onClick={() => openDrawer(decDrawer, dec.id)}
                            className="text-[11px] font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
                          >
                            {dec.secondaryLabel}
                          </button>
                          <button
                            onClick={() => handleGoToTab(dec.openModuleTabId)}
                            className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium hover:text-foreground transition-colors whitespace-nowrap"
                          >
                            {dec.openModuleLabel} <ArrowRight className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3 — VALUE CHAIN DECISION MAP
        ══════════════════════════════════════════════════════════════════ */}
        <section ref={mapRef}>
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[15px] font-bold text-foreground tracking-tight">Value Chain Decision Map</h2>
              <button
                onClick={() => onGoToTab("sku-segmentation")}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-accent border border-primary/15 px-2 py-0.5 rounded-full hover:border-primary/40 transition-colors"
              >
                <Layers className="w-3 h-3" />
                Powered by SKU Strategy Segmentation
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Where risk is entering the operating chain and which decision protects value.</p>
          </div>

          {/* Risk path callout */}
          <div className="rounded-xl border border-[var(--status-critical)]/20 bg-[var(--status-critical-bg)] px-4 py-2.5 mb-4 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--status-critical)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-foreground leading-snug">
              <span className="font-semibold">Primary risk path:</span>{" "}
              Seasonal / Event demand is under-forecast, allocation pressure builds, inbound risk narrows recovery options, DC pressure delays movement, and store execution gaps prevent shelf availability.
            </p>
          </div>

          {/* Horizontal node chain */}
          <div className="rounded-2xl border border-border bg-card px-6 py-6 overflow-x-auto">
            <div className="flex items-stretch gap-0 min-w-max">
              {CHAIN_NODES.map((node, i) => {
                const Icon = node.icon
                const isRisk = RISK_PATH_IDS.has(node.id)
                const isConnectorRisk = i < CHAIN_NODES.length - 1 && RISK_PATH_IDS.has(CHAIN_NODES[i + 1].id)
                return (
                  <div key={node.id} className="flex items-stretch shrink-0">
                    {/* Node card — wider since only 5 */}
                    <button
                      onClick={() => openDrawer(node.drawer)}
                      className={cn(
                        "group flex flex-col items-start rounded-2xl border px-5 py-5 text-left transition-all w-[190px] shrink-0 hover:shadow-lg",
                        node.status === "critical"
                          ? "border-[var(--status-critical)]/30 bg-[var(--status-critical-bg)]/40 hover:border-[var(--status-critical)]/50"
                          : node.status === "watchlist"
                          ? "border-[var(--status-watchlist)]/30 bg-[var(--status-watchlist-bg)]/30 hover:border-[var(--status-watchlist)]/50"
                          : node.status === "behind"
                          ? "border-[var(--status-watchlist)]/30 bg-[var(--status-watchlist-bg)]/20 hover:border-[var(--status-watchlist)]/50"
                          : "border-border bg-background hover:border-primary/30"
                      )}
                    >
                      {/* Icon row */}
                      <div className="flex items-center justify-between w-full mb-3.5">
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                          node.status === "critical"  ? "bg-[var(--status-critical)]/15" :
                          node.status === "watchlist" || node.status === "behind" ? "bg-[var(--status-watchlist)]/15" : "bg-muted"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4",
                            node.status === "critical"  ? "text-[var(--status-critical)]" :
                            node.status === "watchlist" || node.status === "behind" ? "text-[var(--status-watchlist)]" : "text-[var(--status-stable)]"
                          )} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={node.status} />
                          {isRisk && node.status === "critical" && (
                            <span className="w-2 h-2 rounded-full bg-[var(--status-critical)] ring-2 ring-[var(--status-critical-bg)] animate-pulse shrink-0" />
                          )}
                        </div>
                      </div>

                      {/* Name */}
                      <p className="text-[12px] font-bold text-foreground mb-1 leading-snug">{node.name}</p>

                      {/* Primary issue */}
                      <p className="text-[10px] text-muted-foreground leading-snug mb-3 flex-1">{node.primaryIssue}</p>

                      {/* Signal */}
                      <div className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-md border mb-2.5 self-start",
                        node.status === "critical"
                          ? "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border-[var(--status-critical)]/20"
                          : node.status === "watchlist" || node.status === "behind"
                          ? "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border-[var(--status-watchlist)]/20"
                          : "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border-[var(--status-stable)]/20"
                      )}>
                        {node.signal}
                      </div>

                      {/* Value tag */}
                      <p className="text-[10px] text-muted-foreground font-medium mb-3 leading-snug">{node.valueTag}</p>

                      {/* Open link */}
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-primary group-hover:underline mt-auto">
                        <span>{node.openLink}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>

                    {/* Connector arrow */}
                    {i < CHAIN_NODES.length - 1 && (
                      <div className={cn(
                        "flex items-center px-2 shrink-0",
                        isConnectorRisk ? "text-[var(--status-critical)]/60" : "text-muted-foreground/30"
                      )}>
                        <ArrowRight className={cn("w-4 h-4", isConnectorRisk && "stroke-[2.5]")} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border flex-wrap">
              {[
                { status: "critical",  label: "Critical — active risk" },
                { status: "watchlist", label: "Watchlist — monitored" },
                { status: "behind",    label: "Behind — execution gap" },
                { status: "stable",    label: "Stable — on track" },
              ].map(l => (
                <div key={l.status} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <StatusDot status={l.status} />
                  {l.label}
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-[var(--status-critical)] animate-pulse shrink-0" />
                Active risk path node
              </div>
              <p className="ml-auto text-[10px] text-muted-foreground italic">Click any node for detail and decision options</p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 4 — SYSTEM ACTIONS COMPLETED
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center shrink-0">
              <Bot className="w-3 h-3 text-primary-foreground" />
            </div>
            <h2 className="text-[15px] font-bold text-foreground tracking-tight leading-none">System Actions Completed</h2>
            <span className="text-[10px] font-semibold bg-primary/8 text-primary border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-widest ml-1">
              Agentic Workflow
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Automated work already completed or routed within approved planning guardrails.</p>

          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
            {SYSTEM_ACTIONS.map((action) => {
              const isCompleted = action.status === "completed"
              return (
                <div
                  key={action.id}
                  className="px-5 py-4 flex items-start gap-4 hover:bg-muted/40 transition-colors cursor-pointer group"
                  onClick={() => openDrawer(action.drawer)}
                >
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold shrink-0 mt-0.5 border",
                    isCompleted
                      ? "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border-[var(--status-stable)]/20"
                      : "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border-[var(--status-watchlist)]/20"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{isCompleted ? "Completed" : "Watchlist"}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug mb-0.5">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.systemAction}</p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1 text-right">
                    <button
                      className="text-[10px] font-semibold text-primary hover:underline whitespace-nowrap"
                      onClick={e => { e.stopPropagation(); handleGoToTab(action.sourceTabId) }}
                    >
                      {action.sourceModule}
                    </button>
                    <span className="text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded font-medium">
                      {action.segment}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 5 — COMPACT OPERATING MODULE STRIP
        ══════════════════════════════════════════════════════════════════ */}
        <section className="pb-6">
          <div className="mb-4">
            <h2 className="text-[15px] font-bold text-foreground tracking-tight mb-0.5">Explore Operating Modules</h2>
            <p className="text-xs text-muted-foreground">Drill into the source modules behind each decision.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {MODULE_STRIP.map((mod) => {
              const cfg = STATUS_CFG[mod.status]
              return (
                <button
                  key={mod.id}
                  onClick={() => onGoToTab(mod.tabId)}
                  className="group flex flex-col items-start rounded-xl border border-border bg-card px-4 py-3.5 text-left hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-1.5 mb-2 w-full">
                    <StatusDot status={mod.status} />
                    <span className={cn("text-[10px] font-semibold", cfg.badge.split(" ").filter(c => c.startsWith("text-")).join(" "))}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-foreground leading-snug mb-1.5 text-balance">{mod.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug mb-3 flex-1">{mod.metric}</p>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-primary group-hover:underline mt-auto">
                    Open <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              )
            })}
          </div>
        </section>

      </div>

      {/* ── DETAIL DRAWER ──────────────────────────────────────────────────── */}
      <ECTDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={closeDrawer}
        onGoToTab={handleGoToTab}
        onApprove={drawerApproveId ? () => approve(drawerApproveId) : undefined}
      />
    </div>
  )
}
