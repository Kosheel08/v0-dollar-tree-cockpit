import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const exceptions = [
  {
    title: "Seasonal / Event demand spike not captured",
    category: "Seasonal / Event",
    region: "Southeast",
    severity: "Critical",
    rootCause: "Promotion lift and weather-driven demand exceeded baseline assumptions for Seasonal / Event SKUs",
    impact: "$2.4M revenue at risk · 38 stores exposed",
    confidence: "High",
    decision: "Approve temporary forecast uplift of +12% for Seasonal / Event segment",
    primaryBtn: "Approve Uplift",
    secondaryBtn: "Send to Planner",
  },
  {
    title: "Consistent Replenishment replenishment demand under-forecast",
    category: "Consistent Replenishment",
    region: "Midwest",
    severity: "Critical",
    rootCause: "Recent velocity acceleration across high-frequency pantry SKUs in Consistent Replenishment",
    impact: "$1.7M revenue at risk · 27 stores exposed",
    confidence: "Medium",
    decision: "Increase 4-week forecast by +6% for Consistent Replenishment",
    primaryBtn: "Apply Adjustment",
    secondaryBtn: "Review Details",
  },
  {
    title: "Promo / Merchant-Driven promotion uncertainty",
    category: "Promo / Merchant-Driven",
    region: "Northeast",
    severity: "Watchlist",
    rootCause: "Circular promotion timing shifted from prior planning cycle for Party endcap SKUs",
    impact: "$860K revenue at risk · 14 stores exposed",
    confidence: "Medium",
    decision: "Hold for merchant confirmation",
    primaryBtn: "Request Confirmation",
    secondaryBtn: "Defer",
  },
]

const severityBadge: Record<string, string> = {
  Critical: "bg-rose-50 text-rose-700 border-rose-200",
  Watchlist: "bg-amber-50 text-amber-700 border-amber-200",
}

const confidenceDot: Record<string, string> = {
  High: "bg-emerald-500",
  Medium: "bg-amber-400",
  Low: "bg-slate-400",
}

export default function ExceptionReview() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Exception Review</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Planner-facing exceptions requiring resolution before the next forecast lock
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {exceptions.map((ex) => (
          <div key={ex.title} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-foreground leading-snug">{ex.title}</p>
              <span
                className={cn(
                  "shrink-0 text-[10px] font-bold border px-2 py-0.5 rounded",
                  severityBadge[ex.severity]
                )}
              >
                {ex.severity}
              </span>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {ex.category}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {ex.region}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground ml-auto">
                <span className={cn("w-1.5 h-1.5 rounded-full", confidenceDot[ex.confidence])} />
                {ex.confidence} confidence
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

            {/* Decision */}
            <div className="bg-accent/50 border border-primary/15 rounded-lg p-3">
              <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">Recommended Decision</p>
              <p className="text-[11px] text-foreground font-medium leading-relaxed">{ex.decision}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto">
              <Button size="sm" className="flex-1 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                {ex.primaryBtn}
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                {ex.secondaryBtn}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
