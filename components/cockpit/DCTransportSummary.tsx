export default function DCTransportSummary() {
  return (
    <div className="bg-accent border border-border rounded-xl px-5 py-4">
      <p className="text-sm font-semibold text-accent-foreground">DC Capacity &amp; Transportation Summary</p>
      <p className="mt-2 text-xs text-accent-foreground/80 leading-relaxed">
        Network execution risk is concentrated in Savannah and Joliet, where dock utilization, pick-wave pressure, and
        trailer dwell are limiting the ability to move priority Seasonal and Consumables inventory. Marietta and San
        Bernardino have available capacity that can support rebalance moves, while Chesapeake requires route protection
        for Party promo timing.
      </p>
      <div className="mt-3 pt-3 border-t border-accent-foreground/20">
        <p className="text-xs font-semibold text-accent-foreground">Recommended next step</p>
        <p className="mt-0.5 text-xs text-accent-foreground/80">
          Re-sequence Savannah outbound waves and prioritize Joliet Consumables picks before the Jun 10 allocation lock.
        </p>
      </div>
    </div>
  )
}
