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
  ShoppingCart,
  Bot,
  X,
  Bookmark,
  ArrowDown,
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

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { label: string; dot: string; badge: string }> = {
  critical:  { label: "Critical",   dot: "bg-[var(--status-critical)]",  badge: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/25"  },
  watchlist: { label: "Watchlist",  dot: "bg-[var(--status-watchlist)]", badge: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/25" },
  stable:    { label: "Stable",     dot: "bg-[var(--status-stable)]",    badge: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/25"          },
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

// ─── Value chain node data ────────────────────────────────────────────────────

const CHAIN_NODES = [
  {
    id: "sku-segmentation",
    name: "SKU Strategy",
    status: "stable",
    signal: "2,180 SKU families segmented",
    valueTag: "Strategy set",
    decisionLink: "Open module",
    icon: Layers,
    tabId: "sku-segmentation",
    drawer: {
      title: "SKU Strategy",
      status: "stable" as StatusLevel,
      explanation: "SKU families are grouped into operating segments so the system applies fit-for-purpose planning logic instead of treating every SKU the same way.",
      sourceTabs: ["SKU Strategy Segmentation"],
      primarySourceTabId: "sku-segmentation",
      metrics: [
        { label: "SKU families segmented", value: "2,180" },
        { label: "Segments", value: "5 operating segments" },
        { label: "Require human review", value: "174" },
      ],
      businessImpact: "Segmentation creates the planning logic that every other module depends on.",
      recommendedAction: "Open the SKU Strategy Segmentation module to review classified SKU families.",
      openModule: "SKU Strategy Segmentation",
    },
  },
  {
    id: "demand",
    name: "Demand",
    status: "critical",
    signal: "-4.8% forecast bias",
    valueTag: "$3.4M decision",
    decisionLink: "Forecast uplift",
    icon: BarChart2,
    tabId: "demand",
    drawer: {
      title: "Demand",
      status: "critical" as StatusLevel,
      explanation: "Seasonal / Event demand is under-forecast, creating downstream allocation pressure.",
      sourceTabs: ["Demand Planning"],
      primarySourceTabId: "demand",
      metrics: [
        { label: "Forecast bias", value: "-4.8% overall" },
        { label: "Stores affected", value: "214" },
        { label: "Value at risk", value: "$3.4M" },
      ],
      businessImpact: "Under-forecast bias in Seasonal / Event creates late-cycle allocation pressure with a narrowing recovery window.",
      recommendedAction: "Approve the Seasonal / Event forecast uplift before Jun 10.",
      decision: "Approve Seasonal / Event forecast uplift",
      protectedValue: "$3.4M combined with protected allocation",
      openModule: "Demand Planning",
      riskIfNotApproved: "Allocation engine locks in under-forecast position",
    },
  },
  {
    id: "inventory",
    name: "Inventory",
    status: "critical",
    signal: "214 stores exposed",
    valueTag: "Protected allocation",
    decisionLink: "Allocate",
    icon: Package,
    tabId: "inventory",
    drawer: {
      title: "Inventory",
      status: "critical" as StatusLevel,
      explanation: "Inventory is available at the network level, but allocation readiness and store exposure are constrained.",
      sourceTabs: ["Inventory & Allocation"],
      primarySourceTabId: "inventory",
      metrics: [
        { label: "Available to allocate", value: "$48.6M" },
        { label: "Stores exposed", value: "214" },
        { label: "Allocation readiness", value: "72%" },
      ],
      businessImpact: "Positioning inventory at the right stores before the lock is the single highest-leverage action before Jun 10.",
      recommendedAction: "Approve protected push allocation for high-risk Seasonal / Event stores.",
      decision: "Approve protected push allocation",
      openModule: "Inventory & Allocation",
      riskIfNotApproved: "214 stores remain undersupplied heading into selling window",
    },
  },
  {
    id: "supplier",
    name: "Vendor / Supplier",
    status: "watchlist",
    signal: "43 at-risk POs",
    valueTag: "$1.6M decision",
    decisionLink: "Expedite",
    icon: Truck,
    tabId: "supplier-inbound",
    drawer: {
      title: "Vendor / Supplier",
      status: "watchlist" as StatusLevel,
      explanation: "Supplier and PO risk may delay inventory needed for priority Seasonal / Event and replenishment flows.",
      sourceTabs: ["Supplier & Inbound Flow"],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "Supplier OTIF", value: "82.7%" },
        { label: "At-risk POs", value: "43" },
        { label: "Combined exposure", value: "$2.7M" },
      ],
      businessImpact: "Inbound risk not detected early collapses into allocation shortfalls with no recovery time.",
      recommendedAction: "Approve the GreenLeaf expedite and ValuePack recovery plan.",
      decision: "Expedite delayed Seasonal / Event inbound PO",
      protectedValue: "$1.6M",
      openModule: "Supplier & Inbound Flow",
    },
  },
  {
    id: "inbound",
    name: "Inbound",
    status: "watchlist",
    signal: "+4.6 days lead-time variance",
    valueTag: "Recovery path",
    decisionLink: "Recover",
    icon: ArrowDown,
    tabId: "supplier-inbound",
    drawer: {
      title: "Inbound",
      status: "watchlist" as StatusLevel,
      explanation: "Inbound flow is running later than planned, especially for time-sensitive Seasonal / Event inventory.",
      sourceTabs: ["Supplier & Inbound Flow"],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "Lead-time variance", value: "+4.6 days" },
        { label: "At-risk ETAs", value: "28 ASNs" },
        { label: "Savannah window risk", value: "Jun 8–9" },
      ],
      businessImpact: "Every day of inbound delay narrows the options between expedite, substitute, and accepting the stockout.",
      recommendedAction: "Approve recovery path or substitute where needed.",
      decision: "Approve recovery path or substitute where needed",
      openModule: "Supplier & Inbound Flow",
    },
  },
  {
    id: "dc",
    name: "DC",
    status: "critical",
    signal: "3 DCs at capacity risk",
    valueTag: "$1.2M decision",
    decisionLink: "Re-sequence",
    icon: Warehouse,
    tabId: "dc-capacity",
    drawer: {
      title: "DC",
      status: "critical" as StatusLevel,
      explanation: "Savannah and Joliet DC pressure may prevent priority inventory from being processed in time.",
      sourceTabs: ["DC Capacity & Transportation"],
      primarySourceTabId: "dc-capacity",
      metrics: [
        { label: "Savannah DC capacity", value: "96%" },
        { label: "Joliet DC capacity", value: "93%" },
        { label: "DCs at risk", value: "3 (Savannah, Joliet, Chesapeake)" },
      ],
      businessImpact: "DC bottlenecks at Savannah and Joliet are compressing delivery windows for Seasonal / Event SKUs across hundreds of stores.",
      recommendedAction: "Approve the Savannah wave change and overflow route capacity.",
      decision: "Re-sequence Savannah outbound waves",
      protectedValue: "$1.2M",
      openModule: "DC Capacity & Transportation",
      riskIfNotApproved: "72 stores miss priority delivery window",
    },
  },
  {
    id: "transportation",
    name: "Transportation",
    status: "critical",
    signal: "87.9% on-time delivery",
    valueTag: "$640K decision",
    decisionLink: "Add capacity",
    icon: Truck,
    tabId: "dc-capacity",
    drawer: {
      title: "Transportation",
      status: "critical" as StatusLevel,
      explanation: "Lane saturation and delivery reliability risk could delay priority shipments to stores.",
      sourceTabs: ["DC Capacity & Transportation"],
      primarySourceTabId: "dc-capacity",
      metrics: [
        { label: "On-time store delivery", value: "87.9%" },
        { label: "Lane saturation", value: "High — Southeast corridor" },
        { label: "Overflow routes available", value: "3 options" },
      ],
      businessImpact: "Without route capacity approval, priority Seasonal / Event shipments will miss store delivery windows.",
      recommendedAction: "Approve overflow route capacity before the next outbound window.",
      decision: "Approve overflow route capacity",
      protectedValue: "$640K",
      openModule: "DC Capacity & Transportation",
    },
  },
  {
    id: "store",
    name: "Store",
    status: "critical",
    signal: "$4.3M aged in backroom",
    valueTag: "$1.8M decision",
    decisionLink: "Field action",
    icon: Store,
    tabId: "store-execution",
    drawer: {
      title: "Store",
      status: "critical" as StatusLevel,
      explanation: "Delivered inventory is not consistently converting into sellable shelf availability because of backroom aging and task gaps.",
      sourceTabs: ["Store Execution"],
      primarySourceTabId: "store-execution",
      metrics: [
        { label: "Backroom aging >48 hrs", value: "$4.3M" },
        { label: "Stores affected", value: "126" },
        { label: "Delivery-to-shelf cycle", value: "31.4 hrs (target 20 hrs)" },
      ],
      businessImpact: "Every hour of backroom aging during the selling window reduces effective sell-through.",
      recommendedAction: "Approve field action for backroom aging and display setup.",
      decision: "Approve field action for backroom aging and display setup",
      protectedValue: "$1.8M",
      openModule: "Store Execution",
      riskIfNotApproved: "$1.8M remains unavailable to customers",
    },
  },
  {
    id: "shelf",
    name: "Shelf",
    status: "critical",
    signal: "59% display readiness",
    valueTag: "Verify availability",
    decisionLink: "Verify",
    icon: ShoppingCart,
    tabId: "store-execution",
    drawer: {
      title: "Shelf",
      status: "critical" as StatusLevel,
      explanation: "Display and shelf verification gaps reduce confidence that inventory is actually available to customers.",
      sourceTabs: ["Store Execution"],
      primarySourceTabId: "store-execution",
      metrics: [
        { label: "Display readiness", value: "59% network average" },
        { label: "Stores flagged", value: "53" },
        { label: "Value at risk", value: "$520K" },
      ],
      businessImpact: "Promo allocation to stores without display readiness wastes inventory and inflates backroom aging.",
      recommendedAction: "Verify shelf availability and display readiness.",
      decision: "Verify shelf availability and display readiness",
      openModule: "Store Execution",
    },
  },
]

// ─── Risk path connector ──────────────────────────────────────────────────────

const RISK_PATH_IDS = new Set(["demand", "inventory", "inbound", "dc", "store"])

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
    urgency: "Jun 10 · 5:00 PM",
    owner: "Demand Planning + Allocation",
    whyApproval: "Forecast change and constrained allocation tradeoff require planner sign-off.",
    primaryLabel: "Approve",
    secondaryLabel: "Review Rationale",
    openModuleLabel: "Open Demand Planning",
    openModuleTabId: "demand",
    riskIfNotApproved: "Allocation engine locks in under-forecast position for the full planning cycle.",
    decisionRationale: "The system detected -4.8% Seasonal / Event under-forecast bias and ranked 72 high-risk stores for protected push allocation. Approving before the Jun 10 lock allows the allocation engine to reposition inventory, protecting an estimated $3.4M in directional seasonal revenue.",
    relatedNodes: ["Demand", "Inventory"],
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
    riskIfNotApproved: "$1.8M remains unavailable to customers during the selling window.",
    decisionRationale: "126 stores have Seasonal / Event and Promo / Merchant-Driven inventory delivered but not processed to shelf. $4.3M is aging in backrooms across District 104 (Atlanta Metro) and District 147 (Philadelphia). Prioritizing backroom-to-shelf execution before the selling window is the fastest recovery lever.",
    relatedNodes: ["Store", "Shelf"],
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
    riskIfNotApproved: "42 stores miss Seasonal / Event inventory. Window closes permanently after Jun 8.",
    decisionRationale: "GreenLeaf Seasonal Imports PO-78421 has slipped 7 days and may miss the Savannah DC receiving window before the Jun 10 allocation lock. Expedite cost requires management approval.",
    relatedNodes: ["Vendor / Supplier", "Inbound", "DC"],
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
    riskIfNotApproved: "72 stores miss priority delivery window. Savannah pressure compounds through cycle.",
    decisionRationale: "Savannah DC is operating at 96% capacity with 22.4 hrs trailer dwell. Re-sequencing outbound waves to prioritize 72 high-risk Seasonal / Event stores protects $1.2M in estimated delivery value but may delay lower-priority replenishment shipments.",
    relatedNodes: ["DC", "Transportation"],
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
    urgency: "Before allocation lock",
    owner: "Supplier Management + Inventory Planning",
    whyApproval: "Substitution affects supplier commitments, allocation, and merchandising.",
    primaryLabel: "Approve Recovery",
    secondaryLabel: "Review Rationale",
    openModuleLabel: "Open Supplier & Inbound Flow",
    openModuleTabId: "supplier-inbound",
    riskIfNotApproved: "31 Midwest stores below replenishment threshold for the cycle.",
    decisionRationale: "ValuePack Consumables PO-78104 shipped at 82% fill versus 96% expected, creating a replenishment gap at 31 Midwest stores. Using substitute SKUs or alternative supplier recovery closes the gap but requires cross-functional approval.",
    relatedNodes: ["Vendor / Supplier", "Inventory"],
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
      businessImpact: "Segmentation enables fit-for-purpose planning across the cockpit. Without it, every SKU defaults to the same replenishment and allocation logic.",
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
      explanation: "The system detected a persistent -4.8% forecast bias in Seasonal / Event SKU families, comparing rolling actuals against current plan. The bias was linked to downstream allocation shortfalls at 214 stores and an estimated $3.4M in protected value if the uplift is approved before Jun 10.",
      sourceTabs: ["Demand Planning", "SKU Strategy Segmentation"],
      primarySourceTabId: "demand",
      metrics: [
        { label: "Forecast bias detected", value: "-4.8% (Seasonal / Event)" },
        { label: "Stores affected", value: "214" },
        { label: "Value at risk", value: "$3.4M" },
        { label: "Approval required", value: "Yes — uplift requires planner sign-off" },
      ],
      businessImpact: "Under-forecast bias in Seasonal / Event creates late-cycle allocation pressure with a narrowing recovery window before the selling period.",
      recommendedAction: "Approve the Seasonal / Event forecast uplift in the Demand Planning module before Jun 10.",
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
      explanation: "The system scored all stores in the Seasonal / Event allocation pool by absorption capacity — combining sales velocity, backroom capacity, display readiness, and inbound timing. High-risk stores were ranked for protected push allocation before the Jun 10 lock.",
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

// ─── Module strip data ────────────────────────────────────────────────────────

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
}: {
  open: boolean
  payload: DrawerPayload | null
  onClose: () => void
  onGoToTab: (tabId: string) => void
}) {
  if (!open || !payload) return null
  const badge = DRAWER_STATUS_CFG[payload.status] ?? DRAWER_STATUS_CFG.stable

  return (
    <>
      <div className="fixed inset-0 bg-foreground/10 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-[440px] bg-card border-l border-border z-50 flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
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

        {/* Body */}
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
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Related nodes in value chain</p>
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border space-y-2 shrink-0">
          <div className="flex gap-2.5">
            {payload.primarySourceTabId && (
              <button
                onClick={() => { onGoToTab(payload.primarySourceTabId); onClose() }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
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

// ─── Component ────────────────────────────────────────────────────────────────

interface ExecControlTowerPageProps {
  onGoToTab: (tabId: string) => void
}

export default function ExecControlTowerPage({ onGoToTab }: ExecControlTowerPageProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, "pending" | "approved">>({})
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null)

  const decisionsRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  function openDrawer(payload: DrawerPayload) {
    setDrawerPayload(payload)
    setDrawerOpen(true)
  }
  function closeDrawer() {
    setDrawerOpen(false)
    setDrawerPayload(null)
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

  const approvedCount = Object.values(approvalStatuses).filter(v => v === "approved").length
  const approvedValue = [3.4, 1.8, 1.6, 1.2, 0.7]
    .filter((_, i) => approvalStatuses[`pd-${i + 1}`] === "approved")
    .reduce((s, v) => s + v, 0)

  return (
    <div className="min-h-screen bg-background">

      {/* ── SECTION 1: HERO ─────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-card">
        <div className="px-8 py-7">
          {/* Badge + title */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-[10px] font-semibold text-primary bg-accent border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-widest">
              Executive View
            </span>
          </div>
          <h1 className="text-[26px] font-bold text-foreground tracking-tight leading-none mb-2 text-balance">
            Executive Decision Engine
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-1.5">
            From SKU strategy to shelf availability: identify where value is at risk, recommend the next best actions, and route high-impact tradeoffs for approval.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl mb-6">
            {"Dollar Tree's decision engine connects SKU strategy segmentation, demand signals, inventory position, supplier risk, DC capacity, transportation performance, and store execution readiness into one action-oriented planning view."}
          </p>

          {/* Impact statement + metrics */}
          <div className="rounded-2xl border border-border bg-background px-6 py-5 mb-5">
            <div className="flex items-start gap-8">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[var(--status-critical)] mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  5 priority decisions can protect an estimated $8.7M before the Jun 10 allocation lock.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  All figures are directional estimates. Value protected is conditional on approval before the decision lock.
                </p>
              </div>
              {approvedCount > 0 && (
                <div className="shrink-0 rounded-xl border border-[var(--status-stable)]/30 bg-[var(--status-stable-bg)] px-4 py-3 text-right">
                  <p className="text-[11px] text-[var(--status-stable)] font-medium mb-0.5">{approvedCount} decision{approvedCount > 1 ? "s" : ""} approved</p>
                  <p className="text-[18px] font-bold text-[var(--status-stable)]">${approvedValue.toFixed(1)}M protected</p>
                </div>
              )}
            </div>

            {/* 4 impact metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              {[
                { label: "Total revenue at risk", value: "$18.1M", status: "critical" },
                { label: "Estimated value protected", value: "$8.7M", status: "stable" },
                { label: "Stores at risk", value: "286 → 146", status: "watchlist" },
                { label: "Decision lock", value: "Jun 10 · 5:00 PM", status: "critical" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-border bg-card px-4 py-3">
                  <StatusDot status={m.status} />
                  <p className="text-[17px] font-bold text-foreground mt-1.5 leading-none">{m.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
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
            <div className="ml-auto text-right shrink-0">
              <p className="text-[10px] text-muted-foreground">Last refresh</p>
              <p className="text-xs font-semibold text-foreground">Jun 7, 2026 · 8:30 AM</p>
            </div>
          </div>
        </div>
      </section>

      <div className="px-8 py-7 space-y-10 max-w-[1600px]">

        {/* ── SECTION 2: VALUE CHAIN DECISION MAP ─────────────────────────── */}
        <section ref={mapRef}>
          <div className="mb-4">
            <h2 className="text-[15px] font-bold text-foreground tracking-tight mb-0.5">Value Chain Decision Map</h2>
            <p className="text-xs text-muted-foreground">Where risk is entering the chain, where it moves next, and which decision protects value.</p>
          </div>

          {/* Risk path callout */}
          <div className="rounded-xl border border-[var(--status-critical)]/20 bg-[var(--status-critical-bg)] px-4 py-2.5 mb-4 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--status-critical)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-foreground leading-snug">
              <span className="font-semibold">Primary risk path:</span>{" "}
              Seasonal / Event demand → constrained allocation → delayed Savannah inbound → DC pressure → store backroom aging.
            </p>
          </div>

          {/* Horizontal node chain */}
          <div className="rounded-2xl border border-border bg-card px-5 py-6 overflow-x-auto">
            <div className="flex items-stretch gap-0 min-w-max">
              {CHAIN_NODES.map((node, i) => {
                const Icon = node.icon
                const isRisk = RISK_PATH_IDS.has(node.id)
                const cfg = STATUS_CFG[node.status]
                const isConnectorRisk = i < CHAIN_NODES.length - 1 && RISK_PATH_IDS.has(node.id) && RISK_PATH_IDS.has(CHAIN_NODES[i + 1].id)
                return (
                  <div key={node.id} className="flex items-stretch shrink-0">
                    {/* Node card */}
                    <button
                      onClick={() => openDrawer(node.drawer)}
                      className={cn(
                        "group flex flex-col items-start rounded-2xl border px-4 py-4 text-left transition-all w-[148px] shrink-0 hover:shadow-md",
                        node.status === "critical"
                          ? "border-[var(--status-critical)]/30 bg-[var(--status-critical-bg)]/40 hover:border-[var(--status-critical)]/50"
                          : node.status === "watchlist"
                          ? "border-[var(--status-watchlist)]/30 bg-[var(--status-watchlist-bg)]/30 hover:border-[var(--status-watchlist)]/50"
                          : "border-border bg-background hover:border-primary/30"
                      )}
                    >
                      {/* Icon + status */}
                      <div className="flex items-center justify-between w-full mb-3">
                        <div className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                          node.status === "critical" ? "bg-[var(--status-critical)]/15" :
                          node.status === "watchlist" ? "bg-[var(--status-watchlist)]/15" : "bg-muted"
                        )}>
                          <Icon className={cn(
                            "w-3.5 h-3.5",
                            node.status === "critical" ? "text-[var(--status-critical)]" :
                            node.status === "watchlist" ? "text-[var(--status-watchlist)]" : "text-[var(--status-stable)]"
                          )} />
                        </div>
                        {isRisk && node.status === "critical" && (
                          <span className="w-2 h-2 rounded-full bg-[var(--status-critical)] ring-2 ring-[var(--status-critical-bg)] animate-pulse shrink-0" />
                        )}
                      </div>

                      {/* Name */}
                      <p className="text-[11px] font-bold text-foreground mb-1 leading-snug">{node.name}</p>

                      {/* Signal */}
                      <p className="text-[10px] text-muted-foreground leading-snug mb-2.5 flex-1">{node.signal}</p>

                      {/* Value tag */}
                      <div className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-md border mb-2 self-start",
                        node.status === "critical"
                          ? "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border-[var(--status-critical)]/20"
                          : node.status === "watchlist"
                          ? "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border-[var(--status-watchlist)]/20"
                          : "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border-[var(--status-stable)]/20"
                      )}>
                        {node.valueTag}
                      </div>

                      {/* Decision link */}
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-primary group-hover:underline mt-auto">
                        <span>{node.decisionLink}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>

                    {/* Connector arrow */}
                    {i < CHAIN_NODES.length - 1 && (
                      <div className={cn(
                        "flex items-center px-1.5 shrink-0",
                        isConnectorRisk ? "text-[var(--status-critical)]/60" : "text-muted-foreground/30"
                      )}>
                        <ArrowRight className={cn(
                          "w-3.5 h-3.5",
                          isConnectorRisk && "stroke-[2.5]"
                        )} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border flex-wrap">
              {[
                { status: "critical",  label: "Critical — active risk" },
                { status: "watchlist", label: "Watchlist — monitored" },
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

        {/* ── SECTION 3: PRIORITY DECISIONS ───────────────────────────────── */}
        <section ref={decisionsRef}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-[15px] font-bold text-foreground tracking-tight mb-0.5">Priority Decisions</h2>
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
                              dec.rank <= 3
                                ? "text-[var(--status-critical)] bg-[var(--status-critical-bg)] border-[var(--status-critical)]/20"
                                : "text-[var(--status-watchlist)] bg-[var(--status-watchlist-bg)] border-[var(--status-watchlist)]/20"
                            )}>
                              {dec.rank <= 3 ? "Pending Approval" : dec.rank === 5 ? "Needs Review" : "Pending Approval"}
                            </span>
                        }
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

                      {/* Why approval needed — shown when expanded */}
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
                            onClick={() => setApprovalStatuses(s => ({ ...s, [dec.id]: "approved" }))}
                            className="text-[11px] font-semibold text-primary-foreground bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                          >
                            {dec.primaryLabel}
                          </button>
                          <button
                            onClick={() => openDrawer(decDrawer)}
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

        {/* ── SECTION 4: SYSTEM ACTIONS COMPLETED ─────────────────────────── */}
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center shrink-0">
              <Bot className="w-3 h-3 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-foreground tracking-tight leading-none">System Actions Completed</h2>
            </div>
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
                  {/* Status badge */}
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold shrink-0 mt-0.5 border",
                    isCompleted
                      ? "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border-[var(--status-stable)]/20"
                      : "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border-[var(--status-watchlist)]/20"
                  )}>
                    {isCompleted
                      ? <CheckCircle2 className="w-3.5 h-3.5" />
                      : <Clock className="w-3.5 h-3.5" />
                    }
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

        {/* ── SECTION 5: COMPACT OPERATING MODULE STRIP ───────────────────── */}
        <section>
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
      />
    </div>
  )
}
