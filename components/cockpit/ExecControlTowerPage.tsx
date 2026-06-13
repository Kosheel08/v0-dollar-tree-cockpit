"use client"

import { useRef, useState } from "react"
import {
  RefreshCw, Download, Search, ArrowRight, ChevronRight,
  Zap, Link2, CheckCircle2, Clock, AlertTriangle,
  DollarSign, Users, BookOpen, BarChart3, Boxes, Truck, Store,
} from "lucide-react"
import ECTDetailDrawer from "./ECTDetailDrawer"
import StatusBadge from "./ECTStatusBadge"
import type { DrawerPayload, StatusLevel } from "./ECTData"
import { cn } from "@/lib/utils"

const SELECT_CLS =
  "text-xs border border-border rounded-lg bg-card text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"

// ─── helpers ────────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-[15px] font-bold text-foreground tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{subtitle}</p>}
    </div>
  )
}

// ─── drawer payloads ─────────────────────────────────────────────────────────

const POSTURE_DRAWERS: Record<string, DrawerPayload> = {
  revenue: {
    title: "Total Revenue at Risk — $18.1M",
    status: "critical",
    explanation:
      "$18.1M is the illustrative end-to-end exposure across the highest-priority demand, inventory, inbound, network, and store execution risks shown in the cockpit. These are directional demo values and are not actual Dollar Tree financials.",
    sourceTabs: ["Demand Planning", "Inventory & Allocation", "Supplier & Inbound Flow", "DC Capacity & Transportation", "Store Execution"],
    primarySourceTabId: "demand",
    metrics: [
      { label: "Demand-driven exposure",     value: "$12.4M" },
      { label: "Store execution exposure",   value: "$4.3M" },
      { label: "Inbound PO exposure",        value: "$3.7M" },
      { label: "Network execution exposure", value: "$1.9M" },
    ],
    businessImpact: "If no corrective actions are taken before the Jun 10 allocation lock, the full $18.1M exposure remains unprotected across 286 stores.",
    recommendedAction: "Approve the five top executive decisions before Jun 10 to protect an estimated $8.7M.",
  },
  protected: {
    title: "Value Protected if Approved — $8.7M",
    status: "recommended",
    explanation:
      "$8.7M is the estimated value that could be protected if the recommended human approvals and AI-prioritized actions are completed. It is directional demo impact, not guaranteed savings, and not actual Dollar Tree financials.",
    sourceTabs: ["Demand Planning", "Inventory & Allocation", "Supplier & Inbound Flow", "DC Capacity & Transportation", "Store Execution"],
    primarySourceTabId: "inventory",
    metrics: [
      { label: "Forecast uplift + allocation",   value: "$3.4M" },
      { label: "Inbound PO expedite",             value: "$1.6M" },
      { label: "Savannah wave re-sequencing",     value: "$1.2M" },
      { label: "Backroom + display field action", value: "$1.8M" },
      { label: "Constrained recovery",            value: "$700K" },
    ],
    businessImpact: "Protecting $8.7M reduces store exposure from 286 to an estimated 146 stores if all five decisions are approved before the lock.",
    recommendedAction: "Review and approve the Top Executive Decisions before Jun 10.",
  },
  stores: {
    title: "Stores at Risk — 286",
    status: "watchlist",
    explanation:
      "286 stores currently have at least one active supply chain risk — stockout exposure, aged backroom inventory, missed allocations, or late delivery. These are directional demo values.",
    sourceTabs: ["Inventory & Allocation", "Store Execution"],
    primarySourceTabId: "inventory",
    metrics: [
      { label: "Stockout / allocation exposure", value: "214 stores" },
      { label: "Backroom aging >48 hrs",         value: "126 stores" },
      { label: "Display readiness gap",           value: "53 stores" },
    ],
    businessImpact: "If recommended actions are approved, store exposure is estimated to reduce from 286 to approximately 146 stores.",
    recommendedAction: "Prioritize allocation lock decisions and field execution actions.",
  },
  decisions: {
    title: "Critical Decisions — 7",
    status: "critical",
    explanation:
      "7 decisions require leadership input before the Jun 10 allocation lock. Five are shown in Top Executive Decisions below. Two additional field escalations are pending DC Operations and Field leadership sign-off.",
    sourceTabs: ["Demand Planning", "Inventory & Allocation", "Supplier & Inbound Flow", "DC Capacity & Transportation", "Store Execution"],
    primarySourceTabId: "demand",
    metrics: [
      { label: "Decisions visible here",  value: "5" },
      { label: "Pending escalation",      value: "2" },
      { label: "Value protected if all approved", value: "$8.7M estimated" },
    ],
    businessImpact: "Delaying past Jun 10 locks in the no-intervention outcome for the current planning cycle.",
    recommendedAction: "Review the Top Executive Decisions section and assign owners today.",
  },
  deadline: {
    title: "Next Decision Deadline — Jun 10 · 5:00 PM",
    status: "critical",
    explanation:
      "The allocation engine locks at 5:00 PM on Jun 10. Any forecast adjustments, allocation overrides, or inbound recovery actions must be approved before this cutoff.",
    sourceTabs: ["Demand Planning", "Inventory & Allocation"],
    primarySourceTabId: "inventory",
    metrics: [
      { label: "Hours remaining (as of Jun 7 8:30 AM)", value: "~57 hrs" },
      { label: "Decisions required before lock",         value: "5" },
      { label: "Highest-priority",                       value: "Decisions 1 and 2" },
    ],
    businessImpact: "Missing the Jun 10 lock means the at-risk allocation pattern is set for the full planning cycle with no automated recovery path.",
    recommendedAction: "Approve decisions 1 and 2 within the next 24 hours to meet the lock.",
  },
}

const HERO_INFO_DRAWERS: Record<string, DrawerPayload> = {
  segmentation: {
    title: "What does segmentation mean?",
    status: "stable",
    explanation:
      "SKU segmentation means the cockpit does not plan every item the same way. Everyday items use baseline replenishment logic. Seasonal items need time-bound push logic with allocation protection. Promo items depend on merchant timing and display readiness. Limited buys use similar-item history and absorption modeling. Constrained SKUs require human review and recovery planning.",
    sourceTabs: ["AI-Driven SKU Segmentation"],
    primarySourceTabId: "sku-segmentation",
    metrics: [
      { label: "Consistent Replenishment",   value: "Baseline replenishment" },
      { label: "Seasonal / Event",           value: "Time-bound push + allocation" },
      { label: "Treasure Hunt / Limited Buy", value: "Similar-item history" },
      { label: "Promo / Merchant-Driven",    value: "Merchant timing + display gates" },
      { label: "Constrained / Exception",    value: "Human review + recovery" },
    ],
    businessImpact: "Fit-for-purpose planning reduces waste, improves sell-through, and focuses recovery effort where it matters most.",
    recommendedAction: "Open the AI-Driven SKU Segmentation tab to see classified SKU families.",
  },
  data: {
    title: "What data is used?",
    status: "stable",
    explanation:
      "The cockpit uses demand plans, sales velocity, SKU attributes, inventory position, supplier OTIF, PO and ASN status, inbound ETAs, DC capacity, transportation lane performance, store task completion, display readiness, and inventory verification signals.",
    sourceTabs: ["AI-Driven SKU Segmentation", "Demand Planning", "Inventory & Allocation", "Supplier & Inbound Flow", "DC Capacity & Transportation", "Store Execution"],
    primarySourceTabId: "sku-segmentation",
    metrics: [
      { label: "Demand signals",       value: "Forecasts, velocity, promo timing" },
      { label: "Inventory signals",    value: "On-hand, WOS, allocation position" },
      { label: "Supplier signals",     value: "OTIF, PO status, ASN, fill rate, ETAs" },
      { label: "Network signals",      value: "DC capacity, trailer dwell, lane OTD" },
      { label: "Store signals",        value: "Task completion, display readiness, aging" },
    ],
    businessImpact: "Cross-functional signal connection allows AI to detect compounding risks that would be invisible in any single planning domain.",
    recommendedAction: "Review the signal flow section to see how each tab connects to the next.",
  },
  autonomous: {
    title: "What does AI do automatically?",
    status: "stable",
    explanation:
      "AI can classify SKU families into planning segments, detect forecast bias or supplier risk, link signals across planning domains, rank stores or transportation lanes by impact, and create prioritized recommendations — all within approved guardrails.",
    sourceTabs: ["AI-Driven SKU Segmentation", "Demand Planning", "Inventory & Allocation"],
    primarySourceTabId: "sku-segmentation",
    metrics: [
      { label: "SKU classification",       value: "Autonomous" },
      { label: "Bias + risk detection",    value: "Autonomous" },
      { label: "Signal linking",           value: "Autonomous" },
      { label: "Store/lane ranking",       value: "Autonomous" },
      { label: "Recommendation creation",  value: "Autonomous within guardrails" },
    ],
    businessImpact: "Autonomous actions within guardrails free planners to focus on the high-impact decisions that require human judgment.",
    recommendedAction: "Review the AI Actions Completed section to see what the AI has already done.",
  },
  approval: {
    title: "When is approval required?",
    status: "watchlist",
    explanation:
      "Human approval is required when an action changes a forecast, reserves constrained inventory, adds operating cost, changes supplier recovery strategy, affects DC or transportation execution, or requires field labor and merchandising alignment.",
    sourceTabs: ["Demand Planning", "Inventory & Allocation", "Supplier & Inbound Flow", "DC Capacity & Transportation", "Store Execution"],
    primarySourceTabId: "demand",
    metrics: [
      { label: "Forecast changes",          value: "Approval required" },
      { label: "Constrained allocation",    value: "Approval required" },
      { label: "Expedite or cost decisions","value": "Approval required" },
      { label: "DC / transportation changes", value: "Approval required" },
      { label: "Field labor + merchandising", value: "Approval required" },
    ],
    businessImpact: "Routing only high-impact tradeoffs to humans keeps planning velocity high while ensuring the right people own consequential decisions.",
    recommendedAction: "Review the Top Executive Decisions section to see what needs your sign-off.",
  },
}

const SIGNAL_FLOW_DRAWERS: Record<string, DrawerPayload> = {
  "sku-segmentation": {
    title: "AI-Driven SKU Segmentation",
    status: "stable",
    explanation:
      "The segmentation tab classifies SKU families into five planning segments based on SKU behavior, merchant intent, history depth, store absorption, and supply constraints. Each segment receives a fit-for-purpose planning and fulfillment strategy. All downstream tabs apply this segmentation logic when detecting risk and recommending actions.",
    sourceTabs: ["AI-Driven SKU Segmentation"],
    primarySourceTabId: "sku-segmentation",
    metrics: [
      { label: "SKU families analyzed",    value: "2,180" },
      { label: "Require human review",     value: "174" },
      { label: "Output to downstream",     value: "Fit-for-purpose planning logic" },
    ],
    businessImpact: "Without segmentation, every SKU gets the same planning logic — causing missed allocations on seasonal items, over-ordering on replenishment, and no recovery priority for constrained SKUs.",
    recommendedAction: "Open the AI-Driven SKU Segmentation tab to review classified families and approve high-impact segment actions.",
  },
  demand: {
    title: "Demand Planning",
    status: "critical",
    explanation:
      "The demand tab uses SKU segmentation to apply different forecasting logic by segment. It detects bias patterns — particularly under-forecasting in Seasonal / Event and Promo / Merchant-Driven SKUs — and creates forecast uplift recommendations. The output flows downstream to inventory allocation and inbound planning.",
    sourceTabs: ["Demand Planning", "AI-Driven SKU Segmentation"],
    primarySourceTabId: "demand",
    metrics: [
      { label: "Forecast accuracy",        value: "86.4%" },
      { label: "Forecast bias",            value: "-4.8% (under-forecast)" },
      { label: "Output to downstream",     value: "Forecast uplift recommendation" },
    ],
    businessImpact: "Under-forecast bias in Seasonal / Event creates late-cycle allocation pressure. Every week of delay narrows the recovery window before the selling period.",
    recommendedAction: "Approve the Seasonal / Event forecast uplift before the Jun 10 allocation lock.",
  },
  inventory: {
    title: "Inventory & Allocation",
    status: "critical",
    explanation:
      "The inventory tab uses segmentation logic to rank stores by absorption capacity and apply fit-for-purpose allocation rules. It detects shortfall pools and over-positioned inventory, and recommends protected allocations or transfers. The output informs DC outbound wave prioritization and store execution readiness.",
    sourceTabs: ["Inventory & Allocation", "Demand Planning"],
    primarySourceTabId: "inventory",
    metrics: [
      { label: "Available to allocate",   value: "$48.6M" },
      { label: "Stores exposed",          value: "214" },
      { label: "Output to downstream",    value: "Protected allocation recommendation" },
    ],
    businessImpact: "Positioning inventory at the right stores before the lock is the single highest-leverage action available before Jun 10.",
    recommendedAction: "Approve the protected push allocation for high-risk Seasonal / Event stores.",
  },
  "supplier-inbound": {
    title: "Supplier & Inbound Flow",
    status: "watchlist",
    explanation:
      "The supplier tab monitors inbound PO status, ASN timing, supplier fill rate, and ETA variance by SKU segment. It detects supply gaps before inventory arrives at the DC, connecting inbound risk to downstream allocation exposure. The output informs recovery options: expedite, substitute, or confirm receipt.",
    sourceTabs: ["Supplier & Inbound Flow", "Inventory & Allocation"],
    primarySourceTabId: "supplier-inbound",
    metrics: [
      { label: "Supplier OTIF",            value: "82.7%" },
      { label: "At-risk POs",              value: "43" },
      { label: "Output to downstream",     value: "Expedite or substitute recommendation" },
    ],
    businessImpact: "Inbound risk that is not detected early collapses into allocation shortfalls and store stockouts with no recovery time.",
    recommendedAction: "Approve the GreenLeaf expedite and ValuePack recovery plan in the Supplier tab.",
  },
  "dc-capacity": {
    title: "DC Capacity & Transportation",
    status: "critical",
    explanation:
      "The DC tab monitors receiving capacity, trailer dwell, pick-wave backlog, outbound wave sequencing, and transportation lane performance by SKU segment. It detects network execution constraints that delay store delivery and recommends wave changes or route capacity additions.",
    sourceTabs: ["DC Capacity & Transportation", "Supplier & Inbound Flow"],
    primarySourceTabId: "dc-capacity",
    metrics: [
      { label: "Network throughput",       value: "91.3%" },
      { label: "DCs at capacity risk",     value: "3 (Savannah, Joliet, Chesapeake)" },
      { label: "Output to downstream",     value: "Wave sequencing or route capacity recommendation" },
    ],
    businessImpact: "DC bottlenecks at Savannah and Joliet are compressing delivery windows for Seasonal / Event and Consistent Replenishment SKUs across hundreds of stores.",
    recommendedAction: "Approve the Savannah wave change and overflow route capacity before the next outbound window.",
  },
  "store-execution": {
    title: "Store Execution",
    status: "critical",
    explanation:
      "The store execution tab tracks delivery-to-shelf cycle time, backroom aging, display readiness, and inventory accuracy by district and SKU segment. It detects where delivered inventory is not converting into verified shelf availability and recommends field actions or verification worklists.",
    sourceTabs: ["Store Execution", "DC Capacity & Transportation"],
    primarySourceTabId: "store-execution",
    metrics: [
      { label: "Execution score",          value: "78.6 (target 88)" },
      { label: "Delivery-to-shelf cycle",  value: "31.4 hrs (target 20 hrs)" },
      { label: "Output",                   value: "Field action or verification approval" },
    ],
    businessImpact: "$4.3M of inventory is sitting in backrooms instead of on shelves. Every day of delay reduces sell-through during the selling window.",
    recommendedAction: "Approve the District 104 backroom field action and District 147 display-readiness dependency rule.",
  },
}

const SUMMARY_CARD_DRAWERS: Record<string, DrawerPayload> = {
  "sku-segmentation": {
    title: "AI-Driven SKU Segmentation — How it contributes",
    status: "stable",
    explanation:
      "The segmentation tab is the foundation of the cockpit. It classifies 2,180 SKU families into five planning segments and outputs fit-for-purpose logic that every downstream tab applies. Without segmentation, planning defaults to treating every SKU the same — driving misallocated inventory and missed recovery windows.",
    sourceTabs: ["AI-Driven SKU Segmentation"],
    primarySourceTabId: "sku-segmentation",
    metrics: [
      { label: "SKU families analyzed",   value: "2,180" },
      { label: "Require human review",    value: "174" },
      { label: "AI action",               value: "Classified SKUs into five segments" },
      { label: "Human decision",          value: "Approve high-impact segment actions" },
    ],
    businessImpact: "Segmentation creates the planning logic that every other tab depends on. Changes here cascade across demand, inventory, inbound, network, and store execution.",
    recommendedAction: "Open the AI-Driven SKU Segmentation tab to review and approve segment assignments.",
  },
  demand: {
    title: "Demand Planning — How it contributes",
    status: "critical",
    explanation:
      "Demand Planning applies SKU segmentation to detect forecast bias and create uplifts. The -4.8% Seasonal / Event under-forecast bias identified here is the root cause of downstream allocation shortfalls at 214 stores. Approving the forecast uplift is the first lever in the recovery chain.",
    sourceTabs: ["Demand Planning"],
    primarySourceTabId: "demand",
    metrics: [
      { label: "Forecast accuracy",        value: "86.4%" },
      { label: "Forecast bias",            value: "-4.8%" },
      { label: "AI action",                value: "Detected under-forecasting in Seasonal / Event" },
      { label: "Human decision",           value: "Approve forecast uplift" },
    ],
    businessImpact: "Without the uplift, the allocation engine has no signal to position additional inventory to high-risk stores before the Jun 10 lock.",
    recommendedAction: "Approve the Seasonal / Event forecast uplift in the Demand Planning tab.",
  },
  inventory: {
    title: "Inventory & Allocation — How it contributes",
    status: "critical",
    explanation:
      "Inventory & Allocation applies segmentation logic to rank stores by absorption capacity and apply protected allocation rules. $48.6M is available to allocate, but 214 stores are exposed due to positioning constraints. Protected push allocation for high-risk stores is the key output.",
    sourceTabs: ["Inventory & Allocation"],
    primarySourceTabId: "inventory",
    metrics: [
      { label: "Available to allocate",   value: "$48.6M" },
      { label: "Stores exposed",          value: "214" },
      { label: "AI action",               value: "Ranked stores by absorption capacity" },
      { label: "Human decision",          value: "Approve protected push allocation" },
    ],
    businessImpact: "Protected allocation ensures high-velocity stores receive inventory first. Without it, fulfillment defaults to standard replenishment logic that does not account for SKU segment urgency.",
    recommendedAction: "Approve the protected push allocation for high-risk stores before the Jun 10 lock.",
  },
  "supplier-inbound": {
    title: "Supplier & Inbound Flow — How it contributes",
    status: "watchlist",
    explanation:
      "Supplier & Inbound Flow monitors inbound POs by SKU segment and detects supply gaps before inventory arrives at the DC. At 82.7% OTIF with 43 at-risk POs, this tab is surfacing inbound risk that would otherwise collapse into allocation shortfalls with no recovery time.",
    sourceTabs: ["Supplier & Inbound Flow"],
    primarySourceTabId: "supplier-inbound",
    metrics: [
      { label: "Supplier OTIF",           value: "82.7%" },
      { label: "At-risk POs",             value: "43" },
      { label: "AI action",               value: "Linked PO risk to allocation exposure" },
      { label: "Human decision",          value: "Approve expedite or substitute recovery" },
    ],
    businessImpact: "Early detection of inbound risk creates a recovery window. Every day of delay narrows the options between expedite, substitute, and accepting the stockout.",
    recommendedAction: "Approve the GreenLeaf PO expedite and ValuePack recovery in the Supplier tab.",
  },
  "dc-capacity": {
    title: "DC Capacity & Transportation — How it contributes",
    status: "critical",
    explanation:
      "DC Capacity & Transportation detects network execution constraints and applies segment-based outbound wave prioritization. At 91.3% throughput with 3 DCs at capacity risk, Savannah and Joliet are the primary bottlenecks compressing delivery windows for priority SKU segments.",
    sourceTabs: ["DC Capacity & Transportation"],
    primarySourceTabId: "dc-capacity",
    metrics: [
      { label: "Network throughput",      value: "91.3%" },
      { label: "DCs at capacity risk",    value: "3" },
      { label: "AI action",               value: "Prioritized outbound waves by SKU segment" },
      { label: "Human decision",          value: "Approve wave change or route capacity" },
    ],
    businessImpact: "Without wave re-sequencing and route capacity approval, priority Seasonal / Event and Replenishment shipments will miss store delivery windows.",
    recommendedAction: "Approve the Savannah outbound wave change and overflow route capacity.",
  },
  "store-execution": {
    title: "Store Execution — How it contributes",
    status: "critical",
    explanation:
      "Store Execution is the last mile of the supply chain. Even with correct allocations and on-time DC shipments, $4.3M of inventory is aging in backrooms instead of reaching the shelf. Closing the delivery-to-shelf gap is the fastest lever to recover sell-through during the selling window.",
    sourceTabs: ["Store Execution"],
    primarySourceTabId: "store-execution",
    metrics: [
      { label: "Execution score",         value: "78.6" },
      { label: "Backroom aging",          value: "$4.3M" },
      { label: "AI action",               value: "Flagged backroom and display readiness gaps" },
      { label: "Human decision",          value: "Approve field action priorities" },
    ],
    businessImpact: "Every hour of backroom aging during the selling window reduces effective sell-through. District leadership sign-off is required to redirect store labor.",
    recommendedAction: "Approve the District 104 field action in the Store Execution tab.",
  },
}

// ─── AI Actions feed data ─────────────────────────────────────────────────────

const AI_ACTIONS = [
  {
    id: "ect-ai-1",
    title: "Classified SKU families into five operating segments",
    sourceTab: "AI-Driven SKU Segmentation",
    sourceTabId: "sku-segmentation",
    segment: "All Segments",
    action: "Assigned SKU families to fit-for-purpose planning and fulfillment strategies",
    status: "completed" as const,
    drawer: {
      title: "Classified SKU families into five operating segments",
      status: "stable" as StatusLevel,
      explanation:
        "AI analyzed 2,180 SKU families using behavior, merchant intent, history depth, store absorption, and supply constraints. Each family was assigned to one of five planning segments with a fit-for-purpose strategy. This classification is the foundation that all downstream tabs build on.",
      sourceTabs: ["AI-Driven SKU Segmentation"],
      primarySourceTabId: "sku-segmentation",
      metrics: [
        { label: "SKU families analyzed",    value: "2,180" },
        { label: "Segments assigned",        value: "5" },
        { label: "Require human review",     value: "174" },
        { label: "Approval required",        value: "No — within guardrails" },
      ],
      businessImpact: "Segmentation enables fit-for-purpose planning across the cockpit. Without it, every SKU defaults to the same replenishment and allocation logic.",
      recommendedAction: "Open the AI-Driven SKU Segmentation tab to review segment assignments.",
    },
  },
  {
    id: "ect-ai-2",
    title: "Detected Seasonal / Event under-forecast bias",
    sourceTab: "Demand Planning",
    sourceTabId: "demand",
    segment: "Seasonal / Event",
    action: "Created forecast uplift recommendation and linked it to revenue-at-risk",
    status: "completed" as const,
    drawer: {
      title: "Detected Seasonal / Event under-forecast bias",
      status: "critical" as StatusLevel,
      explanation:
        "AI detected a persistent -4.8% forecast bias in Seasonal / Event SKU families, comparing rolling actuals against current plan. The bias was linked to downstream allocation shortfalls at 214 stores and an estimated $3.4M in protected value if the uplift is approved before the Jun 10 lock.",
      sourceTabs: ["Demand Planning", "AI-Driven SKU Segmentation"],
      primarySourceTabId: "demand",
      metrics: [
        { label: "Forecast bias",            value: "-4.8% (Seasonal / Event)" },
        { label: "Stores affected",          value: "214" },
        { label: "Value at risk",            value: "$3.4M" },
        { label: "Approval required",        value: "Yes — forecast uplift requires planner sign-off" },
      ],
      businessImpact: "Under-forecast bias in Seasonal / Event creates late-cycle allocation pressure with a narrowing recovery window before the selling period.",
      recommendedAction: "Approve the Seasonal / Event forecast uplift in the Demand Planning tab before Jun 10.",
    },
  },
  {
    id: "ect-ai-3",
    title: "Ranked store clusters by absorption capacity",
    sourceTab: "Inventory & Allocation",
    sourceTabId: "inventory",
    segment: "Seasonal / Event",
    action: "Prioritized high-risk stores for protected allocation",
    status: "completed" as const,
    drawer: {
      title: "Ranked store clusters by absorption capacity",
      status: "stable" as StatusLevel,
      explanation:
        "AI scored all stores in the Seasonal / Event allocation pool by absorption capacity — combining sales velocity, backroom capacity, display readiness, and inbound timing. High-risk stores were ranked for protected push allocation before the Jun 10 lock.",
      sourceTabs: ["Inventory & Allocation", "Demand Planning"],
      primarySourceTabId: "inventory",
      metrics: [
        { label: "Stores ranked",            value: "214" },
        { label: "High-risk tier",           value: "72 stores" },
        { label: "Value protected if approved", value: "$3.4M" },
        { label: "Approval required",        value: "Yes — protected allocation requires sign-off" },
      ],
      businessImpact: "Ranking by absorption capacity ensures that inventory reaches the stores most likely to sell it, not just the stores nearest to the DC.",
      recommendedAction: "Approve the protected push allocation in the Inventory & Allocation tab.",
    },
  },
  {
    id: "ect-ai-4",
    title: "Linked supplier PO risk to allocation exposure",
    sourceTab: "Supplier & Inbound Flow",
    sourceTabId: "supplier-inbound",
    segment: "Seasonal / Event + Consistent Replenishment",
    action: "Connected delayed and short-shipped POs to impacted store exposure",
    status: "watchlist" as const,
    drawer: {
      title: "Linked supplier PO risk to allocation exposure",
      status: "watchlist" as StatusLevel,
      explanation:
        "AI identified 43 at-risk POs across Seasonal / Event and Consistent Replenishment segments and connected each delayed or short-shipped PO to the downstream store allocation exposure it creates. This cross-tab signal link surfaced $2.7M in combined inbound exposure that would otherwise be invisible at planning review.",
      sourceTabs: ["Supplier & Inbound Flow", "Inventory & Allocation"],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "At-risk POs linked",       value: "43" },
        { label: "Combined exposure",        value: "$2.7M" },
        { label: "Segments",                 value: "Seasonal / Event + Consistent Replenishment" },
        { label: "Approval required",        value: "Expedite and recovery — yes" },
      ],
      businessImpact: "Linking PO risk to store allocation surfaces the downstream impact of inbound delays, enabling faster recovery prioritization before options narrow.",
      recommendedAction: "Approve the GreenLeaf expedite and ValuePack recovery actions in the Supplier tab.",
    },
  },
  {
    id: "ect-ai-5",
    title: "Prioritized network constraints by segment impact",
    sourceTab: "DC Capacity & Transportation",
    sourceTabId: "dc-capacity",
    segment: "Seasonal / Event + Consistent Replenishment",
    action: "Identified Savannah and Joliet as priority network constraints",
    status: "completed" as const,
    drawer: {
      title: "Prioritized network constraints by segment impact",
      status: "stable" as StatusLevel,
      explanation:
        "AI evaluated DC capacity, trailer dwell, and outbound wave sequencing across the network. Savannah (96% capacity, 22.4 hrs dwell) and Joliet (93% capacity, 19.1 hrs dwell) were identified as the highest-impact constraints on Seasonal / Event and Consistent Replenishment outbound flow. Wave re-sequencing was recommended for both.",
      sourceTabs: ["DC Capacity & Transportation", "Supplier & Inbound Flow"],
      primarySourceTabId: "dc-capacity",
      metrics: [
        { label: "Savannah DC capacity",     value: "96%" },
        { label: "Joliet DC capacity",       value: "93%" },
        { label: "Combined value at risk",   value: "$1.9M" },
        { label: "Approval required",        value: "Yes — wave change and route capacity" },
      ],
      businessImpact: "Without wave re-sequencing, Seasonal / Event priority shipments from Savannah and Consistent Replenishment flow from Joliet will miss store delivery windows.",
      recommendedAction: "Approve the Savannah outbound wave change and overflow route capacity in the DC tab.",
    },
  },
  {
    id: "ect-ai-6",
    title: "Flagged store execution dependency for promo push",
    sourceTab: "Store Execution",
    sourceTabId: "store-execution",
    segment: "Promo / Merchant-Driven",
    action: "Linked display readiness gaps to allocation dependency",
    status: "watchlist" as const,
    drawer: {
      title: "Flagged store execution dependency for promo push",
      status: "watchlist" as StatusLevel,
      explanation:
        "AI detected that 53 stores in District 147 have Promo / Merchant-Driven inventory staged but displays not set. Releasing full promo allocation to stores without confirmed display readiness risks backroom overflow and wasted allocation capacity. A display-readiness dependency rule was recommended.",
      sourceTabs: ["Store Execution", "Inventory & Allocation"],
      primarySourceTabId: "store-execution",
      metrics: [
        { label: "Stores flagged",           value: "53" },
        { label: "Value at risk",            value: "$520K" },
        { label: "Display readiness",        value: "59% network average" },
        { label: "Approval required",        value: "Yes — dependency rule requires field + merchandising sign-off" },
      ],
      businessImpact: "Promo allocation to stores without display readiness wastes inventory, degrades sell-through, and inflates backroom aging.",
      recommendedAction: "Approve the display-readiness dependency rule in the Store Execution tab.",
    },
  },
]

// ─── Executive decisions data ─────────────────────────────────────────────────

const EXEC_DECISIONS = [
  {
    id: "ed-1",
    priority: 1,
    title: "Approve Seasonal / Event forecast uplift and protected allocation",
    sourceTabs: ["Demand Planning", "Inventory & Allocation"],
    primarySourceTabId: "demand",
    segment: "Seasonal / Event",
    valueProtected: "$3.4M",
    storesImpacted: 72,
    deadline: "Jun 10 · 5:00 PM",
    owner: "Demand Planning + Allocation",
    whyApproval: "Forecast change and constrained allocation tradeoff require planner sign-off",
    primaryLabel: "Approve",
    drillLabel: "Open Demand Planning",
    drawer: {
      title: "Approve Seasonal / Event forecast uplift and protected allocation",
      status: "critical" as StatusLevel,
      explanation:
        "AI detected -4.8% under-forecast bias in Seasonal / Event SKU families and ranked 72 high-risk stores for protected push allocation. Approving the forecast uplift before the Jun 10 lock allows the allocation engine to position inventory correctly, protecting an estimated $3.4M in directional seasonal revenue.",
      sourceTabs: ["Demand Planning", "Inventory & Allocation"],
      primarySourceTabId: "demand",
      metrics: [
        { label: "Value protected (estimated)", value: "$3.4M" },
        { label: "Stores impacted",             value: "72" },
        { label: "Deadline",                    value: "Jun 10 · 5:00 PM" },
        { label: "Owner",                       value: "Demand Planning + Allocation" },
        { label: "Risk if not approved",        value: "Allocation lock preserves under-forecast position" },
      ],
      businessImpact: "Missing this approval means the allocation engine locks in the under-forecast position, leaving high-risk stores undersupplied for the Seasonal / Event selling window.",
      recommendedAction: "Approve the forecast uplift and confirm protected allocation for the 72 high-risk stores before Jun 10.",
    },
  },
  {
    id: "ed-2",
    priority: 2,
    title: "Expedite delayed Seasonal / Event inbound PO into Savannah DC",
    sourceTabs: ["Supplier & Inbound Flow", "DC Capacity & Transportation"],
    primarySourceTabId: "supplier-inbound",
    segment: "Seasonal / Event",
    valueProtected: "$1.6M",
    storesImpacted: 42,
    deadline: "Next 24 hours",
    owner: "Inbound Planning",
    whyApproval: "Expedite cost and inbound recovery tradeoff require approval",
    primaryLabel: "Approve Expedite",
    drillLabel: "Open Supplier & Inbound Flow",
    drawer: {
      title: "Expedite delayed Seasonal / Event inbound PO into Savannah DC",
      status: "critical" as StatusLevel,
      explanation:
        "GreenLeaf Seasonal Imports PO-78421 has slipped 7 days and may miss the Savannah DC receiving window before the Jun 10 allocation lock. If not expedited, 42 Southeast stores lose their Seasonal / Event inventory before the selling period. Expedite cost requires management approval.",
      sourceTabs: ["Supplier & Inbound Flow", "DC Capacity & Transportation"],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "Supplier / PO",               value: "GreenLeaf · PO-78421" },
        { label: "ETA slip",                    value: "+7 days" },
        { label: "Value protected (estimated)", value: "$1.6M" },
        { label: "Stores impacted",             value: "42" },
        { label: "Deadline",                    value: "Next 24 hours" },
        { label: "Risk if not approved",        value: "42 stores miss Seasonal / Event inventory" },
      ],
      businessImpact: "Delaying the expedite decision past the 24-hour window removes the option entirely. The DC receiving window and allocation lock become fixed constraints.",
      recommendedAction: "Approve the expedite for PO-78421 and coordinate receipt timing with Savannah DC operations.",
    },
  },
  {
    id: "ed-3",
    priority: 3,
    title: "Re-sequence Savannah outbound waves",
    sourceTabs: ["DC Capacity & Transportation"],
    primarySourceTabId: "dc-capacity",
    segment: "Seasonal / Event",
    valueProtected: "$1.2M",
    storesImpacted: 72,
    deadline: "Next 24 hours",
    owner: "DC Operations + Transportation",
    whyApproval: "Operational tradeoff may delay lower-priority shipments",
    primaryLabel: "Approve Wave Change",
    drillLabel: "Open DC Capacity & Transportation",
    drawer: {
      title: "Re-sequence Savannah outbound waves",
      status: "critical" as StatusLevel,
      explanation:
        "Savannah DC is operating at 96% capacity with 22.4 hrs trailer dwell. Re-sequencing outbound waves to prioritize 72 high-risk Seasonal / Event stores protects $1.2M in estimated delivery value but may delay lower-priority replenishment shipments. DC manager sign-off required.",
      sourceTabs: ["DC Capacity & Transportation"],
      primarySourceTabId: "dc-capacity",
      metrics: [
        { label: "DC",                          value: "Savannah DC · 96% capacity" },
        { label: "Trailer dwell",               value: "22.4 hrs (target 12 hrs)" },
        { label: "Value protected (estimated)", value: "$1.2M" },
        { label: "Stores impacted",             value: "72" },
        { label: "Tradeoff",                    value: "Lower-priority shipments delayed" },
        { label: "Risk if not approved",        value: "72 stores miss priority delivery window" },
      ],
      businessImpact: "Without wave re-sequencing, Savannah shipping pressure will delay priority Seasonal / Event stores past the selling window start date.",
      recommendedAction: "Approve outbound wave re-sequencing and coordinate with Savannah DC manager and inventory planning.",
    },
  },
  {
    id: "ed-4",
    priority: 4,
    title: "Clear backroom aging and display setup backlog",
    sourceTabs: ["Store Execution"],
    primarySourceTabId: "store-execution",
    segment: "Seasonal / Event + Promo / Merchant-Driven",
    valueProtected: "$1.8M",
    storesImpacted: 126,
    deadline: "48 hours",
    owner: "Field Operations",
    whyApproval: "Requires field labor reprioritization and district manager action",
    primaryLabel: "Approve Field Action",
    drillLabel: "Open Store Execution",
    drawer: {
      title: "Clear backroom aging and display setup backlog",
      status: "critical" as StatusLevel,
      explanation:
        "126 stores have Seasonal / Event and Promo / Merchant-Driven inventory arrived but not processed to shelf. $4.3M is aging in backrooms across District 104 (Atlanta Metro) and District 147 (Philadelphia). Prioritizing backroom-to-shelf execution and display setup before the selling window is the fastest recovery lever — but requires district manager direction and labor reallocation.",
      sourceTabs: ["Store Execution"],
      primarySourceTabId: "store-execution",
      metrics: [
        { label: "Stores impacted",             value: "126" },
        { label: "Value protected (estimated)", value: "$1.8M" },
        { label: "Inventory aging",             value: ">48 hrs in backroom" },
        { label: "Primary districts",           value: "D104 Atlanta Metro, D147 Philadelphia" },
        { label: "Deadline",                    value: "48 hours" },
        { label: "Risk if not approved",        value: "$1.8M remains unavailable to customers" },
      ],
      businessImpact: "Every hour of backroom aging during the selling window reduces effective sell-through. Labor reprioritization is not safely automatable — it requires field leadership action.",
      recommendedAction: "Approve field action and direct district managers in D104 and D147 to prioritize backroom-to-shelf before the selling window.",
    },
  },
  {
    id: "ed-5",
    priority: 5,
    title: "Approve constrained substitute recovery",
    sourceTabs: ["Supplier & Inbound Flow", "Inventory & Allocation"],
    primarySourceTabId: "supplier-inbound",
    segment: "Constrained / Exception",
    valueProtected: "$700K",
    storesImpacted: 31,
    deadline: "Before allocation lock",
    owner: "Supplier Management + Inventory Planning",
    whyApproval: "Substitution affects supplier commitments, allocation, and merchandising",
    primaryLabel: "Approve Recovery",
    drillLabel: "Open Supplier & Inbound Flow",
    drawer: {
      title: "Approve constrained substitute recovery",
      status: "watchlist" as StatusLevel,
      explanation:
        "ValuePack Consumables PO-78104 shipped at 82% fill versus 96% expected, creating a replenishment gap at 31 Midwest stores. Using substitute SKUs or alternative supplier recovery closes the gap but affects supplier commitments, allocation positioning, and merchandising decisions — requiring cross-functional approval.",
      sourceTabs: ["Supplier & Inbound Flow", "Inventory & Allocation"],
      primarySourceTabId: "supplier-inbound",
      metrics: [
        { label: "Supplier / PO",               value: "ValuePack · PO-78104" },
        { label: "Fill received",               value: "82% vs 96% expected" },
        { label: "Value protected (estimated)", value: "$700K" },
        { label: "Stores impacted",             value: "31" },
        { label: "Deadline",                    value: "Before allocation lock" },
        { label: "Risk if not approved",        value: "31 Midwest stores below replenishment threshold" },
      ],
      businessImpact: "$700K in Consistent Replenishment everyday-SKU revenue at risk if recovery is not approved. Substitute recovery must be confirmed before the allocation lock to be effective.",
      recommendedAction: "Approve substitute recovery or prioritize available inbound supply for high-velocity stores.",
    },
  },
]

// ─── component ────────────────────────────────────────────────────────────────

interface ExecControlTowerPageProps {
  onGoToTab: (tabId: string) => void
}

export default function ExecControlTowerPage({ onGoToTab }: ExecControlTowerPageProps) {
  // Filter state
  const [scope, setScope] = useState("Enterprise")
  const [segment, setSegment] = useState("All Segments")
  const [horizon, setHorizon] = useState("Next 14 Days")
  const [search, setSearch] = useState("")

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  // Approval state for executive decisions
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, "pending" | "approved">>({})

  const decisionsRef = useRef<HTMLDivElement>(null)

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

  const ACTION_STATUS_STYLES = {
    completed: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20",
    watchlist: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/20",
  }
  const ACTION_STATUS_LABELS = { completed: "Completed", watchlist: "Watchlist" }
  const ACTION_STATUS_ICONS = {
    completed: <CheckCircle2 className="w-3.5 h-3.5" />,
    watchlist: <Clock className="w-3.5 h-3.5" />,
  }

  const TAB_IDS: Record<string, string> = {
    "AI-Driven SKU Segmentation": "sku-segmentation",
    "Demand Planning": "demand",
    "Inventory & Allocation": "inventory",
    "Supplier & Inbound Flow": "supplier-inbound",
    "DC Capacity & Transportation": "dc-capacity",
    "Store Execution": "store-execution",
  }

  const FLOW_STAGES = [
    {
      id: "sku-segmentation",
      title: "AI-Driven SKU Segmentation",
      status: "stable" as StatusLevel,
      uses: "SKU behavior, merchant intent, history depth, store absorption, constraints",
      detects: "Best-fit SKU segment and strategy",
      output: "Fit-for-purpose planning logic",
      metric: "2,180 SKU families analyzed",
      icon: <Boxes className="w-4 h-4" />,
    },
    {
      id: "demand",
      title: "Demand Planning",
      status: "critical" as StatusLevel,
      uses: "Forecasts, sales velocity, promo timing",
      detects: "Under-forecast bias",
      output: "Forecast uplift recommendation",
      metric: "-4.8% forecast bias",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: "inventory",
      title: "Inventory & Allocation",
      status: "critical" as StatusLevel,
      uses: "Available inventory, WOS, store exposure",
      detects: "Allocation shortfall and overstock pools",
      output: "Protected allocation recommendation",
      metric: "214 stores exposed",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: "supplier-inbound",
      title: "Supplier & Inbound Flow",
      status: "watchlist" as StatusLevel,
      uses: "Supplier OTIF, PO status, ASN, ETA, fill rate",
      detects: "Inbound timing and fill-rate risk",
      output: "Expedite, substitute, or confirm receipt",
      metric: "43 at-risk POs",
      icon: <Truck className="w-4 h-4" />,
    },
    {
      id: "dc-capacity",
      title: "DC Capacity & Transportation",
      status: "critical" as StatusLevel,
      uses: "DC capacity, trailer dwell, lane performance",
      detects: "Network execution constraint",
      output: "Wave sequencing or route capacity recommendation",
      metric: "3 DCs at capacity risk",
      icon: <Link2 className="w-4 h-4" />,
    },
    {
      id: "store-execution",
      title: "Store Execution",
      status: "critical" as StatusLevel,
      uses: "Delivery-to-shelf, backroom aging, display readiness",
      detects: "Store execution blocker",
      output: "Field action or verification approval",
      metric: "31.4 hr delivery-to-shelf cycle",
      icon: <Store className="w-4 h-4" />,
    },
  ]

  const SUMMARY_CARDS = [
    {
      id: "sku-segmentation",
      title: "AI-Driven SKU Segmentation",
      status: "stable" as StatusLevel,
      mainMetric: "2,180 SKU families analyzed",
      primaryRisk: "174 require human review",
      aiAction: "Classified SKUs into five operating segments",
      humanDecision: "Approve high-impact segment actions",
    },
    {
      id: "demand",
      title: "Demand Planning",
      status: "critical" as StatusLevel,
      mainMetric: "86.4% forecast accuracy",
      primaryRisk: "-4.8% forecast bias",
      aiAction: "Detected under-forecasting in Seasonal / Event",
      humanDecision: "Approve forecast uplift",
    },
    {
      id: "inventory",
      title: "Inventory & Allocation",
      status: "critical" as StatusLevel,
      mainMetric: "$48.6M available to allocate",
      primaryRisk: "214 stores exposed",
      aiAction: "Ranked stores by absorption capacity",
      humanDecision: "Approve protected push allocation",
    },
    {
      id: "supplier-inbound",
      title: "Supplier & Inbound Flow",
      status: "watchlist" as StatusLevel,
      mainMetric: "82.7% supplier OTIF",
      primaryRisk: "43 at-risk POs",
      aiAction: "Linked PO risk to allocation exposure",
      humanDecision: "Approve expedite or substitute recovery",
    },
    {
      id: "dc-capacity",
      title: "DC Capacity & Transportation",
      status: "critical" as StatusLevel,
      mainMetric: "91.3% network throughput",
      primaryRisk: "3 DCs at capacity risk",
      aiAction: "Prioritized outbound waves by SKU segment",
      humanDecision: "Approve wave change or route capacity",
    },
    {
      id: "store-execution",
      title: "Store Execution",
      status: "critical" as StatusLevel,
      mainMetric: "78.6 execution score",
      primaryRisk: "$4.3M aged in backroom",
      aiAction: "Flagged backroom and display readiness gaps",
      humanDecision: "Approve field action priorities",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* ── Section 1: Header + filters ───────────────────────────────────── */}
      <div className="border-b border-border bg-card px-8 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-[17px] font-bold text-foreground tracking-tight">Executive Control Tower</h1>
              <span className="text-[10px] font-semibold text-primary bg-accent border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-widest">
                Executive View
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI-driven supply chain planning, SKU segmentation, and decision priorities across the Dollar Tree network
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11px] text-muted-foreground">Last refresh</p>
            <p className="text-xs font-semibold text-foreground">Jun 7, 2026 · 8:30 AM</p>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-card px-8 py-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <select value={scope} onChange={e => setScope(e.target.value)} className={SELECT_CLS}>
            {["Enterprise", "Southeast", "Midwest", "Northeast", "Southwest", "West"].map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={segment} onChange={e => setSegment(e.target.value)} className={SELECT_CLS}>
            {["All Segments", "Consistent Replenishment", "Seasonal / Event", "Treasure Hunt / Limited Buy", "Promo / Merchant-Driven", "Constrained / Exception"].map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={horizon} onChange={e => setHorizon(e.target.value)} className={SELECT_CLS}>
            {["Next 14 Days", "Next 4 Weeks", "Next 8 Weeks", "Season Window"].map(o => <option key={o}>{o}</option>)}
          </select>
          <div className="flex items-center gap-1.5 flex-1 min-w-[220px] max-w-xs border border-border rounded-lg bg-card px-3 py-2">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search risk, SKU segment, region, DC, supplier, or decision"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="flex items-center gap-1.5 border border-border text-xs font-medium text-muted-foreground px-3 py-2 rounded-lg hover:bg-muted transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export Brief
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="px-8 py-7 space-y-10 max-w-[1600px]">

        {/* ── Section 2: Hero ────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-card px-7 py-6 shadow-sm">
          <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-1">
            Fit-for-purpose execution · Human-in-the-loop decisions
          </p>
          <h2 className="text-[18px] font-bold text-foreground tracking-tight mb-3 text-balance">
            AI-Driven Supply Chain Planning Cockpit
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-6">
            {"Dollar Tree's planning cockpit uses AI-defined SKU segmentation to connect demand, inventory, supplier, network, and store execution signals. Instead of treating every SKU the same way, the cockpit applies fit-for-purpose planning and fulfillment logic by segment, recommends actions within guardrails, and routes high-impact tradeoffs to human approval."}
          </p>

          {/* 3-step explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              {
                n: "01", title: "Segment SKUs",
                text: "Classifies SKU families into Consistent Replenishment, Seasonal / Event, Treasure Hunt / Limited Buy, Promo / Merchant-Driven, and Constrained / Exception.",
              },
              {
                n: "02", title: "Connect Signals",
                text: "Links forecast bias, inventory position, supplier and PO risk, DC capacity, transportation lanes, and store execution readiness.",
              },
              {
                n: "03", title: "Recommend Actions",
                text: "AI diagnoses and prioritizes actions, while planners approve high-impact decisions such as forecast uplifts, protected allocations, expedites, route capacity, and field labor priorities.",
              },
            ].map(s => (
              <div key={s.n} className="rounded-xl border border-border bg-background px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-primary bg-accent border border-primary/20 px-1.5 py-0.5 rounded font-mono">{s.n}</span>
                  <span className="text-sm font-semibold text-foreground">{s.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>

          {/* Info pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: "segmentation", label: "What does segmentation mean?" },
              { key: "data",         label: "What data is used?" },
              { key: "autonomous",   label: "What does AI do automatically?" },
              { key: "approval",     label: "When is approval required?" },
            ].map(p => (
              <button
                key={p.key}
                onClick={() => openDrawer(HERO_INFO_DRAWERS[p.key])}
                className="flex items-center gap-1.5 text-[11px] font-medium text-primary border border-primary/30 bg-accent px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Zap className="w-3 h-3" />
                {p.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Section 3: Executive posture snapshot ─────────────────────── */}
        <section>
          <SectionHeader
            title="Current Supply Chain Posture"
            subtitle="Risk is concentrated across connected planning and execution points: Seasonal / Event under-forecasting, constrained allocation readiness, inbound supplier variance, Savannah/Joliet network pressure, and store execution gaps."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { key: "revenue",   title: "Total Revenue at Risk",     value: "$18.1M",  sub: "End-to-end exposure across flagged risks", badge: "critical" as StatusLevel },
              { key: "protected", title: "Value Protected if Approved", value: "$8.7M",  sub: "Estimated impact of recommended actions",  badge: "recommended" as StatusLevel },
              { key: "stores",    title: "Stores at Risk",             value: "286",     sub: "Potential exposure before actions",         badge: "watchlist" as StatusLevel },
              { key: "decisions", title: "Critical Decisions",         value: "7",       sub: "Require approval before next lock",         badge: "critical" as StatusLevel },
              { key: "deadline",  title: "Next Decision Deadline",     value: "Jun 10",  sub: "5:00 PM allocation lock",                  badge: "critical" as StatusLevel },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => openDrawer(POSTURE_DRAWERS[m.key])}
                className="rounded-xl border border-border bg-card px-4 py-4 text-left hover:border-primary/40 hover:shadow-md transition-all group cursor-pointer"
              >
                <StatusBadge status={m.badge} className="mb-2.5" />
                <p className="text-[22px] font-bold text-foreground leading-none mb-1">{m.value}</p>
                <p className="text-[11px] font-semibold text-foreground mb-1">{m.title}</p>
                <p className="text-[10px] text-muted-foreground leading-snug">{m.sub}</p>
                <div className="mt-2.5 flex items-center gap-1 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View detail</span><ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Section 4: AI segmentation and signal flow ─────────────────── */}
        <section>
          <SectionHeader
            title="How the Cockpit Connects the System"
            subtitle="AI segmentation creates the operating logic; each downstream tab applies that logic to a different supply chain decision point."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {FLOW_STAGES.map((stage, i) => (
              <div
                key={stage.id}
                className="rounded-xl border border-border bg-card px-4 py-4 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer flex flex-col"
                onClick={() => openDrawer(SIGNAL_FLOW_DRAWERS[stage.id])}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-primary shrink-0">
                    {stage.icon}
                  </div>
                  <StatusBadge status={stage.status} />
                </div>
                <p className="text-[11px] font-bold text-foreground leading-snug mb-2.5">{stage.title}</p>
                <div className="space-y-1.5 flex-1 text-[10px] text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Uses:</span> {stage.uses}</p>
                  <p><span className="font-semibold text-foreground">Detects:</span> {stage.detects}</p>
                  <p><span className="font-semibold text-foreground">Output:</span> {stage.output}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[11px] font-bold text-foreground mb-2">{stage.metric}</p>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-[10px] font-semibold text-primary hover:underline"
                      onClick={e => { e.stopPropagation(); handleGoToTab(stage.id) }}
                    >
                      Open tab
                    </button>
                    <span className="text-muted-foreground">·</span>
                    <button
                      className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                      onClick={e => { e.stopPropagation(); openDrawer(SIGNAL_FLOW_DRAWERS[stage.id]) }}
                    >
                      Explain
                    </button>
                  </div>
                </div>
                {/* connector arrow */}
                {i < FLOW_STAGES.length - 1 && (
                  <div className="hidden xl:block absolute -right-1.5 top-1/2 -translate-y-1/2 text-border">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 5: Source tab summary cards ───────────────────────── */}
        <section>
          <SectionHeader
            title="Operating Tab Summaries"
            subtitle="Where each cockpit tab is focused and what decision it supports"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {SUMMARY_CARDS.map(card => (
              <div
                key={card.id}
                className="rounded-xl border border-border bg-card px-5 py-4 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer"
                onClick={() => openDrawer(SUMMARY_CARD_DRAWERS[card.id])}
              >
                <div className="flex items-center justify-between mb-3">
                  <StatusBadge status={card.status} />
                </div>
                <p className="text-[12px] font-bold text-foreground mb-1">{card.title}</p>
                <p className="text-[13px] font-bold text-primary mb-3">{card.mainMetric}</p>
                <div className="space-y-1.5 text-[11px] mb-4">
                  <div className="flex gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[var(--status-critical)] shrink-0 mt-0.5" />
                    <span className="text-muted-foreground"><span className="font-semibold text-foreground">Primary risk:</span> {card.primaryRisk}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[var(--status-stable)] shrink-0 mt-0.5" />
                    <span className="text-muted-foreground"><span className="font-semibold text-foreground">AI action:</span> {card.aiAction}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground"><span className="font-semibold text-foreground">Human decision:</span> {card.humanDecision}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <button
                    className="text-[11px] font-semibold text-primary-foreground bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                    onClick={e => { e.stopPropagation(); handleGoToTab(card.id) }}
                  >
                    Open tab
                  </button>
                  <button
                    className="text-[11px] text-primary font-medium hover:underline"
                    onClick={e => { e.stopPropagation(); openDrawer(SUMMARY_CARD_DRAWERS[card.id]) }}
                  >
                    View explanation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 6: AI actions completed ───────────────────────────── */}
        <section>
          <SectionHeader
            title="AI Actions Completed"
            subtitle="Cross-functional actions the AI has already completed or routed within approved guardrails"
          />
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
            {AI_ACTIONS.map(action => (
              <div
                key={action.id}
                className="px-5 py-4 flex items-start gap-4 hover:bg-muted/40 transition-colors cursor-pointer group"
                onClick={() => openDrawer(action.drawer)}
              >
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold shrink-0 mt-0.5",
                  ACTION_STATUS_STYLES[action.status]
                )}>
                  {ACTION_STATUS_ICONS[action.status]}
                  <span>{ACTION_STATUS_LABELS[action.status]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug mb-0.5">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.action}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1 text-right">
                  <button
                    className="text-[10px] font-semibold text-primary hover:underline whitespace-nowrap"
                    onClick={e => { e.stopPropagation(); handleGoToTab(action.sourceTabId) }}
                  >
                    {action.sourceTab}
                  </button>
                  <span className="text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded font-medium">
                    {action.segment}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 7: Top executive decisions ────────────────────────── */}
        <section ref={decisionsRef}>
          <SectionHeader
            title="Top Executive Decisions"
            subtitle="Highest-value human approvals needed before the next decision lock"
          />
          <div className="space-y-2.5">
            {EXEC_DECISIONS.map(dec => {
              const isApproved = approvalStatuses[dec.id] === "approved"
              return (
                <div
                  key={dec.id}
                  className={cn(
                    "rounded-xl border bg-card shadow-sm transition-all",
                    isApproved
                      ? "border-[var(--status-stable)]/30 bg-[var(--status-stable-bg)]"
                      : "border-border hover:border-primary/30 hover:shadow-md cursor-pointer"
                  )}
                  onClick={() => !isApproved && openDrawer(dec.drawer)}
                >
                  <div className="px-5 py-4 flex items-start gap-4">
                    {/* Priority number */}
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 transition-colors",
                      isApproved
                        ? "bg-[var(--status-stable)] text-white"
                        : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                    )}>
                      {isApproved ? <CheckCircle2 className="w-4 h-4" /> : dec.priority}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        {isApproved
                          ? <span className="text-[11px] font-semibold text-[var(--status-stable)] bg-[var(--status-stable-bg)] border border-[var(--status-stable)]/20 px-2 py-0.5 rounded-md">Approved</span>
                          : <span className="text-[11px] font-semibold text-[var(--status-watchlist)] bg-[var(--status-watchlist-bg)] border border-[var(--status-watchlist)]/20 px-2 py-0.5 rounded-md">
                              {dec.priority <= 3 ? "Pending Approval" : dec.priority === 5 ? "Needs Review" : "Pending Approval"}
                            </span>
                        }
                        <span className="text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded font-medium">{dec.segment}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-snug mb-2">{dec.title}</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <DollarSign className="w-3 h-3 text-[var(--status-stable)]" />
                          <span className="font-semibold text-[var(--status-stable)]">{dec.valueProtected} estimated</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{dec.storesImpacted} stores</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{dec.deadline}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          Owner: <span className="font-medium text-foreground">{dec.owner}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div
                      className="flex items-center gap-2 shrink-0"
                      onClick={e => e.stopPropagation()}
                    >
                      {isApproved ? (
                        <button
                          onClick={() => openDrawer(dec.drawer)}
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
                            onClick={() => openDrawer(dec.drawer)}
                            className="text-[11px] font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
                          >
                            Review Rationale
                          </button>
                          <button
                            onClick={() => handleGoToTab(dec.primarySourceTabId)}
                            className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium hover:text-foreground transition-colors whitespace-nowrap"
                          >
                            {dec.drillLabel} <ArrowRight className="w-3 h-3" />
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

        {/* ── Section 8: Executive summary brief ────────────────────────── */}
        <section className="rounded-2xl border border-border bg-card px-7 py-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-[14px] font-bold text-foreground mb-3">Executive Summary Brief</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-3xl">
                {"Dollar Tree's highest-value opportunity is to use AI-defined SKU segmentation to make planning and fulfillment more fit-for-purpose. The cockpit connects demand, inventory, supplier, DC, transportation, and store execution signals; takes lower-risk actions within guardrails; and routes the highest-impact tradeoffs to human approval. The current priority is to resolve Seasonal / Event risk before the Jun 10 allocation lock, while also protecting replenishment flow and store execution readiness."}
              </p>
              <div className="rounded-xl bg-accent border border-primary/20 px-4 py-3 max-w-2xl">
                <p className="text-xs text-accent-foreground leading-relaxed">
                  <span className="font-semibold">Recommended next step:</span>{" "}
                  Review and approve the top executive decisions before the Jun 10 allocation lock.{" "}
                  <button
                    onClick={scrollToDecisions}
                    className="text-primary font-semibold hover:underline"
                  >
                    Review decisions
                  </button>
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <button
                onClick={scrollToDecisions}
                className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Review Decisions <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* ── Detail drawer ────────────────────────────────────────────────── */}
      <ECTDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={closeDrawer}
        onGoToTab={handleGoToTab}
      />
    </div>
  )
}
