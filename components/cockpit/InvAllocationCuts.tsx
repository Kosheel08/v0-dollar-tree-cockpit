"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categoryChips = ["All", "Seasonal", "Consumables", "Party", "Household", "Health & Beauty"]
const regionChips = ["All", "Southeast", "Midwest", "Northeast", "Southwest", "West"]

type CutData = {
  onHand: string
  available: string
  wos: string
  stockoutExposure: string
  recommendation: string
  shortage: string
  overstock: string
  highestRiskDc: string
  transferCandidate: string
  netExposure: string
  imbalanceBadge: string
}

const cutData: Record<string, CutData> = {
  "Seasonal · Southeast": {
    onHand: "$18.4M", available: "$6.3M", wos: "2.1", stockoutExposure: "72 stores",
    recommendation: "Prioritize allocation to high-velocity stores and reserve inventory for promoted Seasonal SKUs.",
    shortage: "Southeast stores", overstock: "Southwest Household", highestRiskDc: "Savannah DC",
    transferCandidate: "Marietta DC → Savannah DC", netExposure: "$2.8M",
    imbalanceBadge: "Rebalance Needed",
  },
  "Consumables · Midwest": {
    onHand: "$26.8M", available: "$7.4M", wos: "2.7", stockoutExposure: "58 stores",
    recommendation: "Prioritize replenishment to high-velocity Midwest stores and monitor next inbound PO.",
    shortage: "Midwest stores", overstock: "N/A", highestRiskDc: "Joliet DC",
    transferCandidate: "No transfer available", netExposure: "$1.9M",
    imbalanceBadge: "Replenish Priority",
  },
  "Party · Northeast": {
    onHand: "$14.6M", available: "$5.4M", wos: "3.1", stockoutExposure: "31 stores",
    recommendation: "Hold partial allocation pending promo confirmation from Merchandising.",
    shortage: "Northeast stores", overstock: "None identified", highestRiskDc: "Chesapeake DC",
    transferCandidate: "Hold pending promo", netExposure: "$860K",
    imbalanceBadge: "Promo Uncertainty",
  },
  "Household · Southwest": {
    onHand: "$31.2M", available: "$12.4M", wos: "5.6", stockoutExposure: "18 stores",
    recommendation: "Transfer excess Household inventory to Southeast demand pool to reduce carrying risk.",
    shortage: "None — overstock", overstock: "$4.2M above target", highestRiskDc: "Marietta DC",
    transferCandidate: "Marietta DC → Savannah DC", netExposure: "$720K carrying",
    imbalanceBadge: "Rebalance Needed",
  },
  "Health & Beauty · West": {
    onHand: "$21.5M", available: "$7.9M", wos: "4.0", stockoutExposure: "9 stores",
    recommendation: "Maintain current allocation. Monitor next cycle.",
    shortage: "None — stable", overstock: "Minimal", highestRiskDc: "San Bernardino DC",
    transferCandidate: "No action needed", netExposure: "$240K monitored",
    imbalanceBadge: "Stable",
  },
  default: {
    onHand: "$112.5M", available: "$48.6M", wos: "3.3", stockoutExposure: "214 stores",
    recommendation: "Monitor exception queue. Prioritize P1 allocation actions before the Jun 10 lock.",
    shortage: "Southeast stores", overstock: "Southwest Household", highestRiskDc: "Savannah DC",
    transferCandidate: "Marietta DC → Savannah DC", netExposure: "$2.8M",
    imbalanceBadge: "Rebalance Needed",
  },
}

function getCutKey(cat: string, reg: string): string {
  if (cat === "All" && reg === "All") return "default"
  if (cat !== "All" && reg !== "All") return `${cat} · ${reg}`
  return "default"
}

function getCutLabel(cat: string, reg: string): string {
  const c = cat === "All" ? "All Categories" : cat
  const r = reg === "All" ? "All Regions" : reg
  return `${c} · ${r}`
}

const imbalanceBadgeStyle: Record<string, string> = {
  "Rebalance Needed":   "bg-amber-50 text-amber-700 border-amber-200",
  "Replenish Priority": "bg-rose-50 text-rose-700 border-rose-200",
  "Promo Uncertainty":  "bg-amber-50 text-amber-700 border-amber-200",
  "Stable":             "bg-emerald-50 text-emerald-700 border-emerald-200",
}

export default function InvAllocationCuts() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedRegion, setSelectedRegion] = useState("All")

  const key = getCutKey(selectedCategory, selectedRegion)
  const data = cutData[key] || cutData.default
  const label = getCutLabel(selectedCategory, selectedRegion)

  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Category &amp; Region Allocation Cuts</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Interactive planning cuts used to isolate shortages, overstock, and transfer opportunities
        </p>
      </div>

      {/* Selector card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Category chips */}
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

          {/* Region chips */}
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
        {/* Card 1: Selected Inventory Cut */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Selected Inventory Cut</p>
            <p className="text-sm font-bold text-foreground mt-1">{label}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "On Hand",          value: data.onHand },
              { label: "Available",        value: data.available },
              { label: "Weeks of Supply",  value: data.wos },
              { label: "Stockout Exposure",value: data.stockoutExposure },
            ].map(({ label: l, value }) => (
              <div key={l} className="flex flex-col gap-0.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{l}</p>
                <p className="text-sm font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-accent/60 border border-primary/20 rounded-lg p-3 mt-auto">
            <p className="text-[11px] font-semibold text-primary mb-1">Recommendation</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{data.recommendation}</p>
          </div>
        </div>

        {/* Card 2: Inventory Imbalance */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Inventory Imbalance</p>
              <p className="text-sm font-semibold text-foreground mt-1">Network positioning signals</p>
            </div>
            <span className={cn("text-[10px] font-semibold border px-1.5 py-0.5 rounded shrink-0", imbalanceBadgeStyle[data.imbalanceBadge] || imbalanceBadgeStyle["Rebalance Needed"])}>
              {data.imbalanceBadge}
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Shortage cluster",   value: data.shortage },
              { label: "Overstock pool",     value: data.overstock },
              { label: "Highest-risk DC",    value: data.highestRiskDc },
              { label: "Transfer candidate", value: data.transferCandidate },
              { label: "Net exposure",       value: data.netExposure },
            ].map(({ label: l, value }) => (
              <div key={l} className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
                <span className="text-[11px] text-muted-foreground">{l}</span>
                <span className="text-[11px] font-semibold text-foreground text-right max-w-[120px] leading-tight">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Allocation Action */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Allocation Action</p>
            <p className="text-sm font-semibold text-foreground mt-1">Recommended actions</p>
          </div>

          <div className="space-y-2">
            {[
              "Protect promoted Seasonal SKUs",
              "Allocate to top-risk stores first",
              "Review case-pack fit before release",
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
            Open Allocation Review
          </Button>
        </div>
      </div>
    </section>
  )
}
