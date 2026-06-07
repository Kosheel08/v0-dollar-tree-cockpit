"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categoryChips = ["All", "Household", "Consumables", "Seasonal", "Party", "Health & Beauty"]
const regionChips = ["All", "Southeast", "Midwest", "Northeast", "Southwest", "West"]

const planningCutData: Record<string, Record<string, { accuracy: string; bias: string; risk: string; recommendation: string }>> = {
  "Seasonal · Southeast": {
    accuracy: "79.8%",
    bias: "-8.7%",
    risk: "$3.1M",
    recommendation: "Prioritize near-term forecast override review for promoted SKUs and weather-sensitive demand.",
  },
  "Seasonal · Midwest": {
    accuracy: "80.5%",
    bias: "-7.2%",
    risk: "$2.3M",
    recommendation: "Review velocity acceleration on core SKUs ahead of next cycle lock.",
  },
  "Consumables · Midwest": {
    accuracy: "79.1%",
    bias: "-6.7%",
    risk: "$2.6M",
    recommendation: "Increase near-term forecast volumes and validate DC replenishment constraints.",
  },
  default: {
    accuracy: "86.4%",
    bias: "-4.8%",
    risk: "$12.4M",
    recommendation: "Monitor exception queue and resolve P1 items before the next forecast lock.",
  },
}

function getPlanningCut(cat: string, reg: string) {
  const label = `${cat === "All" ? "All Categories" : cat} · ${reg === "All" ? "All Regions" : reg}`
  const cat2 = cat === "All" ? "All" : cat
  const reg2 = reg === "All" ? "All" : reg
  const key = `${cat2} · ${reg2}`
  return { label, data: planningCutData[key] || planningCutData.default }
}

interface SegmentationProps {
  globalCategory: string
  globalRegion: string
}

export default function SegmentationPanel({ globalCategory, globalRegion }: SegmentationProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedRegion, setSelectedRegion] = useState("All")

  const { label, data } = getPlanningCut(selectedCategory, selectedRegion)

  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Category &amp; Region Segmentation</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Filterable planning cuts used to isolate forecast gaps and concentrated demand risk
        </p>
      </div>

      {/* Selector card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Category row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-16 shrink-0">
              Category
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categoryChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setSelectedCategory(chip)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                    selectedCategory === chip
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
