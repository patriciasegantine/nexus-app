import { format } from "date-fns"
import type { ProjectPriority, ProjectStatus } from "@/types/project"

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

export const PROJECT_STATUS_NAMES: Record<ProjectStatus, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  ON_HOLD: "On hold",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
}

export const PROJECT_STATUS_STYLES: Record<ProjectStatus, string> = {
  PLANNING: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
  ACTIVE: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  ON_HOLD: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  COMPLETED: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  ARCHIVED: "bg-muted text-muted-foreground",
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  PLANNING: "#64748B",
  ACTIVE: "#4C7DFF",
  ON_HOLD: "#EAB308",
  COMPLETED: "#36C275",
  ARCHIVED: "#94A3B8",
}

export const PROJECT_PRIORITY_NAMES: Record<ProjectPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
}

export const PROJECT_PRIORITY_COLORS: Record<ProjectPriority, string> = {
  LOW: "#22C55E",
  MEDIUM: "#EAB308",
  HIGH: "#EF4444",
}

export const PROJECT_PRIORITY_ACCENT: Record<ProjectPriority, string> = {
  LOW: "text-emerald-600 dark:text-emerald-400",
  MEDIUM: "text-amber-600 dark:text-amber-400",
  HIGH: "text-rose-600 dark:text-rose-400",
}

export function formatProjectDate(date: Date) {
  return format(new Date(date), "d MMM yy")
}

export function formatProjectTimeline(startDate: Date | null, targetDate: Date | null) {
  if (startDate && targetDate) {
    return `${formatProjectDate(startDate)} - ${formatProjectDate(targetDate)}`
  }

  if (startDate) return `Starts ${formatProjectDate(startDate)}`
  if (targetDate) return `Target ${formatProjectDate(targetDate)}`
  return null
}
