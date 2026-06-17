import type { MouseEventHandler } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagProps {
  label: string
  onRemove?: () => void
  removePosition?: "inline" | "corner"
  onClick?: MouseEventHandler<HTMLButtonElement>
  active?: boolean
  className?: string
}

const CornerRemoveButton = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <button
    type="button"
    onClick={(e) => { e.stopPropagation(); onRemove() }}
    aria-label={`Remove tag ${label}`}
    className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-muted-foreground/70 text-background opacity-0 transition-opacity group-hover:opacity-100 hover:bg-foreground"
  >
    <X className="h-2 w-2" />
  </button>
)

const InlineRemoveButton = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <button
    type="button"
    onClick={(e) => { e.stopPropagation(); onRemove() }}
    aria-label={`Remove tag ${label}`}
    className="ml-0.5 rounded-full p-0.5 opacity-60 transition-colors hover:bg-foreground/10 hover:opacity-100"
  >
    <X className="h-2.5 w-2.5" />
  </button>
)

export function Tag({ label, onRemove, removePosition = "inline", onClick, active = false, className }: TagProps) {
  const base = cn(
    'group relative inline-flex max-w-full items-center gap-1 rounded-full border border-border/60 bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground',
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    active && 'border-foreground/20 bg-muted/80 text-foreground',
    className,
  )

  const RemoveBtn = removePosition === "corner" ? CornerRemoveButton : InlineRemoveButton

  // Both click-to-filter and remove
  if (onClick && onRemove) {
    return (
      <span className={base}>
        <button type="button" onClick={onClick} className="truncate hover:text-foreground">
          #{label}
        </button>
        <RemoveBtn label={label} onRemove={onRemove} />
      </span>
    )
  }

  // Click only
  if (onClick) {
    return (
      <button type="button" className={cn(base, 'hover:text-foreground')} onClick={onClick}>
        <span className="truncate">#{label}</span>
      </button>
    )
  }

  // Static with optional remove
  return (
    <span className={base}>
      <span className="truncate">#{label}</span>
      {onRemove && <RemoveBtn label={label} onRemove={onRemove} />}
    </span>
  )
}
