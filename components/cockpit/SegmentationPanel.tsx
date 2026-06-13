"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const segmentChips = ["All", "Consistent Replenishment", "Seasonal / Event", "Treasure Hunt / Limited Buy", "Promo / Merchant-Driven", "Constrained / Exception"]
const regionChips = ["All", "Southeast", "Midwest", "Northeast", "Southwest", "West"]

const planningCutData: Record<string, Record<string, { accuracy: string; bias: string; risk: string; recommendation: string }>> = {
  "Seasonal / Event · Southeast": {
    accuracy: "79.8%",
    bias: "-8.7%",
    risk: "$3.1M",
    recommendation: "Prioritize near-term forecast override review for Seasonal / Event SKUs and weather-sensitive demand.",
  },
  "Seasonal / Event · Midwest": {
    accuracy: "80.5%",
    bias: "-7.2%",
    risk: "$2.3M",
    recommendation: "Review velocity acceleration on Seasonal / Event SKUs ahead of next cycle lock.",
  },
  "Consistent Replenishment · Midwest": {
    accuracy: "79.1%",
    bias: "-6.7%",
    risk: "$2.6M",
    recommendation: "Increase near-term forecast volumes and validate DC replenishment constraints.",
  },
  default: {
    accuracy: "86.4%",
    bias: "-4.8%",
    risk: "$12.4M",
    recommendation: "Monitor P1 items and resolve exceptions before the next forecast lock.",
  },
}

function getPlanningCut(seg: string, reg: string) {
  const label = `${seg === "All" ? "All Segments" : seg} · ${reg === "All" ? "All Regions" : reg}`
  const seg2 = seg === "All" ? "All" : seg
  const reg2 = reg === "All" ? "All" : reg
  const key = `${seg2} · ${reg2}`
  return { label, data: planningCutData[key] || planningCutData.default }
}

interface SegmentationProps {
  globalSegment: string
  globalRegion: string
}

export default function SegmentationPanel({ globalSegment, globalRegion }: SegmentationProps) {
  const [selectedSegment, setSelectedSegment] = useState("All")
  const [selectedRegion, setSelectedRegion] = useState("All")

  const { label, data } = getPlanningCut(selectedSegment, selectedRegion)

  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">SKU Segment &amp; Region Performance</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Filterable planning cuts used to isolate forecast gaps and concentrated demand risk by SKU segment
        </p>
      </div>

      {/* Selector card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Segment row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-16 shrink-0">
              Segment
            </span>
            <div className="flex flex-wrap gap-1.5">
              {segmentChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setSelectedSegment(chip)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                    selectedSegment === chip
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:bg-accent"
                  )}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Region row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-16 shrink-0">
              Region
            </span>
            <div className="flex flex-wrap gap-1.5">
              {regionChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setSelectedRegion(chip)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                    selectedRegion === chip
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:bg-accent"
                  )}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Three cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Selected Planning Cut */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Selected Planning Cut</p>
              <p className="text-sm font-bold text-foreground mt-1">{label}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Accuracy", value: data.accuracy },
              { label: "Bias", value: data.bias },
              { label: "Rev at Risk", value: data.risk },
            ].map(({ label: l, value }) => (
              <div key={l} className="flex flex-col gap-0.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{l}</p>
                <p
                  className={cn(
                    "text-base font-bold",
                    l === "Bias" && value.startsWith("-") ? "text-rose-600" : "text-foreground"
                  )}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-accent/60 border border-primary/20 rounded-lg p-3 mt-auto">
            <p className="text-[11px] font-semibold text-primary mb-1">Recommendation</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{data.recommendation}</p>
          </div>
        </div>

        {/* Risk Concentration */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Risk Concentration</p>
              <p className="text-sm font-semibold text-foreground mt-1">High-risk signal summary</p>
            </div>
            <span className="text-[10px] font-semibold border px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border-rose-200 shrink-0">
              Critical
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Top SKU family", value: "Holiday décor" },
              { label: "Highest-risk DC", value: "Savannah DC" },
              { label: "Stores exposed", value: "42" },
              { label: "Lost sales exposure", value: "$840K" },
              { label: "Primary driver", value: "Promotion lift miss" },
            ].map(({ label: l, value }) => (
              <div key={l} className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
                <span className="text-[11px] text-muted-foreground">{l}</span>
                <span className="text-[11px] font-semibold text-foreground text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Planner Action */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Planner Action</p>
            <p className="text-sm font-semibold text-foreground mt-1">Recommended interventions</p>
          </div>

          <div className="space-y-2">
            {[
              "Review demand overrides",
              "Validate promotion lift assumptions",
              "Escalate DC replenishment constraints",
            ].map((action, i) => (
              <div key={action} className="flex items-start gap-2.5 py-2 border-b border-border last:border-0">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-foreground leading-relaxed">{action}</p>
              </div>
            ))}
          </div>

          <Button size="sm" className="w-full mt-auto text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90">
            Open Exception Review
          </Button>
        </div>
      </div>
    </section>
  )
}
