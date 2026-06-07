export default function InvAllocationSummary() {
  return (
    <section>
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Inventory &amp; Allocation Summary</p>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Inventory is sufficient at the network level but unevenly positioned across categories and regions.{" "}
          <span className="font-semibold text-foreground">Seasonal Southeast</span> and{" "}
          <span className="font-semibold text-foreground">Consumables Midwest</span> are below forward coverage
          thresholds and require protected allocation, while{" "}
          <span className="font-semibold text-foreground">Household Southwest</span> has excess inventory that can
          be rebalanced to support higher-risk demand pools.
        </p>

        <div className="bg-accent/60 border border-primary/25 rounded-lg px-4 py-3 flex items-start gap-3">
          <span className="w-4 h-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </span>
          <p className="text-xs font-medium text-primary leading-relaxed">
            Recommended next step: Approve P1 allocation actions before the Jun 10 allocation lock.
          </p>
        </div>
      </div>
    </section>
  )
}
