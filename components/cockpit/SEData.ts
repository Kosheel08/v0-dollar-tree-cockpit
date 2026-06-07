// Store Execution — shared data and types

export type StatusType = "Critical" | "Behind" | "Watchlist" | "On Track" | "Complete"

export type DetailItem = {
  id: string
  type: "funnel" | "district" | "workbench" | "promo" | "accuracy" | "action"
  title: string
  status: StatusType
  meta: Record<string, string>
  metrics: { label: string; value: string }[]
  rootCauses: string[]
  impact: string
  recommendation: string
  primaryAction: string
  secondaryAction: string
}

// ─── Funnel stages ────────────────────────────────────────────────────────────
export const funnelStages: DetailItem[] = [
  {
    id: "f1", type: "funnel", title: "Delivery Checked In", status: "On Track",
    meta: { "Stage": "1 of 6", "Stores": "1,240", "Completion": "94%", "Median Time": "1.8 hrs" },
    metrics: [{ label: "Stores complete", value: "1,166" }, { label: "Stores incomplete", value: "74" }, { label: "Median cycle", value: "1.8 hrs" }, { label: "Target", value: "<2 hrs" }],
    rootCauses: ["Delivery window misalignment in 12 stores", "Receiving team scheduling gaps on weekends"],
    impact: "Minor check-in delays create downstream backroom congestion in 6% of stores.",
    recommendation: "Audit weekend receiving coverage; confirm delivery window communication in lagging stores.",
    primaryAction: "Create Field Action", secondaryAction: "View Store List",
  },
  {
    id: "f2", type: "funnel", title: "Truck Unloaded", status: "Behind",
    meta: { "Stage": "2 of 6", "Stores": "1,108", "Completion": "89%", "Median Time": "5.6 hrs" },
    metrics: [{ label: "Stores complete", value: "986" }, { label: "Stores incomplete", value: "122" }, { label: "Median cycle", value: "5.6 hrs" }, { label: "Target", value: "<4 hrs" }],
    rootCauses: ["Insufficient unload crew in 87 stores", "Oversized mixed-load trailers requiring rescan", "Equipment availability constraints"],
    impact: "$1.1M inventory sitting on trailers past target window; downstream backroom intake delayed.",
    recommendation: "Prioritize labor assignment to truck unload in bottom-quartile stores; escalate to district managers.",
    primaryAction: "Assign Field Action", secondaryAction: "View Store List",
  },
  {
    id: "f3", type: "funnel", title: "Backroom Sorted", status: "Behind",
    meta: { "Stage": "3 of 6", "Stores": "914", "Completion": "74%", "Median Time": "13.2 hrs" },
    metrics: [{ label: "Stores complete", value: "676" }, { label: "Stores incomplete", value: "238" }, { label: "Median cycle", value: "13.2 hrs" }, { label: "Target", value: "<8 hrs" }],
    rootCauses: ["Backroom congestion from prior delivery not cleared", "Seasonal totes unstaged blocking sort lanes", "Sort task unassigned in 61 stores"],
    impact: "$2.4M inventory unsorted; delays put-to-shelf by 6–14 hours in affected stores.",
    recommendation: "Clear prior-cycle totes before next delivery; assign sort tasks before truck arrival.",
    primaryAction: "Create Field Action", secondaryAction: "View Store List",
  },
  {
    id: "f4", type: "funnel", title: "Put-to-Shelf", status: "Critical",
    meta: { "Stage": "4 of 6", "Stores": "842", "Completion": "68%", "Median Time": "31.4 hrs" },
    metrics: [{ label: "Stores complete", value: "573" }, { label: "Stores incomplete", value: "269" }, { label: "Median cycle", value: "31.4 hrs" }, { label: "Target", value: "<18 hrs" }],
    rootCauses: ["Labor not scheduled for stocking shifts", "Planogram mismatches requiring reset before stock", "Seasonal floor sets blocking aisle access"],
    impact: "$3.8M product in building not generating sales. Sellable availability gap driving revenue leakage.",
    recommendation: "Emergency labor scheduling review in Districts 104 and 118; escalate planogram compliance issues to merchandising.",
    primaryAction: "Escalate to Field", secondaryAction: "View Store List",
  },
  {
    id: "f5", type: "funnel", title: "Display / Endcap Set", status: "Critical",
    meta: { "Stage": "5 of 6", "Stores": "731", "Completion": "59%", "Median Time": "42.0 hrs" },
    metrics: [{ label: "Stores complete", value: "431" }, { label: "Stores incomplete", value: "300" }, { label: "Median cycle", value: "42.0 hrs" }, { label: "Target", value: "<24 hrs" }],
    rootCauses: ["Display materials not received or mislabeled", "Endcap setup tasks not assigned before stocking", "Photo verification workflow incomplete"],
    impact: "300 stores with promo product delivered but display not set; promotional selling window at risk.",
    recommendation: "Assign endcap setup tasks at time of delivery check-in; require photo verification before close-out.",
    primaryAction: "Prioritize Tasks", secondaryAction: "View Promo Stores",
  },
  {
    id: "f6", type: "funnel", title: "Shelf Verified", status: "Critical",
    meta: { "Stage": "6 of 6", "Stores": "702", "Completion": "57%", "Median Time": "46.8 hrs" },
    metrics: [{ label: "Stores complete", value: "400" }, { label: "Stores incomplete", value: "302" }, { label: "Median cycle", value: "46.8 hrs" }, { label: "Target", value: "<28 hrs" }],
    rootCauses: ["Shelf verification task deprioritized vs. unload tasks", "System inventory mismatches creating false positives", "No store manager sign-off required in 44% of stores"],
    impact: "43% of stores have unverified shelf status; replenishment decisions based on inaccurate availability signal.",
    recommendation: "Mandate shelf verification task before delivery close-out; route exceptions to district manager queue.",
    primaryAction: "Create Verification Queue", secondaryAction: "View Store List",
  },
]

// ─── Districts ─────────────────────────────────────────────────────────────────
export const districts: DetailItem[] = [
  {
    id: "d1", type: "district", title: "District 104 · Atlanta Metro", status: "Critical",
    meta: { "Stores": "38", "Execution Score": "61 / 100", "Cycle Time": "39.8 hrs", "Tasks Overdue": "94", "Display Readiness": "46%", "Inventory Accuracy": "89.7%" },
    metrics: [{ label: "Execution Score", value: "61" }, { label: "Delivery-to-shelf", value: "39.8 hrs" }, { label: "Tasks overdue", value: "94" }, { label: "Display readiness", value: "46%" }],
    rootCauses: ["Backroom aging > 48 hrs across 22 stores", "Endcap setup tasks incomplete in high-traffic locations", "Understaffed stocking shifts 3 out of 5 weekdays"],
    impact: "Largest single-district contributor to execution score gap. $1.7M inventory aged in backroom.",
    recommendation: "District field leadership to conduct store-by-store backroom audit; escalate task completion daily.",
    primaryAction: "View District Detail", secondaryAction: "Assign Field Action",
  },
  {
    id: "d2", type: "district", title: "District 118 · Birmingham", status: "Behind",
    meta: { "Stores": "31", "Execution Score": "68 / 100", "Cycle Time": "34.2 hrs", "Tasks Overdue": "71", "Display Readiness": "52%", "Inventory Accuracy": "91.4%" },
    metrics: [{ label: "Execution Score", value: "68" }, { label: "Delivery-to-shelf", value: "34.2 hrs" }, { label: "Tasks overdue", value: "71" }, { label: "Display readiness", value: "52%" }],
    rootCauses: ["Truck unload delays across 18 stores", "Task backlog from prior week not cleared", "Shift scheduling gaps on Thursday/Friday"],
    impact: "Task backlog compounding; execution score declining vs. prior 4-week trend.",
    recommendation: "Weekly task audit with store managers; confirm truck unload labor minimum at delivery window.",
    primaryAction: "View District Detail", secondaryAction: "Assign Field Action",
  },
  {
    id: "d3", type: "district", title: "District 132 · Chicago South", status: "Behind",
    meta: { "Stores": "42", "Execution Score": "72 / 100", "Cycle Time": "30.6 hrs", "Tasks Overdue": "63", "Display Readiness": "61%", "Inventory Accuracy": "92.2%" },
    metrics: [{ label: "Execution Score", value: "72" }, { label: "Delivery-to-shelf", value: "30.6 hrs" }, { label: "Tasks overdue", value: "63" }, { label: "Display readiness", value: "61%" }],
    rootCauses: ["Put-to-shelf cycle time above 30-hr threshold", "Planogram reset bottleneck in 14 stores"],
    impact: "Moderate risk; 63 tasks overdue creating downstream shelf availability gap.",
    recommendation: "Address planogram reset backlog as priority before next delivery window.",
    primaryAction: "View District Detail", secondaryAction: "Assign Field Action",
  },
  {
    id: "d4", type: "district", title: "District 147 · Philadelphia", status: "Watchlist",
    meta: { "Stores": "29", "Execution Score": "76 / 100", "Cycle Time": "28.1 hrs", "Tasks Overdue": "48", "Display Readiness": "64%", "Inventory Accuracy": "93.0%" },
    metrics: [{ label: "Execution Score", value: "76" }, { label: "Delivery-to-shelf", value: "28.1 hrs" }, { label: "Tasks overdue", value: "48" }, { label: "Display readiness", value: "64%" }],
    rootCauses: ["Promo display verification incomplete in 11 stores"],
    impact: "On the boundary; promo display gap creates risk for upcoming promotional window.",
    recommendation: "Complete promo display verification before Jun 10 selling window opens.",
    primaryAction: "View District Detail", secondaryAction: "View Promo Tasks",
  },
  {
    id: "d5", type: "district", title: "District 155 · Phoenix", status: "On Track",
    meta: { "Stores": "36", "Execution Score": "83 / 100", "Cycle Time": "24.9 hrs", "Tasks Overdue": "31", "Display Readiness": "72%", "Inventory Accuracy": "94.1%" },
    metrics: [{ label: "Execution Score", value: "83" }, { label: "Delivery-to-shelf", value: "24.9 hrs" }, { label: "Tasks overdue", value: "31" }, { label: "Display readiness", value: "72%" }],
    rootCauses: ["Minor backroom aging in 4 stores"],
    impact: "Performing above network average; minor backroom aging manageable at current rate.",
    recommendation: "Monitor backroom aging; maintain current labor scheduling approach.",
    primaryAction: "View District Detail", secondaryAction: "View Store List",
  },
  {
    id: "d6", type: "district", title: "District 169 · Los Angeles East", status: "Complete",
    meta: { "Stores": "34", "Execution Score": "88 / 100", "Cycle Time": "21.7 hrs", "Tasks Overdue": "18", "Display Readiness": "81%", "Inventory Accuracy": "95.3%" },
    metrics: [{ label: "Execution Score", value: "88" }, { label: "Delivery-to-shelf", value: "21.7 hrs" }, { label: "Tasks overdue", value: "18" }, { label: "Display readiness", value: "81%" }],
    rootCauses: ["No material issues identified"],
    impact: "Best-in-network district; available as a model for backroom and task compliance benchmarking.",
    recommendation: "Document operating practices for broader network rollout.",
    primaryAction: "View District Detail", secondaryAction: "Share Best Practices",
  },
]

// ─── Workbench items ───────────────────────────────────────────────────────────
export const workbenchItems: (DetailItem & { column: 1 | 2 | 3; sub1: string; sub2: string })[] = [
  {
    id: "w1", type: "workbench", column: 1, title: "Seasonal totes aged >48 hrs", status: "Critical",
    sub1: "126 stores", sub2: "$1.7M",
    meta: { "Category": "Seasonal", "Stores": "126", "Value": "$1.7M", "Age": ">48 hrs" },
    metrics: [{ label: "Stores impacted", value: "126" }, { label: "Inventory value", value: "$1.7M" }, { label: "Avg age", value: "61 hrs" }],
    rootCauses: ["No put-to-shelf labor assigned", "Aisle reset blocking seasonal section", "Tote labels missing for cross-reference"],
    impact: "Seasonal product aging in backroom misses peak selling window; markdown risk increasing.",
    recommendation: "Assign emergency stocking labor; prioritize seasonal tote processing within 12 hours.",
    primaryAction: "Assign Labor", secondaryAction: "View Stores",
  },
  {
    id: "w2", type: "workbench", column: 1, title: "Household cartons aged >72 hrs", status: "Behind",
    sub1: "84 stores", sub2: "$920K",
    meta: { "Category": "Household", "Stores": "84", "Value": "$920K", "Age": ">72 hrs" },
    metrics: [{ label: "Stores impacted", value: "84" }, { label: "Inventory value", value: "$920K" }, { label: "Avg age", value: "78 hrs" }],
    rootCauses: ["Backroom congestion from seasonal overflow", "Carton staging in receiving dock, not sorted"],
    impact: "Consumables replenishment delayed; shelf gaps likely in affected stores by tomorrow.",
    recommendation: "Route household cartons to front of stocking queue; clear backroom staging area.",
    primaryAction: "Reprioritize Queue", secondaryAction: "View Stores",
  },
  {
    id: "w3", type: "workbench", column: 1, title: "Party displays staged, not set", status: "Critical",
    sub1: "53 stores", sub2: "$610K",
    meta: { "Category": "Party / Seasonal", "Stores": "53", "Value": "$610K", "Status": "Staged only" },
    metrics: [{ label: "Stores impacted", value: "53" }, { label: "Inventory value", value: "$610K" }, { label: "Setup due", value: "Jun 9" }],
    rootCauses: ["Display setup task not assigned at check-in", "Endcap space occupied by prior promo not cleared"],
    impact: "Party promotional window opens Jun 9; displays not set will miss entire window.",
    recommendation: "Assign display setup tasks immediately; confirm endcap clearance in all 53 stores.",
    primaryAction: "Assign Setup Tasks", secondaryAction: "View Stores",
  },
  {
    id: "w4", type: "workbench", column: 2, title: "Unassigned stocking tasks", status: "Critical",
    sub1: "212 tasks", sub2: "79 stores",
    meta: { "Task type": "Stocking", "Tasks": "212", "Stores": "79", "Age": "Open > 24 hrs" },
    metrics: [{ label: "Open tasks", value: "212" }, { label: "Stores affected", value: "79" }, { label: "Avg task age", value: "31 hrs" }],
    rootCauses: ["Labor schedule not aligned to stocking task load", "Task assignment not auto-routed on delivery receipt"],
    impact: "212 unassigned tasks mean shelves cannot be stocked without manual intervention.",
    recommendation: "Configure auto-task assignment on delivery receipt; escalate to district managers for same-day coverage.",
    primaryAction: "Assign Tasks", secondaryAction: "View Task List",
  },
  {
    id: "w5", type: "workbench", column: 2, title: "Manager approval pending", status: "Behind",
    sub1: "98 tasks", sub2: "44 stores",
    meta: { "Task type": "Manager approval", "Tasks": "98", "Stores": "44", "Aging": ">12 hrs" },
    metrics: [{ label: "Pending tasks", value: "98" }, { label: "Stores affected", value: "44" }, { label: "Avg wait", value: "18 hrs" }],
    rootCauses: ["Store manager unavailable or off-shift", "Approval workflow requires in-store sign-off only"],
    impact: "98 tasks blocked pending approval; stocking and display cannot proceed.",
    recommendation: "Enable remote task approval in app; notify district manager of pending approvals >8 hrs.",
    primaryAction: "Send Approval Reminders", secondaryAction: "View Tasks",
  },
  {
    id: "w6", type: "workbench", column: 2, title: "Truck unload not closed", status: "Behind",
    sub1: "61 tasks", sub2: "38 stores",
    meta: { "Task type": "Truck unload close-out", "Tasks": "61", "Stores": "38", "Age": ">8 hrs" },
    metrics: [{ label: "Open close-outs", value: "61" }, { label: "Stores affected", value: "38" }, { label: "Avg open time", value: "11 hrs" }],
    rootCauses: ["Store team started backroom before closing truck task", "System task not linked to physical completion step"],
    impact: "Open truck tasks leave inventory uncounted in system; accuracy and replenishment signals degraded.",
    recommendation: "Enforce task sequencing: truck unload must close before backroom sort task opens.",
    primaryAction: "Force Close Review", secondaryAction: "View Tasks",
  },
  {
    id: "w7", type: "workbench", column: 3, title: "Consumables replenishment verification", status: "Behind",
    sub1: "142 tasks", sub2: "58 stores",
    meta: { "Category": "Consumables", "Tasks": "142", "Stores": "58", "Due": "Today" },
    metrics: [{ label: "Tasks ready", value: "142" }, { label: "Stores", value: "58" }, { label: "Due", value: "Today" }],
    rootCauses: ["Stocking complete but verification task not triggered", "Team moving to next delivery without closing prior"],
    impact: "Replenishment accuracy signal unreliable; 58 stores may trigger false reorder.",
    recommendation: "Trigger verification task automatically on stocking task completion.",
    primaryAction: "Trigger Verification", secondaryAction: "View Tasks",
  },
  {
    id: "w8", type: "workbench", column: 3, title: "Health & Beauty cycle count check", status: "Watchlist",
    sub1: "44 tasks", sub2: "22 stores",
    meta: { "Category": "Health & Beauty", "Tasks": "44", "Stores": "22", "Due": "Jun 9" },
    metrics: [{ label: "Tasks ready", value: "44" }, { label: "Stores", value: "22" }, { label: "Due", value: "Jun 9" }],
    rootCauses: ["Prior count variance not resolved before new window opened"],
    impact: "Cycle count integrity risk; variance could inflate replenishment need.",
    recommendation: "Resolve prior variance before opening new count window.",
    primaryAction: "Assign Count Queue", secondaryAction: "View Stores",
  },
  {
    id: "w9", type: "workbench", column: 3, title: "Endcap photo verification", status: "Critical",
    sub1: "86 tasks", sub2: "39 stores",
    meta: { "Type": "Photo verification", "Tasks": "86", "Stores": "39", "Due": "Jun 9" },
    metrics: [{ label: "Tasks ready", value: "86" }, { label: "Stores", value: "39" }, { label: "Due", value: "Jun 9" }],
    rootCauses: ["Photo verification step not embedded in task flow", "Stores submitting task close without photo"],
    impact: "No photo = no compliance confirmation; promo display execution unverifiable.",
    recommendation: "Make photo submission mandatory in task close-out flow before Jun 9.",
    primaryAction: "Enforce Verification", secondaryAction: "View Stores",
  },
]

// ─── Promo tracker ─────────────────────────────────────────────────────────────
export const promoItems: (DetailItem & { assigned: number; complete: number; photoVerified: number; due: string; issue: string })[] = [
  {
    id: "p1", type: "promo", title: "Seasonal endcap setup", status: "Critical",
    assigned: 72, complete: 43, photoVerified: 38, due: "Jun 9", issue: "Displays not set in high-traffic stores",
    meta: { "Assigned stores": "72", "Complete": "43", "Photo verified": "38", "Due": "Jun 9" },
    metrics: [{ label: "Completion rate", value: "60%" }, { label: "Incomplete", value: "29 stores" }, { label: "Photo verified", value: "38 / 72" }],
    rootCauses: ["High-traffic stores deprioritized endcap vs. daily replenishment", "Display materials mislabeled in 8 stores"],
    impact: "29 stores missing seasonal display ahead of Jun 9 selling window.",
    recommendation: "Assign field rep to confirm setup in top-20 high-traffic stores today.",
    primaryAction: "Assign Field Rep", secondaryAction: "View Incomplete Stores",
  },
  {
    id: "p2", type: "promo", title: "Party promo display confirmation", status: "Behind",
    assigned: 31, complete: 21, photoVerified: 18, due: "Jun 10", issue: "Display confirmation missing before promo window",
    meta: { "Assigned stores": "31", "Complete": "21", "Photo verified": "18", "Due": "Jun 10" },
    metrics: [{ label: "Completion rate", value: "68%" }, { label: "Incomplete", value: "10 stores" }, { label: "Photo verified", value: "18 / 31" }],
    rootCauses: ["Confirmation task not surfaced to store manager", "3 stores have display but photo not submitted"],
    impact: "10 stores entering Party promo window without confirmed display.",
    recommendation: "Push confirmation task to store manager queue; require photo by Jun 9.",
    primaryAction: "Prioritize Tasks", secondaryAction: "View Task List",
  },
  {
    id: "p3", type: "promo", title: "Graduation / summer seasonal aisle reset", status: "Watchlist",
    assigned: 54, complete: 39, photoVerified: 34, due: "Jun 11", issue: "Reset tasks open in small-box stores",
    meta: { "Assigned stores": "54", "Complete": "39", "Photo verified": "34", "Due": "Jun 11" },
    metrics: [{ label: "Completion rate", value: "72%" }, { label: "Incomplete", value: "15 stores" }, { label: "Photo verified", value: "34 / 54" }],
    rootCauses: ["Small-box stores have constrained labor for aisle resets"],
    impact: "15 stores may miss summer seasonal window if reset not completed by Jun 11.",
    recommendation: "Route small-box store reset tasks to district manager for labor support.",
    primaryAction: "Request Labor Support", secondaryAction: "View Incomplete Stores",
  },
  {
    id: "p4", type: "promo", title: "Household value-zone shelf refresh", status: "Behind",
    assigned: 44, complete: 28, photoVerified: 25, due: "Jun 12", issue: "Backroom congestion blocking refresh",
    meta: { "Assigned stores": "44", "Complete": "28", "Photo verified": "25", "Due": "Jun 12" },
    metrics: [{ label: "Completion rate", value: "64%" }, { label: "Incomplete", value: "16 stores" }, { label: "Photo verified", value: "25 / 44" }],
    rootCauses: ["Backroom congestion preventing refresh product from reaching shelf", "Stocking priority not updated to include refresh task"],
    impact: "16 stores with outdated value-zone shelf layout entering peak household week.",
    recommendation: "Resolve backroom congestion first; then re-prioritize refresh task in affected stores.",
    primaryAction: "Update Task Priority", secondaryAction: "View Stores",
  },
  {
    id: "p5", type: "promo", title: "Health & Beauty secondary display check", status: "On Track",
    assigned: 67, complete: 61, photoVerified: 59, due: "Jun 13", issue: "Minor verification gaps",
    meta: { "Assigned stores": "67", "Complete": "61", "Photo verified": "59", "Due": "Jun 13" },
    metrics: [{ label: "Completion rate", value: "91%" }, { label: "Incomplete", value: "6 stores" }, { label: "Photo verified", value: "59 / 67" }],
    rootCauses: ["6 stores pending photo submission only"],
    impact: "Minor; 6 stores need photo close-out only — no display gap.",
    recommendation: "Send reminder notification to 6 stores to complete photo submission.",
    primaryAction: "Send Reminder", secondaryAction: "View Stores",
  },
]

// ─── Accuracy risk drivers ──────────────────────────────────────────────────────
export const accuracyDrivers: DetailItem[] = [
  {
    id: "a1", type: "accuracy", title: "Phantom inventory suspected", status: "Critical",
    meta: { "Stores": "74", "Estimated impact": "$780K", "Type": "Phantom inventory" },
    metrics: [{ label: "Stores", value: "74" }, { label: "Impact", value: "$780K" }, { label: "Detection method", value: "On-hand vs. sales velocity" }],
    rootCauses: ["Product lost in backroom or damaged but not written off", "Receiving scan error creating ghost units"],
    impact: "$780K phantom inventory triggering false replenishment suppression in 74 stores.",
    recommendation: "Initiate targeted cycle count in 74 stores; require physical verification before replenishment decision.",
    primaryAction: "Create Count Queue", secondaryAction: "View Stores",
  },
  {
    id: "a2", type: "accuracy", title: "Negative on-hand corrections", status: "Behind",
    meta: { "Stores": "51", "Estimated impact": "$410K", "Type": "Negative correction" },
    metrics: [{ label: "Stores", value: "51" }, { label: "Impact", value: "$410K" }, { label: "Corrections", value: "134 SKUs" }],
    rootCauses: ["Returns processed without restocking verification", "System correction applied before physical count confirmed"],
    impact: "Negative corrections create replenishment over-order risk; $410K in potential over-receipt.",
    recommendation: "Block automated replenishment on negatively corrected SKUs until physical count confirms.",
    primaryAction: "Flag for Review", secondaryAction: "View Stores",
  },
  {
    id: "a3", type: "accuracy", title: "Cycle counts overdue", status: "Behind",
    meta: { "Stores": "138", "Counts overdue": "286", "Type": "Overdue cycle count" },
    metrics: [{ label: "Stores", value: "138" }, { label: "Counts overdue", value: "286" }, { label: "Avg days overdue", value: "9 days" }],
    rootCauses: ["Count task not assigned to scheduled associate", "Count window missed due to backroom access blocked"],
    impact: "286 overdue counts create inventory accuracy drift; replenishment and allocation confidence degraded.",
    recommendation: "Assign overdue counts to district manager escalation list; complete within 48 hours.",
    primaryAction: "Assign Counts", secondaryAction: "View Overdue List",
  },
  {
    id: "a4", type: "accuracy", title: "Shelf verification missing", status: "Watchlist",
    meta: { "Stores": "96", "Tasks missing": "184", "Type": "Shelf verification" },
    metrics: [{ label: "Stores", value: "96" }, { label: "Tasks missing", value: "184" }, { label: "Category exposure", value: "Seasonal / HBA" }],
    rootCauses: ["Verification task not triggered post-stocking", "Store team skipping verification to meet throughput targets"],
    impact: "Shelf availability signal unreliable in 96 stores; downstream replenishment may over- or under-order.",
    recommendation: "Make shelf verification mandatory task close-out step; monitor compliance daily.",
    primaryAction: "Mandate Verification", secondaryAction: "View Stores",
  },
  {
    id: "a5", type: "accuracy", title: "Receiving discrepancy unresolved", status: "Watchlist",
    meta: { "Stores": "42", "Estimated impact": "$260K", "Type": "Receiving discrepancy" },
    metrics: [{ label: "Stores", value: "42" }, { label: "Impact", value: "$260K" }, { label: "Avg age", value: "6 days" }],
    rootCauses: ["ASN quantity mismatch not resolved at receiving", "Discrepancy log not actioned within 72-hour window"],
    impact: "$260K in unresolved receiving discrepancies creating inventory accuracy and accounts payable risk.",
    recommendation: "Route all unresolved discrepancies to store support team for resolution within 24 hours.",
    primaryAction: "Resolve Backlog", secondaryAction: "View Discrepancies",
  },
]

// ─── Cycle count queue ─────────────────────────────────────────────────────────
export const cycleCountQueue: DetailItem[] = [
  {
    id: "c1", type: "accuracy", title: "Atlanta Metro high-variance stores", status: "Critical",
    meta: { "District": "104", "Stores": "38", "Due": "Jun 8", "Priority": "Critical" },
    metrics: [{ label: "Stores", value: "38" }, { label: "Due", value: "Jun 8" }, { label: "Est. time", value: "4 hrs / store" }],
    rootCauses: ["High phantom inventory concentration", "Backroom aging contributing to location drift"],
    impact: "Unresolved variance will compound into replenishment error if not counted before Jun 8.",
    recommendation: "Deploy district field team immediately; prioritize top-20 highest-variance stores.",
    primaryAction: "Deploy Count Team", secondaryAction: "View Stores",
  },
  {
    id: "c2", type: "accuracy", title: "Birmingham backroom recount", status: "Behind",
    meta: { "District": "118", "Stores": "31", "Due": "Jun 9", "Priority": "Behind" },
    metrics: [{ label: "Stores", value: "31" }, { label: "Due", value: "Jun 9" }, { label: "Recount reason", value: "Backroom sort error" }],
    rootCauses: ["Prior count completed before backroom sort; double-counting risk"],
    impact: "Recount required before replenishment decision can be trusted.",
    recommendation: "Schedule recount after backroom sort completion; assign to district ops coordinator.",
    primaryAction: "Schedule Recount", secondaryAction: "View Stores",
  },
  {
    id: "c3", type: "accuracy", title: "Chicago South fast-mover validation", status: "Behind",
    meta: { "District": "132", "Stores": "42", "Due": "Jun 10", "Priority": "Behind" },
    metrics: [{ label: "Stores", value: "42" }, { label: "Due", value: "Jun 10" }, { label: "SKU focus", value: "High-velocity consumables" }],
    rootCauses: ["Fast-moving SKUs require higher count frequency than current schedule"],
    impact: "Velocity mismatch creating replenishment lag in 42 stores.",
    recommendation: "Increase count frequency for top-50 velocity SKUs to weekly cycle.",
    primaryAction: "Update Count Schedule", secondaryAction: "View SKUs",
  },
  {
    id: "c4", type: "accuracy", title: "Phoenix exception recount", status: "On Track",
    meta: { "District": "155", "Stores": "36", "Due": "Jun 12", "Priority": "On Track" },
    metrics: [{ label: "Stores", value: "36" }, { label: "Due", value: "Jun 12" }, { label: "Variance level", value: "Low" }],
    rootCauses: ["Minor variance from prior cycle; standard exception process"],
    impact: "Low risk; routine exception count in well-performing district.",
    recommendation: "Complete per standard schedule; no escalation needed.",
    primaryAction: "Confirm Schedule", secondaryAction: "View Stores",
  },
  {
    id: "c5", type: "accuracy", title: "LA East stable validation", status: "Complete",
    meta: { "District": "169", "Stores": "34", "Due": "Jun 13", "Priority": "Complete" },
    metrics: [{ label: "Stores", value: "34" }, { label: "Due", value: "Jun 13" }, { label: "Accuracy rate", value: "95.3%" }],
    rootCauses: ["No material variance identified"],
    impact: "Best-in-network accuracy; validation confirms system integrity.",
    recommendation: "Document methodology for network-wide benchmarking.",
    primaryAction: "Archive Results", secondaryAction: "Share Methodology",
  },
]

// ─── Field actions ─────────────────────────────────────────────────────────────
export const fieldActions: DetailItem[] = [
  {
    id: "fa1", type: "action", title: "Clear Atlanta Metro backroom aging",
    status: "Critical",
    meta: { "Priority": "1", "Owner": "District 104 Field Leadership", "Timing": "Next 24 hours", "Linked issue": "$1.7M inventory aged >48 hrs in backroom" },
    metrics: [{ label: "Expected impact", value: "9–12 hr cycle time improvement" }, { label: "Stores", value: "38" }, { label: "Value at risk", value: "$1.7M" }],
    rootCauses: ["Backroom aging from understaffed stocking shifts", "Endcap space not cleared for new seasonal product"],
    impact: "$1.7M inventory aging in backroom missing peak seasonal selling window.",
    recommendation: "District 104 field leadership to conduct same-day backroom audit; assign stocking labor on emergency basis.",
    primaryAction: "Assign Field Action", secondaryAction: "View Stores",
  },
  {
    id: "fa2", type: "action", title: "Close overdue endcap setup tasks",
    status: "Critical",
    meta: { "Priority": "2", "Owner": "Store Managers", "Timing": "Before Jun 9", "Linked issue": "29 Seasonal endcap tasks incomplete" },
    metrics: [{ label: "Expected impact", value: "Display readiness 59% → 71%" }, { label: "Tasks", value: "29 incomplete" }, { label: "Due", value: "Jun 9" }],
    rootCauses: ["Endcap setup task not assigned at delivery check-in", "Prior promo display not cleared before new setup due"],
    impact: "29 stores entering promo window without verified endcap display; revenue at risk during seasonal peak.",
    recommendation: "Store manager task close-out required by end-of-day Jun 8; district manager to confirm.",
    primaryAction: "Prioritize Tasks", secondaryAction: "View Task List",
  },
  {
    id: "fa3", type: "action", title: "Resolve phantom inventory exceptions",
    status: "Behind",
    meta: { "Priority": "3", "Owner": "Store Operations", "Timing": "48 hours", "Linked issue": "74 stores with suspected phantom inventory" },
    metrics: [{ label: "Expected impact", value: "Shelf availability confidence +6%" }, { label: "Stores", value: "74" }, { label: "Impact", value: "$780K" }],
    rootCauses: ["Ghost units from receiving scan errors", "Product lost in backroom not written off"],
    impact: "Phantom inventory suppressing replenishment in 74 stores; shelf gaps may widen without correction.",
    recommendation: "Initiate targeted cycle count queue for 74 stores; suspend automated replenishment until resolved.",
    primaryAction: "Create Count Queue", secondaryAction: "View Exceptions",
  },
  {
    id: "fa4", type: "action", title: "Verify Party promo displays",
    status: "Behind",
    meta: { "Priority": "4", "Owner": "Field + Merchandising", "Timing": "Before Jun 10", "Linked issue": "10 stores missing display confirmation" },
    metrics: [{ label: "Expected impact", value: "Promo readiness before window" }, { label: "Stores", value: "10" }, { label: "Due", value: "Jun 10" }],
    rootCauses: ["Photo confirmation not submitted", "Display set but task not closed in system"],
    impact: "10 stores entering Party promo window without confirmed display; promotional selling opportunity at risk.",
    recommendation: "Field rep to visit or call 10 stores; require photo submission by Jun 9.",
    primaryAction: "Request Verification", secondaryAction: "View Promo Stores",
  },
  {
    id: "fa5", type: "action", title: "Close receiving discrepancy backlog",
    status: "Watchlist",
    meta: { "Priority": "5", "Owner": "Store Support", "Timing": "This week", "Linked issue": "42 stores with unresolved receiving discrepancies" },
    metrics: [{ label: "Expected impact", value: "Inventory accuracy leakage reduced" }, { label: "Stores", value: "42" }, { label: "Impact", value: "$260K" }],
    rootCauses: ["ASN quantity mismatch not resolved at receiving", "Discrepancy log aging past 72-hour resolution window"],
    impact: "$260K in unresolved discrepancies creating inventory accuracy and AP reconciliation risk.",
    recommendation: "Store support team to work down backlog by Jun 12; auto-escalate any >7-day discrepancy.",
    primaryAction: "Resolve Backlog", secondaryAction: "View Discrepancies",
  },
]
