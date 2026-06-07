"use client"

import { cn } from "@/lib/utils"
import type { StatusLevel } from "./ECTData"

const config: Record<StatusLevel, { label: string; classes: string }> = {
  critical:     { label: "Critical",     classes: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20" },
  watchlist:    { label: "Watchlist",    classes: "bg-[var(--status-watchlist-bg)] text-[var(--status-watchlist)] border border-[var(--status-watchlist)]/20" },
  stable:       { label: "Stable",       classes: "bg-[var(--status-stable-bg)] text-[var(--status-stable)] border border-[var(--status-stable)]/20" },
  recommended:  { label: "Recommended", classes: "bg-[var(--status-improving-bg)] text-[var(--status-improving)] border border-[var(--status-improving)]/20" },
  "high-risk":  { label: "High Risk",   classes: "bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical)]/20" },
}

export default function StatusBadge({ status, className }: { status: StatusLevel; className?: string }) {
  const { label, classes } = config[status]
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide", classes, className)}>
      {label}
    </span>
  )
}
