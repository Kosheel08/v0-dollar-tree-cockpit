// Shared mock data for DC Capacity & Transportation tab
export type StatusLevel = "Critical" | "Watchlist" | "Stable" | "Recovering"

export interface DCNode {
  id: string
  name: string
  region: string
  capacityUtilization: number
  laborCoverage: number
  dockUtilization: number
  trailerDwell: number
  outboundCases: string
  status: StatusLevel
  action: string
  bottlenecks: string[]
  impactedCategories: string[]
  recommendedActions: string[]
}

export const DC_NODES: DCNode[] = [
  {
    id: "savannah",
    name: "Savannah DC",
    region: "Southeast",
    capacityUtilization: 96,
    laborCoverage: 88,
    dockUtilization: 94,
    trailerDwell: 22.4,
    outboundCases: "410K",
    status: "Critical",
    action: "Re-sequence outbound waves for Seasonal allocation",
    bottlenecks: [
      "Dock utilization above 90%",
      "Trailer dwell above target (22.4 hrs vs 12 hr target)",
      "Seasonal outbound waves competing with inbound receipt windows",
    ],
    impactedCategories: ["Seasonal", "Consumables"],
    recommendedActions: [
      "Re-sequence outbound waves",
      "Pull forward labor for second shift",
      "Protect delivery windows for 72 high-risk Southeast stores",
    ],
  },
  {
    id: "joliet",
    name: "Joliet DC",
    region: "Midwest",
    capacityUtilization: 93,
    laborCoverage: 91,
    dockUtilization: 89,
    trailerDwell: 19.1,
    outboundCases: "365K",
    status: "Critical",
    action: "Prioritize Consumables pick waves",
    bottlenecks: [
      "Pick wave backlog building across Consumables",
      "Dock queue delays on inbound side",
      "Trailer dwell above 19 hrs",
    ],
    impactedCategories: ["Consumables", "Household"],
    recommendedActions: [
      "Prioritize top 58 store orders before standard replenishment",
      "Re-sequence dispatch waves",
      "Add temp labor for pick operations",
    ],
  },
  {
    id: "chesapeake",
    name: "Chesapeake DC",
    region: "Northeast",
    capacityUtilization: 87,
    laborCoverage: 90,
    dockUtilization: 84,
    trailerDwell: 15.7,
    outboundCases: "240K",
    status: "Watchlist",
    action: "Protect Party promo delivery windows",
    bottlenecks: [
      "Promo route window compression for Party category",
      "Trailer dwell trending up toward target",
    ],
    impactedCategories: ["Party", "Seasonal"],
    recommendedActions: [
      "Reserve dedicated route capacity for Northeast promo stores",
      "Monitor dwell daily through promo lock",
    ],
  },
  {
    id: "marietta",
    name: "Marietta DC",
    region: "Southwest",
    capacityUtilization: 78,
    laborCoverage: 96,
    dockUtilization: 72,
    trailerDwell: 10.8,
    outboundCases: "285K",
    status: "Stable",
    action: "Use available capacity for rebalanced Household flow",
    bottlenecks: [],
    impactedCategories: ["Household"],
    recommendedActions: [
      "Accept rebalance volume from Savannah and Joliet",
      "Coordinate with network planning on transfer timing",
    ],
  },
  {
    id: "san-bernardino",
    name: "San Bernardino DC",
    region: "West",
    capacityUtilization: 81,
    laborCoverage: 94,
    dockUtilization: 76,
    trailerDwell: 11.6,
    outboundCases: "210K",
    status: "Stable",
    action: "Maintain current wave plan",
    bottlenecks: [],
    impactedCategories: [],
    recommendedActions: ["Maintain current wave plan", "Available for expedite overflow if needed"],
  },
  {
    id: "olive-branch",
    name: "Olive Branch DC",
    region: "Central",
    capacityUtilization: 88,
    laborCoverage: 86,
    dockUtilization: 82,
    trailerDwell: 16.2,
    outboundCases: "330K",
    status: "Watchlist",
    action: "Monitor labor coverage and appointment backlog",
    bottlenecks: [
      "Labor coverage below 90% threshold",
      "Appointment backlog risk if labor gap persists",
    ],
    impactedCategories: ["Consumables", "Household"],
    recommendedActions: [
      "Shift labor from receiving to outbound picking during peak window",
      "Flag to staffing agency for contingency coverage",
    ],
  },
]

export interface LaneCard {
  id: string
  lane: string
  originDC: string
  destinationRegion: string
  carrier: string
  onTimeDelivery: number
  trailerUtilization: number
  costPerCase: number
  lateRoutes: number
  primaryIssue: string
  status: StatusLevel
  action: string
  impactedStores: string
}

export const LANE_CARDS: LaneCard[] = [
  {
    id: "savannah-se",
    lane: "Savannah DC → Southeast Stores",
    originDC: "Savannah DC",
    destinationRegion: "Southeast",
    carrier: "Regional Fleet A",
    onTimeDelivery: 82.4,
    trailerUtilization: 97,
    costPerCase: 0.42,
    lateRoutes: 18,
    primaryIssue: "Route saturation and tight delivery windows",
    status: "Critical",
    action: "Split routes and add overflow capacity",
    impactedStores: "72 Southeast stores",
  },
  {
    id: "joliet-mw",
    lane: "Joliet DC → Midwest Stores",
    originDC: "Joliet DC",
    destinationRegion: "Midwest",
    carrier: "Core Carrier Midwest",
    onTimeDelivery: 85.9,
    trailerUtilization: 94,
    costPerCase: 0.39,
    lateRoutes: 14,
    primaryIssue: "High consumables volume and dock queue delays",
    status: "Critical",
    action: "Re-sequence dispatch waves",
    impactedStores: "58 Midwest stores",
  },
  {
    id: "chesapeake-ne",
    lane: "Chesapeake DC → Northeast Stores",
    originDC: "Chesapeake DC",
    destinationRegion: "Northeast",
    carrier: "Northeast Dedicated",
    onTimeDelivery: 89.6,
    trailerUtilization: 88,
    costPerCase: 0.44,
    lateRoutes: 9,
    primaryIssue: "Promo delivery window compression",
    status: "Watchlist",
    action: "Protect Party promo routes",
    impactedStores: "31 Northeast promo stores",
  },
  {
    id: "marietta-sw",
    lane: "Marietta DC → Southwest Stores",
    originDC: "Marietta DC",
    destinationRegion: "Southwest",
    carrier: "Southwest Fleet B",
    onTimeDelivery: 94.8,
    trailerUtilization: 79,
    costPerCase: 0.36,
    lateRoutes: 3,
    primaryIssue: "Available capacity for rebalance moves",
    status: "Stable",
    action: "Use spare capacity for Household transfer",
    impactedStores: "No stores at risk",
  },
  {
    id: "sb-west",
    lane: "San Bernardino DC → West Stores",
    originDC: "San Bernardino DC",
    destinationRegion: "West",
    carrier: "West Regional",
    onTimeDelivery: 95.1,
    trailerUtilization: 81,
    costPerCase: 0.41,
    lateRoutes: 2,
    primaryIssue: "No material risk",
    status: "Stable",
    action: "Maintain current plan",
    impactedStores: "No stores at risk",
  },
]

export interface Bottleneck {
  id: string
  title: string
  type: "Dock" | "Picking" | "Labor" | "Transportation"
  node: string
  impact: string
  severity: StatusLevel
  owner: string
  timing: string
  recommendedAction: string
}

export const BOTTLENECKS: Bottleneck[] = [
  {
    id: "savannah-dock",
    title: "Savannah shipping dock utilization above 95%",
    type: "Dock",
    node: "Savannah DC",
    impact: "Seasonal outbound waves at risk",
    severity: "Critical",
    owner: "DC Operations",
    timing: "Next 24 hours",
    recommendedAction: "Open second shift dock window and re-sequence wave release",
  },
  {
    id: "joliet-pick",
    title: "Joliet pick wave backlog",
    type: "Picking",
    node: "Joliet DC",
    impact: "Consumables replenishment delay",
    severity: "Critical",
    owner: "Warehouse Operations",
    timing: "48 hours",
    recommendedAction: "Prioritize top 58 store orders before standard replenishment",
  },
  {
    id: "olive-labor",
    title: "Olive Branch labor coverage gap",
    type: "Labor",
    node: "Olive Branch DC",
    impact: "Appointment backlog may increase",
    severity: "Watchlist",
    owner: "Labor Planning",
    timing: "This week",
    recommendedAction: "Shift labor from receiving to outbound picking during peak window",
  },
  {
    id: "chesapeake-route",
    title: "Chesapeake promo route compression",
    type: "Transportation",
    node: "Chesapeake DC",
    impact: "Party promo delivery timing risk",
    severity: "Watchlist",
    owner: "Transportation",
    timing: "Before promo lock",
    recommendedAction: "Reserve dedicated route capacity for Northeast promo stores",
  },
]
