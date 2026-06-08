"use client"

import { cn } from "@/lib/utils"

interface POCard {
  po: string
  supplier: string
  category: string
  destination: string
  issue: string
  value: string
  impact: string
  action: string
}

const critical: POCard[] = [
  {
    po: "PO-78421",
    supplier: "GreenLeaf Seasonal Imports",
    category: "Seasonal",
    destination: "Savannah DC",
    issue: "ETA slipped 7 days; allocation shortfall expected",
    value: "$1.6M",
    impact: "42 Southeast stores exposed",
    action: "Expedite or substitute",
  },
  {
    po: "PO-78104",
    supplier: "ValuePack Consumables Co.",
    category: "Consumables",
    destination: "Joliet DC",
    issue: "Short shipment: 82% fill vs 96% expected",
    value: "$1.1M",
    impact: "31 Midwest stores exposed",
    action: "Prioritize high-velocity SKUs",
  },
]

const watchlist: POCard[] = [
  {
    po: "PO-77988",
    supplier: "BrightParty Goods",
    category: "Party",
    destination: "Chesapeake DC",
    issue: "Promo timing changed; receipt date uncertain",
    value: "$860K",
    impact: "14 Northeast stores exposed",
    action: "Confirm merchant calendar",
  },
  {
    po: "PO-78293",
    supplier: "Everyday Basics Manufacturing",
    category: "Consumables",
    destination: "Olive Branch DC",
    issue: "ASN received late; appointment pending",
    value: "$740K",
    impact: "Potential replenishment delay",
    action: "Confirm DC appointment",
  },
]

const stable: POCard[] = [
  {
    po: "PO-77611",
    supplier: "CareWell Beauty Supply",
    category: "Health & Beauty",
    destination: "San Bernardino DC",
    issue: "On track",
    value: "$520K",
    impact: "No material risk",
    action: "Monitor",
  },
  {
    po: "PO-78002",
    supplier: "HomeBase Essentials",
    category: "Household",
    destination: "Marietta DC",
    issue: "Early receipt contributing to overstock",
    value: "$940K",
    impact: "Carrying cost risk",
    action: "Slow or redirect",
  },
]

const laneConfig = [
  {
    label: "Critical",
    cards: critical,
    headerCls: "bg-rose-50 border-rose-200 text-rose-700",
    badgeCls: "bg-rose-100 text-rose-700",
    borderCls: "border-rose-200",
  },
  {
    label: "Watchlist",
    cards: watchlist,
    headerCls: "bg-amber-50 border-amber-200 text-amber-700",
    badgeCls: "bg-amber-100 text-amber-700",
    borderCls: "border-amber-200",
  },
  {
    label: "Stable / Recovering",
    cards: stable,
    headerCls: "bg-emerald-50 border-emerald-200 text-emerald-700",
    badgeCls: "bg-emerald-100 text-emerald-700",
    borderCls: "border-emerald-200",
  },
]

function POCardTile({ card, badgeCls }: { card: POCard; badgeCls: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3.5 flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-foreground">{card.po}</p>
          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{card.supplier}</p>
        </div>
        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0", badgeCls)}>
          {card.category}
        </span>
      </div>

      <p className="text-[11px] text-foreground leading-relaxed">{card.issue}</p>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
        <div>
          <span className="text-muted-foreground">Dest: </span>
          <span className="text-foreground font-medium">{card.destination}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Value: </span>
          <span className="text-foreground font-medium">{card.value}</span>
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground">Impact: </span>
          <span className="text-foreground">{card.impact}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">Action: </span>{card.action}
        </p>
      </div>
    </div>
  )
}

export default function SIPORiskLanes() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Purchase Order Risk Lanes</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Open inbound risks grouped by severity and required planner action
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {laneConfig.map((lane) => (
          <div key={lane.label} className="flex flex-col gap-3">
            {/* Lane header */}
            <div className={cn("px-3 py-2 rounded-lg border flex items-center justify-between", lane.headerCls)}>
              <span className="text-xs font-semibold">{lane.label}</span>
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", lane.badgeCls)}>
                {lane.cards.length}
              </span>
            </div>
            {/* Cards */}
            <div className="flex flex-col gap-2.5">
              {lane.cards.map((card) => (
                <POCardTile key={card.po} card={card} badgeCls={lane.badgeCls} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
