"use client"

import { useState, useRef } from "react"
import { Search, RefreshCw, Download, ChevronRight, Bot, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import SKUDetailDrawer from "./SKUDetailDrawer"
import type { DrawerPayload } from "./SKUData"
import { dcActions, dcApprovals } from "./AIActionsData"

// ─── Types ─────────────────────────────────────────────────────────────────────

type StatusLevel = "critical" | "watchlist" | "stable" | "needs-approval" | "completed" | "pending" | "approved"

interface DCCard {
  id: string; name: string; region: string; status: StatusLevel
  capacity: number; dwell: string; constraint: string
  segments: string[]; recommendation: string
  drawer: DrawerPayload
}

interface LaneRow {
  id: string; priority: string; lane: string; segment: string
  otd: string; trailerUtil: string; lateRoutes: number
  issue: string; recommendation: string; status: StatusLevel
  drawer: DrawerPayload
}

// ─── Static data ───────────────────────────────────────────────────────────────

const DC_CARDS: DCCard[] = [
  {
    id: "savannah", name: "Savannah DC", region: "Southeast", status: "critical",
    capacity: 96, dwell: "22.4 hrs", constraint: "Shipping dock utilization",
    segments: ["Seasonal / Event", "Promo / Merchant-Driven"],
    recommendation: "Re-sequence outbound waves for high-risk stores",
    drawer: {
      title: "Savannah DC — Capacity Detail",
      status: "critical",
      explanation: "Shipping dock utilization is above effective capacity while Seasonal / Event outbound waves are due before the allocation lock. Trailer dwell of 22.4 hrs (target 12 hrs) is creating congestion and limiting dock availability for priority outbound shipments.",
      signals: ["96% DC capacity", "22.4 hrs trailer dwell (target 12 hrs)", "Seasonal / Event outbound priority", "72 Southeast stores at risk", "Allocation lock: Jun 10"],
      sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }, { label: "Inventory & Allocation", id: "inventory" }],
      primarySourceTabId: "dc-capacity",
      segment: "Seasonal / Event",
      segmentStrategy: "Wave re-sequencing and dock throughput recovery",
      metrics: [
        { label: "Capacity",        value: "96%" },
        { label: "Trailer dwell",   value: "22.4 hrs" },
        { label: "Stores at risk",  value: "72 Southeast stores" },
        { label: "Value at risk",   value: "$1.2M" },
        { label: "Primary constraint", value: "Shipping dock utilization" },
      ],
      humanApprovalRequired: true,
      businessImpact: "72 Southeast stores may miss priority Seasonal / Event delivery windows before the selling period if outbound waves are not re-sequenced.",
      recommendedAction: "Approve Savannah outbound wave re-sequencing to prioritize high-risk stores before allocation lock.",
      guardrailNote: "No wave change executed without DC manager and planning sign-off.",
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    id: "joliet", name: "Joliet DC", region: "Midwest", status: "critical",
    capacity: 93, dwell: "19.1 hrs", constraint: "Pick-wave backlog",
    segments: ["Consistent Replenishment"],
    recommendation: "Prioritize everyday replenishment picks",
    drawer: {
      title: "Joliet DC — Capacity Detail",
      status: "critical",
      explanation: "Pick-wave backlog is limiting Consistent Replenishment flow to high-velocity Midwest stores. The issue is not lack of inventory — it is the physical ability to pick, stage, and dispatch replenishment loads on cycle.",
      signals: ["93% DC capacity", "19.1 hrs trailer dwell", "Pick-wave backlog identified", "58 Midwest stores with replenishment exposure"],
      sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }, { label: "Inventory & Allocation", id: "inventory" }],
      primarySourceTabId: "dc-capacity",
      segment: "Consistent Replenishment",
      segmentStrategy: "Replenishment pick prioritization within current wave plan",
      metrics: [
        { label: "Capacity",       value: "93%" },
        { label: "Trailer dwell",  value: "19.1 hrs" },
        { label: "Stores exposed", value: "58" },
        { label: "Primary constraint", value: "Pick-wave backlog" },
      ],
      humanApprovalRequired: false,
      businessImpact: "58 stores have replenishment exposure. Basic prioritization within guardrails is autonomous; overtime or additional labor requires approval.",
      recommendedAction: "Confirm replenishment pick priority in Joliet wave plan. Approve labor flex if overtime is required.",
      guardrailNote: "Basic prioritization is within autonomous guardrails. Labor or overtime requires separate approval.",
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    id: "chesapeake", name: "Chesapeake DC", region: "Northeast", status: "watchlist",
    capacity: 87, dwell: "15.7 hrs", constraint: "Promo delivery window compression",
    segments: ["Promo / Merchant-Driven"],
    recommendation: "Protect promo delivery windows",
    drawer: {
      title: "Chesapeake DC — Capacity Detail",
      status: "watchlist",
      explanation: "Promo delivery windows are compressed on Northeast routes due to 88% trailer utilization and 9 late routes. Promo / Merchant-Driven inventory may arrive after display setup deadlines if delivery windows are not protected.",
      signals: ["87% DC capacity", "15.7 hrs trailer dwell", "88% trailer utilization on Northeast routes", "9 late routes", "14 stores at risk"],
      sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }, { label: "Store Execution", id: "store-execution" }],
      primarySourceTabId: "dc-capacity",
      segment: "Promo / Merchant-Driven",
      segmentStrategy: "Protect promo delivery slots before display setup deadlines",
      metrics: [
        { label: "Capacity",       value: "87%" },
        { label: "Trailer dwell",  value: "15.7 hrs" },
        { label: "Late routes",    value: "9" },
        { label: "Stores at risk", value: "14" },
      ],
      humanApprovalRequired: true,
      businessImpact: "14 Northeast stores at risk of missed promo display windows. Late delivery would degrade promo sell-through and add markdown exposure.",
      recommendedAction: "Approve overflow route capacity for Chesapeake → Northeast priority lanes.",
      guardrailNote: "No route capacity change committed without management approval.",
      actionLabel: "Go to Store Execution",
      actionTabId: "store-execution",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    id: "marietta", name: "Marietta DC", region: "Southwest", status: "stable",
    capacity: 78, dwell: "10.8 hrs", constraint: "Available capacity",
    segments: ["Treasure Hunt / Limited Buy"],
    recommendation: "Support rebalance moves if lane capacity is available",
    drawer: {
      title: "Marietta DC — Capacity Detail",
      status: "stable",
      explanation: "Marietta DC has available capacity and acceptable dwell times. It is positioned to support Treasure Hunt / Limited Buy rebalance moves from constrained DCs if transportation lane capacity is available.",
      signals: ["78% DC capacity", "10.8 hrs trailer dwell", "Available outbound capacity", "Rebalance candidate identified"],
      sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }, { label: "Inventory & Allocation", id: "inventory" }],
      primarySourceTabId: "dc-capacity",
      segment: "Treasure Hunt / Limited Buy",
      segmentStrategy: "Support rebalance moves as receiving DC",
      metrics: [
        { label: "Capacity",       value: "78%" },
        { label: "Trailer dwell",  value: "10.8 hrs" },
        { label: "Available",      value: "Rebalance capacity" },
      ],
      humanApprovalRequired: false,
      businessImpact: "Marietta can absorb rebalance transfers if approved at the Inventory & Allocation level. No execution risk at this DC.",
      recommendedAction: "Confirm rebalance transfer approval at Inventory & Allocation before scheduling inbound.",
      guardrailNote: "Rebalance transfer decisions are owned by Inventory Planning.",
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    id: "san-bernardino", name: "San Bernardino DC", region: "West", status: "stable",
    capacity: 81, dwell: "11.6 hrs", constraint: "No material constraint",
    segments: ["Constrained / Exception"],
    recommendation: "Maintain current outbound plan",
    drawer: {
      title: "San Bernardino DC — Capacity Detail",
      status: "stable",
      explanation: "San Bernardino DC is operating within normal parameters with no material capacity or dwell concerns. Current outbound plan for Constrained / Exception SKUs should be maintained.",
      signals: ["81% DC capacity", "11.6 hrs trailer dwell", "No flagged constraint", "Constrained / Exception segment coverage"],
      sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }],
      primarySourceTabId: "dc-capacity",
      segment: "Constrained / Exception",
      segmentStrategy: "Maintain current outbound plan",
      metrics: [
        { label: "Capacity",      value: "81%" },
        { label: "Trailer dwell", value: "11.6 hrs" },
        { label: "Risk level",    value: "None" },
      ],
      humanApprovalRequired: false,
      businessImpact: "No execution risk at this DC. Standard monitoring applies.",
      recommendedAction: "Maintain current outbound plan and monitor for any inbound supply changes.",
      guardrailNote: "No action required at this time.",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    id: "olive-branch", name: "Olive Branch DC", region: "Central", status: "watchlist",
    capacity: 88, dwell: "16.2 hrs", constraint: "Labor coverage and appointment backlog",
    segments: ["Consistent Replenishment", "Constrained / Exception"],
    recommendation: "Monitor backlog and flex labor coverage",
    drawer: {
      title: "Olive Branch DC — Capacity Detail",
      status: "watchlist",
      explanation: "Labor coverage and appointment backlog are building at Olive Branch DC, limiting outbound replenishment flow for Consistent Replenishment and Constrained / Exception SKUs. Flexing labor coverage for targeted shifts would reduce the backlog.",
      signals: ["88% DC capacity", "16.2 hrs trailer dwell", "Appointment backlog identified", "Labor coverage gap flagged"],
      sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }, { label: "Inventory & Allocation", id: "inventory" }],
      primarySourceTabId: "dc-capacity",
      segment: "Consistent Replenishment",
      segmentStrategy: "Labor flex to reduce backlog and protect replenishment flow",
      metrics: [
        { label: "Capacity",        value: "88%" },
        { label: "Trailer dwell",   value: "16.2 hrs" },
        { label: "Value at risk",   value: "$480K" },
        { label: "Primary constraint", value: "Labor coverage + appointment backlog" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$480K exposure tied to delayed replenishment flow. Everyday service thresholds may fall behind if backlog is not cleared.",
      recommendedAction: "Approve labor flex coverage for targeted shifts to reduce backlog.",
      guardrailNote: "Labor scheduling and overtime require operations approval.",
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      secondaryLabel: "Mark for Review",
    },
  },
]

const LANE_ROWS: LaneRow[] = [
  {
    id: "lane-1", priority: "P1", lane: "Savannah DC → Southeast", segment: "Seasonal / Event",
    otd: "82.4%", trailerUtil: "97%", lateRoutes: 18,
    issue: "Route saturation and tight delivery windows",
    recommendation: "Add overflow capacity or re-sequence loads",
    status: "critical",
    drawer: {
      title: "Savannah DC → Southeast — Lane Detail",
      status: "critical",
      explanation: "Route saturation and tight delivery windows on the Savannah → Southeast lane are creating 18 late routes and an 82.4% on-time delivery rate — well below the 94% target. Seasonal / Event shipments for 72 stores are at risk of missing the selling window.",
      signals: ["82.4% on-time delivery (target 94%)", "97% trailer utilization", "18 late routes", "72 stores at delivery risk", "Allocation lock: Jun 10"],
      sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }, { label: "Store Execution", id: "store-execution" }],
      primarySourceTabId: "dc-capacity",
      segment: "Seasonal / Event",
      segmentStrategy: "Overflow capacity or load re-sequencing for priority stores",
      metrics: [
        { label: "On-time delivery",  value: "82.4% (target 94%)" },
        { label: "Trailer utilization", value: "97%" },
        { label: "Late routes",       value: "18" },
        { label: "Stores at risk",    value: "72" },
        { label: "Value at risk",     value: "$1.2M" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$1.2M service exposure — 72 Southeast stores may miss Seasonal / Event delivery windows before the selling period opens.",
      recommendedAction: "Approve Savannah outbound wave change and add overflow capacity for priority store loads.",
      guardrailNote: "No route or wave change committed without DC manager and transportation approval.",
      actionLabel: "Go to Store Execution",
      actionTabId: "store-execution",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    id: "lane-2", priority: "P1", lane: "Joliet DC → Midwest", segment: "Consistent Replenishment",
    otd: "85.9%", trailerUtil: "94%", lateRoutes: 14,
    issue: "Pick-wave backlog delaying dispatch",
    recommendation: "Prioritize replenishment loads",
    status: "critical",
    drawer: {
      title: "Joliet DC → Midwest — Lane Detail",
      status: "critical",
      explanation: "Pick-wave backlog at Joliet DC is delaying dispatch for Consistent Replenishment loads, producing 14 late routes and 85.9% on-time delivery. The constraint is operational throughput, not inventory availability.",
      signals: ["85.9% on-time delivery (target 94%)", "94% trailer utilization", "14 late routes", "58 stores with replenishment exposure"],
      sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }, { label: "Inventory & Allocation", id: "inventory" }],
      primarySourceTabId: "dc-capacity",
      segment: "Consistent Replenishment",
      segmentStrategy: "Pick prioritization to clear backlog and protect dispatch timing",
      metrics: [
        { label: "On-time delivery",   value: "85.9% (target 94%)" },
        { label: "Trailer utilization", value: "94%" },
        { label: "Late routes",        value: "14" },
        { label: "Stores exposed",     value: "58" },
      ],
      humanApprovalRequired: false,
      businessImpact: "58 Midwest stores have replenishment exposure. Delayed dispatch from pick-wave backlog degrades everyday service levels.",
      recommendedAction: "Prioritize replenishment loads within Joliet wave plan. Approve labor flex if overtime is needed.",
      guardrailNote: "Basic prioritization is autonomous. Labor or overtime changes require approval.",
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    id: "lane-3", priority: "P2", lane: "Chesapeake DC → Northeast", segment: "Promo / Merchant-Driven",
    otd: "89.6%", trailerUtil: "88%", lateRoutes: 9,
    issue: "Promo delivery windows compressed",
    recommendation: "Protect promo delivery slots",
    status: "watchlist",
    drawer: {
      title: "Chesapeake DC → Northeast — Lane Detail",
      status: "watchlist",
      explanation: "Delivery windows on the Chesapeake → Northeast lane are compressed due to 88% trailer utilization, producing 9 late routes. Promo / Merchant-Driven inventory may arrive after display setup deadlines if windows are not protected.",
      signals: ["89.6% on-time delivery", "88% trailer utilization", "9 late routes", "Display timing dependency", "14 stores at risk"],
      sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }, { label: "Store Execution", id: "store-execution" }],
      primarySourceTabId: "dc-capacity",
      segment: "Promo / Merchant-Driven",
      segmentStrategy: "Protect promo delivery windows before display setup deadlines",
      metrics: [
        { label: "On-time delivery",   value: "89.6%" },
        { label: "Trailer utilization", value: "88%" },
        { label: "Late routes",        value: "9" },
        { label: "Value at risk",      value: "$640K" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$640K exposure — late deliveries may affect store display readiness and degrade promo sell-through at 14 Northeast stores.",
      recommendedAction: "Approve overflow route capacity to protect promo delivery slots.",
      guardrailNote: "No route capacity change committed without management approval.",
      actionLabel: "Go to Store Execution",
      actionTabId: "store-execution",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    id: "lane-4", priority: "P3", lane: "Marietta DC → Southwest", segment: "Treasure Hunt / Limited Buy",
    otd: "94.8%", trailerUtil: "79%", lateRoutes: 3,
    issue: "Available capacity for rebalance moves",
    recommendation: "Use as support lane if needed",
    status: "stable",
    drawer: {
      title: "Marietta DC → Southwest — Lane Detail",
      status: "stable",
      explanation: "Marietta → Southwest lane is operating above target with available trailer capacity. It can serve as a support lane for Treasure Hunt / Limited Buy rebalance moves from constrained DCs if approved.",
      signals: ["94.8% on-time delivery", "79% trailer utilization", "3 late routes", "Available rebalance capacity"],
      sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }],
      primarySourceTabId: "dc-capacity",
      segment: "Treasure Hunt / Limited Buy",
      segmentStrategy: "Available as support lane for rebalance moves",
      metrics: [
        { label: "On-time delivery",   value: "94.8%" },
        { label: "Trailer utilization", value: "79%" },
        { label: "Late routes",        value: "3" },
        { label: "Status",             value: "Stable" },
      ],
      humanApprovalRequired: false,
      businessImpact: "No execution risk on this lane. Available capacity can support rebalance moves if Inventory & Allocation approves the transfer.",
      recommendedAction: "Maintain current routing. Use as support lane for approved rebalance transfers.",
      guardrailNote: "No action required. Rebalance transfer decisions are owned by Inventory Planning.",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    id: "lane-5", priority: "P3", lane: "San Bernardino DC → West", segment: "Constrained / Exception",
    otd: "95.1%", trailerUtil: "81%", lateRoutes: 2,
    issue: "No material risk",
    recommendation: "Maintain current routing",
    status: "stable",
    drawer: {
      title: "San Bernardino DC → West — Lane Detail",
      status: "stable",
      explanation: "San Bernardino → West lane is performing at or above target. No material execution risk exists for Constrained / Exception SKU flow on this lane.",
      signals: ["95.1% on-time delivery", "81% trailer utilization", "2 late routes", "No flagged constraint"],
      sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }],
      primarySourceTabId: "dc-capacity",
      segment: "Constrained / Exception",
      segmentStrategy: "Maintain current routing plan",
      metrics: [
        { label: "On-time delivery",   value: "95.1%" },
        { label: "Trailer utilization", value: "81%" },
        { label: "Late routes",        value: "2" },
        { label: "Status",             value: "Stable" },
      ],
      humanApprovalRequired: false,
      businessImpact: "No execution risk. Standard monitoring applies.",
      recommendedAction: "Maintain current routing and monitor for inbound supply changes.",
      guardrailNote: "No action required.",
      secondaryLabel: "Mark for Review",
    },
  },
]

const KPI_DRAWERS: DrawerPayload[] = [
  {
    title: "Network Throughput — 91.3%",
    status: "watchlist",
    explanation: "Network throughput measures the percent of planned daily volume the distribution network is successfully processing. At 91.3%, the network is handling most of its planned flow, but capacity buffers are thin — particularly at Savannah and Joliet — and any additional pressure could delay priority shipments.",
    signals: ["91.3% of planned volume processing", "Thin capacity buffers at Savannah (96%) and Joliet (93%)", "Seasonal / Event and Consistent Replenishment priority exposure"],
    sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }],
    primarySourceTabId: "dc-capacity",
    segment: "All Segments",
    segmentStrategy: "Network-wide throughput monitoring",
    metrics: [
      { label: "Throughput",      value: "91.3% of planned volume" },
      { label: "Most constrained", value: "Savannah DC (96%), Joliet DC (93%)" },
      { label: "Buffer status",   value: "Thin — additional pressure would delay priority shipments" },
    ],
    humanApprovalRequired: false,
    businessImpact: "Thin buffers mean the network has limited ability to absorb unexpected volume spikes or supplier delivery delays without affecting priority segment delivery.",
    recommendedAction: "Monitor Savannah and Joliet DCs closely. Approve wave and labor actions before allocation lock.",
    guardrailNote: "Network throughput is monitored autonomously. Execution actions require approval.",
    secondaryLabel: "Mark for Review",
  },
  {
    title: "DCs at Capacity Risk — 3",
    status: "critical",
    explanation: "Three DCs — Savannah, Joliet, and Chesapeake — are operating above the point where dock, pick, yard, or labor pressure may delay priority flow. The risk is not a lack of inventory; it is the physical ability to receive, pick, stage, ship, or move product through the DC on time.",
    signals: ["Savannah DC: 96% capacity, shipping dock constraint", "Joliet DC: 93% capacity, pick-wave backlog", "Chesapeake DC: 87% capacity, promo window compression"],
    sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }],
    primarySourceTabId: "dc-capacity",
    segment: "Seasonal / Event, Consistent Replenishment, Promo / Merchant-Driven",
    segmentStrategy: "DC-level constraint resolution by priority segment",
    metrics: [
      { label: "Critical DCs",   value: "Savannah, Joliet" },
      { label: "Watchlist DCs",  value: "Chesapeake, Olive Branch" },
      { label: "Stable DCs",     value: "Marietta, San Bernardino" },
    ],
    humanApprovalRequired: true,
    businessImpact: "3 DCs creating network execution risk for priority SKU segments. Delayed throughput at these nodes affects delivery timing for high-value segments.",
    recommendedAction: "Approve Savannah wave change and Joliet labor flex before allocation lock.",
    guardrailNote: "DC capacity risk is monitored autonomously. Execution interventions require planner and operations sign-off.",
    actionLabel: "Go to Inventory & Allocation",
    actionTabId: "inventory",
    secondaryLabel: "Mark for Review",
  },
  {
    title: "Trailer Dwell — 18.6 hrs",
    status: "watchlist",
    explanation: "Trailer dwell measures how long trailers sit at a DC before they are unloaded, loaded, or moved. At 18.6 hrs on average against a 12 hr target, trailers are sitting too long — creating dock and yard congestion that limits the number of inbound and outbound appointments a DC can handle per shift.",
    signals: ["18.6 hrs average dwell (target: 12 hrs)", "Savannah DC worst offender: 22.4 hrs", "Joliet DC: 19.1 hrs", "Chesapeake DC: 15.7 hrs"],
    sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }],
    primarySourceTabId: "dc-capacity",
    segment: "All Segments",
    segmentStrategy: "Dwell reduction to free dock capacity",
    metrics: [
      { label: "Average dwell",  value: "18.6 hrs" },
      { label: "Target",         value: "Below 12 hrs" },
      { label: "Worst offender", value: "Savannah DC · 22.4 hrs" },
    ],
    humanApprovalRequired: false,
    businessImpact: "High dwell is a leading indicator of dock congestion and throughput delay. Reducing dwell at Savannah and Joliet would directly improve outbound throughput for priority shipments.",
    recommendedAction: "Approve wave re-sequencing and labor flex to reduce dwell at Savannah and Joliet.",
    guardrailNote: "Dwell metrics are monitored autonomously. Recovery actions require DC operations approval.",
    secondaryLabel: "Mark for Review",
  },
  {
    title: "On-Time Store Delivery — 87.9%",
    status: "needs-approval",
    explanation: "On-time store delivery measures whether stores receive their deliveries when expected. At 87.9% against a 94% target, delivery reliability risk is creating execution gaps for stores depending on Seasonal / Event and Promo / Merchant-Driven shipments arriving on time for display and floor setup.",
    signals: ["87.9% on-time delivery (target 94%)", "Gap driven by Savannah → Southeast and Joliet → Midwest lanes", "Seasonal / Event and Promo / Merchant-Driven most affected"],
    sourceTabs: [{ label: "DC Capacity & Transportation", id: "dc-capacity" }, { label: "Store Execution", id: "store-execution" }],
    primarySourceTabId: "dc-capacity",
    segment: "Seasonal / Event, Promo / Merchant-Driven",
    segmentStrategy: "Lane-level delivery recovery for priority segments",
    metrics: [
      { label: "On-time delivery", value: "87.9% (target 94%)" },
      { label: "Gap",              value: "-6.1 pts vs target" },
      { label: "Most affected",    value: "Savannah → SE, Joliet → Midwest" },
    ],
    humanApprovalRequired: true,
    businessImpact: "Delayed delivery prevents stores from executing Seasonal / Event or Promo / Merchant-Driven plans on time, reducing sell-through and increasing markdown risk.",
    recommendedAction: "Approve wave change and overflow capacity to recover delivery reliability on P1 lanes.",
    guardrailNote: "Delivery reliability monitoring is autonomous. Recovery execution requires approval.",
    actionLabel: "Go to Store Execution",
    actionTabId: "store-execution",
    secondaryLabel: "Mark for Review",
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

const DC_OPTIONS = ["All DCs", "Savannah DC", "Joliet DC", "Chesapeake DC", "Marietta DC", "San Bernardino DC", "Olive Branch DC"]
const REGION_OPTIONS = ["All Regions", "Southeast", "Midwest", "Northeast", "Southwest", "West", "Central"]
const SEGMENT_OPTIONS = ["All Segments", "Consistent Replenishment", "Seasonal / Event", "Treasure Hunt / Limited Buy", "Promo / Merchant-Driven", "Constrained / Exception"]
const STATUS_OPTIONS = ["All Statuses", "Critical", "Watchlist", "Stable", "Needs Approval"]

const statusCfg: Record<string, { label: string; classes: string }> = {
  critical:         { label: "Critical",        classes: "bg-[var(--status-critical-bg)] text-[var(--status-critical)]" },
  watchlist:        { label: "Watchlist",       classes: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)]" },
  stable:           { label: "Stable",          classes: "bg-[var(--status-stable-bg)] text-[var(--status-stable)]" },
  "needs-approval": { label: "Needs Approval",  classes: "bg-amber-50 text-amber-700" },
  completed:        { label: "Completed",       classes: "bg-[var(--status-stable-bg)] text-[var(--status-stable)]" },
  pending:          { label: "Pending Approval", classes: "bg-amber-50 text-amber-700" },
  approved:         { label: "Approved",        classes: "bg-emerald-50 text-emerald-700" },
  "above-target":   { label: "Above Target",    classes: "bg-red-50 text-red-700" },
  "below-target":   { label: "Below Target",    classes: "bg-red-50 text-red-700" },
}

function Badge({ status, label }: { status: string; label?: string }) {
  const cfg = statusCfg[status] ?? { label: status, classes: "bg-muted text-muted-foreground" }
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold", cfg.classes)}>
      {label ?? cfg.label}
    </span>
  )
}

function SelectFilter({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 px-2.5 pr-7 text-xs font-medium bg-background border border-border rounded-lg text-foreground appearance-none hover:border-primary/40 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30"
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

interface DCCapacityTransportPageProps {
  onGoToTab?: (tab: string) => void
}

export default function DCCapacityTransportPage({ onGoToTab }: DCCapacityTransportPageProps) {
  const [dcFilter, setDcFilter]         = useState("All DCs")
  const [regionFilter, setRegionFilter] = useState("All Regions")
  const [segmentFilter, setSegmentFilter] = useState("All Segments")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [search, setSearch]             = useState("")
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, string>>({})
  const aiModuleRef = useRef<HTMLDivElement>(null)

  function openDrawer(payload: DrawerPayload) {
    setDrawerPayload(payload)
    setDrawerOpen(true)
  }
  function closeDrawer() { setDrawerOpen(false) }

  function handleApprove(id: string) {
    setApprovalStatuses((prev) => ({ ...prev, [id]: "approved" }))
  }

  function handleGoToTab(tabId: string) {
    closeDrawer()
    onGoToTab?.(tabId)
  }

  function scrollToAiModule() {
    aiModuleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const searchLower = search.toLowerCase()

  const filteredDCs = DC_CARDS.filter((dc) => {
    if (dcFilter !== "All DCs" && dc.name !== dcFilter) return false
    if (regionFilter !== "All Regions" && dc.region !== regionFilter) return false
    if (statusFilter !== "All Statuses" && dc.status !== statusFilter.toLowerCase()) return false
    if (segmentFilter !== "All Segments" && !dc.segments.some((s) => s === segmentFilter)) return false
    if (search && !dc.name.toLowerCase().includes(searchLower) && !dc.region.toLowerCase().includes(searchLower) && !dc.constraint.toLowerCase().includes(searchLower)) return false
    return true
  })

  const filteredLanes = LANE_ROWS.filter((lane) => {
    if (statusFilter !== "All Statuses" && lane.status !== statusFilter.toLowerCase()) return false
    if (segmentFilter !== "All Segments" && lane.segment !== segmentFilter) return false
    if (search && !lane.lane.toLowerCase().includes(searchLower) && !lane.segment.toLowerCase().includes(searchLower)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      {/* ── Section 1: Header ── */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-foreground">DC Capacity &amp; Transportation</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            DC capacity, outbound flow, trailer dwell, and delivery risk for priority SKU segments
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--status-stable-bg)] text-[var(--status-stable)]">
            Network execution active
          </span>
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
            Last refresh: Jun 7, 2026 · 8:30 AM
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-card border-b border-border px-6 py-2.5 flex items-center gap-2 flex-wrap">
        <SelectFilter value={dcFilter}      onChange={setDcFilter}      options={DC_OPTIONS} />
        <SelectFilter value={regionFilter}  onChange={setRegionFilter}  options={REGION_OPTIONS} />
        <SelectFilter value={segmentFilter} onChange={setSegmentFilter} options={SEGMENT_OPTIONS} />
        <SelectFilter value={statusFilter}  onChange={setStatusFilter}  options={STATUS_OPTIONS} />
        <div className="relative ml-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search DC, lane, SKU segment, route, or region"
            className="h-8 pl-8 pr-3 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 w-72"
          />
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <button className="h-8 flex items-center gap-1.5 px-3 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button className="h-8 flex items-center gap-1.5 px-3 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">

        {/* ── Section 2: KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { kpi: KPI_DRAWERS[0], value: "91.3%",    sub: "Of planned daily volume",    badgeStatus: "watchlist",       badgeLabel: "Watchlist",      footer: "Network is processing most planned flow, but capacity buffers are thin" },
            { kpi: KPI_DRAWERS[1], value: "3",         sub: "Savannah, Joliet, Chesapeake", badgeStatus: "critical",     badgeLabel: "Critical",       footer: "DCs where dock, pick, yard, or labor pressure may delay priority flow" },
            { kpi: KPI_DRAWERS[2], value: "18.6 hrs",  sub: "Target below 12 hrs",       badgeStatus: "above-target",    badgeLabel: "Above Target",   footer: "Long dwell limits dock availability and slows outbound execution" },
            { kpi: KPI_DRAWERS[3], value: "87.9%",     sub: "Target 94%",                badgeStatus: "below-target",    badgeLabel: "Below Target",   footer: "Delivery reliability risk for priority stores and segments" },
          ].map(({ kpi, value, sub, badgeStatus, badgeLabel, footer }, i) => (
            <button
              key={i}
              onClick={() => openDrawer(kpi)}
              className="group text-left bg-card rounded-2xl border border-border px-4 py-4 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground leading-snug">{kpi.title.split(" — ")[0]}</p>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
              <p className="text-[11px] text-muted-foreground mb-2.5">{sub}</p>
              <Badge status={badgeStatus} label={badgeLabel} />
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">{footer}</p>
            </button>
          ))}
        </div>

        {/* ── Section 3: DC Capacity Risk Overview ── */}
        <section className="rounded-2xl border border-border bg-card px-6 py-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">DC Capacity Risk Overview</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Capacity and execution pressure by distribution center</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredDCs.map((dc) => (
              <button
                key={dc.id}
                onClick={() => openDrawer(dc.drawer)}
                className="group text-left rounded-xl border border-border bg-background px-4 py-4 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{dc.name}</p>
                    <p className="text-[11px] text-muted-foreground">{dc.region}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge status={dc.status} />
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] mb-3">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className={cn("font-semibold", dc.capacity >= 90 ? "text-red-600" : dc.capacity >= 85 ? "text-amber-600" : "text-[var(--status-stable)]")}>{dc.capacity}%</span>
                  <span className="text-muted-foreground">Trailer dwell</span>
                  <span className={cn("font-semibold", parseFloat(dc.dwell) > 16 ? "text-red-600" : parseFloat(dc.dwell) > 13 ? "text-amber-600" : "text-[var(--status-stable)]")}>{dc.dwell}</span>
                </div>
                <div className="mb-2">
                  <p className="text-[11px] text-muted-foreground">Primary constraint</p>
                  <p className="text-[11px] font-medium text-foreground">{dc.constraint}</p>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {dc.segments.map((s) => (
                    <span key={s} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/8 text-primary">{s}</span>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground italic">{dc.recommendation}</p>
              </button>
            ))}
            {filteredDCs.length === 0 && (
              <p className="col-span-3 text-xs text-muted-foreground py-4 text-center">No DCs match current filters.</p>
            )}
          </div>
        </section>

        {/* ── Section 4: Transportation Lane Risk Matrix ── */}
        <section className="rounded-2xl border border-border bg-card px-6 py-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">Transportation Lane Risk Matrix</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Top outbound lane risks by DC, region, priority segment, delivery reliability, and recovery action</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {["Priority", "Lane", "Priority Segment", "On-Time Delivery", "Trailer Util.", "Late Routes", "Issue", "AI Recommendation", "Status"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground pb-2.5 pr-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLanes.map((lane) => (
                  <tr
                    key={lane.id}
                    onClick={() => openDrawer(lane.drawer)}
                    className="border-b border-border/60 hover:bg-muted/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 pr-4">
                      <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold", lane.priority === "P1" ? "bg-red-50 text-red-700" : lane.priority === "P2" ? "bg-amber-50 text-amber-700" : "bg-muted text-muted-foreground")}>
                        {lane.priority}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 font-medium text-foreground whitespace-nowrap">{lane.lane}</td>
                    <td className="py-2.5 pr-4">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/8 text-primary whitespace-nowrap">{lane.segment}</span>
                    </td>
                    <td className={cn("py-2.5 pr-4 font-semibold", parseFloat(lane.otd) < 88 ? "text-red-600" : parseFloat(lane.otd) < 92 ? "text-amber-600" : "text-[var(--status-stable)]")}>{lane.otd}</td>
                    <td className={cn("py-2.5 pr-4 font-semibold", parseInt(lane.trailerUtil) >= 95 ? "text-red-600" : parseInt(lane.trailerUtil) >= 88 ? "text-amber-600" : "text-foreground")}>{lane.trailerUtil}</td>
                    <td className={cn("py-2.5 pr-4 font-semibold", lane.lateRoutes >= 14 ? "text-red-600" : lane.lateRoutes >= 8 ? "text-amber-600" : "text-foreground")}>{lane.lateRoutes}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground max-w-[160px]">{lane.issue}</td>
                    <td className="py-2.5 pr-4 text-primary max-w-[180px] group-hover:underline">{lane.recommendation}</td>
                    <td className="py-2.5"><Badge status={lane.status} /></td>
                  </tr>
                ))}
                {filteredLanes.length === 0 && (
                  <tr><td colSpan={9} className="py-4 text-center text-muted-foreground">No lanes match current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 5: AI Actions & Human Approvals ── */}
        <section ref={aiModuleRef} className="rounded-2xl border border-border bg-card px-6 py-5">
          {/* Module header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-semibold text-foreground">AI Actions &amp; Human Approvals</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary">
                  <Bot className="w-3 h-3" /> AGENTIC AI
                </span>
              </div>
              <p className="text-xs text-muted-foreground">What the AI has prioritized within network guardrails, and what still requires operations approval before execution</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: AI Actions Completed */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI Actions Completed</p>
              <div className="space-y-2">
                {dcActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => openDrawer(action.drawer)}
                    className="group w-full text-left rounded-xl border border-border bg-background px-4 py-3.5 hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-[13px] font-semibold text-foreground leading-snug">{action.title}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {action.status === "completed"
                          ? <CheckCircle2 className="w-4 h-4 text-[var(--status-stable)]" />
                          : <Clock className="w-4 h-4 text-amber-500" />
                        }
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/8 text-primary">{action.segment}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">{action.sourceTab}</span>
                      <Badge status={action.status} />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{action.actionTaken}</p>
                    {action.drawer.metrics?.[4]?.value && (
                      <p className="text-[10px] text-muted-foreground/70 mt-1.5">{action.drawer.metrics[4].value}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Human Approval Required */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Human Approval Required</p>
              <div className="space-y-2">
                {dcApprovals.map((approval) => {
                  const currentStatus = approvalStatuses[approval.id] ?? approval.status
                  const isApproved = currentStatus === "approved"
                  return (
                    <div
                      key={approval.id}
                      className={cn(
                        "rounded-xl border bg-background px-4 py-3.5 transition-all",
                        isApproved ? "border-emerald-200 bg-emerald-50/40" : "border-border"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-[13px] font-semibold text-foreground leading-snug">{approval.title}</p>
                        {isApproved
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          : <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        }
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/8 text-primary">{approval.segment}</span>
                        <Badge status={isApproved ? "approved" : currentStatus} />
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-1 leading-relaxed">{approval.recommendation}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-red-600 font-semibold">
                          <AlertTriangle className="inline w-3 h-3 mr-0.5 -mt-0.5" />
                          {approval.valueAtRisk} at risk
                        </span>
                        <span className="text-[11px] text-muted-foreground">{approval.owner}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {!isApproved && (
                          <button
                            onClick={() => handleApprove(approval.id)}
                            className="flex-1 h-7 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors"
                          >
                            {approval.id === "dc-ap-1" ? "Approve Wave Change" : approval.id === "dc-ap-2" ? "Approve Capacity" : "Approve Labor Flex"}
                          </button>
                        )}
                        <button
                          onClick={() => openDrawer({ ...approval.drawer, status: (isApproved ? "approved" : approval.drawer.status) as DrawerPayload["status"] })}
                          className={cn(
                            "h-7 rounded-lg border border-border text-[11px] font-medium hover:bg-muted transition-colors px-3",
                            isApproved ? "flex-1" : ""
                          )}
                        >
                          {isApproved ? "View Approval" : "Review"}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 6: Summary ── */}
        <section className="rounded-2xl border border-border bg-card px-6 py-5">
          <h2 className="text-sm font-semibold text-foreground mb-2">DC Capacity &amp; Transportation Summary</h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Network execution risk is concentrated in Savannah and Joliet, where dock utilization, pick-wave pressure, trailer dwell, and route saturation may delay priority SKU segments. The main risk is not whether inventory exists, but whether the network can process and deliver it on time. Marietta and San Bernardino have available capacity that can support selected rebalance moves.
          </p>
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start justify-between gap-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-semibold">Recommended next step:</span>{" "}
              <button
                onClick={() => openDrawer(dcApprovals[0].drawer)}
                className="underline underline-offset-2 hover:text-amber-900 transition-colors"
              >
                Approve Savannah outbound wave change
              </button>
              {" "}and protect priority delivery lanes before the Jun 10 allocation lock.
            </p>
            <button
              onClick={scrollToAiModule}
              className="shrink-0 h-7 px-3 rounded-lg bg-amber-100 border border-amber-200 text-[11px] font-semibold text-amber-800 hover:bg-amber-200 transition-colors whitespace-nowrap"
            >
              Open approval workbench
            </button>
          </div>
        </section>

      </div>

      {/* Detail drawer */}
      <SKUDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={closeDrawer}
        onGoToTab={handleGoToTab}
      />
    </div>
  )
}
