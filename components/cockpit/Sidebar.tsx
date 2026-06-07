"use client"

import {
  BarChart3,
  GitMerge,
  Boxes,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
  LayoutDashboard,
  TreePine,
  Radio,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Demand Planning", icon: LayoutDashboard, id: "demand" },
  { label: "Inventory & Allocation", icon: Boxes, id: "inventory" },
  { label: "Forecast Accuracy", icon: TrendingUp, id: "forecast" },
  { label: "Demand Transfer", icon: GitMerge, id: "transfer" },
  { label: "Inventory Risk", icon: BarChart3, id: "inv-risk" },
  { label: "Supplier Signals", icon: Radio, id: "supplier" },
  { label: "Exception Review", icon: AlertTriangle, id: "exceptions" },
  { label: "Executive Summary", icon: FileText, id: "executive" },
]

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-[260px] shrink-0 flex flex-col border-r border-border bg-card h-screen sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <TreePine className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-semibold text-foreground tracking-wide uppercase">Dollar Tree</p>
          <p className="text-[11px] text-muted-foreground">Planning Cockpit</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 pb-2">
          Planning
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "group relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
              )}
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[11px] text-muted-foreground">Planning Cycle</p>
        <p className="text-xs font-medium text-foreground mt-0.5">Jun 2026 · Week 2</p>
      </div>
    </aside>
  )
}
