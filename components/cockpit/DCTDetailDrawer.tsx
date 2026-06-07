"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DCNode, LaneCard, Bottleneck, StatusLevel } from "./DCTData"

function StatusBadge({ status }: { status: StatusLevel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide",
        status === "Critical" && "bg-[var(--status-critical-bg)] text-[var(--status-critical)]",
        status === "Watchlist" && "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)]",
        status === "Stable" && "bg-[var(--status-stable-bg)] text-[var(--status-stable)]",
        status === "Recovering" && "bg-[var(--status-improving-bg)] text-[var(--status-improving)]",
      )}
    >
      {status}
    </span>
  )
}

function DrawerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}

type DetailType = "dc" | "lane" | "bottleneck" | "heatmap" | null

interface DetailItem {
  type: DetailType
  data: DCNode | LaneCard | Bottleneck | { dc: string; step: string; value: number; status: StatusLevel } | null
}

interface DCTDetailDrawerProps {
  detail: DetailItem | null
  onClose: () => void
}

export default function DCTDetailDrawer({ detail, onClose }: DCTDetailDrawerProps) {
  if (!detail || !detail.data) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-[420px] bg-card border-l border-border shadow-xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              {detail.type === "dc" && "DC Node Detail"}
              {detail.type === "lane" && "Lane Detail"}
              {detail.type === "bottleneck" && "Bottleneck Detail"}
              {detail.type === "heatmap" && "Capacity Detail"}
            </p>
            <h2 className="text-base font-bold text-foreground leading-tight">
              {detail.type === "dc" && (detail.data as DCNode).name}
              {detail.type === "lane" && (detail.data as LaneCard).lane}
              {detail.type === "bottleneck" && (detail.data as Bottleneck).title}
              {detail.type === "heatmap" &&
                `${(detail.data as { dc: string; step: string }).dc} — ${(detail.data as { dc: string; step: string }).step}`}
            </h2>
            {detail.type !== "heatmap" && (
              <StatusBadge
                status={
                  detail.type === "dc"
                    ? (detail.data as DCNode).status
                    : detail.type === "lane"
                      ? (detail.data as LaneCard).status
                      : (detail.data as Bottleneck).severity
                }
              />
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {detail.type === "dc" && <DCNodeContent dc={detail.data as DCNode} />}
          {detail.type === "lane" && <LaneContent lane={detail.data as LaneCard} />}
          {detail.type === "bottleneck" && <BottleneckContent bottleneck={detail.data as Bottleneck} />}
          {detail.type === "heatmap" && (
            <HeatmapContent
              cell={detail.data as { dc: string; step: string; value: number; status: StatusLevel }}
            />
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex gap-2">
          {detail.type === "dc" && (
            <>
              <button className="flex-1 bg-foreground text-background text-xs font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                Create Network Action
              </button>
              <button className="flex-1 border border-border text-xs font-semibold py-2 rounded-lg hover:bg-muted transition-colors">
                View Impacted Stores
              </button>
            </>
          )}
          {detail.type === "lane" && (
            <>
              <button className="flex-1 bg-foreground text-background text-xs font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                Approve Route Adjustment
              </button>
              <button className="flex-1 border border-border text-xs font-semibold py-2 rounded-lg hover:bg-muted transition-colors">
                View Route Detail
              </button>
            </>
          )}
          {detail.type === "bottleneck" && (
            <>
              <button className="flex-1 bg-foreground text-background text-xs font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                Create Action
              </button>
              <button className="flex-1 border border-border text-xs font-semibold py-2 rounded-lg hover:bg-muted transition-colors">
                Assign Owner
              </button>
            </>
          )}
          {detail.type === "heatmap" && (
            <button className="flex-1 bg-foreground text-background text-xs font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
              View DC Detail
            </button>
          )}
        </div>
      </aside>
    </>
  )
}

function DCNodeContent({ dc }: { dc: DCNode }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <DrawerMetric label="Region" value={dc.region} />
        <DrawerMetric label="Outbound Cases" value={dc.outboundCases} />
        <DrawerMetric label="Capacity Utilization" value={`${dc.capacityUtilization}%`} />
        <DrawerMetric label="Labor Coverage" value={`${dc.laborCoverage}%`} />
        <DrawerMetric label="Dock Utilization" value={`${dc.dockUtilization}%`} />
        <DrawerMetric label="Trailer Dwell" value={`${dc.trailerDwell} hrs`} />
      </div>
      {dc.bottlenecks.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Current Bottlenecks</p>
          <ul className="space-y-1.5">
            {dc.bottlenecks.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-critical)] mt-1.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
      {dc.impactedCategories.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Impacted Categories</p>
          <div className="flex flex-wrap gap-1.5">
            {dc.impactedCategories.map((c) => (
              <span key={c} className="px-2 py-0.5 bg-muted text-xs font-medium rounded-md text-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="text-xs font-semibold text-foreground mb-2">Recommended Actions</p>
        <ul className="space-y-1.5">
          {dc.recommendedActions.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="w-4 h-4 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] font-bold shrink-0">
                {i + 1}
              </span>
              {a}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function LaneContent({ lane }: { lane: LaneCard }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <DrawerMetric label="Origin DC" value={lane.originDC} />
        <DrawerMetric label="Destination" value={lane.destinationRegion} />
        <DrawerMetric label="Carrier" value={lane.carrier} />
        <DrawerMetric label="On-Time Delivery" value={`${lane.onTimeDelivery}%`} />
        <DrawerMetric label="Trailer Utilization" value={`${lane.trailerUtilization}%`} />
        <DrawerMetric label="Cost per Case" value={`$${lane.costPerCase.toFixed(2)}`} />
        <DrawerMetric label="Late Routes" value={`${lane.lateRoutes}`} />
        <DrawerMetric label="Impacted Stores" value={lane.impactedStores} />
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground mb-1.5">Primary Issue</p>
        <p className="text-xs text-muted-foreground">{lane.primaryIssue}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground mb-1.5">Recommended Action</p>
        <p className="text-xs text-muted-foreground">{lane.action}</p>
      </div>
    </>
  )
}

function BottleneckContent({ bottleneck }: { bottleneck: Bottleneck }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <DrawerMetric label="Type" value={bottleneck.type} />
        <DrawerMetric label="Node" value={bottleneck.node} />
        <DrawerMetric label="Owner" value={bottleneck.owner} />
        <DrawerMetric label="Timing" value={bottleneck.timing} />
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground mb-1.5">Operational Impact</p>
        <p className="text-xs text-muted-foreground">{bottleneck.impact}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground mb-1.5">Recommended Action</p>
        <p className="text-xs text-muted-foreground">{bottleneck.recommendedAction}</p>
      </div>
    </>
  )
}

function HeatmapContent({ cell }: { cell: { dc: string; step: string; value: number; status: StatusLevel } }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <DrawerMetric label="Distribution Center" value={cell.dc} />
        <DrawerMetric label="Process Step" value={cell.step} />
        <DrawerMetric label="Utilization" value={`${cell.value}%`} />
        <DrawerMetric label="Risk Status" value={cell.status} />
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground mb-1.5">What this means</p>
        <p className="text-xs text-muted-foreground">
          {cell.status === "Critical"
            ? `${cell.step} at ${cell.dc} is operating above safe capacity. Immediate action may be required to avoid service degradation.`
            : cell.status === "Watchlist"
              ? `${cell.step} at ${cell.dc} is approaching capacity limits. Monitor closely and prepare contingency plans.`
              : `${cell.step} at ${cell.dc} is operating within normal parameters. No immediate action required.`}
        </p>
      </div>
    </>
  )
}
