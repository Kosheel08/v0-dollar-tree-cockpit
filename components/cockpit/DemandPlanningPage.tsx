"use client"

import { useState } from "react"
import { Activity } from "lucide-react"
import FilterBar from "@/components/cockpit/FilterBar"
import KpiCards from "@/components/cockpit/KpiCards"
import ForecastAnalytics from "@/components/cockpit/ForecastAnalytics"
import SegmentationPanel from "@/components/cockpit/SegmentationPanel"
import RiskMatrix from "@/components/cockpit/RiskMatrix"
import ExceptionReview from "@/components/cockpit/ExceptionReview"
import PlanningActions from "@/components/cockpit/PlanningActions"
import DemandPlanningSummary from "@/components/cockpit/DemandPlanningSummary"

export default function DemandPlanningPage() {
  const [category, setCategory] = useState("All Categories")
  const [region, setRegion] = useState("All Regions")
  const [horizon, setHorizon] = useState("4 Weeks")
  const [scenario, setScenario] = useState("Baseline")
  const [search, setSearch] = useState("")

  return (
    <div className="flex flex-col min-h-full">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Demand Planning</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Forecast accuracy, bias, and revenue-at-risk signals across categories and regions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
              <Activity className="w-3 h-3" />
              Live planning cycle
            </span>
            <span className="text-[11px] text-muted-foreground">
              Last refresh: Jun 7, 2026 &middot; 8:30 AM
            </span>
          </div>
        </div>

        {/* ONE global filter bar — no duplicates */}
        <div className="mt-4">
          <FilterBar
            category={category}
            region={region}
            horizon={horizon}
            scenario={scenario}
            search={search}
            onCategory={setCategory}
            onRegion={setRegion}
            onHorizon={setHorizon}
            onScenario={setScenario}
            onSearch={setSearch}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 px-6 py-6 space-y-8">
        {/* Section 1: KPI cards */}
        <KpiCards />

        {/* Section 2: Forecast analytics */}
        <ForecastAnalytics />

        {/* Section 3: Segmentation */}
        <SegmentationPanel globalCategory={category} globalRegion={region} />

        {/* Section 4: Risk matrix */}
        <RiskMatrix />

        {/* Section 5: Exception review */}
        <ExceptionReview />

        {/* Section 6: Planning actions */}
        <PlanningActions />

        {/* Section 7: Summary */}
        <DemandPlanningSummary />
      </main>
    </div>
  )
}
