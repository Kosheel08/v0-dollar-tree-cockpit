"use client"

import { ChevronRight, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import { classificationSignals, classificationEngineDrawer, segmentCards } from "./SKUData"
import type { DrawerPayload, StatusLevel } from "./SKUData"
import ECTSectionHeader from "./ECTSectionHeader"

const segmentChipColors: Record<string, string> = {
  "consistent-replenishment": "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/30",
  "seasonal-event":           "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/30",
  "treasure-hunt":            "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/30",
  "promo-merchant":           "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/30",
  "constrained-exception":    "bg-amber-50 text-amber-700 border border-amber-200",
}

interface SKUClassificationFlowProps {
  onOpenDrawer: (payload: DrawerPayload) => void
}

export default function SKUClassificationFlow({ onOpenDrawer }: SKUClassificationFlowProps) {
  return (
    <div>
      <ECTSectionHeader
        title="How AI Classifies SKUs"
        subtitle="Signals used to assign each SKU family to a practical planning and fulfillment segment"
        className="mb-5"
      />

      <div className="flex gap-4 items-stretch">
        {/* Input signals — left column */}
        <div className="flex flex-col gap-2.5 w-[220px] shrink-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Input signals</p>
          {classificationSignals.map((sig) => (
            <button
              key={sig.id}
              onClick={() => onOpenDrawer(sig.drawer)}
              className="bg-card border border-border rounded-xl px-3.5 py-3 text-left hover:border-primary/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <p className="text-[12px] font-semibold text-foreground leading-tight">{sig.title}</p>
                <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">{sig.example}</p>
            </button>
          ))}
        </div>

        {/* Arrow connector */}
        <div className="flex flex-col items-center justify-center gap-1 shrink-0 px-1">
          <div className="h-full w-px bg-border" />
          <div className="shrink-0 text-muted-foreground/40 text-lg">›</div>
          <div className="h-full w-px bg-border" />
        </div>

        {/* Central AI engine */}
        <div className="flex-1 flex flex-col justify-center">
          <button
            onClick={() => onOpenDrawer(classificationEngineDrawer)}
            className="bg-card border-2 border-primary/30 rounded-2xl p-5 text-left hover:border-primary/60 hover:shadow-md transition-all group w-full"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-primary-foreground" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
            </div>
            <p className="text-[14px] font-bold text-foreground mb-1.5">AI Classification Engine</p>
            <p className="text-[12px] text-muted-foreground leading-snug mb-4">
              Assigns each SKU family to the segment with the best-fit planning and fulfillment strategy.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: "Confidence score", value: "0.84 avg" },
                { label: "Recommended segment", value: "Top-ranked" },
                { label: "Automation level", value: "High / Med / Low" },
                { label: "Human approval", value: "Required for 174" },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                  <p className="text-[12px] font-semibold text-foreground">{m.value}</p>
                </div>
              ))}
            </div>
          </button>
        </div>

        {/* Arrow connector */}
        <div className="flex flex-col items-center justify-center gap-1 shrink-0 px-1">
          <div className="h-full w-px bg-border" />
          <div className="shrink-0 text-muted-foreground/40 text-lg">›</div>
          <div className="h-full w-px bg-border" />
        </div>

        {/* Output segment chips — right column */}
        <div className="flex flex-col gap-2.5 w-[210px] shrink-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Output segments</p>
          {segmentCards.map((seg) => (
            <button
              key={seg.id}
              onClick={() => onOpenDrawer(seg.drawer)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-xl px-3.5 py-3 text-left hover:opacity-80 transition-all group",
                segmentChipColors[seg.id]
              )}
            >
              <div>
                <p className="text-[12px] font-semibold leading-tight">{seg.name}</p>
                <p className="text-[11px] opacity-75 leading-tight">{seg.skuFamilies.toLocaleString()} SKU families</p>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
