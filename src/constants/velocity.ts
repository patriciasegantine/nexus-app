export type VelocityStatus = 'PLANNED' | 'COMPLETED'

export const VELOCITY_STATUS: Record<VelocityStatus, string> = {
  PLANNED: 'planned',
  COMPLETED: 'completed',
} as const

export const VELOCITY_STATUS_NAMES: Record<VelocityStatus, string> = {
  PLANNED: 'Planned',
  COMPLETED: 'Completed',
} as const

export const VELOCITY_STATUS_COLORS: Record<VelocityStatus, string> = {
  PLANNED: 'hsl(var(--velocity-planned))',
  COMPLETED: 'hsl(var(--velocity-completed))'
} as const
