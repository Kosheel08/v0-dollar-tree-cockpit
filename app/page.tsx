"use client"

import { useState } from "react"
import Sidebar from "@/components/cockpit/Sidebar"
import DemandPlanningPage from "@/components/cockpit/DemandPlanningPage"
import InventoryAllocationPage from "@/components/cockpit/InventoryAllocationPage"

export default function Page() {
  const [activeTab, setActiveTab] = useState("demand")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        {activeTab === "demand"    && <DemandPlanningPage />}
        {activeTab === "inventory" && <InventoryAllocationPage />}
        {!["demand", "inventory"].includes(activeTab) && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Coming soon</p>
              <p className="text-xs text-muted-foreground mt-1">This tab is not yet available.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
