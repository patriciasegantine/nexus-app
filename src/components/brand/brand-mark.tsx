import Image from "next/image"
import { cn } from "@/lib/utils"

type BrandMarkProps = {
  size?: "sm" | "md"
  showName?: boolean
  className?: string
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
} as const

export function BrandMark({ size = "md", showName = true, className }: BrandMarkProps) {
  const pixelSize = size === "sm" ? 24 : 32

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.svg"
        alt="Nexus"
        width={pixelSize}
        height={pixelSize}
        className={cn("rounded-md ring-1 ring-border dark:ring-slate-600", sizeClasses[size])}
        priority
      />
      {showName && <span className="text-sm font-semibold tracking-normal">Nexus</span>}
    </div>
  )
}
