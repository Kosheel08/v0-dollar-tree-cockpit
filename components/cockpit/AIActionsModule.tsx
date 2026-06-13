"use client"

import { useState } from "react"
import { Bot, Users, ChevronRight, CheckCircle2, Clock, AlertCircle, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import SKUDetailDrawer from "./SKUDetailDrawer"
import type { DrawerPayload, StatusLevel } from "./SKUData"

// ─── shared types ──────────────────────────────────────────────────────────────

export interface AIAction {
  id: string
  title: string
  segment: string
  detected: string
  actionTaken: string
  sourceTab: string
  sourceTabId: string
  status: "completed" | "watchlist" | "routed"
  drawer: DrawerPayload
}

export interface ApprovalItem {
  id: string
  title: string
  segment: string
  recommendation: string
  whyApproval: string
  valueAtRisk: string
  owner: string
  status: "pending" | "needs-approval"
  drawer: DrawerPayload
}

export interface AIActionsModuleProps {
  actions: AIAction[]
  approvals: ApprovalItem[]
  onGoToTab: (tab: string) => void
  /** Compact = condensed row style; rich = full card grid (used on SKU seg tab — but that tab already has its own). Default: compact */
  variant?: "compact" | "rich"
}

// ─── visual config ─────────────────────────────────────────────────────────────

const ACTION_STATUS: Record<AIAction["status"], { label: string; dot: string; badge: string; icon: typeof CheckCircle2 }> = {
  completed: { label: "Completed",   dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  watchlist: { label: "Watchlist",   dot: "bg-orange-400",  badge: "bg-orange-50 text-orange-700 border-orange-200",   icon: AlertCircle  },
  routed:    { label: "Routed",      dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200",       icon: Clock        },
}

const APPROVAL_STATUS: Record<ApprovalItem["status"], { label: string; badge: string }> = {
  "pending":       { label: "Pending Approval", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  "needs-approval":{ label: "Needs Review",      badge: "bg-orange-50 text-orange-700 border-orange-200" },
}

const SEGMENT_CHIP = "text-[10px] font-medium bg-primary/8 text-primary border border-primary/20 px-1.5 py-0.5 rounded-md whitespace-nowrap"
const TAB_CHIP     = "text-[10px] font-medium bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded-md whitespace-nowrap"

// ─── component ────────────────────────────────────────────────────────────────

export default function AIActionsModule({ actions, approvals, onGoToTab, variant = "compact" }: AIActionsModuleProps) {
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [drawerPayload, setDrawerPayload] = useState<DrawerPayload | null>(null)
  const [approvedIds, setApprovedIds]   = useState<Set<string>>(new Set())

  function openDrawer(payload: DrawerPayload) {
    setDrawerPayload(payload)
    setDrawerOpen(true)
  }
  function closeDrawer() {
    setDrawerOpen(false)
    setDrawerPayload(null)
  }

  function handleApprove(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setApprovedIds(prev => new Set([...prev, id]))
  }

  return (
    <>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Bot className="w-3 h-3 text-primary-foreground" />
        </div>
        <p className="text-[13px] font-semibold text-foreground">AI Actions &amp; Human Approvals</p>
        <span className="text-[10px] font-semibold bg-primary/8 text-primary border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-widest">
          Agentic AI
        </span>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-4 items-start">

        {/* LEFT — AI Actions Completed */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <p className="text-[11px] font-semibold text-foreground">AI Actions Completed</p>
            <span className="ml-auto text-[10px] text-muted-foreground font-medium">{actions.length} actions</span>
          </div>

          <div className="space-y-2">
            {actions.map((action) => {
              const cfg = ACTION_STATUS[action.status]
              const Icon = cfg.icon
              return (
                <button
                  key={action.id}
                  onClick={() => openDrawer(action.drawer)}
                  className="w-full flex items-start gap-3 bg-card border border-border rounded-xl px-3.5 py-3 text-left hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  {/* Status dot */}
                  <span className={cn("mt-1 w-2 h-2 rounded-full shrink-0 ring-2 ring-background", cfg.dot)} />

                  <div className="flex-1 min-w-0">
                    {/* Chips row */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className={TAB_CHIP}>{action.sourceTab}</span>
                      <span className={SEGMENT_CHIP}>{action.segment}</span>
                      <span className={cn("ml-auto flex items-center gap-0.5 text-[10px] font-semibold border px-1.5 py-0.5 rounded-md", cfg.badge)}>
                        <Icon className="w-2.5 h-2.5" />{cfg.label}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-[12px] font-semibold text-foreground leading-snug mb-1">{action.title}</p>

                    {/* Detected / action */}
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      <span className="font-medium text-foreground/70">Detected: </span>{action.detected}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      <span className="font-medium text-foreground/70">Action: </span>{action.actionTaken}
                    </p>
                  </div>

                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </button>
              )
            })}
          </div>
        </div>

        {/* RIGHT — Human Approval Required */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <p className="text-[11px] font-semibold text-foreground">Human Approval Required</p>
            <span className="ml-auto text-[10px] text-muted-foreground font-medium">{approvals.length} pending</span>
          </div>

          <div className="space-y-2">
            {approvals.map((item) => {
              const isApproved = approvedIds.has(item.id)
              const cfg = isApproved
                ? { label: "Approved", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" }
                : APPROVAL_STATUS[item.status]

              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openDrawer(item.drawer)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDrawer(item.drawer) } }}
                  className="flex flex-col gap-2.5 bg-card border border-border rounded-xl px-3.5 py-3 cursor-pointer hover:border-amber-300 hover:shadow-sm transition-all group"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <span className={SEGMENT_CHIP}>{item.segment}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={cn("text-[10px] font-semibold border px-1.5 py-0.5 rounded-md", cfg.badge)}>{cfg.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-amber-600 transition-colors shrink-0" />
                    </div>
                  </div>

                  {/* Title */}
                  <p className="text-[12px] font-semibold text-foreground leading-snug">{item.title}</p>

                  {/* Why + value */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Why approval needed</p>
                      <p className="text-[11px] text-foreground leading-snug">{item.whyApproval}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Value at risk</p>
                      <p className="text-[14px] font-bold text-foreground">{item.valueAtRisk}</p>
                    </div>
                  </div>

                  {/* Owner + action buttons */}
                  <div className="flex items-center gap-2 pt-1.5 border-t border-border" onClick={e => e.stopPropagation()}>
                    {isApproved ? (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-semibold text-emerald-700">Approved</span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={(e) => handleApprove(e, item.id)}
                          className="flex-1 text-[11px] font-semibold bg-primary text-primary-foreground py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openDrawer(item.drawer) }}
                          className="flex-1 text-[11px] font-semibold border border-border bg-card text-foreground py-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          Review
                        </button>
                      </>
                    )}
                    <span className="ml-auto text-[10px] text-muted-foreground">{item.owner}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Detail drawer */}
      <SKUDetailDrawer
        open={drawerOpen}
        payload={drawerPayload}
        onClose={closeDrawer}
        onGoToTab={(tabId) => { onGoToTab(tabId); closeDrawer() }}
      />
    </>
  )
}
