"use client"

interface DemandPlanningSummaryProps {
  onOpenApproval?: () => void
}

export default function DemandPlanningSummary({ onOpenApproval }: DemandPlanningSummaryProps) {
  return (
    <section>
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <p className="text-sm font-semibold text-foreground">Demand Planning Summary</p>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Forecast accuracy has improved to{" "}
          <span className="font-semibold text-foreground">86.4%</span>, but under-forecast bias remains
          concentrated in Seasonal / Event and Promo / Merchant-Driven SKU segments. The AI has identified
          the highest-risk segment gaps, created forecast recommendations within guardrails, and routed the
          key planner decisions for approval before the next forecast lock.
        </p>

        <div className="bg-accent/60 border border-primary/25 rounded-lg px-4 py-3 flex items-start gap-3">
          <span className="w-4 h-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </span>
          <p className="text-xs font-medium text-primary leading-relaxed flex-1">
            Recommended next step:{" "}
            <button
              onClick={onOpenApproval}
              className="underline underline-offset-2 hover:opacity-75 transition-opacity"
            >
              Approve Seasonal / Event forecast uplift
            </button>
            {" "}and validate Promo / Merchant-Driven assumptions before the next forecast lock.
          </p>
        </div>
      </div>
    </section>
  )
}
