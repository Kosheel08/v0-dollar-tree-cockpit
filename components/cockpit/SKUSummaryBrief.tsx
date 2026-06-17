import { ArrowRight } from "lucide-react"

export default function SKUSummaryBrief() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-semibold text-foreground mb-2">SKU Segmentation Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Segmentation-led planning allows Dollar Tree to apply different planning and fulfillment strategies based on how each SKU behaves. Stable everyday SKUs can be replenished with higher automation, while seasonal, promotional, limited-buy, and constrained SKUs receive more targeted push strategies or human approval. This reduces planning noise and focuses planner attention on the SKU families where timing, availability, capacity, or confidence creates the greatest business risk.
          </p>
          <div className="bg-accent/60 border border-accent rounded-lg px-4 py-3">
            <p className="text-[12px] font-semibold text-accent-foreground">
              Recommended next step: Review high-impact Seasonal / Event and Constrained / Exception SKU approvals before the next allocation lock.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 shrink-0">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
            Review Approval Workbench <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 border border-border bg-card text-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-muted transition-colors whitespace-nowrap">
            Export Segmentation Brief
          </button>
        </div>
      </div>
    </div>
  )
}
