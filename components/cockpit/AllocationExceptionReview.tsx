import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const exceptions = [
  {
    title: "Seasonal Southeast allocation shortfall",
    severity: "Critical",
    category: "Seasonal",
    region: "Southeast",
    node: "Savannah DC",
    rootCause: "Demand plan uplift exceeds available inventory after current allocation commitments",
    impact: "$2.8M service risk · 72 stores exposed",
    signal: "2.1 WOS vs 3.8 target",
    signalDot: "bg-rose-500",
    decision: "Approve protected allocation for top-risk stores and expedite inbound replenishment",
    primaryBtn: "Approve Protected Allocation",
    secondaryBtn: "Send to Inventory Planner",
  },
  {
    title: "Household overstock trapped in Southwest",
    severity: "Rebalance",
    category: "Household",
    region: "Southwest",
    node: "Marietta DC",
    rootCause: "Inventory receipts exceeded regional demand and current allocation rules are holding excess locally",
    impact: "$720K carrying risk · $1.4M transfer opportunity",
    signal: "5.6 WOS vs 4.2 target",
    signalDot: "bg-amber-400",
    decision: "Transfer excess inventory to Southeast demand pool",
    primaryBtn: "Approve Transfer",
    secondaryBtn: "Review Lane Capacity",
  },
  {
    title: "Consumables Midwest replenishment pressure",
    severity: "Critical",
    category: "Consumables",
    region: "Midwest",
    node: "Joliet DC",
    rootCause: "Store demand increased faster than replenishment parameters after recent velocity acceleration",
    impact: "$1.9M lost sales risk · 58 stores exposed",
    signal: "2.7 WOS vs 3.5 target",
    signalDot: "bg-rose-500",
    decision: "Prioritize replenishment to high-velocity stores and monitor next inbound PO",
    primaryBtn: "Prioritize Replenishment",
    secondaryBtn: "Review SKU Detail",
  },
]

const severityBadge: Record<string, string> = {
  Critical:  "bg-rose-50 text-rose-700 border-rose-200",
  Rebalance: "bg-amber-50 text-amber-700 border-amber-200",
  Watchlist: "bg-amber-50 text-amber-700 border-amber-200",
}

export default function AllocationExceptionReview() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Allocation Exception Review</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Inventory exceptions requiring planner resolution before allocation release
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {exceptions.map((ex) => (
          <div key={ex.title} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-foreground leading-snug">{ex.title}</p>
              <span className={cn("shrink-0 text-[10px] font-bold border px-2 py-0.5 rounded", severityBadge[ex.severity])}>
                {ex.severity}
              </span>
            </div>

            {/* Metadata chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {ex.category}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {ex.region}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {ex.node}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground ml-auto shrink-0">
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", ex.signalDot)} />
                {ex.signal}
              </span>
            </div>

            {/* Root cause + impact */}
            <div className="space-y-2 border-t border-border pt-3">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Root Cause</p>
                <p className="text-xs text-foreground leading-relaxed">{ex.rootCause}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Business Impact</p>
                <p className="text-xs font-semibold text-rose-700">{ex.impact}</p>
              </div>
            </div>

            {/* Decision callout */}
            <div className="bg-accent/50 border border-primary/15 rounded-lg p-3">
              <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">Recommended Decision</p>
              <p className="text-[11px] text-foreground font-medium leading-relaxed">{ex.decision}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto flex-wrap">
              <Button size="sm" className="flex-1 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 min-w-0">
                {ex.primaryBtn}
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs min-w-0">
                {ex.secondaryBtn}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
