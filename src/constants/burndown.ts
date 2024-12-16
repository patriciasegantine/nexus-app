export type VelocityStatus = 'REMAIN' | 'IDEAL'

export const BURNDOWN_STATUS: Record<VelocityStatus, string> = {
  IDEAL: 'remaining',
  REMAIN: 'ideal',
} as const

export const BURNDOWN_STATUS_NAMES: Record<VelocityStatus, string> = {
  IDEAL: 'Remaining',
  REMAIN: 'Ideal',
} as const

export const BURNDOWN_STATUS_COLORS: Record<VelocityStatus, string> = {
  IDEAL: 'hsl(var(--burndown-ideal))',
  REMAIN: 'hsl(var(--burndown-remain))'
} as const
