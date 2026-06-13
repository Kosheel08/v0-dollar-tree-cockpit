"use client"

import { useState, useRef } from "react"
import {
  Search, RefreshCw, Download, ChevronDown, Zap, ChevronRight,
} from "lucide-react"
import SEFunnel from "./SEFunnel"
import SKUDetailDrawer from "./SKUDetailDrawer"
import type { DrawerPayload } from "./SKUData"
import AIActionsModule from "./AIActionsModule"
import { storeActions, storeApprovals } from "./AIActionsData"
import type { DetailItem } from "./SEData"
import SEDetailDrawer from "./SEDetailDrawer"

// ─── types ─────────────────────────────────────────────────────────────────────
type RiskStatus = "Critical" | "Behind" | "Watchlist" | "On Track" | "Complete"

// ─── helpers ───────────────────────────────────────────────────────────────────
function statusBadge(s: RiskStatus) {
  if (s === "Critical")  return "bg-red-100 text-red-700 border-red-200"
  if (s === "Behind")    return "bg-amber-100 text-amber-700 border-amber-200"
  if (s === "Watchlist") return "bg-blue-100 text-blue-700 border-blue-200"
  if (s === "On Track")  return "bg-emerald-100 text-emerald-700 border-emerald-200"
  return "bg-gray-100 text-gray-600 border-gray-200"
}

function kpiStatusBadge(s: RiskStatus) {
  return `text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge(s)}`
}

function FilterSelect({ options }: { options: string[] }) {
  const [val, setVal] = useState(options[0])
  return (
    <div className="relative">
      <select
        value={val}
        onChange={e => setVal(e.target.value)}
        className="appearance-none text-xs font-medium bg-background border border-border rounded-lg pl-3 pr-7 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
    </div>
  )
}

// ─── KPI data ──────────────────────────────────────────────────────────────────
const kpiCards: {
  title: string; value: string; subtext: string; status: RiskStatus; footer: string; drawer: DrawerPayload
}[] = [
  {
    title: "Execution Score",
    value: "78.6",
    subtext: "Target 88",
    status: "Behind",
    footer: "Composite view of store execution readiness after delivery",
    drawer: {
      title: "Execution Score · 78.6",
      status: "watchlist",
      explanation: "The Execution Score is a composite measure of store execution readiness after delivery receipt. It aggregates performance across delivery-to-shelf cycle time, backroom aging, display setup completion, and inventory verification. The current score of 78.6 is 9.4 points below the 88 target.",
      signals: ["Delivery-to-Shelf Cycle: 31.4 hrs vs <24 hr target", "Backroom Aging: $4.3M aged >48 hrs", "Display Readiness: 59% promo setups complete", "Shelf Verified: 57% of stores"],
      sourceTabs: [{ label: "Store Execution", id: "store-execution" }],
      primarySourceTabId: "store-execution",
      segment: "All Segments",
      segmentStrategy: "Composite execution score — delivery through verification",
      metrics: [
        { label: "Score",              value: "78.6 / 100" },
        { label: "Target",             value: "88" },
        { label: "Gap",                value: "−9.4 pts" },
        { label: "Primary driver",     value: "Backroom aging + display readiness" },
      ],
      humanApprovalRequired: false,
      businessImpact: "A score of 78.6 means roughly 21% of delivered inventory is not fully available to customers due to execution gaps across receiving, backroom, shelf stocking, display setup, and verification.",
      recommendedAction: "Focus on backroom aging (P1 field action) and display readiness (P1 approval) to close the largest components of the score gap.",
      guardrailNote: "Score is a diagnostic measure — it does not trigger automated actions.",
    },
  },
  {
    title: "Delivery-to-Shelf Cycle",
    value: "31.4 hrs",
    subtext: "Target <24 hrs",
    status: "Behind",
    footer: "Median time from delivery check-in to shelf availability",
    drawer: {
      title: "Delivery-to-Shelf Cycle · 31.4 hrs",
      status: "watchlist",
      explanation: "The Delivery-to-Shelf Cycle measures how long it takes for delivered product to become available to customers on the sales floor. The current median of 31.4 hours is 7.4 hours above the <24 hr target. The primary bottleneck is put-to-shelf (31.4 hrs median) and display/endcap setup (42.0 hrs median).",
      signals: ["Put-to-Shelf median: 31.4 hrs (target <18 hrs)", "Display / Endcap Set median: 42.0 hrs", "Backroom Sorted: 13.2 hrs (target <8 hrs)", "269 stores incomplete on put-to-shelf"],
      sourceTabs: [{ label: "Store Execution", id: "store-execution" }],
      primarySourceTabId: "store-execution",
      segment: "All Segments",
      segmentStrategy: "End-to-end cycle time reduction from receiving through shelf availability",
      metrics: [
        { label: "Median cycle",       value: "31.4 hrs" },
        { label: "Target",             value: "<24 hrs" },
        { label: "Gap",                value: "+7.4 hrs" },
        { label: "Worst stage",        value: "Display / Endcap Set: 42.0 hrs" },
      ],
      humanApprovalRequired: false,
      businessImpact: "Every additional hour above target means delivered inventory is sitting in backrooms or on the floor unverified, not generating sales. A 31.4 hr median represents a material sell-through opportunity.",
      recommendedAction: "Focus on put-to-shelf labor scheduling in Districts 104 and 118, and display setup task assignment to reduce cycle time below 24 hrs.",
      guardrailNote: "Cycle time is a diagnostic measure — no automated action is triggered.",
    },
  },
  {
    title: "Backroom Aging",
    value: "$4.3M",
    subtext: "Inventory >48 hrs in backroom",
    status: "Critical",
    footer: "Delivered inventory not yet converted to shelf availability",
    drawer: {
      title: "Backroom Aging · $4.3M",
      status: "critical",
      explanation: "$4.3M of delivered inventory has been in store backrooms for more than 48 hours without being converted to shelf availability. This means the product exists in the store but is not accessible to customers. The largest contributors are Seasonal / Event totes ($1.7M, 126 stores) and Treasure Hunt household cartons ($920K, 84 stores).",
      signals: ["Seasonal / Event totes aged >48 hrs · 126 stores · $1.7M", "Treasure Hunt cartons aged >72 hrs · 84 stores · $920K", "Backroom Sorted: 74% (914 stores)", "Put-to-Shelf: 68% (842 stores)"],
      sourceTabs: [{ label: "Store Execution", id: "store-execution" }, { label: "Inventory & Allocation", id: "inventory" }],
      primarySourceTabId: "store-execution",
      segment: "Seasonal / Event + Treasure Hunt / Limited Buy",
      segmentStrategy: "Emergency backroom clearance before selling window",
      metrics: [
        { label: "Total aging value",  value: "$4.3M" },
        { label: "Seasonal / Event",   value: "$1.7M · 126 stores" },
        { label: "Treasure Hunt",      value: "$920K · 84 stores" },
        { label: "Aging threshold",    value: ">48 hrs" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$4.3M of inventory is in stores but not available to customers. Every additional hour of aging during the selling window reduces effective sell-through and increases markdown risk.",
      recommendedAction: "Approve the P1 field action for backroom aging in the AI Actions & Human Approvals section.",
      guardrailNote: "Backroom aging is tracked autonomously. Labor reallocation and DM field action require human approval.",
    },
  },
  {
    title: "Display Readiness",
    value: "59%",
    subtext: "Promo setups complete",
    status: "Critical",
    footer: "Promo and endcap execution before selling window",
    drawer: {
      title: "Display Readiness · 59%",
      status: "critical",
      explanation: "59% of promo and endcap setups are complete across the network. This matters most for Promo / Merchant-Driven and Seasonal / Event SKU segments, where product needs to be displayed before the selling window opens. 300 stores have product delivered but display not yet set, and 39 stores are missing mandatory photo verification.",
      signals: ["Display / Endcap Set: 59%, 731 stores (target >85%)", "300 stores with product delivered but display not set", "39 stores missing endcap photo verification", "Party promo window opens Jun 9"],
      sourceTabs: [{ label: "Store Execution", id: "store-execution" }, { label: "Demand Planning", id: "demand" }],
      primarySourceTabId: "store-execution",
      segment: "Promo / Merchant-Driven + Seasonal / Event",
      segmentStrategy: "Display setup prioritization before promo and seasonal selling windows",
      metrics: [
        { label: "Display readiness",  value: "59%" },
        { label: "Target",             value: ">85%" },
        { label: "Stores incomplete",  value: "300" },
        { label: "Photo missing",      value: "39 stores" },
      ],
      humanApprovalRequired: true,
      businessImpact: "300 stores with unset displays and 39 stores missing photo verification represent $520K of promo execution risk and $610K of additional exposure from party displays staged but not set before Jun 9.",
      recommendedAction: "Approve the display-readiness dependency rule in the AI Actions & Human Approvals section.",
      guardrailNote: "Display completion is tracked autonomously. Display rule and allocation dependency require merchandising and field leadership sign-off.",
    },
  },
]

// ─── Risk matrix data ──────────────────────────────────────────────────────────
type MatrixRow = {
  priority: "P1" | "P2" | "P3"
  risk: string
  workstream: string
  district: string
  segment: string
  stores: string
  valueAtRisk: string
  recommendation: string
  status: RiskStatus
  drawer: DrawerPayload
}

const riskRows: MatrixRow[] = [
  {
    priority: "P1",
    risk: "Seasonal totes aged >48 hrs",
    workstream: "Backroom Processing",
    district: "District 104 · Atlanta Metro",
    segment: "Seasonal / Event",
    stores: "126",
    valueAtRisk: "$1.7M",
    recommendation: "Prioritize backroom-to-shelf work",
    status: "Critical",
    drawer: {
      title: "Seasonal totes aged >48 hrs · District 104",
      status: "critical",
      explanation: "Seasonal / Event inventory has arrived at District 104 · Atlanta Metro stores but remains in the backroom past the 48-hour target processing window. Without immediate backroom-to-shelf prioritization, this inventory will not be available to customers during the selling window.",
      signals: ["126 stores with Seasonal / Event inventory aged >48 hrs", "District 104 · Atlanta Metro primary exposure", "$1.7M value at risk", "Selling window: Jun 9", "Labor not scheduled for backroom clearance"],
      sourceTabs: [{ label: "Store Execution", id: "store-execution" }, { label: "Inventory & Allocation", id: "inventory" }, { label: "DC Capacity & Transportation", id: "dc-capacity" }],
      primarySourceTabId: "store-execution",
      segment: "Seasonal / Event",
      segmentStrategy: "Emergency backroom-to-shelf prioritization before selling window",
      metrics: [
        { label: "Stores impacted",   value: "126" },
        { label: "Value at risk",     value: "$1.7M" },
        { label: "Inventory age",     value: ">48 hrs in backroom" },
        { label: "Selling window",    value: "Jun 9" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$1.7M of Seasonal / Event inventory is in stores but not available to customers. Without field action, this product will miss the selling window.",
      recommendedAction: "Prioritize backroom-to-shelf work for high-impact stores. Approve field action in the AI Actions & Human Approvals section.",
      guardrailNote: "Field leadership must approve labor reallocation. No automated store-level action taken.",
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    priority: "P1",
    risk: "Unassigned stocking tasks",
    workstream: "Put-to-Shelf",
    district: "District 118 · Birmingham",
    segment: "Consistent Replenishment",
    stores: "79",
    valueAtRisk: "$1.1M",
    recommendation: "Assign high-priority stocking tasks",
    status: "Critical",
    drawer: {
      title: "Unassigned stocking tasks · District 118",
      status: "critical",
      explanation: "High-volume everyday replenishment stocking tasks in District 118 · Birmingham have not been assigned to store teams. 212 open tasks across 79 stores are aging past 24 hours, meaning shelves cannot be restocked without manual intervention from store managers or district leaders.",
      signals: ["212 unassigned stocking tasks across 79 stores", "District 118 · Birmingham", "Consistent Replenishment segment", "Tasks aging >24 hrs", "$1.1M value at risk"],
      sourceTabs: [{ label: "Store Execution", id: "store-execution" }, { label: "Inventory & Allocation", id: "inventory" }],
      primarySourceTabId: "store-execution",
      segment: "Consistent Replenishment",
      segmentStrategy: "Assign stocking tasks for high-service-exposure stores",
      metrics: [
        { label: "Open tasks",        value: "212" },
        { label: "Stores impacted",   value: "79" },
        { label: "Value at risk",     value: "$1.1M" },
        { label: "Task age",          value: ">24 hrs" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$1.1M of Consistent Replenishment inventory is in stores but not assigned for stocking. Shelves may remain understocked until store managers assign labor.",
      recommendedAction: "Assign high-priority stocking tasks for Consistent Replenishment SKUs in stores with service exposure. Escalate to District 118 manager.",
      guardrailNote: "Task assignment requires store manager or district leader action. No automated task routing without operational approval.",
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    priority: "P2",
    risk: "Party displays staged, not set",
    workstream: "Display / Endcap",
    district: "District 147 · Philadelphia",
    segment: "Promo / Merchant-Driven",
    stores: "53",
    valueAtRisk: "$610K",
    recommendation: "Complete display setup before promo window",
    status: "Critical",
    drawer: {
      title: "Party displays staged, not set · District 147",
      status: "critical",
      explanation: "Promo inventory has arrived in District 147 · Philadelphia stores and is staged in backrooms, but displays and endcaps have not been set before the Jun 9 party promo window. Once the window opens, stores with unset displays will miss the full promotional selling period.",
      signals: ["53 stores with party displays staged, not set", "District 147 · Philadelphia", "Promo window opens: Jun 9", "Photo verification incomplete", "$610K value at risk"],
      sourceTabs: [{ label: "Store Execution", id: "store-execution" }, { label: "Demand Planning", id: "demand" }, { label: "Inventory & Allocation", id: "inventory" }],
      primarySourceTabId: "store-execution",
      segment: "Promo / Merchant-Driven",
      segmentStrategy: "Display setup completion before promo selling window",
      metrics: [
        { label: "Stores impacted",   value: "53" },
        { label: "Value at risk",     value: "$610K" },
        { label: "Setup due",         value: "Jun 9" },
        { label: "Photo verified",    value: "Incomplete" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$610K of promo inventory is at risk of missing the selling window entirely if displays are not set and verified before Jun 9.",
      recommendedAction: "Complete display setup and photo verification for all 53 stores before Jun 9. Approve display-readiness dependency in the AI Actions & Human Approvals section.",
      guardrailNote: "Display execution requires field and merchandising confirmation. No allocation held without explicit approval.",
      actionLabel: "Go to Demand Planning",
      actionTabId: "demand",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    priority: "P2",
    risk: "Phantom inventory suspected",
    workstream: "Inventory Verification",
    district: "District 132 · Chicago South",
    segment: "Constrained / Exception",
    stores: "74",
    valueAtRisk: "$780K",
    recommendation: "Create cycle count verification worklist",
    status: "Watchlist",
    drawer: {
      title: "Phantom inventory suspected · District 132",
      status: "watchlist",
      explanation: "System inventory may not match physical shelf reality at 74 stores in District 132 · Chicago South. Phantom inventory inflates availability metrics and causes replenishment and allocation decisions to assume product is sellable when it is not physically available on the shelf. A cycle count verification worklist is recommended.",
      signals: ["System vs physical inventory discrepancy at 74 stores", "District 132 · Chicago South", "Constrained / Exception segment", "$780K value at risk", "Cycle count overdue"],
      sourceTabs: [{ label: "Store Execution", id: "store-execution" }, { label: "Inventory & Allocation", id: "inventory" }],
      primarySourceTabId: "store-execution",
      segment: "Constrained / Exception",
      segmentStrategy: "Cycle count verification and inventory accuracy correction",
      metrics: [
        { label: "Stores impacted",   value: "74" },
        { label: "Value at risk",     value: "$780K" },
        { label: "Action needed",     value: "Cycle count" },
        { label: "System gap",        value: "Suspected phantom inventory" },
      ],
      humanApprovalRequired: true,
      businessImpact: "$780K of inventory may be counted as available in the system but not physically accessible to customers, masking real stockout risk.",
      recommendedAction: "Approve inventory accuracy verification worklist in the AI Actions & Human Approvals section.",
      guardrailNote: "Inventory accuracy detection is autonomous. Cycle count and adjustment require store ops and inventory control sign-off.",
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    priority: "P3",
    risk: "Household cartons aged >72 hrs",
    workstream: "Backroom Processing",
    district: "District 155 · Phoenix",
    segment: "Treasure Hunt / Limited Buy",
    stores: "84",
    valueAtRisk: "$920K",
    recommendation: "Monitor aging and redirect field support if needed",
    status: "Behind",
    drawer: {
      title: "Household cartons aged >72 hrs · District 155",
      status: "watchlist",
      explanation: "Treasure Hunt / Limited Buy household cartons have aged past 72 hours in backrooms at 84 stores in District 155 · Phoenix. Backroom congestion from seasonal overflow has caused cartons to sit in the receiving dock rather than being sorted and moved to the floor.",
      signals: ["84 stores with household cartons aged >72 hrs", "District 155 · Phoenix", "Treasure Hunt / Limited Buy segment", "$920K value at risk", "Backroom congestion from seasonal overflow"],
      sourceTabs: [{ label: "Store Execution", id: "store-execution" }],
      primarySourceTabId: "store-execution",
      segment: "Treasure Hunt / Limited Buy",
      segmentStrategy: "Monitor and redirect field support before aging crosses markdown threshold",
      metrics: [
        { label: "Stores impacted",   value: "84" },
        { label: "Value at risk",     value: "$920K" },
        { label: "Inventory age",     value: ">72 hrs" },
        { label: "Primary cause",     value: "Backroom congestion from seasonal overflow" },
      ],
      humanApprovalRequired: false,
      businessImpact: "$920K of Treasure Hunt inventory is at risk of markdown if backroom processing continues to be delayed. Shelf gaps are likely in affected stores.",
      recommendedAction: "Monitor aging trajectory. Redirect field support from District 155 if 72-hr threshold continues to widen.",
      guardrailNote: "No automated field action triggered. Monitoring only — escalation requires DM sign-off.",
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      secondaryLabel: "Mark for Review",
    },
  },
  {
    priority: "P3",
    risk: "Endcap photo verification missing",
    workstream: "Display / Endcap",
    district: "District 169 · Los Angeles East",
    segment: "Promo / Merchant-Driven",
    stores: "39",
    valueAtRisk: "$420K",
    recommendation: "Request photo verification",
    status: "Watchlist",
    drawer: {
      title: "Endcap photo verification missing · District 169",
      status: "watchlist",
      explanation: "39 stores in District 169 · Los Angeles East have closed endcap setup tasks without submitting mandatory photo verification. Without photo confirmation, compliance cannot be verified and promo display execution is unauditable.",
      signals: ["39 stores missing endcap photo verification", "District 169 · Los Angeles East", "Promo / Merchant-Driven segment", "$420K value at risk", "Photo step not embedded in task close-out"],
      sourceTabs: [{ label: "Store Execution", id: "store-execution" }],
      primarySourceTabId: "store-execution",
      segment: "Promo / Merchant-Driven",
      segmentStrategy: "Photo verification enforcement before task close-out",
      metrics: [
        { label: "Stores impacted",   value: "39" },
        { label: "Value at risk",     value: "$420K" },
        { label: "Verification gap",  value: "Photo not submitted" },
        { label: "District",          value: "District 169 · Los Angeles East" },
      ],
      humanApprovalRequired: false,
      businessImpact: "$420K of promo inventory execution is unverified. Without photo confirmation, promo compliance reporting is unreliable.",
      recommendedAction: "Request photo verification from 39 stores. Make photo submission mandatory before task close-out.",
      guardrailNote: "Monitoring only — no automated enforcement of photo submission without operational change approval.",
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      secondaryLabel: "Mark for Review",
    },
  },
]

// ─── page ──────────────────────────────────────────────────────────────────────
interface StoreExecutionPageProps {
  onGoToTab?: (tab: string) => void
}

export default function StoreExecutionPage({ onGoToTab }: StoreExecutionPageProps) {
  const [search, setSearch]               = useState("")
  const [selectedDistrict, setDistrict]   = useState("All Districts")
  const [selectedSegment, setSegment]     = useState("All Segments")
  const [selectedWorkstream, setWorkstream] = useState("All Workstreams")
  const [selectedStatus, setStatus]       = useState("All Statuses")

  // SKUDetailDrawer (for KPI cards, risk matrix rows)
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  // SEDetailDrawer (for funnel stages)
  const [funnelDrawerOpen, setFunnelDrawerOpen] = useState(false)
  const [funnelSelected, setFunnelSelected]     = useState<DetailItem | null>(null)

  const aiSectionRef = useRef<HTMLDivElement>(null)

  function openDrawer(payload: DrawerPayload) {
    setDrawerPayload(payload)
    setDrawerOpen(true)
  }

  function openFunnelDrawer(item: DetailItem) {
    setFunnelSelected(item)
    setFunnelDrawerOpen(true)
  }

  function scrollToAI() {
    aiSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // filter risk rows by active filters
  const visibleRows = riskRows.filter(row => {
    if (selectedDistrict !== "All Districts" && !row.district.includes(selectedDistrict.split(" · ")[0].replace("District ", "").trim())) {
      // match by district number substring
      const distNum = selectedDistrict.match(/District (\d+)/)?.[1]
      if (distNum && !row.district.includes(distNum)) return false
    }
    if (selectedSegment !== "All Segments" && row.segment !== selectedSegment) return false
    if (selectedWorkstream !== "All Workstreams" && row.workstream !== selectedWorkstream) return false
    if (selectedStatus !== "All Statuses" && row.status !== selectedStatus) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !row.risk.toLowerCase().includes(q) &&
        !row.district.toLowerCase().includes(q) &&
        !row.segment.toLowerCase().includes(q) &&
        !row.workstream.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-background">

      {/* ── SECTION 1: Header ── */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Zap className="w-4 h-4 text-primary" />
              <h1 className="text-base font-bold text-foreground">Store Execution</h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Store receiving, backroom processing, shelf readiness, display execution, and inventory verification after delivery
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Field execution active
            </span>
            <span className="text-xs text-muted-foreground">Last refresh: Jun 7, 2026 · 8:30 AM</span>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="border-b border-border bg-card/80 px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* District */}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={e => setDistrict(e.target.value)}
              className="appearance-none text-xs font-medium bg-background border border-border rounded-lg pl-3 pr-7 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {["All Districts","District 104 · Atlanta Metro","District 118 · Birmingham","District 132 · Chicago South","District 147 · Philadelphia","District 155 · Phoenix","District 169 · Los Angeles East"].map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
          {/* SKU Segment */}
          <div className="relative">
            <select
              value={selectedSegment}
              onChange={e => setSegment(e.target.value)}
              className="appearance-none text-xs font-medium bg-background border border-border rounded-lg pl-3 pr-7 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {["All Segments","Consistent Replenishment","Seasonal / Event","Treasure Hunt / Limited Buy","Promo / Merchant-Driven","Constrained / Exception"].map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
          {/* Workstream */}
          <div className="relative">
            <select
              value={selectedWorkstream}
              onChange={e => setWorkstream(e.target.value)}
              className="appearance-none text-xs font-medium bg-background border border-border rounded-lg pl-3 pr-7 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {["All Workstreams","Receiving","Backroom Processing","Put-to-Shelf","Display / Endcap","Inventory Verification"].map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
          {/* Status */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={e => setStatus(e.target.value)}
              className="appearance-none text-xs font-medium bg-background border border-border rounded-lg pl-3 pr-7 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {["All Statuses","Critical","Behind","Watchlist","On Track","Complete"].map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search store, district, SKU segment, task, display, or issue"
              className="w-full text-xs bg-background border border-border rounded-lg pl-8 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />Refresh
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors">
              <Download className="w-3.5 h-3.5" />Export
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto">

        {/* ── SECTION 2: KPI cards ── */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map(card => (
              <button
                key={card.title}
                onClick={() => openDrawer(card.drawer)}
                className="rounded-xl border border-border bg-card p-4 text-left hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground">{card.title}</p>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{card.value}</p>
                <p className="text-[11px] text-muted-foreground mb-2">{card.subtext}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className={kpiStatusBadge(card.status)}>{card.status}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed border-t border-border pt-2">{card.footer}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: Delivery-to-Shelf Funnel ── */}
        <section>
          <SEFunnel onSelect={openFunnelDrawer} />
        </section>

        {/* ── SECTION 4: Store Execution Risk Matrix ── */}
        <section>
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="px-5 pt-5 pb-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Store Execution Risk Matrix</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Top store execution risks by workstream, district, SKU segment, value exposure, and recommended field action
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Priority</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Risk / Example</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Workstream</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">District</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">SKU Segment</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Stores</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Value at Risk</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">AI Recommendation</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, i) => (
                    <tr
                      key={i}
                      onClick={() => openDrawer(row.drawer)}
                      className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          row.priority === "P1" ? "bg-red-50 text-red-700 border-red-200" :
                          row.priority === "P2" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-gray-50 text-gray-600 border-gray-200"
                        }`}>{row.priority}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground group-hover:text-primary transition-colors max-w-[180px]">
                        {row.risk}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.workstream}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.district}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {row.segment}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">{row.stores}</td>
                      <td className="px-4 py-3 text-right font-bold text-foreground">{row.valueAtRisk}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[200px]">{row.recommendation}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {visibleRows.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-xs text-muted-foreground">
                        No rows match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: AI Actions & Human Approvals ── */}
        <section ref={aiSectionRef} className="rounded-2xl border border-border bg-card px-6 py-5">
          <AIActionsModule
            actions={storeActions}
            approvals={storeApprovals}
            onGoToTab={onGoToTab ?? (() => {})}
          />
        </section>

        {/* ── SECTION 6: Summary ── */}
        <section>
          <div className="rounded-xl border border-primary/30 bg-accent/40 px-6 py-5">
            <p className="text-sm font-semibold text-foreground mb-2">Store Execution Summary</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Store execution risk is concentrated after delivery receipt, especially in backroom processing, put-to-shelf cycle time, display setup, and inventory verification. The largest controllable gap is not whether inventory exists in the network, but whether store teams can convert delivered product into verified shelf availability before the selling window.
            </p>
            <div className="flex items-start gap-2 p-3 rounded-lg border border-primary/20 bg-background">
              <span className="w-0.5 self-stretch rounded-full bg-primary flex-shrink-0" />
              <p className="text-xs text-foreground leading-relaxed">
                <span className="font-semibold">Recommended next step: </span>
                <button
                  onClick={scrollToAI}
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Prioritize field actions
                </button>
                {" "}for backroom aging, promo display readiness, and phantom inventory verification within the next 48 hours.
              </p>
            </div>
            <div className="mt-3">
              <button
                onClick={scrollToAI}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-primary/30 bg-background text-primary hover:bg-primary/5 transition-colors"
              >
                Open approval workbench
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* ── SKU Detail Drawer (KPI + Risk Matrix) ── */}
      {drawerPayload && (
        <SKUDetailDrawer
          payload={drawerPayload}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onGoToTab={onGoToTab ?? (() => {})}
        />
      )}

      {/* ── SE Detail Drawer (Funnel stages) ── */}
      <SEDetailDrawer
        item={funnelSelected}
        open={funnelDrawerOpen}
        onClose={() => setFunnelDrawerOpen(false)}
      />
    </div>
  )
}
