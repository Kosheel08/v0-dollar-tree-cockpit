import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
  action?: React.ReactNode
}

export default function ECTSectionHeader({ title, subtitle, className, action }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-5", className)}>
      <div>
        <h2 className="text-[15px] font-semibold text-foreground tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
