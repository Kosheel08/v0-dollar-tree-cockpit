import Sidebar from "@/components/cockpit/Sidebar"
import DemandPlanningPage from "@/components/cockpit/DemandPlanningPage"

export default function Page() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <DemandPlanningPage />
      </div>
    </div>
  )
}
