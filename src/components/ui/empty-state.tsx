import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  action?: React.ReactNode
  variant?: "page" | "compact"
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  action,
  variant = "page",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center text-muted-foreground",
        variant === "page" ? "min-h-[20rem] gap-4" : "h-[140px] gap-2",
        className
      )}
    >
      <Icon className={variant === "page" ? "h-12 w-12" : "h-8 w-8"} />
      <p className={variant === "compact" ? "text-sm" : undefined}>{title}</p>
      {action}
    </div>
  )
}
