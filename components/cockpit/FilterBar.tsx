"use client"

import { RefreshCw, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = ["All Categories", "Household", "Consumables", "Seasonal", "Party", "Health & Beauty"]
const regions = ["All Regions", "Southeast", "Midwest", "Northeast", "Southwest", "West"]
const horizons = ["4 Weeks", "8 Weeks", "13 Weeks", "26 Weeks"]
const scenarios = ["Baseline", "Promo Adjusted", "Constrained Supply", "Executive Override"]

interface FilterBarProps {
  category: string
  region: string
  horizon: string
  scenario: string
  search: string
  onCategory: (v: string) => void
  onRegion: (v: string) => void
  onHorizon: (v: string) => void
  onScenario: (v: string) => void
  onSearch: (v: string) => void
}

export default function FilterBar({
  category,
  region,
  horizon,
  scenario,
  search,
  onCategory,
  onRegion,
  onHorizon,
  onScenario,
  onSearch,
}: FilterBarProps) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 flex flex-wrap items-center gap-2.5">
      {/* Dropdowns */}
      <select
        value={category}
        onChange={(e) => onCategory(e.target.value)}
        className="h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
      >
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <select
        value={region}
        onChange={(e) => onRegion(e.target.value)}
        className="h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
      >
        {regions.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>

      <select
        value={horizon}
        onChange={(e) => onHorizon(e.target.value)}
        className="h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
      >
        {horizons.map((h) => (
          <option key={h}>{h}</option>
        ))}
      </select>

      <select
        value={scenario}
        onChange={(e) => onScenario(e.target.value)}
        className="h-8 text-xs bg-background border border-border rounded-md px-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
      >
        {scenarios.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search SKU, category, DC, or region"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="h-8 w-full text-xs bg-background border border-border rounded-md pl-8 pr-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </div>
    </div>
  )
}
