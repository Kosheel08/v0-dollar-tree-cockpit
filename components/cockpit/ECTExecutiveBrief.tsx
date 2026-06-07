import { ArrowRight, FileDown } from "lucide-react"

interface ECTExecutiveBriefProps {
  onReviewDecisions: () => void
}

export default function ECTExecutiveBrief({ onReviewDecisions }: ECTExecutiveBriefProps) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-accent px-7 py-6">
      <p className="text-[11px] font-semibold text-accent-foreground/70 uppercase tracking-widest mb-2">Executive Summary Brief</p>
      <p className="text-sm text-accent-foreground leading-relaxed max-w-4xl mb-3">
        {"Dollar Tree's highest-value supply chain opportunity is to resolve a small number of connected bottlenecks before the Jun\u00a010 allocation lock. The risk begins with demand under-forecasting, then flows through constrained allocation readiness, inbound variability, Savannah/Joliet network pressure, and store execution gaps. Approving the recommended actions can protect an estimated "}<strong>$8.7M</strong>{", reduce store exposure from "}<strong>286 to 146 stores</strong>{", and improve service recovery by "}<strong>6.2 points</strong>{"."}
      </p>
      <div className="rounded-xl border border-primary/20 bg-card px-4 py-3 mb-4 inline-block">
        <p className="text-xs font-semibold text-foreground">
          Recommended next step:{" "}
          <span className="font-normal text-muted-foreground">
            Approve the top three executive decisions and assign field execution actions within the next 24 hours.
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          onClick={onReviewDecisions}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Review Decisions <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button className="flex items-center gap-1.5 border border-border text-xs font-medium text-muted-foreground px-4 py-2.5 rounded-lg hover:bg-muted transition-colors">
          <FileDown className="w-3.5 h-3.5" />
          Export Executive Brief
        </button>
      </div>
    </div>
  )
}
