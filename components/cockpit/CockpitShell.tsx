"use client"

import { useState } from "react"
import Sidebar from "@/components/cockpit/Sidebar"
import DemandPlanningPage from "@/components/cockpit/DemandPlanningPage"
import InventoryAllocationPage from "@/components/cockpit/InventoryAllocationPage"
import SupplierInboundPage from "@/components/cockpit/SupplierInboundPage"
import DCCapacityTransportPage from "@/components/cockpit/DCCapacityTransportPage"
import StoreExecutionPage from "@/components/cockpit/StoreExecutionPage"
import ExecControlTowerPage from "@/components/cockpit/ExecControlTowerPage"
import SKUSegmentationPage from "@/components/cockpit/SKUSegmentationPage"

const WIRED = ["executive-tower", "sku-segmentation", "demand", "inventory", "supplier-inbound", "dc-capacity", "store-execution"]

export default function CockpitShell() {
  const [activeTab, setActiveTab] = useState<string>("executive-tower")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        {activeTab === "executive-tower" && <ExecControlTowerPage onGoToTab={setActiveTab} />}
        {activeTab === "sku-segmentation" && <SKUSegmentationPage onGoToTab={setActiveTab} />}
        {activeTab === "demand" && <DemandPlanningPage onGoToTab={setActiveTab} />}
        {activeTab === "inventory" && <InventoryAllocationPage onGoToTab={setActiveTab} />}
        {activeTab === "supplier-inbound" && <SupplierInboundPage onGoToTab={setActiveTab} />}
        {activeTab === "dc-capacity" && <DCCapacityTransportPage onGoToTab={setActiveTab} />}
        {activeTab === "store-execution" && <StoreExecutionPage onGoToTab={setActiveTab} />}
        {!WIRED.includes(activeTab) && (
          <div className="flex items-center justify-center h-full min-h-screen">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Coming soon</p>
              <p className="text-xs text-muted-foreground mt-1">This module is not yet available.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
