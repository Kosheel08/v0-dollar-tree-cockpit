"use client"

export default function SIFlowSummary() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-foreground mb-2">Supplier &amp; Inbound Flow Summary</h2>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Inbound risk is concentrated in Seasonal and Consumables suppliers supporting Southeast and Midwest demand pools.
        Supplier OTIF is below target at 82.7%, with late ASNs, short shipments, and DC appointment constraints driving
        the largest service exposure. Recovery should focus first on expediting Seasonal PO-78421 into Savannah DC,
        recovering Consumables short shipments for Joliet DC, and confirming Party receipt timing before promo allocation.
      </p>
      <div className="mt-4 px-4 py-3 bg-accent border border-border rounded-lg">
        <p className="text-xs text-accent-foreground">
          <span className="font-semibold">Recommended next step: </span>
          Resolve critical inbound exceptions before the Jun 10 allocation lock.
        </p>
      </div>
    </div>
  )
}
