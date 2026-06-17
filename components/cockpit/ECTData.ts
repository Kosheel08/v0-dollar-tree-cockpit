// ---------------------------------------------------------------
// Executive Decision Engine — static data
// ---------------------------------------------------------------

export type StatusLevel = "critical" | "watchlist" | "stable" | "recommended" | "high-risk"

export interface DrawerPayload {
  title: string
  status: StatusLevel
  explanation: string
  sourceTabs: string[]
  primarySourceTabId: string
  metrics: { label: string; value: string }[]
  businessImpact: string
  recommendedAction: string
}

// Hero metrics
export const heroMetrics: { label: string; value: string; sub?: string; drawerId: string }[] = [
  { label: "Total Revenue at Risk", value: "$18.1M", drawerId: "hero-revenue" },
  { label: "Value Protected", value: "$8.7M", sub: "if actions approved", drawerId: "hero-protected" },
  { label: "Stores at Risk", value: "286", drawerId: "hero-stores" },
  { label: "Critical Decisions", value: "7", drawerId: "hero-decisions" },
  { label: "Next Deadline", value: "Jun 10", sub: "5:00 PM", drawerId: "hero-deadline" },
]

// Risk flow stages
export const riskFlowStages = [
  {
    id: "flow-demand",
    label: "Demand",
    sourceTab: "Demand Planning",
    sourceTabId: "demand",
    status: "critical" as StatusLevel,
    signal: "-4.8% forecast bias",
    impact: "$12.4M demand-driven revenue at risk",
    explanation:
      "Demand is being under-forecast across Seasonal / Event and Promo / Merchant-Driven SKU segments, creating late-cycle pressure on allocation and fulfillment.",
  },
  {
    id: "flow-inventory",
    label: "Inventory",
    sourceTab: "Inventory & Allocation",
    sourceTabId: "inventory",
    status: "critical" as StatusLevel,
    signal: "72% allocation readiness",
    impact: "214 stores with stockout exposure",
    explanation:
      "Inventory exists at the network level, but positioning and allocation constraints are creating service risk at the store level.",
  },
  {
    id: "flow-supplier",
    label: "Supplier / Inbound",
    sourceTab: "Supplier & Inbound Flow",
    sourceTabId: "supplier-inbound",
    status: "watchlist" as StatusLevel,
    signal: "82.7% supplier OTIF",
    impact: "$9.8M inbound value at risk",
    explanation:
      "Inbound variability from late ASNs, short shipments, and lead-time variance is narrowing recovery options before the allocation lock.",
  },
  {
    id: "flow-network",
    label: "Network",
    sourceTab: "DC Capacity & Transportation",
    sourceTabId: "dc-capacity",
    status: "critical" as StatusLevel,
    signal: "3 DCs at capacity risk",
    impact: "87.9% on-time store delivery",
    explanation:
      "Savannah and Joliet constraints are slowing the ability to process and ship priority inventory to at-risk stores.",
  },
  {
    id: "flow-store",
    label: "Store Execution",
    sourceTab: "Store Execution",
    sourceTabId: "store-execution",
    status: "critical" as StatusLevel,
    signal: "31.4 hr delivery-to-shelf cycle",
    impact: "$4.3M inventory aged >48 hrs in backroom",
    explanation:
      "Delivered inventory is not consistently converting into verified shelf availability, compounding upstream supply chain delays.",
  },
]

// Source tab summaries
export const sourceSummaryCards = [
  {
    id: "card-demand",
    tabId: "demand",
    tabLabel: "Demand Planning",
    status: "critical" as StatusLevel,
    mainMetric: "86.4%",
    mainLabel: "Forecast Accuracy",
    riskMetric: "-4.8% bias",
    businessImpact: "$12.4M revenue at risk",
    explanation:
      "Forecast accuracy is improving, but under-forecast bias remains concentrated in Seasonal / Event and Promo / Merchant-Driven SKU segments, driving late-cycle pressure.",
    topAction: "Approve targeted forecast uplift for Seasonal / Event demand.",
  },
  {
    id: "card-inventory",
    tabId: "inventory",
    tabLabel: "Inventory & Allocation",
    status: "critical" as StatusLevel,
    mainMetric: "$48.6M",
    mainLabel: "Available to Allocate",
    riskMetric: "72% allocation readiness",
    businessImpact: "214 stores exposed",
    explanation:
      "Inventory is available at the network level, but positioning and allocation constraints are creating service risk.",
    topAction: "Protect allocation for high-risk stores before lock.",
  },
  {
    id: "card-supplier",
    tabId: "supplier-inbound",
    tabLabel: "Supplier & Inbound Flow",
    status: "watchlist" as StatusLevel,
    mainMetric: "82.7%",
    mainLabel: "Supplier OTIF",
    riskMetric: "43 at-risk POs",
    businessImpact: "$9.8M inbound value at risk",
    explanation:
      "Late ASNs, short shipments, and lead-time variance are narrowing recovery options before the allocation lock.",
    topAction: "Expedite critical Seasonal / Event inbound PO and recover Consistent Replenishment short shipment.",
  },
  {
    id: "card-network",
    tabId: "dc-capacity",
    tabLabel: "DC Capacity & Transportation",
    status: "critical" as StatusLevel,
    mainMetric: "91.3%",
    mainLabel: "Network Throughput",
    riskMetric: "3 DCs at capacity risk",
    businessImpact: "87.9% on-time store delivery",
    explanation:
      "Savannah and Joliet constraints are limiting outbound flow and store delivery reliability across the network.",
    topAction: "Re-sequence outbound waves and add route capacity.",
  },
  {
    id: "card-store",
    tabId: "store-execution",
    tabLabel: "Store Execution",
    status: "critical" as StatusLevel,
    mainMetric: "78.6",
    mainLabel: "Execution Score",
    riskMetric: "31.4 hr delivery-to-shelf",
    businessImpact: "$4.3M aged in backroom",
    explanation:
      "Store teams need to convert delivered inventory into shelf-verified availability faster to reduce revenue leakage.",
    topAction: "Clear backroom aging, endcap setup, and phantom inventory exceptions.",
  },
]

// Executive decisions
export const executiveDecisions = [
  {
    id: "dec-1",
    title: "Approve Seasonal / Event forecast uplift and protected allocation",
    sourceTabs: ["Demand Planning", "Inventory & Allocation"],
    primarySourceTabId: "inventory",
    valueProtected: "$3.4M",
    storesImpacted: 72,
    owner: "Demand Planning + Allocation",
    deadline: "Jun 10 · 5:00 PM",
    status: "critical" as StatusLevel,
    rationale:
      "Under-forecast bias in Seasonal / Event SKU segments is driving downstream allocation shortfalls. Approving an uplift before the Jun 10 lock allows the allocation engine to position inventory correctly, protecting an estimated $3.4M in seasonal revenue across 72 stores.",
  },
  {
    id: "dec-2",
    title: "Expedite delayed Seasonal / Event inbound PO into Savannah DC",
    sourceTabs: ["Supplier & Inbound Flow", "DC Capacity & Transportation"],
    primarySourceTabId: "supplier-inbound",
    valueProtected: "$1.6M",
    storesImpacted: 42,
    owner: "Inbound Planning",
    deadline: "Next 24 hours",
    status: "critical" as StatusLevel,
    rationale:
      "A delayed Seasonal / Event PO is creating a cascading receipt gap at Savannah DC. Expediting this shipment restores outbound wave sequencing and recovers delivery reliability for 42 downstream stores.",
  },
  {
    id: "dec-3",
    title: "Re-sequence Savannah outbound waves",
    sourceTabs: ["DC Capacity & Transportation"],
    primarySourceTabId: "dc-capacity",
    valueProtected: "$1.2M",
    storesImpacted: 72,
    owner: "DC Operations + Transportation",
    deadline: "Next 24 hours",
    status: "critical" as StatusLevel,
    rationale:
      "Savannah DC is operating above capacity with suboptimal wave sequencing, delaying priority shipments. Re-sequencing outbound waves prioritizes high-risk stores and recovers on-time delivery performance.",
  },
  {
    id: "dec-4",
    title: "Clear backroom aging and endcap setup backlog",
    sourceTabs: ["Store Execution"],
    primarySourceTabId: "store-execution",
    valueProtected: "$1.8M",
    storesImpacted: 126,
    owner: "Field Operations",
    deadline: "48 hours",
    status: "critical" as StatusLevel,
    rationale:
      "126 stores have inventory delivered but aging in the backroom, preventing shelf verification and sales conversion. Clearing this backlog is the fastest lever to recover $1.8M in at-risk revenue.",
  },
  {
    id: "dec-5",
    title: "Recover Consistent Replenishment short shipment for Midwest stores",
    sourceTabs: ["Supplier & Inbound Flow", "Inventory & Allocation"],
    primarySourceTabId: "supplier-inbound",
    valueProtected: "$700K",
    storesImpacted: 58,
    owner: "Supplier Management + Replenishment",
    deadline: "48 hours",
    status: "watchlist" as StatusLevel,
    rationale:
      "A short shipment in Consistent Replenishment is creating stockout exposure across 58 Midwest stores. Recovery options include expediting a supplemental shipment or reallocating from an adjacent DC.",
  },
]

// Scenarios
export const scenarios = [
  {
    id: "recommended",
    label: "Recommended Actions Approved",
    status: "recommended" as StatusLevel,
    revenueAtRisk: "$9.4M",
    valueProtected: "$8.7M",
    storesAtRisk: 146,
    serviceRecovery: "+6.2 pts",
    operatingCost: "$640K",
    summary: "Best balance of value protection and controllable cost.",
    explanation:
      "This scenario assumes leadership approves all five executive decisions before the Jun 10 allocation lock. The combination of forecast uplift, inbound recovery, wave re-sequencing, and field execution actions produces the best risk-adjusted outcome.",
  },
  {
    id: "no-intervention",
    label: "No Intervention",
    status: "high-risk" as StatusLevel,
    revenueAtRisk: "$18.1M",
    valueProtected: "$0",
    storesAtRisk: 286,
    serviceRecovery: "0 pts",
    operatingCost: "$0",
    summary: "Avoids incremental cost but leaves service and revenue exposure unresolved.",
    explanation:
      "No actions are taken. All upstream supply chain risks flow through to store execution and customer-facing service levels. The full $18.1M revenue at risk remains unprotected.",
  },
  {
    id: "constrained",
    label: "Constrained Network",
    status: "watchlist" as StatusLevel,
    revenueAtRisk: "$14.6M",
    valueProtected: "$3.5M",
    storesAtRisk: 231,
    serviceRecovery: "+2.1 pts",
    operatingCost: "$280K",
    summary: "Partial recovery, but DC and store execution constraints limit the benefit.",
    explanation:
      "Only inbound and demand actions are approved. DC capacity constraints and store execution gaps remain unresolved, limiting recovery to $3.5M despite moderate cost outlay.",
  },
]

// Drawer payloads keyed by id
export const drawerPayloads: Record<string, DrawerPayload> = {
  "hero-revenue": {
    title: "Total Revenue at Risk",
    status: "critical",
    explanation:
      "This figure represents the total Dollar Tree revenue exposed across all five operating domains — demand, inventory, inbound, network, and store execution — if no corrective actions are taken before the Jun 10 allocation lock.",
    sourceTabs: ["Demand Planning", "Inventory & Allocation", "Supplier & Inbound Flow", "DC Capacity & Transportation", "Store Execution"],
    primarySourceTabId: "demand",
    metrics: [
      { label: "Demand-driven", value: "$12.4M" },
      { label: "Inbound-driven", value: "$9.8M" },
      { label: "Network-driven", value: "included above" },
      { label: "Store execution", value: "$4.3M" },
    ],
    businessImpact: "If no actions are taken, the full $18.1M remains at risk across 286 stores.",
    recommendedAction: "Approve the recommended actions package before Jun 10 to protect $8.7M.",
  },
  "hero-protected": {
    title: "Value Protected",
    status: "stable",
    explanation:
      "This represents the estimated revenue that can be protected if leadership approves the five recommended executive decisions before the Jun 10 allocation lock.",
    sourceTabs: ["Demand Planning", "Inventory & Allocation", "Supplier & Inbound Flow"],
    primarySourceTabId: "inventory",
    metrics: [
      { label: "Forecast uplift", value: "$3.4M" },
      { label: "Inbound recovery", value: "$1.6M" },
      { label: "Network re-sequencing", value: "$1.2M" },
      { label: "Store execution", value: "$1.8M" },
      { label: "Consumables recovery", value: "$700K" },
    ],
    businessImpact: "Protecting $8.7M reduces store exposure from 286 to 146 stores.",
    recommendedAction: "Review and approve the Top Executive Decisions section.",
  },
  "hero-stores": {
    title: "Stores at Risk",
    status: "critical",
    explanation:
      "286 stores currently have at least one active supply chain risk — stockout exposure, aged backroom inventory, missed allocations, or service delivery failures.",
    sourceTabs: ["Inventory & Allocation", "Store Execution"],
    primarySourceTabId: "inventory",
    metrics: [
      { label: "Stockout exposure", value: "214 stores" },
      { label: "Backroom aging >48hrs", value: "126 stores" },
      { label: "Missed allocations", value: "98 stores" },
    ],
    businessImpact: "If recommended actions are approved, store exposure reduces from 286 to 146.",
    recommendedAction: "Prioritize allocation lock decisions and field execution actions.",
  },
  "hero-decisions": {
    title: "Critical Decisions",
    status: "critical",
    explanation:
      "There are 7 decisions requiring leadership input before the Jun 10 allocation lock. 5 are captured in the Top Executive Decisions section; 2 additional field escalations are pending DC Operations and Field leadership sign-off.",
    sourceTabs: ["Demand Planning", "Inventory & Allocation", "Supplier & Inbound Flow", "DC Capacity & Transportation", "Store Execution"],
    primarySourceTabId: "demand",
    metrics: [
      { label: "Decisions in view", value: "5" },
      { label: "Pending escalation", value: "2" },
      { label: "Value protected if approved", value: "$8.7M" },
    ],
    businessImpact: "Delaying decisions past Jun 10 locks in the no-intervention outcome.",
    recommendedAction: "Review the Top Executive Decisions section and assign owners today.",
  },
  "hero-deadline": {
    title: "Next Deadline — Jun 10 · 5:00 PM",
    status: "critical",
    explanation:
      "The allocation engine locks at 5:00 PM on Jun 10. Any forecast adjustments, allocation overrides, or inbound recovery actions must be approved and submitted before this cutoff.",
    sourceTabs: ["Demand Planning", "Inventory & Allocation"],
    primarySourceTabId: "inventory",
    metrics: [
      { label: "Hours remaining", value: "~57 hrs" },
      { label: "Decisions required before lock", value: "5" },
    ],
    businessImpact: "Missing the lock means the at-risk allocation pattern is set for the full planning cycle.",
    recommendedAction: "Approve decisions 1 and 2 in the next 24 hours to meet the lock.",
  },
}
