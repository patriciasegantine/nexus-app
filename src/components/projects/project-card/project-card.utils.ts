export const PROJECT_COLORS = [
  '#2A2F36',
  '#6F6AF8',
  '#4C7DFF',
  '#FFB020',
  '#36C275',
  '#FF4D5E',
]

export const DEFAULT_PROJECT_COLOR = '#2A2F36'

export function colorIndex(id: string, length: number) {
  return id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % length
}

export function progressColor(progress: number, total: number) {
  if (total === 0 || progress === 0) return "bg-[hsl(var(--priority-high))]"
  if (progress < 30) return "bg-[hsl(var(--priority-high))]"
  if (progress < 70) return "bg-[hsl(var(--priority-medium))]"
  return "bg-[hsl(var(--priority-low))]"
}
