// ---------------------------------------------------------------------------
// SKU Segmentation — shared data types and mock data
// ---------------------------------------------------------------------------

export type StatusLevel = "critical" | "watchlist" | "stable" | "needs-approval" | "completed" | "pending" | "approved"
export type AutomationLevel = "high" | "medium" | "low"

export interface DrawerPayload {
  title: string
  status: StatusLevel
  explanation: string
  signals?: string[]
  metrics: { label: string; value: string }[]
  sourceTabs: { label: string; id: string }[]
  actionLabel?: string
  actionTabId?: string
  secondaryLabel?: string
  extraSections?: { heading: string; body: string }[]
  // Extended fields for agentic AI context
  segment?: string
  segmentStrategy?: string
  humanApprovalRequired?: boolean
  guardrailNote?: string
}

// ---------------------------------------------------------------------------
// Summary metrics
// ---------------------------------------------------------------------------
export const summaryMetrics: {
  title: string
  value: string
  subtext: string
  status: StatusLevel
  drawer: DrawerPayload
}[] = [
  {
    title: "SKU Families Analyzed",
    value: "2,180",
    subtext: "Across 5 priority categories",
    status: "stable",
    drawer: {
      title: "SKU Families Analyzed",
      status: "stable",
      explanation:
        "2,180 SKU families were evaluated across Consumables, Seasonal, Party, Household, and Health & Beauty categories. Each family was assessed using demand history, event data, merchant signals, store absorption scores, and operational constraints.",
      signals: ["Demand history depth", "Category classification", "DC receipt data", "Merchant calendar"],
      metrics: [
        { label: "Categories covered", value: "5" },
        { label: "SKU families", value: "2,180" },
        { label: "Data signals per SKU", value: "6" },
        { label: "Analysis window", value: "52 weeks" },
      ],
      sourceTabs: [{ label: "Demand Planning", id: "demand" }],
      actionLabel: "Go to Demand Planning",
      actionTabId: "demand",
    },
  },
  {
    title: "AI-Classified",
    value: "92%",
    subtext: "Assigned with high confidence",
    status: "stable",
    drawer: {
      title: "AI-Classified SKUs",
      status: "stable",
      explanation:
        "92% of SKU families were assigned to a segment with high confidence (score ≥ 0.80). The remaining 8% were either flagged for human review or require additional history before the AI can assign a segment with confidence.",
      signals: ["Confidence threshold: 0.80", "Minimum 12-week history required", "Analog match score"],
      metrics: [
        { label: "High-confidence assignments", value: "2,006 SKUs" },
        { label: "Confidence threshold", value: "0.80" },
        { label: "Below threshold", value: "174 SKUs" },
        { label: "Automation eligible", value: "1,450 SKUs" },
      ],
      sourceTabs: [],
      actionLabel: "View Approval Workbench",
      actionTabId: "sku-segmentation",
    },
  },
  {
    title: "Human Review Required",
    value: "174",
    subtext: "Constrained or low-confidence SKU families",
    status: "needs-approval",
    drawer: {
      title: "Human Review Required",
      status: "needs-approval",
      explanation:
        "174 SKU families have been routed for human review because they have low forecast confidence, active supply constraints, DC capacity pressure, or are new items without enough history to classify reliably.",
      signals: ["Forecast confidence < 0.80", "Supply shortfall detected", "DC capacity flag", "New item flag"],
      metrics: [
        { label: "Low confidence", value: "82 SKUs" },
        { label: "Supply-constrained", value: "54 SKUs" },
        { label: "New items", value: "38 SKUs" },
        { label: "Revenue at risk", value: "$4.0M" },
      ],
      sourceTabs: [
        { label: "Supplier & Inbound Flow", id: "supplier-inbound" },
        { label: "Executive Control Tower", id: "executive-tower" },
      ],
      actionLabel: "Open Approval Workbench",
      actionTabId: "sku-segmentation",
    },
  },
  {
    title: "Revenue at Risk",
    value: "$12.4M",
    subtext: "Across flagged SKU segments",
    status: "critical",
    drawer: {
      title: "Revenue at Risk",
      status: "critical",
      explanation:
        "Revenue at risk is calculated by combining shelf OOS exposure, under-forecast bias, and constrained allocation across Seasonal / Event, Constrained / Exception, Consistent Replenishment, Treasure Hunt, and Promo segments.",
      signals: ["Shelf OOS rate", "Forecast bias", "Constrained allocation value", "Promo exposure"],
      metrics: [
        { label: "Seasonal / Event", value: "$5.4M" },
        { label: "Constrained / Exception", value: "$4.0M" },
        { label: "Consistent Replenishment", value: "$3.2M (residual)" },
        { label: "Treasure Hunt", value: "$2.1M" },
        { label: "Promo / Merchant-Driven", value: "$1.7M" },
      ],
      sourceTabs: [
        { label: "Executive Control Tower", id: "executive-tower" },
        { label: "Demand Planning", id: "demand" },
      ],
      actionLabel: "Go to Executive Control Tower",
      actionTabId: "executive-tower",
    },
  },
  {
    title: "Recommended Push Actions",
    value: "38",
    subtext: "Pending planner review",
    status: "watchlist",
    drawer: {
      title: "Recommended Push Actions",
      status: "watchlist",
      explanation:
        "38 AI-recommended push actions are pending planner review. These include pre-window seasonal pushes, controlled Treasure Hunt pushes, promo-protected allocation holds, and constrained fallback substitutions.",
      signals: ["Store absorption score", "Selling window timing", "Display readiness", "DC availability"],
      metrics: [
        { label: "Seasonal pre-window pushes", value: "14" },
        { label: "Treasure Hunt controlled pushes", value: "9" },
        { label: "Promo protection holds", value: "8" },
        { label: "Constrained fallbacks", value: "7" },
      ],
      sourceTabs: [
        { label: "Inventory & Allocation", id: "inventory" },
        { label: "Store Execution", id: "store-execution" },
      ],
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
    },
  },
]

// ---------------------------------------------------------------------------
// Segment cards
// ---------------------------------------------------------------------------
export interface SegmentCard {
  id: string
  name: string
  definition: string
  exampleSkus: string[]
  strategy: string
  skuFamilies: number
  forecastAccuracy: string
  forecastBias: string
  shelfOos: string
  revenueAtRisk: string
  automationLevel: AutomationLevel
  humanRole: string
  status: StatusLevel
  drawer: DrawerPayload
}

export const segmentCards: SegmentCard[] = [
  {
    id: "consistent-replenishment",
    name: "Consistent Replenishment",
    definition: "Everyday SKUs with stable, repeatable demand and enough history for automated replenishment.",
    exampleSkus: ["Paper towels", "Cleaning supplies", "Pantry basics", "Health basics"],
    strategy: "Maintain baseline par levels and auto-replenish within guardrails.",
    skuFamilies: 1240,
    forecastAccuracy: "88.6%",
    forecastBias: "-2.1%",
    shelfOos: "4.8%",
    revenueAtRisk: "$3.2M",
    automationLevel: "high",
    humanRole: "Review outliers only",
    status: "stable",
    drawer: {
      title: "Consistent Replenishment",
      status: "stable",
      explanation:
        "Everyday SKUs with stable velocity and long enough history to forecast reliably. AI auto-replenishes within guardrails, and planners only review statistical outliers or supplier exceptions.",
      signals: ["Stable weekly velocity, low variance", "52+ weeks history", "No seasonal spike", "No merchant flag"],
      metrics: [
        { label: "SKU families", value: "1,240" },
        { label: "Forecast accuracy", value: "88.6%" },
        { label: "Forecast bias", value: "-2.1%" },
        { label: "Shelf OOS", value: "4.8%" },
        { label: "Revenue at risk", value: "$3.2M" },
        { label: "Automation level", value: "High" },
      ],
      sourceTabs: [
        { label: "Demand Planning", id: "demand" },
        { label: "Inventory & Allocation", id: "inventory" },
      ],
      actionLabel: "View Related Demand Risk",
      actionTabId: "demand",
      secondaryLabel: "Open Approval Items",
      extraSections: [
        { heading: "Classification criteria", body: "Coefficient of variation < 0.25 over 52 weeks, no active seasonal or promo flag, forecast confidence ≥ 0.88." },
        { heading: "Human review threshold", body: "Planners intervene only when a SKU's forecast error exceeds 15% for 3+ consecutive weeks or when a supplier exception is detected." },
      ],
    },
  },
  {
    id: "seasonal-event",
    name: "Seasonal / Event",
    definition: "Time-bound SKUs tied to holidays, seasons, or short selling windows.",
    exampleSkus: ["Halloween décor", "Summer toys", "Graduation supplies", "Holiday wrap"],
    strategy: "Push inventory before the selling window using regional seasonality and store absorption.",
    skuFamilies: 340,
    forecastAccuracy: "79.4%",
    forecastBias: "-8.9%",
    shelfOos: "9.6%",
    revenueAtRisk: "$5.4M",
    automationLevel: "medium",
    humanRole: "Approve major seasonal pushes",
    status: "critical",
    drawer: {
      title: "Seasonal / Event",
      status: "critical",
      explanation:
        "SKUs with defined selling windows require pre-window push allocation. AI identifies the window, scores store absorption, and recommends push quantities — but major allocation decisions require planner approval due to high revenue exposure.",
      signals: ["Short selling period", "Spike-driven demand", "Post-event residual risk", "Regional velocity variance"],
      metrics: [
        { label: "SKU families", value: "340" },
        { label: "Forecast accuracy", value: "79.4%" },
        { label: "Forecast bias", value: "-8.9%" },
        { label: "Shelf OOS", value: "9.6%" },
        { label: "Revenue at risk", value: "$5.4M" },
        { label: "Automation level", value: "Medium" },
      ],
      sourceTabs: [
        { label: "Demand Planning", id: "demand" },
        { label: "Inventory & Allocation", id: "inventory" },
        { label: "Store Execution", id: "store-execution" },
      ],
      actionLabel: "View Related Demand Risk",
      actionTabId: "demand",
      secondaryLabel: "Open Approval Items",
      extraSections: [
        { heading: "Classification criteria", body: "Selling window < 12 weeks, demand spike ratio > 2.5x baseline, seasonal event flag from merchant calendar." },
        { heading: "Human review threshold", body: "All pushes > $500K in revenue exposure or affecting > 200 stores require planner sign-off before allocation lock." },
      ],
    },
  },
  {
    id: "treasure-hunt",
    name: "Treasure Hunt / Limited Buy",
    definition: "One-time or opportunistic buys with sparse item history and limited availability.",
    exampleSkus: ["Closeout home goods", "Novelty products", "Limited branded deals", "Special buys"],
    strategy: "Use similar-item analogs and store absorption rather than overfitting SKU-store forecasts.",
    skuFamilies: 185,
    forecastAccuracy: "72.5%",
    forecastBias: "-6.4%",
    shelfOos: "7.8%",
    revenueAtRisk: "$2.1M",
    automationLevel: "medium",
    humanRole: "Review low-confidence analogs",
    status: "watchlist",
    drawer: {
      title: "Treasure Hunt / Limited Buy",
      status: "watchlist",
      explanation:
        "One-time buys with limited or no item-level history are handled using similar-item analog matching. AI identifies the best analog, scores store absorption, and recommends a controlled push to high-velocity stores.",
      signals: ["Sparse history", "Similar-item analog match", "Store absorption score", "Markdown risk flag"],
      metrics: [
        { label: "SKU families", value: "185" },
        { label: "Forecast accuracy", value: "72.5%" },
        { label: "Forecast bias", value: "-6.4%" },
        { label: "Shelf OOS", value: "7.8%" },
        { label: "Revenue at risk", value: "$2.1M" },
        { label: "Automation level", value: "Medium" },
      ],
      sourceTabs: [
        { label: "Inventory & Allocation", id: "inventory" },
        { label: "Demand Planning", id: "demand" },
      ],
      actionLabel: "View Related Demand Risk",
      actionTabId: "demand",
      secondaryLabel: "Open Approval Items",
      extraSections: [
        { heading: "Classification criteria", body: "Item history < 8 weeks, analog match score ≥ 0.70, limited-buy flag from merchant system." },
        { heading: "Human review threshold", body: "Planners review any SKU where the top analog match score falls below 0.70 or where markdown risk is flagged." },
      ],
    },
  },
  {
    id: "promo-merchant",
    name: "Promo / Merchant-Driven",
    definition: "SKUs where merchant intent, promo timing, display placement, or circular activity is the strongest demand signal.",
    exampleSkus: ["Endcap items", "Party promotion items", "Front-of-store seasonal programs", "Promo consumables"],
    strategy: "Protect inventory for promo stores and coordinate with display readiness before the allocation lock.",
    skuFamilies: 210,
    forecastAccuracy: "81.2%",
    forecastBias: "-5.7%",
    shelfOos: "8.4%",
    revenueAtRisk: "$1.7M",
    automationLevel: "medium",
    humanRole: "Confirm merchant timing",
    status: "watchlist",
    drawer: {
      title: "Promo / Merchant-Driven",
      status: "watchlist",
      explanation:
        "Promo SKUs are driven by merchant calendar signals, display plans, and circular activity rather than purely historical velocity. AI protects inventory for confirmed promo stores but requires merchant timing confirmation before locking allocation.",
      signals: ["Promo calendar flag", "Endcap or display plan", "Circular activity", "Store display readiness score"],
      metrics: [
        { label: "SKU families", value: "210" },
        { label: "Forecast accuracy", value: "81.2%" },
        { label: "Forecast bias", value: "-5.7%" },
        { label: "Shelf OOS", value: "8.4%" },
        { label: "Revenue at risk", value: "$1.7M" },
        { label: "Automation level", value: "Medium" },
      ],
      sourceTabs: [
        { label: "Inventory & Allocation", id: "inventory" },
        { label: "Store Execution", id: "store-execution" },
      ],
      actionLabel: "View Related Demand Risk",
      actionTabId: "demand",
      secondaryLabel: "Open Approval Items",
      extraSections: [
        { heading: "Classification criteria", body: "Active promo calendar flag, confirmed endcap or circular placement, merchant priority score > 0.65." },
        { heading: "Human review threshold", body: "Merchant timing confirmation is required before any allocation lock affecting > 150 promo stores." },
      ],
    },
  },
  {
    id: "constrained-exception",
    name: "Constrained / Exception",
    definition: "SKUs where the recommended action is blocked by supply, DC, transportation, store capacity, or low-confidence data constraints.",
    exampleSkus: ["Supplier-limited items", "Bulky/cube-constrained products", "Store-capacity constrained items", "Low-confidence new items"],
    strategy: "Route to human review and recommend fallback actions such as substitution, partial allocation, delay, or override.",
    skuFamilies: 174,
    forecastAccuracy: "68.1%",
    forecastBias: "-10.2%",
    shelfOos: "11.4%",
    revenueAtRisk: "$4.0M",
    automationLevel: "low",
    humanRole: "Approve exceptions",
    status: "needs-approval",
    drawer: {
      title: "Constrained / Exception",
      status: "needs-approval",
      explanation:
        "These SKUs have active constraints that prevent a clean automated recommendation. AI routes them to planners with suggested fallback options such as partial allocation, substitution, delay, or override.",
      signals: ["Supply shortfall detected", "DC capacity flag", "Store cube constraint", "Confidence score < 0.68"],
      metrics: [
        { label: "SKU families", value: "174" },
        { label: "Forecast accuracy", value: "68.1%" },
        { label: "Forecast bias", value: "-10.2%" },
        { label: "Shelf OOS", value: "11.4%" },
        { label: "Revenue at risk", value: "$4.0M" },
        { label: "Automation level", value: "Low" },
      ],
      sourceTabs: [
        { label: "Supplier & Inbound Flow", id: "supplier-inbound" },
        { label: "DC Capacity & Transportation", id: "dc-capacity" },
        { label: "Executive Control Tower", id: "executive-tower" },
      ],
      actionLabel: "View Related Demand Risk",
      actionTabId: "demand",
      secondaryLabel: "Open Approval Items",
      extraSections: [
        { heading: "Classification criteria", body: "Any active supply shortfall, DC hold, transportation delay, store capacity flag, or forecast confidence < 0.68 triggers this classification." },
        { heading: "Human review threshold", body: "All SKUs in this segment require individual planner review. AI provides ranked fallback options but does not auto-execute." },
      ],
    },
  },
]

// ---------------------------------------------------------------------------
// Classification signals
// ---------------------------------------------------------------------------
export const classificationSignals: {
  id: string
  title: string
  description: string
  example: string
  drawer: DrawerPayload
}[] = [
  {
    id: "demand-stability",
    title: "Demand Stability",
    description: "Measures whether sell-through is predictable week to week.",
    example: "Stable weekly velocity, low variance",
    drawer: {
      title: "Demand Stability",
      status: "stable",
      explanation:
        "Demand stability is measured using coefficient of variation over a rolling 52-week window. SKUs with CV < 0.25 are considered stable candidates for automated replenishment. High-variance SKUs are routed to Seasonal, Treasure Hunt, or Constrained segments.",
      signals: ["Coefficient of variation (CV)", "Week-over-week velocity delta", "Trend direction"],
      metrics: [
        { label: "Stable threshold (CV)", value: "< 0.25" },
        { label: "High-variance flag (CV)", value: "> 0.55" },
        { label: "SKUs flagged high-variance", value: "412" },
      ],
      sourceTabs: [{ label: "Demand Planning", id: "demand" }],
      actionLabel: "Go to Demand Planning",
      actionTabId: "demand",
    },
  },
  {
    id: "seasonality",
    title: "Seasonality / Event Window",
    description: "Identifies holiday, seasonal, or time-bound selling windows.",
    example: "Short selling period, spike-driven demand",
    drawer: {
      title: "Seasonality / Event Window",
      status: "watchlist",
      explanation:
        "AI compares each SKU's velocity profile against known holiday, seasonal, and event calendars. SKUs with a demand spike ratio > 2.5x baseline within a defined event window are classified as Seasonal / Event.",
      signals: ["Demand spike ratio", "Merchant event calendar", "Post-event velocity drop"],
      metrics: [
        { label: "Spike ratio threshold", value: "> 2.5x baseline" },
        { label: "Max selling window", value: "< 12 weeks" },
        { label: "Seasonal SKUs identified", value: "340" },
      ],
      sourceTabs: [{ label: "Demand Planning", id: "demand" }],
      actionLabel: "Go to Demand Planning",
      actionTabId: "demand",
    },
  },
  {
    id: "history-depth",
    title: "History Depth",
    description: "Checks whether the SKU has enough history to forecast reliably.",
    example: "New item, sparse history, or similar-item analog required",
    drawer: {
      title: "History Depth",
      status: "watchlist",
      explanation:
        "SKUs with fewer than 12 weeks of history are evaluated for analog matching. If a similar-item analog with a match score ≥ 0.70 is found, the SKU is placed in Treasure Hunt / Limited Buy. Otherwise it is routed to Constrained / Exception for human review.",
      signals: ["Weeks of sell-through history", "Analog match score", "New item flag"],
      metrics: [
        { label: "Minimum history for auto-classify", value: "12 weeks" },
        { label: "Analog match threshold", value: "≥ 0.70" },
        { label: "SKUs using analog", value: "185" },
      ],
      sourceTabs: [{ label: "Demand Planning", id: "demand" }],
      actionLabel: "Go to Demand Planning",
      actionTabId: "demand",
    },
  },
  {
    id: "merchant-intent",
    title: "Merchant Intent",
    description: "Uses promo calendars, assortment approvals, display plans, and merchant priority signals.",
    example: "Promo or endcap timing confirmed",
    drawer: {
      title: "Merchant Intent",
      status: "stable",
      explanation:
        "Merchant intent signals override statistical forecasts when a promo, endcap, or circular placement is active. AI reads the merchant calendar and display plan to confirm whether the SKU should be protected for promotional stores.",
      signals: ["Promo calendar flag", "Endcap or display plan", "Merchant priority score", "Circular activity"],
      metrics: [
        { label: "SKUs with active promo flag", value: "210" },
        { label: "Merchant priority threshold", value: "> 0.65" },
        { label: "Display readiness required", value: "Yes for lock" },
      ],
      sourceTabs: [
        { label: "Inventory & Allocation", id: "inventory" },
        { label: "Store Execution", id: "store-execution" },
      ],
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
    },
  },
  {
    id: "store-absorption",
    title: "Store Absorption",
    description: "Estimates which stores can realistically receive, hold, stock, and sell the product.",
    example: "Velocity, backroom pressure, execution score",
    drawer: {
      title: "Store Absorption",
      status: "stable",
      explanation:
        "Store absorption estimates how much product a store can realistically receive, hold, stock, and sell based on sales velocity, backroom pressure, execution score, and similar-item sell-through. It is used to rank stores for push allocation and to avoid over-shipping.",
      signals: ["Sales velocity rank", "Backroom pressure score", "Store execution score", "Similar-item sell-through"],
      metrics: [
        { label: "Stores scored for absorption", value: "8,200+" },
        { label: "High-absorption stores (Q4)", value: "2,100" },
        { label: "Low-absorption stores flagged", value: "640" },
      ],
      sourceTabs: [
        { label: "Store Execution", id: "store-execution" },
        { label: "Inventory & Allocation", id: "inventory" },
      ],
      actionLabel: "Go to Store Execution",
      actionTabId: "store-execution",
    },
  },
  {
    id: "operational-constraints",
    title: "Operational Constraints",
    description: "Detects whether supplier, DC, transportation, or store constraints limit the recommendation.",
    example: "Supply shortfall, DC bottleneck, store capacity constraint",
    drawer: {
      title: "Operational Constraints",
      status: "critical",
      explanation:
        "When any upstream constraint — supplier fill-rate shortfall, DC capacity hold, transportation delay, or store cube constraint — is detected, AI routes the SKU to the Constrained / Exception segment and generates fallback recommendations.",
      signals: ["Supplier fill-rate < threshold", "DC capacity utilization > 90%", "Transportation delay flag", "Store cube constraint"],
      metrics: [
        { label: "Constrained SKUs routed", value: "174" },
        { label: "Supply-flagged", value: "54" },
        { label: "DC-flagged", value: "38" },
        { label: "Store-capacity flagged", value: "82" },
      ],
      sourceTabs: [
        { label: "Supplier & Inbound Flow", id: "supplier-inbound" },
        { label: "DC Capacity & Transportation", id: "dc-capacity" },
      ],
      actionLabel: "Go to DC Capacity & Transportation",
      actionTabId: "dc-capacity",
    },
  },
]

export const classificationEngineDrawer: DrawerPayload = {
  title: "AI Classification Engine",
  status: "stable",
  explanation:
    "The engine combines product behavior, merchant intent, store absorption, and operational constraints to assign a segment and determine whether the action can be automated or needs human approval. It runs after each planning cycle refresh using the latest signals.",
  signals: ["Demand stability score", "Seasonality index", "History depth", "Merchant intent flags", "Absorption rank", "Constraint flags"],
  metrics: [
    { label: "Classification runs per day", value: "4" },
    { label: "Average confidence score", value: "0.84" },
    { label: "Auto-assigned (high confidence)", value: "2,006 SKUs" },
    { label: "Routed for human review", value: "174 SKUs" },
    { label: "Automation decisions executed", value: "1,450" },
  ],
  sourceTabs: [],
  actionLabel: "View Approval Workbench",
  actionTabId: "sku-segmentation",
}

// ---------------------------------------------------------------------------
// Decision log
// ---------------------------------------------------------------------------
export const decisionLog: {
  id: string
  title: string
  reason: string
  actionTaken: string
  status: StatusLevel
  relatedTab: { label: string; id: string }
  timestamp: string
  drawer: DrawerPayload
}[] = [
  {
    id: "log-1",
    title: "AI classified 340 SKU families as Seasonal / Event",
    reason: "Short selling window, seasonal demand spike, and limited post-event replenishment value",
    actionTaken: "Recommended pre-window push allocation by store absorption score",
    status: "completed",
    relatedTab: { label: "Inventory & Allocation", id: "inventory" },
    timestamp: "12 min ago",
    drawer: {
      title: "Seasonal / Event Classification",
      status: "completed",
      explanation: "AI compared velocity profiles against the seasonal event calendar and identified 340 SKU families with a demand spike ratio > 2.5x and a selling window under 12 weeks.",
      signals: ["Demand spike ratio: 2.5–6.1x", "Selling window: 4–11 weeks", "Post-event velocity drop: confirmed"],
      metrics: [
        { label: "SKUs classified", value: "340" },
        { label: "Average spike ratio", value: "3.8x" },
        { label: "Revenue exposure", value: "$5.4M" },
        { label: "Human approval required", value: "Yes — major pushes" },
      ],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }],
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
    },
  },
  {
    id: "log-2",
    title: "AI flagged 174 SKU families for human review",
    reason: "Supply constraints, low forecast confidence, or store capacity limitations",
    actionTaken: "Routed approval items to planning owners",
    status: "needs-approval",
    relatedTab: { label: "Executive Control Tower", id: "executive-tower" },
    timestamp: "36 min ago",
    drawer: {
      title: "Human Review Routing",
      status: "needs-approval",
      explanation: "174 SKUs could not be auto-assigned due to active supply shortfalls, DC capacity holds, or confidence scores below threshold. Each SKU was routed to a planning owner with a ranked set of fallback options.",
      signals: ["Confidence < 0.68", "Supply fill-rate < 80%", "DC capacity > 90%", "Store cube flag"],
      metrics: [
        { label: "SKUs routed", value: "174" },
        { label: "Revenue at risk", value: "$4.0M" },
        { label: "Human approval needed", value: "Yes — all" },
        { label: "Target resolution", value: "Before next allocation lock" },
      ],
      sourceTabs: [{ label: "Executive Control Tower", id: "executive-tower" }],
      actionLabel: "Go to Executive Control Tower",
      actionTabId: "executive-tower",
    },
  },
  {
    id: "log-3",
    title: "AI detected under-forecast bias in Seasonal SKUs",
    reason: "Actual velocity exceeded baseline forecast by 8.9%",
    actionTaken: "Recommended forecast uplift and protected allocation",
    status: "pending",
    relatedTab: { label: "Demand Planning", id: "demand" },
    timestamp: "Today 8:10 AM",
    drawer: {
      title: "Under-Forecast Bias — Seasonal",
      status: "pending",
      explanation: "Actual sell-through on Seasonal SKUs is running 8.9% ahead of the baseline forecast. AI has recommended a forecast uplift and a protected allocation hold while planner approval is pending.",
      signals: ["Actual vs. forecast delta: +8.9%", "3-week trend: accelerating", "Store sell-through: above plan in 62% of stores"],
      metrics: [
        { label: "Forecast bias", value: "-8.9%" },
        { label: "Uplift recommendation", value: "+9.4%" },
        { label: "Stores above plan", value: "62%" },
        { label: "Revenue impact if unaddressed", value: "$1.2M" },
      ],
      sourceTabs: [{ label: "Demand Planning", id: "demand" }],
      actionLabel: "Go to Demand Planning",
      actionTabId: "demand",
    },
  },
  {
    id: "log-4",
    title: "AI identified Treasure Hunt SKUs with sparse history",
    reason: "Limited item history but strong similar-item analogs",
    actionTaken: "Recommended controlled push to high-absorption stores",
    status: "completed",
    relatedTab: { label: "Inventory & Allocation", id: "inventory" },
    timestamp: "Today 7:44 AM",
    drawer: {
      title: "Treasure Hunt — Analog Push",
      status: "completed",
      explanation: "185 limited-buy SKUs were matched to similar-item analogs with scores ≥ 0.74. AI recommended a controlled push limited to high-absorption stores to minimize markdown risk.",
      signals: ["Analog match score ≥ 0.74", "History depth < 8 weeks", "High-absorption store list"],
      metrics: [
        { label: "SKUs using analog", value: "185" },
        { label: "Average analog match score", value: "0.81" },
        { label: "Stores targeted", value: "High-absorption only" },
        { label: "Markdown risk", value: "Low — controlled push" },
      ],
      sourceTabs: [{ label: "Inventory & Allocation", id: "inventory" }],
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
    },
  },
  {
    id: "log-5",
    title: "AI linked Promo SKUs to display readiness risk",
    reason: "Merchant promotion is active but display completion is below threshold",
    actionTaken: "Flagged Store Execution dependency before allocation lock",
    status: "watchlist",
    relatedTab: { label: "Store Execution", id: "store-execution" },
    timestamp: "Today 7:20 AM",
    drawer: {
      title: "Promo SKU — Display Readiness Flag",
      status: "watchlist",
      explanation: "Party promo SKUs have confirmed merchant calendar entries but store display completion is at 67% — below the 85% threshold needed to proceed with allocation lock. AI flagged this dependency.",
      signals: ["Display completion: 67%", "Allocation lock threshold: 85%", "Merchant promo: active", "Impacted stores: 310"],
      metrics: [
        { label: "Promo SKUs affected", value: "48" },
        { label: "Display completion", value: "67%" },
        { label: "Required threshold", value: "85%" },
        { label: "Allocation lock at risk", value: "Yes" },
      ],
      sourceTabs: [{ label: "Store Execution", id: "store-execution" }],
      actionLabel: "Go to Store Execution",
      actionTabId: "store-execution",
    },
  },
]

// ---------------------------------------------------------------------------
// Approval workbench
// ---------------------------------------------------------------------------
export interface ApprovalCard {
  id: string
  title: string
  segment: string
  recommendation: string
  whyApproval: string
  valueAtRisk: string
  owner: string
  status: StatusLevel
  primaryLabel: string
  secondaryLabel: string
  drawer: DrawerPayload
}

export const approvalCards: ApprovalCard[] = [
  {
    id: "approval-1",
    title: "Approve Seasonal / Event forecast uplift and push allocation",
    segment: "Seasonal / Event",
    recommendation: "Increase near-term forecast and push 42% of available Seasonal inventory to high-velocity stores",
    whyApproval: "High revenue exposure and constrained inventory before the selling window",
    valueAtRisk: "$2.4M",
    owner: "Demand Planning + Allocation",
    status: "pending",
    primaryLabel: "Approve",
    secondaryLabel: "View Rationale",
    drawer: {
      title: "Approve Seasonal / Event forecast uplift and push allocation",
      status: "pending",
      explanation: "AI detected under-forecast bias (+8.9% actual vs baseline) on Seasonal / Event SKUs and recommends a near-term forecast uplift paired with pushing 42% of available inventory to high-velocity stores before the selling window.",
      signals: ["Velocity delta +8.9% vs baseline", "Seasonal / Event segment classification", "Allocation lock deadline: Jun 10", "214 stores with stockout exposure"],
      segment: "Seasonal / Event",
      segmentStrategy: "Pre-window push allocation with forecast uplift",
      humanApprovalRequired: true,
      guardrailNote: "High revenue exposure — AI cannot act alone on forecast changes that directly drive allocation commitments.",
      metrics: [
        { label: "Forecast uplift", value: "+8.9% near-term" },
        { label: "Inventory to push", value: "42% of available" },
        { label: "Revenue at risk", value: "$2.4M" },
        { label: "Related tabs", value: "Demand Planning + Inventory & Allocation" },
      ],
      sourceTabs: [
        { label: "Demand Planning", id: "demand" },
        { label: "Inventory & Allocation", id: "inventory" },
      ],
      actionLabel: "Go to Demand Planning",
      actionTabId: "demand",
      extraSections: [
        { heading: "Risk if not approved", body: "Under-forecast bias results in under-allocation to high-velocity stores. Estimated revenue impact: $2.4M with increasing OOS through the selling window." },
        { heading: "Recommended next step", body: "Approve forecast uplift and confirm push allocation in Inventory & Allocation before Jun 10 deadline." },
      ],
    },
  },
  {
    id: "approval-2",
    title: "Approve Promo / Merchant-Driven inventory protection",
    segment: "Promo / Merchant-Driven",
    recommendation: "Protect Party promo inventory for stores with confirmed display readiness",
    whyApproval: "Merchant timing and display readiness need confirmation before allocation lock",
    valueAtRisk: "$860K",
    owner: "Merchandising + Planning",
    status: "pending",
    primaryLabel: "Approve Protection",
    secondaryLabel: "Request Confirmation",
    drawer: {
      title: "Approve Promo / Merchant-Driven inventory protection",
      status: "pending",
      explanation: "AI recommends holding Party promo inventory for the 310 stores with confirmed endcap display readiness. Allocation lock is blocked until merchant timing is confirmed.",
      signals: ["Display readiness: 67% (below 85% threshold)", "Merchant promo: active", "Circular activity: confirmed", "Allocation lock: pending"],
      segment: "Promo / Merchant-Driven",
      segmentStrategy: "Protected inventory for promo/display stores pending merchant confirmation",
      humanApprovalRequired: true,
      guardrailNote: "Merchant-sensitive and cross-functional — allocation lock cannot proceed without merchandising sign-off.",
      metrics: [
        { label: "Promo stores targeted", value: "310" },
        { label: "Display readiness", value: "67%" },
        { label: "Revenue at risk", value: "$860K" },
        { label: "Allocation lock status", value: "Blocked" },
      ],
      sourceTabs: [
        { label: "Inventory & Allocation", id: "inventory" },
        { label: "Store Execution", id: "store-execution" },
      ],
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      extraSections: [
        { heading: "Risk if not approved", body: "Inventory allocated to non-display-ready stores risks markdown and execution failure. $860K revenue protection requires confirmation." },
        { heading: "Recommended next step", body: "Confirm merchant timing with Merchandising, then approve protection for display-ready stores only." },
      ],
    },
  },
  {
    id: "approval-3",
    title: "Review Constrained / Exception SKU fallback",
    segment: "Constrained / Exception",
    recommendation: "Partially allocate supplier-limited cleaning SKUs and substitute where possible",
    whyApproval: "Supplier fill-rate constraint and DC capacity pressure limit the full recommendation",
    valueAtRisk: "$1.1M",
    owner: "Supplier Management + Inventory Planning",
    status: "needs-approval",
    primaryLabel: "Approve Fallback",
    secondaryLabel: "View Constraint",
    drawer: {
      title: "Review Constrained / Exception SKU fallback",
      status: "needs-approval",
      explanation: "Supplier fill-rate issues and DC capacity pressure are constraining the AI's ability to fully recommend an allocation path for cleaning SKUs. A partial allocation with substitution is the recommended fallback.",
      signals: ["43 at-risk POs", "Supplier fill-rate variance", "DC capacity: Savannah constrained", "Constrained / Exception segment flag"],
      segment: "Constrained / Exception",
      segmentStrategy: "Human-reviewed fallback allocation with partial push and SKU substitution",
      humanApprovalRequired: true,
      guardrailNote: "Low-confidence recommendation due to combined supplier and DC constraints — human review required before any allocation action.",
      metrics: [
        { label: "At-risk POs", value: "43" },
        { label: "Revenue at risk", value: "$1.1M" },
        { label: "Recommended action", value: "Partial allocation + substitution" },
        { label: "Constraint source", value: "Supplier fill-rate + DC capacity" },
      ],
      sourceTabs: [
        { label: "Supplier & Inbound Flow", id: "supplier-inbound" },
        { label: "DC Capacity & Transportation", id: "dc-capacity" },
      ],
      actionLabel: "Go to Supplier & Inbound Flow",
      actionTabId: "supplier-inbound",
      extraSections: [
        { heading: "Risk if not approved", body: "Cleaning SKU stockouts in 80+ stores if constraint is unresolved. $1.1M revenue at risk if no fallback is implemented." },
        { heading: "Recommended next step", body: "Review supplier constraint details, approve partial allocation, and identify substitution SKUs where possible." },
      ],
    },
  },
  {
    id: "approval-4",
    title: "Approve Treasure Hunt controlled push",
    segment: "Treasure Hunt / Limited Buy",
    recommendation: "Push limited-buy home goods only to high-absorption stores",
    whyApproval: "Sparse SKU history and markdown risk require human review",
    valueAtRisk: "$640K",
    owner: "Merchandising + Allocation",
    status: "pending",
    primaryLabel: "Approve Controlled Push",
    secondaryLabel: "View Similar Items",
    drawer: {
      title: "Approve Treasure Hunt controlled push",
      status: "pending",
      explanation: "AI recommends a controlled push of limited-buy home goods exclusively to stores with high absorption capacity. Sparse SKU history and markdown risk prevent autonomous action.",
      signals: ["Sparse sell-through history", "Limited-buy SKU classification", "Markdown risk: elevated", "High absorption stores identified"],
      segment: "Treasure Hunt / Limited Buy",
      segmentStrategy: "Controlled push by store absorption capacity with markdown risk guardrails",
      humanApprovalRequired: true,
      guardrailNote: "Sparse history and elevated markdown risk exceed autonomous action thresholds — planner confirmation required.",
      metrics: [
        { label: "Revenue at risk", value: "$640K" },
        { label: "Push strategy", value: "High-absorption stores only" },
        { label: "SKU type", value: "Limited buy / home goods" },
        { label: "Markdown risk", value: "Elevated" },
      ],
      sourceTabs: [
        { label: "AI-Driven SKU Segmentation", id: "sku-segmentation" },
        { label: "Inventory & Allocation", id: "inventory" },
      ],
      actionLabel: "Go to Inventory & Allocation",
      actionTabId: "inventory",
      extraSections: [
        { heading: "Risk if not approved", body: "Without controlled push, limited-buy inventory may be allocated broadly and result in markdown exposure across low-absorption stores." },
        { heading: "Recommended next step", body: "Approve controlled push for high-absorption store list and review similar item history before committing." },
      ],
    },
  },
  {
    id: "approval-5",
    title: "Approve Store Execution dependency for Promo SKUs",
    segment: "Promo / Merchant-Driven",
    recommendation: "Delay full promo push for stores without display readiness confirmation",
    whyApproval: "Prevents inventory from arriving before stores can execute the display",
    valueAtRisk: "$520K",
    owner: "Field Operations + Merchandising",
    status: "pending",
    primaryLabel: "Approve Dependency Rule",
    secondaryLabel: "View Stores",
    drawer: {
      title: "Approve Store Execution dependency for Promo SKUs",
      status: "pending",
      explanation: "AI recommends a dependency rule that blocks promo push to stores without confirmed display readiness. This prevents inventory from arriving before stores can execute endcap or display placement.",
      signals: ["Display readiness below threshold", "Promo / Merchant-Driven segment", "Store execution backroom age risk", "Allocation lock proximity"],
      segment: "Promo / Merchant-Driven",
      segmentStrategy: "Delay full promo push pending display readiness confirmation at store level",
      humanApprovalRequired: true,
      guardrailNote: "Cross-functional dependency between Field Operations and Merchandising — requires human approval before blocking allocation flow.",
      metrics: [
        { label: "Revenue at risk", value: "$520K" },
        { label: "Dependency type", value: "Display readiness gate" },
        { label: "Affected segment", value: "Promo / Merchant-Driven" },
        { label: "Related source", value: "Store Execution" },
      ],
      sourceTabs: [
        { label: "Store Execution", id: "store-execution" },
      ],
      actionLabel: "Go to Store Execution",
      actionTabId: "store-execution",
      extraSections: [
        { heading: "Risk if not approved", body: "Promo inventory arrives before display readiness, ages in backroom, and misses the promo window. Estimated impact: $520K sell-through loss." },
        { heading: "Recommended next step", body: "Approve dependency rule and align Field Operations on display readiness confirmation process before allocation lock." },
      ],
    },
  },
]
