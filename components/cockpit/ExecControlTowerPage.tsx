"use client"

import { useRef, useState } from "react"
import { RefreshCw, Download, Search } from "lucide-react"
import ECTHero from "./ECTHero"
import ECTRiskFlow from "./ECTRiskFlow"
import ECTSourceSummaryCards from "./ECTSourceSummaryCards"
import ECTExecutiveDecisions from "./ECTExecutiveDecisions"
import ECTScenarioView from "./ECTScenarioView"
import ECTExecutiveBrief from "./ECTExecutiveBrief"
import ECTDetailDrawer from "./ECTDetailDrawer"
import type { DrawerPayload } from "./ECTData"
import AIActionsModule from "./AIActionsModule"
import { ectActions, ectApprovals } from "./AIActionsData"

const SELECT_CLS = "text-xs border border-border rounded-lg bg-card text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"

interface ExecControlTowerPageProps {
  onGoToTab: (tabId: string) => void
}

export default function ExecControlTowerPage({ onGoToTab }: ExecControlTowerPageProps) {
  // Filter state
  const [businessView, setBusinessView] = useState("Enterprise")
  const [region, setRegion] = useState("All Regions")
  const [horizon, setHorizon] = useState("Next 14 Days")
  const [scenario, setScenario] = useState("Baseline Risk")
  const [search, setSearch] = useState("")

  // Scenario card selection
  const [selectedScenario, setSelectedScenario] = useState("recommended")

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)

  // Ref for decisions section (for "Review Decisions" scroll)
  const decisionsRef = useRef<HTMLDivElement>(null)

  function openDrawer(payload: DrawerPayload) {
    setDrawerPayload(payload)
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
    setDrawerPayload(null)
  }

  function handleGoToTab(tabId: string) {
    closeDrawer()
    onGoToTab(tabId)
  }

  function handleReviewDecisions() {
    decisionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-card px-8 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-[17px] font-bold text-foreground tracking-tight">Executive Control Tower</h1>
              <span className="text-[10px] font-semibold text-primary bg-accent border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-widest">Executive view</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              End-to-end supply chain risk, value protection, and decision priorities across the Dollar Tree network
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11px] text-muted-foreground">Last refresh</p>
            <p className="text-xs font-semibold text-foreground">Jun 7, 2026 · 8:30 AM</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="border-b border-border bg-card px-8 py-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <select value={businessView} onChange={e => setBusinessView(e.target.value)} className={SELECT_CLS}>
            {["Enterprise","Merchandising","Supply Chain","Store Operations","Finance"].map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={region} onChange={e => setRegion(e.target.value)} className={SELECT_CLS}>
            {["All Regions","Southeast","Midwest","Northeast","Southwest","West"].map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={horizon} onChange={e => setHorizon(e.target.value)} className={SELECT_CLS}>
            {["Next 7 Days","Next 14 Days","Next 30 Days","Current Planning Cycle"].map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={scenario} onChange={e => setScenario(e.target.value)} className={SELECT_CLS}>
            {["Baseline Risk","Recommended Actions Approved","No Intervention","Constrained Network"].map(o => <option key={o}>{o}</option>)}
          </select>
          <div className="flex items-center gap-1.5 flex-1 min-w-[220px] max-w-xs border border-border rounded-lg bg-card px-3 py-2">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search risk, segment, region, DC, supplier, or store issue"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="flex items-center gap-1.5 border border-border text-xs font-medium text-muted-foreground px-3 py-2 rounded-lg hover:bg-muted transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              <Download className="w-3.5 h-3.5" /> Export Brief
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-8 py-7 space-y-9 max-w-[1600px]">
        {/* S1 — Hero */}
        <ECTHero onOpenDrawer={openDrawer} onReviewDecisions={handleReviewDecisions} />

        {/* S2 — Risk flow */}
        <ECTRiskFlow onOpenDrawer={openDrawer} onGoToTab={handleGoToTab} />

        {/* S3 — Source tab summaries */}
        <ECTSourceSummaryCards onOpenDrawer={openDrawer} onGoToTab={handleGoToTab} />

        {/* S3b — AI Actions & Human Approvals (exec cross-functional summary) */}
        <section className="rounded-2xl border border-border bg-card px-6 py-5">
          <AIActionsModule
            actions={ectActions}
            approvals={ectApprovals}
            onGoToTab={handleGoToTab}
          />
        </section>

        {/* S4 — Executive decisions */}
        <div ref={decisionsRef}>
          <ECTExecutiveDecisions onOpenDrawer={openDrawer} onGoToTab={handleGoToTab} />
        </div>

        {/* S5 — Scenario view */}
        <ECTScenarioView
          selectedScenario={selectedScenario}
          onSelectScenario={setSelectedScenario}
          onOpenDrawer={openDrawer}
        />

        {/* S6 — Executive brief */}
        <ECTExecutiveBrief onReviewDecisions={handleReviewDecisions} />
      </div>

      {/* Detail drawer */}
      <ECTDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={closeDrawer}
        onGoToTab={handleGoToTab}
      />
    </div>
  )
}
