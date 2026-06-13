"use client"

import { useState, useMemo } from "react"
import { Search, RefreshCw, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { DC_NODES, LANE_CARDS, BOTTLENECKS, type DCNode, type LaneCard, type Bottleneck, type StatusLevel } from "./DCTData"
import DCTCommandStrip from "./DCTCommandStrip"
import DCNodeBoard from "./DCNodeBoard"
import DCCapacityHeatmap from "./DCCapacityHeatmap"
import TransportLaneRiskBoard from "./TransportLaneRiskBoard"
import DCBottleneckPanel from "./DCBottleneckPanel"
import DCNetworkRecovery from "./DCNetworkRecovery"
import DCTransportSummary from "./DCTransportSummary"
import DCTDetailDrawer from "./DCTDetailDrawer"
import AIActionsModule from "./AIActionsModule"
import { dcActions, dcApprovals } from "./AIActionsData"

type DetailType = "dc" | "lane" | "bottleneck" | "heatmap" | null

interface DetailState {
  type: DetailType
  data: DCNode | LaneCard | Bottleneck | { dc: string; step: string; value: number; status: StatusLevel } | null
}

const DC_OPTIONS = ["All DCs", "Savannah DC", "Joliet DC", "Chesapeake DC", "Marietta DC", "San Bernardino DC", "Olive Branch DC"]
const REGION_OPTIONS = ["All Regions", "Southeast", "Midwest", "Northeast", "Southwest", "West", "Central"]
const FLOW_OPTIONS = ["All Flow Types", "Receiving", "Putaway", "Picking", "Shipping", "Store Delivery"]
const RISK_OPTIONS = ["All Statuses", "Critical", "Watchlist", "Stable", "Recovering"]

interface DCCapacityTransportPageProps {
  onGoToTab?: (tab: string) => void
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
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

export default function DCCapacityTransportPage({ onGoToTab }: DCCapacityTransportPageProps) {
  const [dcFilter, setDcFilter] = useState("All DCs")
  const [regionFilter, setRegionFilter] = useState("All Regions")
  const [flowFilter, setFlowFilter] = useState("All Flow Types")
  const [riskFilter, setRiskFilter] = useState("All Statuses")
  const [search, setSearch] = useState("")
  const [detail, setDetail] = useState<DetailState | null>(null)

  const searchLower = search.toLowerCase()

  function openDC(dc: DCNode) { setDetail({ type: "dc", data: dc }) }
  function openLane(lane: LaneCard) { setDetail({ type: "lane", data: lane }) }
  function openBottleneck(b: Bottleneck) { setDetail({ type: "bottleneck", data: b }) }
  function openHeatmap(cell: { dc: string; step: string; value: number; status: StatusLevel }) {
    setDetail({ type: "heatmap", data: cell })
  }
  function closeDetail() { setDetail(null) }

  // Combined filter string for DCNodeBoard
  const boardFilter = useMemo(() => {
    const parts: string[] = []
    if (dcFilter !== "All DCs") parts.push(dcFilter)
    if (regionFilter !== "All Regions") parts.push(regionFilter)
    if (riskFilter !== "All Statuses") parts.push(riskFilter)
    if (search) parts.push(search)
    return parts.join(" ")
  }, [dcFilter, regionFilter, riskFilter, search])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-foreground">DC Capacity &amp; Transportation</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Distribution throughput, dock capacity, outbound flow, and store delivery risk across the network
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
        <Select value={dcFilter} onChange={setDcFilter} options={DC_OPTIONS} />
        <Select value={regionFilter} onChange={setRegionFilter} options={REGION_OPTIONS} />
        <Select value={flowFilter} onChange={setFlowFilter} options={FLOW_OPTIONS} />
        <Select value={riskFilter} onChange={setRiskFilter} options={RISK_OPTIONS} />
        <div className="relative ml-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search DC, lane, route, carrier, or region"
            className="h-8 pl-8 pr-3 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 w-64"
          />
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <button className="h-8 flex items-center gap-1.5 px-3 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button className="h-8 flex items-center gap-1.5 px-3 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Page body */}
      <div className="px-6 py-5 space-y-5">
        <DCTCommandStrip />
        <DCNodeBoard onSelect={openDC} filter={boardFilter} />
        <DCCapacityHeatmap onSelect={openHeatmap} />
        <TransportLaneRiskBoard onSelect={openLane} />
        <DCBottleneckPanel onSelect={openBottleneck} />
        <DCNetworkRecovery />

        {/* AI Actions & Human Approvals */}
        <section className="rounded-2xl border border-border bg-card px-6 py-5">
          <AIActionsModule
            actions={dcActions}
            approvals={dcApprovals}
            onGoToTab={onGoToTab ?? (() => {})}
          />
        </section>

        <DCTransportSummary />
      </div>

      {/* Detail drawer */}
      {detail && <DCTDetailDrawer detail={detail} onClose={closeDetail} />}
    </div>
  )
}
