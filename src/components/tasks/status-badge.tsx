'use client'

import { useTheme } from 'next-themes'
import { TASK_STATUS_COLORS, TASK_STATUS_NAMES } from '@/constants/task'
import type { TaskStatus } from '@/types/task'

interface StatusBadgeProps {
  status: TaskStatus
  onClick?: () => void
}

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const { resolvedTheme } = useTheme()
  const opacity = resolvedTheme === 'dark' ? '66' : '33'
  const className = `inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${
    onClick ? 'transition-[filter] hover:brightness-95' : ''
  }`
  const style = { backgroundColor: TASK_STATUS_COLORS[status] + opacity }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className} style={style}>
        {TASK_STATUS_NAMES[status]}
      </button>
    )
  }

  return (
    <span className={className} style={style}>
      {TASK_STATUS_NAMES[status]}
    </span>
  )
}
