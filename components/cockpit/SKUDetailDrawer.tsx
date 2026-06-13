"use client"

import { X, ArrowRight, Bookmark, Bot, ShieldCheck } from "lucide-react"
import type { DrawerPayload, StatusLevel } from "./SKUData"
import { cn } from "@/lib/utils"

const TAB_LABELS: Record<string, string> = {
  "demand": "Demand Planning",
  "inventory": "Inventory & Allocation",
  "supplier-inbound": "Supplier & Inbound Flow",
  "dc-capacity": "DC Capacity & Transportation",
  "store-execution": "Store Execution",
  "executive-tower": "Executive Control Tower",
  "sku-segmentation": "AI-Driven SKU Segmentation",
}

const statusConfig: Record<StatusLevel, { label: string; classes: string }> = {
  critical:      { label: "Critical",       classes: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20" },
  watchlist:     { label: "Watchlist",      classes: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/20" },
  stable:        { label: "Stable",         classes: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20" },
  "needs-approval": { label: "Needs Approval", classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  completed:     { label: "Completed",      classes: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20" },
  pending:       { label: "Pending Approval", classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  approved:      { label: "Approved",       classes: "bg-[var(--status-improving-bg)] text-[var(--status-improving)] border border-[var(--status-improving)]/20" },
}

interface SKUDetailDrawerProps {
  open: boolean
  payload: DrawerPayload | null
  onClose: () => void
  onGoToTab: (tabId: string) => void
}

export default function SKUDetailDrawer({ open, payload, onClose, onGoToTab }: SKUDetailDrawerProps) {
  if (!open || !payload) return null

  const badge = statusConfig[payload.status]

  return (
    <>
      <div className="fixed inset-0 bg-foreground/10 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-[420px] bg-card border-l border-border z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border">
          <div className="flex-1 min-w-0">
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide mb-1.5", badge.classes)}>
              {badge.label}
            </span>
            <h3 className="text-[14px] font-semibold text-foreground leading-snug">{payload.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Explanation */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">What this means</p>
            <p className="text-sm text-foreground leading-relaxed">{payload.explanation}</p>
          </div>

          {/* Signals */}
          {payload.signals && payload.signals.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Data signals</p>
              <ul className="space-y-1">
                {payload.signals.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-xs text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Source tabs */}
          {payload.sourceTabs.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Source tabs</p>
              <div className="flex flex-wrap gap-1.5">
                {payload.sourceTabs.map((t) => (
                  <span key={t.id} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border font-medium">
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key metrics */}
          {payload.metrics.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Key metrics</p>
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {payload.metrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between px-4 py-2.5 bg-card">
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                    <span className="text-xs font-semibold text-foreground">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra sections */}
          {payload.extraSections?.map((sec) => (
            <div key={sec.heading}>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">{sec.heading}</p>
              <p className="text-sm text-foreground leading-relaxed">{sec.body}</p>
            </div>
          ))}

          {/* Segment context */}
          {(payload.segment || payload.segmentStrategy) && (
            <div className="rounded-xl border border-primary/20 bg-accent p-4 space-y-1.5">
              <p className="text-[11px] font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
                <Bot className="w-3 h-3" /> SKU Segment Context
              </p>
              {payload.segment && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Segment</span>
                  <span className="text-xs font-semibold text-foreground">{payload.segment}</span>
                </div>
              )}
              {payload.segmentStrategy && (
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-muted-foreground shrink-0">Strategy</span>
                  <span className="text-xs font-medium text-foreground text-right">{payload.segmentStrategy}</span>
                </div>
              )}
              {payload.humanApprovalRequired !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Human approval</span>
                  <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md border",
                    payload.humanApprovalRequired
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border-[var(--status-stable)]/20"
                  )}>
                    {payload.humanApprovalRequired ? "Required" : "Not required"}
                  </span>
                </div>
              )}
              {payload.guardrailNote && (
                <div className="pt-1 border-t border-primary/10">
                  <div className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{payload.guardrailNote}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border space-y-2">
          <div className="flex gap-2.5">
            {payload.actionTabId && payload.actionLabel && (
              <button
                onClick={() => { onGoToTab(payload.actionTabId!); onClose() }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                {payload.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 border border-border bg-card text-muted-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" /> {payload.secondaryLabel ?? "Mark for review"}
            </button>
          </div>
          {payload.actionTabId !== "sku-segmentation" && (
            <button
              onClick={() => { onGoToTab("sku-segmentation"); onClose() }}
              className="w-full flex items-center justify-center gap-1.5 border border-primary/30 bg-accent text-primary text-xs font-semibold px-4 py-2 rounded-lg hover:bg-accent/80 transition-colors"
            >
              <Bot className="w-3.5 h-3.5" /> Open AI-Driven SKU Segmentation
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
