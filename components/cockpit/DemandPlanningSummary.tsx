export default function DemandPlanningSummary() {
  return (
    <section>
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Demand Planning Summary</p>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Forecast accuracy has improved to{" "}
          <span className="font-semibold text-foreground">86.4%</span>, but under-forecast bias remains
          concentrated in Seasonal / Event, Consistent Replenishment, and Promo / Merchant-Driven SKU segments.
          The highest-value intervention is a targeted Seasonal / Event forecast uplift in the Southeast,
          followed by Midwest Consistent Replenishment validation and Promo / Merchant-Driven promotion
          calendar confirmation.
        </p>

        <div className="bg-accent/60 border border-primary/25 rounded-lg px-4 py-3 flex items-start gap-3">
          <span className="w-4 h-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </span>
          <p className="text-xs font-medium text-primary leading-relaxed">
            Recommended next step: Resolve P1 exceptions before the next forecast lock.
          </p>
        </div>
      </div>
    </section>
  )
}
