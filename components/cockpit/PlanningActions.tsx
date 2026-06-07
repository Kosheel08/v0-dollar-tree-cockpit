import { Button } from "@/components/ui/button"

const actions = [
  {
    title: "Approve forecast uplift for Seasonal Southeast",
    value: "$2.4M protected revenue",
    effort: "Medium",
    owner: "Demand Planning",
    timing: "Before next forecast lock",
    primaryBtn: "Approve",
    secondaryBtn: "View rationale",
    effortColor: "text-amber-700 bg-amber-50 border-amber-200",
  },
  {
    title: "Escalate Midwest consumables constraint",
    value: "$1.7M protected revenue",
    effort: "Low",
    owner: "Supply Planning",
    timing: "This week",
    primaryBtn: "Escalate",
    secondaryBtn: "View impacted SKUs",
    effortColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    title: "Validate Party promotion calendar",
    value: "$860K protected revenue",
    effort: "Low",
    owner: "Merchandising",
    timing: "48 hours",
    primaryBtn: "Request Validation",
    secondaryBtn: "View promo details",
    effortColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
]

export default function PlanningActions() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Planning Actions</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Recommended interventions ranked by expected business value
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <div key={action.title} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
            {/* Rank + Title */}
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm font-semibold text-foreground leading-snug">{action.title}</p>
            </div>

            {/* Expected value */}
            <div className="bg-accent/50 border border-primary/15 rounded-lg px-3 py-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Expected Value</p>
              <p className="text-sm font-bold text-primary mt-0.5">{action.value}</p>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <p className="text-muted-foreground">Effort</p>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold mt-0.5 ${action.effortColor}`}>
                  {action.effort}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground">Owner</p>
                <p className="font-medium text-foreground mt-0.5">{action.owner}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Timing</p>
                <p className="font-medium text-foreground mt-0.5">{action.timing}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 mt-auto">
              <Button size="sm" className="flex-1 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                {action.primaryBtn}
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                {action.secondaryBtn}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
