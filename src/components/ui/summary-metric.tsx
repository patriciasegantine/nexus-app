import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SummaryMetricProps {
  icon: LucideIcon
  label: string
  value: number | string
  tone?: "default" | "danger"
}

export function SummaryMetric({ icon: Icon, label, value, tone = "default" }: SummaryMetricProps) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card px-2 py-4 text-center shadow-sm transition-all duration-200 hover:shadow-md sm:flex-row sm:justify-start sm:gap-3 sm:px-4 sm:py-4 sm:text-left">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground sm:h-10 sm:w-10",
          tone === "danger" && "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
        )}
      >
        <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="text-base font-semibold leading-none text-foreground sm:text-lg">{value}</p>
        <p className="truncate text-[11px] leading-tight text-muted-foreground sm:text-xs">{label}</p>
      </div>
    </div>
  )
}
