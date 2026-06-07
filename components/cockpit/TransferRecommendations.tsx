import { Button } from "@/components/ui/button"

const recommendations = [
  {
    priority: 1,
    title: "Protect Seasonal allocation for Southeast stores",
    expectedImpact: "$2.8M service risk reduced",
    inventoryMove: "Reserve $3.6M available Seasonal inventory for 72 high-risk stores",
    owner: "Allocation Planning",
    timing: "Before Jun 10 allocation lock",
    constraints: "Case-pack fit and Savannah DC outbound capacity",
    primaryBtn: "Approve Allocation",
    secondaryBtn: "View store list",
  },
  {
    priority: 2,
    title: "Rebalance Household overstock to Southeast",
    expectedImpact: "$720K carrying risk reduced",
    inventoryMove: "Transfer $1.4M Household inventory from Marietta DC to Savannah DC",
    owner: "Inventory Planning",
    timing: "This week",
    constraints: "Trailer availability and receiving calendar",
    primaryBtn: "Approve Transfer",
    secondaryBtn: "View lane details",
  },
  {
    priority: 3,
    title: "Prioritize Consumables replenishment in Midwest",
    expectedImpact: "$1.9M lost sales risk reduced",
    inventoryMove: "Allocate available inventory to 58 high-velocity Midwest stores",
    owner: "Replenishment",
    timing: "Next 48 hours",
    constraints: "Limited available inventory and high store demand",
    primaryBtn: "Prioritize Stores",
    secondaryBtn: "View impacted SKUs",
  },
]

export default function TransferRecommendations() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Transfer &amp; Allocation Recommendations</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Recommended inventory moves ranked by service impact and value protected
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div key={rec.priority} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
            {/* Rank + Title */}
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {rec.priority}
              </span>
              <p className="text-sm font-semibold text-foreground leading-snug">{rec.title}</p>
            </div>

            {/* Expected impact */}
            <div className="bg-accent/50 border border-primary/15 rounded-lg px-3 py-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Expected Impact</p>
              <p className="text-sm font-bold text-primary mt-0.5">{rec.expectedImpact}</p>
            </div>

            {/* Inventory move */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Inventory Move</p>
              <p className="text-xs text-foreground leading-relaxed">{rec.inventoryMove}</p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <p className="text-muted-foreground">Owner</p>
                <p className="font-medium text-foreground mt-0.5">{rec.owner}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Timing</p>
                <p className="font-medium text-foreground mt-0.5">{rec.timing}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Constraints</p>
                <p className="font-medium text-foreground mt-0.5 leading-relaxed">{rec.constraints}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 mt-auto flex-wrap">
              <Button size="sm" className="flex-1 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 min-w-0">
                {rec.primaryBtn}
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs min-w-0">
                {rec.secondaryBtn}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
