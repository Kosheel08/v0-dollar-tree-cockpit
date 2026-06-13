"use client"

interface InvAllocationSummary2Props {
  onOpenApprovals?: () => void
}

export default function InvAllocationSummary2({ onOpenApprovals }: InvAllocationSummary2Props) {
  return (
    <div className="bg-card border border-border rounded-2xl px-6 py-5">
      <p className="text-[13px] font-semibold text-foreground mb-2">Inventory &amp; Allocation Summary</p>
      <p className="text-[12px] text-muted-foreground leading-relaxed">
        Inventory is sufficient at the network level but unevenly positioned across SKU segments and regions.
        Seasonal / Event in the Southeast and Consistent Replenishment in the Midwest are below forward
        coverage thresholds and require protected allocation, while Treasure Hunt / Limited Buy inventory in the
        Southwest can be rebalanced to support higher-risk demand pools.
      </p>
      <div className="mt-3 flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-[11px] text-amber-800 flex-1 leading-snug">
          Recommended next step:{" "}
          <button
            onClick={onOpenApprovals}
            className="font-semibold underline hover:no-underline"
          >
            Approve P1 allocation actions
          </button>{" "}
          before the Jun 10 allocation lock.
        </p>
        {onOpenApprovals && (
          <button
            onClick={onOpenApprovals}
            className="shrink-0 text-[11px] font-semibold bg-amber-700 text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Open approval workbench
          </button>
        )}
      </div>
    </div>
  )
}
