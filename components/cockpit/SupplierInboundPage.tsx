"use client"

import { useState } from "react"
import { RefreshCw, Download, Search, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import SKUDetailDrawer from "./SKUDetailDrawer"
import type { DrawerPayload } from "./SKUData"
import AIActionsModule from "./AIActionsModule"
import { supplierActions, supplierApprovals } from "./AIActionsData"

// ─── constants ────────────────────────────────────────────────────────────────

const supplierOptions = ["All Suppliers","GreenLeaf Seasonal Imports","ValuePack Consumables Co.","BrightParty Goods","HomeBase Essentials","CareWell Beauty Supply","Everyday Basics Manufacturing"]
const segmentOptions  = ["All Segments","Consistent Replenishment","Seasonal / Event","Treasure Hunt / Limited Buy","Promo / Merchant-Driven","Constrained / Exception"]
const dcOptions       = ["All DCs","Savannah DC","Joliet DC","Chesapeake DC","Marietta DC","San Bernardino DC","Olive Branch DC"]
const statusOptions   = ["All Statuses","Critical","Watchlist","Recovering","Stable","Needs Approval"]

const selectCls = "h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"

// ─── KPI data ─────────────────────────────────────────────────────────────────

const kpis: Array<{
  title: string; value: string; subtext: string; badge: string;
  badgeCls: string; footer: string; drawer: DrawerPayload
}> = [
  {
    title: "Supplier OTIF",
    value: "82.7%",
    subtext: "Target 92%",
    badge: "Below Target",
    badgeCls: "bg-red-50 text-red-700 border border-red-200",
    footer: "On-time, in-full performance across priority suppliers",
    drawer: {
      title: "Supplier OTIF — 82.7%",
      status: "critical",
      explanation: "OTIF (On Time In Full) measures whether suppliers are delivering purchase orders on time and at the committed quantity. At 82.7% against a 92% target, current supplier performance is degrading inventory availability and allocation plan reliability.",
      signals: ["OTIF: 82.7% vs 92% target", "9.3 percentage point gap to target", "Seasonal / Event and Consistent Replenishment most affected", "Fill-rate and ETA variance driving shortfall"],
      sourceTabs: [{ label: "Supplier & Inbound Flow", id: "supplier-inbound" }, { label: "Inventory & Allocation", id: "inventory" }],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "Current OTIF",   value: "82.7%" },
        { label: "Target OTIF",    value: "92%" },
        { label: "Gap to target",  value: "-9.3 pts" },
        { label: "Impact",         value: "Allocation plan reliability reduced" },
      ],
      businessImpact: "Below-target OTIF means inventory needed for allocation plans is not arriving as committed, increasing downstream service risk.",
      recommendedAction: "Focus recovery on the P1 and P2 rows in the Supplier / PO Risk Matrix.",
    },
  },
  {
    title: "At-Risk POs",
    value: "43",
    subtext: "18 critical · 25 watchlist",
    badge: "Critical",
    badgeCls: "bg-red-50 text-red-700 border border-red-200",
    footer: "Open purchase orders with timing, fill-rate, or documentation risk",
    drawer: {
      title: "43 At-Risk Purchase Orders",
      status: "critical",
      explanation: "43 open purchase orders have been flagged with timing, fill-rate, ASN documentation, or DC receipt readiness risk. 18 are classified as critical — requiring immediate action — and 25 are on watchlist.",
      signals: ["43 total at-risk POs", "18 critical: immediate action required", "25 watchlist: monitoring required", "Risk types: ETA slippage, fill-rate, ASN gaps, appointment pending"],
      sourceTabs: [{ label: "Supplier & Inbound Flow", id: "supplier-inbound" }],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "Critical POs",   value: "18" },
        { label: "Watchlist POs",  value: "25" },
        { label: "Total at-risk",  value: "43" },
        { label: "Risk matrix",    value: "See Supplier / PO Risk Matrix below" },
      ],
      businessImpact: "43 at-risk POs represent potential inventory arrival failures that translate directly into allocation shortfalls and store service gaps.",
      recommendedAction: "Prioritize P1 critical POs in the Supplier / PO Risk Matrix and approve recovery actions.",
    },
  },
  {
    title: "Inbound Value at Risk",
    value: "$9.8M",
    subtext: "Across flagged supplier and PO risks",
    badge: "High",
    badgeCls: "bg-amber-50 text-amber-700 border border-amber-200",
    footer: "Inbound exposure tied to allocation and service risk",
    drawer: {
      title: "Inbound Value at Risk — $9.8M",
      status: "watchlist",
      explanation: "$9.8M represents the total inbound inventory value at risk across all flagged supplier and PO issues. This is not guaranteed lost sales — it is the value of inventory at risk of arriving late, short, or not ready for DC receipt. The top visible risks in the matrix account for a portion of this exposure.",
      signals: ["$9.8M total inbound value at risk", "Top visible matrix rows: $5.5M combined", "Remaining exposure distributed across watchlist POs", "Not all risks require immediate action"],
      sourceTabs: [{ label: "Supplier & Inbound Flow", id: "supplier-inbound" }, { label: "Inventory & Allocation", id: "inventory" }],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "Total at risk",   value: "$9.8M" },
        { label: "Critical share",  value: "~$2.7M (P1 rows)" },
        { label: "Watchlist share", value: "~$7.1M (P2/P3 rows + other)" },
        { label: "Recovery target", value: "Prioritize P1 before Jun 10" },
      ],
      businessImpact: "Unresolved inbound risks translate into allocation plan failures and downstream store service gaps.",
      recommendedAction: "Resolve P1 critical approvals before the Jun 10 allocation lock.",
    },
  },
  {
    title: "Avg Lead-Time Variance",
    value: "+4.6 days",
    subtext: "Largest variance in Seasonal / Event",
    badge: "Watchlist",
    badgeCls: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    footer: "Average delay versus planned inbound lead time",
    drawer: {
      title: "Avg Lead-Time Variance — +4.6 Days",
      status: "watchlist",
      explanation: "+4.6 days means inbound flow across priority POs is running later than planned on average. Seasonal / Event SKUs carry the largest impact because their selling window is short — a 7-day ETA slip on a seasonal PO is especially damaging relative to the available time to sell.",
      signals: ["+4.6 days average vs planned lead time", "Seasonal / Event: largest individual variance (+7 days on PO-78421)", "Consistent Replenishment: +3.1 days average", "Variance driven by supplier commit slippage and ASN gaps"],
      sourceTabs: [{ label: "Supplier & Inbound Flow", id: "supplier-inbound" }],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "Avg variance",            value: "+4.6 days" },
        { label: "Seasonal / Event",        value: "+7.0 days (PO-78421)" },
        { label: "Consistent Replenishment", value: "+3.1 days avg" },
        { label: "Impact",                  value: "Selling window compression for Seasonal" },
      ],
      businessImpact: "Lead-time variance compresses the available selling and receipt window for time-sensitive SKU segments, especially Seasonal / Event.",
      recommendedAction: "Approve expedite for GreenLeaf PO-78421 and monitor remaining Seasonal / Event inbound POs.",
    },
  },
]

// ─── Inbound Flow stages ───────────────────────────────────────────────────────

type FlowStatus = "watchlist" | "critical" | "stable" | "completed"

const flowStages: Array<{
  stage: string; pos: number; value: string; atRisk: number; status: FlowStatus;
  primaryIssue: string; segmentsImpacted: string; nextStep: string;
}> = [
  {
    stage: "Supplier Commit",
    pos: 126,
    value: "$32.4M",
    atRisk: 9,
    status: "watchlist",
    primaryIssue: "Some supplier commit dates have slipped, creating early-stage uncertainty on delivery timing.",
    segmentsImpacted: "Seasonal / Event, Consistent Replenishment",
    nextStep: "Monitor commit accuracy for P1 suppliers and escalate slippage early.",
  },
  {
    stage: "PO Confirmed",
    pos: 104,
    value: "$28.7M",
    atRisk: 11,
    status: "watchlist",
    primaryIssue: "11 confirmed POs have timing or fill-rate risk that has not yet been resolved at the supplier level.",
    segmentsImpacted: "Seasonal / Event, Promo / Merchant-Driven",
    nextStep: "Confirm receipt timing for P1 and P2 POs before allocation release.",
  },
  {
    stage: "ASN Received",
    pos: 81,
    value: "$21.3M",
    atRisk: 14,
    status: "critical",
    primaryIssue: "ASN and documentation gaps are creating uncertainty on what will arrive and when.",
    segmentsImpacted: "Seasonal / Event, Consistent Replenishment",
    nextStep: "Prioritize ASN validation for POs linked to allocation-critical SKU segments.",
  },
  {
    stage: "In Transit",
    pos: 62,
    value: "$18.9M",
    atRisk: 7,
    status: "watchlist",
    primaryIssue: "7 in-transit POs have timing uncertainty due to carrier delays and route changes.",
    segmentsImpacted: "Consistent Replenishment, Constrained / Exception",
    nextStep: "Monitor in-transit POs and pre-position DC appointments for critical arrivals.",
  },
  {
    stage: "DC Receipt Ready",
    pos: 48,
    value: "$14.6M",
    atRisk: 2,
    status: "stable",
    primaryIssue: "2 POs with minor DC appointment timing uncertainty — not expected to impact allocation.",
    segmentsImpacted: "Constrained / Exception",
    nextStep: "Confirm final appointment times and close out receipt readiness checklist.",
  },
]

const flowStatusConfig: Record<FlowStatus, { label: string; cls: string }> = {
  critical:   { label: "Critical",   cls: "bg-red-50 text-red-700 border-red-200" },
  watchlist:  { label: "Watchlist",  cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  stable:     { label: "Stable",     cls: "bg-green-50 text-green-700 border-green-200" },
  completed:  { label: "Completed",  cls: "bg-green-50 text-green-700 border-green-200" },
}

// ─── Risk Matrix rows ──────────────────────────────────────────────────────────

type RiskLevel = "Critical" | "Watchlist" | "Rebalance" | "Stable"

interface RiskRow {
  priority: "P1" | "P2" | "P3"
  supplier: string
  po: string
  segment: string
  example: string
  dc: string
  issue: string
  valueAtRisk: string
  storesExposed: string
  aiRec: string
  status: RiskLevel
  rootCause: string
  humanApproval: string
  relatedTabs: string[]
  relatedTabIds: string[]
}

const riskRows: RiskRow[] = [
  {
    priority: "P1",
    supplier: "GreenLeaf Seasonal Imports",
    po: "PO-78421",
    segment: "Seasonal / Event",
    example: "Halloween décor",
    dc: "Savannah DC",
    issue: "ETA slipped 7 days",
    valueAtRisk: "$1.6M",
    storesExposed: "42",
    aiRec: "Expedite or substitute",
    status: "Critical",
    rootCause: "Seasonal / Event inbound ETA slipped 7 days and may miss the allocation window for Southeast stores.",
    humanApproval: "Yes — expedite cost and substitution tradeoff require management approval.",
    relatedTabs: ["Demand Planning", "Inventory & Allocation", "DC Capacity & Transportation"],
    relatedTabIds: ["demand", "inventory", "dc-capacity"],
  },
  {
    priority: "P1",
    supplier: "ValuePack Consumables Co.",
    po: "PO-78104",
    segment: "Consistent Replenishment",
    example: "Paper goods",
    dc: "Joliet DC",
    issue: "Short shipment: 82% fill vs 96% expected",
    valueAtRisk: "$1.1M",
    storesExposed: "31",
    aiRec: "Prioritize recovery for high-velocity stores",
    status: "Critical",
    rootCause: "Short shipment reduces fill for Consistent Replenishment SKUs supporting Midwest high-velocity stores.",
    humanApproval: "Yes — substitution and supplier recovery decisions require planner approval.",
    relatedTabs: ["Inventory & Allocation"],
    relatedTabIds: ["inventory"],
  },
  {
    priority: "P2",
    supplier: "BrightParty Goods",
    po: "PO-77988",
    segment: "Promo / Merchant-Driven",
    example: "Party endcap",
    dc: "Chesapeake DC",
    issue: "Promo timing changed; receipt date uncertain",
    valueAtRisk: "$860K",
    storesExposed: "14",
    aiRec: "Confirm merchant calendar",
    status: "Watchlist",
    rootCause: "Promotion timing changed and receipt date uncertainty may affect Party endcap execution.",
    humanApproval: "Yes — merchant confirmation required.",
    relatedTabs: ["Demand Planning", "Store Execution"],
    relatedTabIds: ["demand", "store-execution"],
  },
  {
    priority: "P2",
    supplier: "Everyday Basics Manufacturing",
    po: "PO-78293",
    segment: "Constrained / Exception",
    example: "Cleaning",
    dc: "Olive Branch DC",
    issue: "ASN received late; appointment pending",
    valueAtRisk: "$740K",
    storesExposed: "Potential delay",
    aiRec: "Confirm DC appointment",
    status: "Watchlist",
    rootCause: "ASN was received late and DC appointment is not yet confirmed.",
    humanApproval: "No immediate approval unless appointment slips.",
    relatedTabs: ["DC Capacity & Transportation"],
    relatedTabIds: ["dc-capacity"],
  },
  {
    priority: "P3",
    supplier: "HomeBase Essentials",
    po: "PO-78002",
    segment: "Treasure Hunt / Limited Buy",
    example: "Home goods",
    dc: "Marietta DC",
    issue: "Early receipt contributing to overstock",
    valueAtRisk: "$720K carrying risk",
    storesExposed: "18",
    aiRec: "Slow or redirect",
    status: "Rebalance",
    rootCause: "Early receipt is contributing to overstock risk in Marietta DC.",
    humanApproval: "Yes — inbound flow change affects DC and transportation plan.",
    relatedTabs: ["Inventory & Allocation", "DC Capacity & Transportation"],
    relatedTabIds: ["inventory", "dc-capacity"],
  },
  {
    priority: "P3",
    supplier: "CareWell Beauty Supply",
    po: "PO-77611",
    segment: "Constrained / Exception",
    example: "Health basics",
    dc: "San Bernardino DC",
    issue: "On track",
    valueAtRisk: "$520K monitored",
    storesExposed: "No material risk",
    aiRec: "Maintain current plan",
    status: "Stable",
    rootCause: "This PO is on track. No immediate action required.",
    humanApproval: "No approval required.",
    relatedTabs: [],
    relatedTabIds: [],
  },
]

const riskStatusConfig: Record<RiskLevel, { cls: string }> = {
  Critical:  { cls: "bg-red-50 text-red-700 border border-red-200" },
  Watchlist: { cls: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  Rebalance: { cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  Stable:    { cls: "bg-green-50 text-green-700 border border-green-200" },
}

const priorityCls: Record<string, string> = {
  P1: "bg-red-100 text-red-700 font-bold",
  P2: "bg-yellow-100 text-yellow-700 font-semibold",
  P3: "bg-gray-100 text-gray-600",
}

// ─── page ──────────────────────────────────────────────────────────────────────

interface SupplierInboundPageProps {
  onGoToTab?: (tab: string) => void
}

export default function SupplierInboundPage({ onGoToTab }: SupplierInboundPageProps) {
  const [supplier,  setSupplier]  = useState("All Suppliers")
  const [segment,   setSegment]   = useState("All Segments")
  const [dc,        setDc]        = useState("All DCs")
  const [status,    setStatus]    = useState("All Statuses")
  const [search,    setSearch]    = useState("")
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  function openDrawer(p: DrawerPayload) { setDrawerPayload(p); setDrawerOpen(true) }
  function closeDrawer()               { setDrawerOpen(false); setDrawerPayload(null) }

  function rowToDrawer(row: RiskRow): DrawerPayload {
    return {
      title: `${row.supplier} · ${row.po}`,
      status: row.status === "Critical" ? "critical" : row.status === "Watchlist" ? "watchlist" : row.status === "Rebalance" ? "pending" : "stable",
      explanation: row.rootCause,
      signals: [
        `Issue: ${row.issue}`,
        `Value at risk: ${row.valueAtRisk}`,
        `Stores exposed: ${row.storesExposed}`,
        `Destination DC: ${row.dc}`,
        `Human approval: ${row.humanApproval}`,
      ],
      sourceTabs: [
        { label: "Supplier & Inbound Flow", id: "supplier-inbound" },
        ...row.relatedTabIds.map((id) => ({ label: row.relatedTabs[row.relatedTabIds.indexOf(id)], id })),
      ],
      primarySourceTabId: "supplier-inbound",
      segment: row.segment,
      segmentStrategy: row.aiRec,
      metrics: [
        { label: "Priority",        value: row.priority },
        { label: "SKU segment",     value: row.segment },
        { label: "Example",         value: row.example },
        { label: "Destination DC",  value: row.dc },
        { label: "Issue",           value: row.issue },
        { label: "Value at risk",   value: row.valueAtRisk },
        { label: "Stores exposed",  value: row.storesExposed },
      ],
      humanApprovalRequired: row.humanApproval.startsWith("Yes"),
      businessImpact: `${row.valueAtRisk} value at risk with ${row.storesExposed} stores potentially exposed if this issue is not resolved.`,
      recommendedAction: row.aiRec,
      actionLabel: row.relatedTabIds[0] ? `Go to ${row.relatedTabs[0]}` : undefined,
      actionTabId: row.relatedTabIds[0],
      secondaryLabel: "Mark for Review",
    }
  }

  function flowToDrawer(f: typeof flowStages[0]): DrawerPayload {
    return {
      title: `Inbound Flow — ${f.stage}`,
      status: f.status === "critical" ? "critical" : f.status === "watchlist" ? "watchlist" : "stable",
      explanation: f.primaryIssue,
      signals: [
        `${f.pos} POs at this stage`,
        `${f.value} total value`,
        `${f.atRisk} at-risk POs`,
        `SKU segments: ${f.segmentsImpacted}`,
      ],
      sourceTabs: [{ label: "Supplier & Inbound Flow", id: "supplier-inbound" }],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "PO count",          value: `${f.pos} POs` },
        { label: "Total value",       value: f.value },
        { label: "At-risk POs",       value: `${f.atRisk}` },
        { label: "Segments impacted", value: f.segmentsImpacted },
      ],
      businessImpact: `${f.atRisk} at-risk POs at the ${f.stage} stage represent potential disruptions to inbound flow and downstream allocation.`,
      recommendedAction: f.nextStep,
    }
  }

  return (
    <>
      <div className="flex flex-col gap-5 px-6 py-5 max-w-[1400px] mx-auto w-full">

        {/* ── Section 1: Header + filters ──────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">Supplier &amp; Inbound Flow</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Supplier reliability, purchase order risk, inbound timing, and receipt readiness by AI-defined SKU segment
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              Inbound cycle active
            </span>
            <span className="text-xs text-muted-foreground">Last refresh: Jun 7, 2026 &middot; 8:30 AM</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl px-4 py-3 flex flex-wrap items-center gap-2.5">
          <select value={supplier} onChange={(e) => setSupplier(e.target.value)} className={selectCls}>
            {supplierOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
          <select value={segment} onChange={(e) => setSegment(e.target.value)} className={selectCls}>
            {segmentOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
          <select value={dc} onChange={(e) => setDc(e.target.value)} className={selectCls}>
            {dcOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
            {statusOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search supplier, PO, SKU segment, DC, or risk"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full text-xs bg-background border border-border rounded-md pl-8 pr-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Download className="w-3.5 h-3.5" />Export
            </Button>
          </div>
        </div>

        {/* ── Section 2: KPI cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <button
              key={kpi.title}
              onClick={() => openDrawer(kpi.drawer)}
              className="bg-card border border-border rounded-xl p-4 text-left group hover:border-primary/40 hover:shadow-sm transition-all flex flex-col gap-1"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-medium text-muted-foreground">{kpi.title}</p>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-foreground leading-none">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground">{kpi.subtext}</p>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit mt-0.5", kpi.badgeCls)}>
                {kpi.badge}
              </span>
              <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{kpi.footer}</p>
            </button>
          ))}
        </div>

        {/* ── Section 3: Inbound Flow Status ───────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="mb-3">
            <p className="text-[13px] font-semibold text-foreground">Inbound Flow Status</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Purchase order flow from supplier commitment through DC receipt</p>
          </div>
          <div className="flex flex-wrap items-stretch gap-0">
            {flowStages.map((stage, i) => {
              const cfg = flowStatusConfig[stage.status]
              return (
                <div key={stage.stage} className="flex items-stretch flex-1 min-w-[130px]">
                  <button
                    onClick={() => openDrawer(flowToDrawer(stage))}
                    className="flex-1 bg-background border border-border rounded-xl p-3.5 text-left group hover:border-primary/40 hover:shadow-sm transition-all flex flex-col gap-1.5"
                  >
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{stage.stage}</p>
                    <p className="text-[15px] font-bold text-foreground leading-none">{stage.pos} POs</p>
                    <p className="text-[11px] text-muted-foreground">{stage.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stage.atRisk} at risk</p>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit", cfg.cls)}>
                      {cfg.label}
                    </span>
                  </button>
                  {i < flowStages.length - 1 && (
                    <div className="flex items-center px-1.5 text-muted-foreground/40 shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-[11px] text-blue-700">
              <span className="font-semibold">Insight: </span>
              ASN gaps, short shipments, and DC appointment constraints are the largest upstream drivers of current allocation risk.
            </p>
          </div>
        </div>

        {/* ── Section 4: Supplier / PO Risk Matrix ─────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-[13px] font-semibold text-foreground">Supplier / PO Risk Matrix</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Top inbound risks by supplier, SKU segment, destination DC, value exposure, and recommended recovery action
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="border-y border-border bg-muted/30">
                  {["Priority","Supplier / PO","SKU Segment / Example","Destination DC","Issue","Value at Risk","Stores Exposed","AI Recommendation","Status"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {riskRows.map((row) => (
                  <tr
                    key={row.po}
                    onClick={() => openDrawer(rowToDrawer(row))}
                    className="border-b border-border hover:bg-muted/20 cursor-pointer transition-colors group"
                  >
                    <td className="px-3 py-2.5">
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded", priorityCls[row.priority])}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-foreground leading-snug">{row.supplier}</p>
                      <p className="text-muted-foreground text-[10px]">{row.po}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="text-foreground">{row.segment}</p>
                      <p className="text-muted-foreground text-[10px]">{row.example}</p>
                    </td>
                    <td className="px-3 py-2.5 text-foreground whitespace-nowrap">{row.dc}</td>
                    <td className="px-3 py-2.5 text-foreground max-w-[180px]">{row.issue}</td>
                    <td className="px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">{row.valueAtRisk}</td>
                    <td className="px-3 py-2.5 text-foreground">{row.storesExposed}</td>
                    <td className="px-3 py-2.5 text-foreground max-w-[160px]">{row.aiRec}</td>
                    <td className="px-3 py-2.5">
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", riskStatusConfig[row.status].cls)}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Section 5: AI Actions & Human Approvals ──────────────────────── */}
        <section className="rounded-2xl border border-border bg-card px-6 py-5">
          <AIActionsModule
            actions={supplierActions}
            approvals={supplierApprovals}
            onGoToTab={onGoToTab ?? (() => {})}
          />
        </section>

        {/* ── Section 6: Summary ───────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-2">Supplier &amp; Inbound Flow Summary</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Supplier performance is below target at 82.7% OTIF, with 43 at-risk POs and $9.8M of inbound value at risk.
            The highest-impact issues are delayed Seasonal / Event inbound flow into Savannah DC, short-shipped Consistent
            Replenishment inventory into Joliet DC, and uncertain Promo / Merchant-Driven receipt timing into Chesapeake DC.
          </p>
          <div className="mt-4 px-4 py-3 bg-accent border border-border rounded-lg">
            <p className="text-xs text-accent-foreground">
              <span className="font-semibold">Recommended next step: </span>
              <button
                onClick={() => openDrawer(supplierApprovals[0]?.drawer as DrawerPayload)}
                className="underline underline-offset-2 hover:text-primary transition-colors"
              >
                Resolve critical inbound approvals
              </button>
              {" "}before the Jun 10 allocation lock.
            </p>
          </div>
        </div>

      </div>

      <SKUDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={closeDrawer}
        onGoToTab={(id) => { if (onGoToTab) onGoToTab(id); closeDrawer() }}
      />
    </>
  )
}
