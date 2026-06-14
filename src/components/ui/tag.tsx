import type { MouseEventHandler } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagProps {
  label: string
  onRemove?: () => void
  onClick?: MouseEventHandler<HTMLButtonElement>
  active?: boolean
  className?: string
}

const TAG_COLORS = [
  'border-blue-200/70 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/45 dark:text-blue-300',
  'border-violet-200/70 bg-violet-50 text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/45 dark:text-violet-300',
  'border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/45 dark:text-emerald-300',
  'border-amber-200/70 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/45 dark:text-amber-300',
  'border-rose-200/70 bg-rose-50 text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/45 dark:text-rose-300',
  'border-cyan-200/70 bg-cyan-50 text-cyan-700 dark:border-cyan-800/60 dark:bg-cyan-950/45 dark:text-cyan-300',
]

export function getTagColor(label: string) {
  const index = Array.from(label).reduce((total, character) => total + character.charCodeAt(0), 0)
  return TAG_COLORS[index % TAG_COLORS.length]
}

export function Tag({ label, onRemove, onClick, active = false, className }: TagProps) {
  const tagClassName = cn(
    'inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    getTagColor(label),
    onClick && 'cursor-pointer hover:brightness-95 dark:hover:brightness-110',
    active && 'ring-1 ring-current/30',
    className,
  )

  if (onClick) {
    return (
      <button type="button" className={tagClassName} onClick={onClick}>
        <span className="truncate">{label}</span>
      </button>
    )
  }

  return (
    <span className={tagClassName}>
      <span className="truncate">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove tag ${label}`}
          className="ml-0.5 rounded-full p-0.5 opacity-60 transition-colors hover:bg-current/10 hover:opacity-100"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </span>
  )
}
