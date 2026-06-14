export const PROJECT_COLORS = [
  '#71717a', // zinc (default)
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#f43f5e', // rose-500
]

export const DEFAULT_PROJECT_COLOR = '#71717a'

export function colorIndex(id: string, length: number) {
  return id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % length
}

export function progressColor(progress: number, total: number) {
  if (total === 0 || progress === 0) return "bg-red-500"
  if (progress < 30) return "bg-red-500"
  if (progress < 70) return "bg-amber-500"
  return "bg-emerald-500"
}
