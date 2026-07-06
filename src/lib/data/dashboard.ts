import { cache } from "react"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import type { RecentTask } from "@/types/task"
import type { RecentProject } from "@/types/project"

export interface TaskStatusSummary {
  totalTasks: number
  inProgress: number
  completed: number
  overdue: number
  byStatus: Record<string, number>
}

export const getTaskStatusSummary = cache(async (): Promise<TaskStatusSummary | null> => {
  const session = await auth()
  if (!session?.user?.id) return null

  const userId = session.user.id

  const [tasksByStatus, overdue] = await Promise.all([
    db.task.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    }),
    db.task.count({
      where: {
        userId,
        dueDate: { lt: new Date() },
        status: { not: "DONE" },
      },
    }),
  ])

  const byStatus = Object.fromEntries(
    tasksByStatus.map((s) => [s.status, s._count._all])
  )

  const totalTasks = tasksByStatus.reduce((sum, s) => sum + s._count._all, 0)

  return {
    totalTasks,
    inProgress: byStatus["IN_PROGRESS"] ?? 0,
    completed: byStatus["DONE"] ?? 0,
    overdue,
    byStatus,
  }
})

export async function getTaskPrioritySummary(): Promise<{ byPriority: Record<string, number> }> {
  const session = await auth()
  if (!session?.user?.id) return { byPriority: {} }

  const tasksByPriority = await db.task.groupBy({
    by: ["priority"],
    where: { userId: session.user.id },
    _count: { _all: true },
  })

  return {
    byPriority: Object.fromEntries(
      tasksByPriority.map((p) => [p.priority, p._count._all])
    ),
  }
}

export async function getRecentTasks(): Promise<RecentTask[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  return db.task.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      tags: true,
      dueDate: true,
      updatedAt: true,
      project: { select: { id: true, name: true } },
    },
  })
}

export async function getRecentProjectsForDashboard(): Promise<RecentProject[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  const recentProjects = await db.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      color: true,
      _count: { select: { tasks: true } },
      tasks: { where: { status: "DONE" }, select: { id: true } },
    },
  })

  return recentProjects.map(({ tasks, ...p }) => ({
    ...p,
    doneTasks: tasks.length,
  }))
}
