"use client"

import { X, ArrowRight, Bookmark } from "lucide-react"
import StatusBadge from "./ECTStatusBadge"
import type { DrawerPayload } from "./ECTData"
import { cn } from "@/lib/utils"

interface ECTDetailDrawerProps {
  open: boolean
  payload: DrawerPayload | null
  onClose: () => void
  onGoToTab: (tabId: string) => void
}

const TAB_LABELS: Record<string, string> = {
  "demand": "Demand Planning",
  "inventory": "Inventory & Allocation",
  "supplier-inbound": "Supplier & Inbound Flow",
  "dc-capacity": "DC Capacity & Transportation",
  "store-execution": "Store Execution",
}

export default function ECTDetailDrawer({ open, payload, onClose, onGoToTab }: ECTDetailDrawerProps) {
  if (!open || !payload) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/10 z-40"
        onClick={onClose}
      />
      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-[420px] bg-card border-l border-border z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <StatusBadge status={payload.status} />
            </div>
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

          {/* Source tabs */}
          {payload.sourceTabs.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Source tabs</p>
              <div className="flex flex-wrap gap-1.5">
                {payload.sourceTabs.map((t) => (
                  <span key={t} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border font-medium">
                    {t}
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

          {/* Business impact */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Business impact</p>
            <p className="text-sm text-foreground leading-relaxed">{payload.businessImpact}</p>
          </div>

          {/* Recommended action */}
          <div className="rounded-xl bg-accent border border-accent-foreground/10 px-4 py-3">
            <p className="text-[11px] font-semibold text-accent-foreground uppercase tracking-widest mb-1">Recommended action</p>
            <p className="text-sm text-accent-foreground leading-relaxed">{payload.recommendedAction}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center gap-2.5">
          <button
            onClick={() => { onGoToTab(payload.primarySourceTabId); onClose() }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to {TAB_LABELS[payload.primarySourceTabId] ?? "source tab"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-1.5 border border-border text-xs font-medium text-muted-foreground px-3 py-2.5 rounded-lg hover:bg-muted transition-colors">
            <Bookmark className="w-3.5 h-3.5" />
            Mark for review
          </button>
        </div>
      </aside>
    </>
  )
}
