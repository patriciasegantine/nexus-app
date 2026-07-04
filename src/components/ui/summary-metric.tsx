import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SummaryMetricProps {
  icon: LucideIcon
  label: string
  value: number | string
  description?: string
  href?: string
  color?: string
  tone?: "default" | "danger"
}

export function SummaryMetric({
  icon: Icon,
  label,
  value,
  description,
  href,
  color,
  tone = "default",
}: SummaryMetricProps) {
  const content = (
    <div
      className={cn(
        "flex h-full min-w-0 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card px-2 py-4 text-center shadow-sm transition-all duration-200 sm:flex-row sm:justify-start sm:gap-3 sm:px-4 sm:py-4 sm:text-left",
        href ? "group-hover:-translate-y-0.5 group-hover:shadow-md" : "hover:shadow-md"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground sm:h-10 sm:w-10",
          tone === "danger" && !color && "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
        )}
        style={color ? { backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color } : undefined}
      >
        <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "font-semibold leading-none text-foreground",
            description ? "text-lg sm:text-2xl" : "text-base sm:text-lg"
          )}
        >
          {value}
        </p>
        <p className="truncate text-[11px] leading-tight text-muted-foreground sm:text-xs">{label}</p>
        {description && (
          <p className="mt-1 hidden truncate text-xs text-muted-foreground sm:block">{description}</p>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${label}: ${value}`}
        className="group block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {content}
      </Link>
    )
  }

  return content
}
