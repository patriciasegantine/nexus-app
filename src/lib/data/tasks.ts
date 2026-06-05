import { auth } from "@/auth"
import { db } from "@/lib/db"
import type { TaskStatus, TaskPriority } from "@/types/task"

export async function getTasks(filters?: { status?: TaskStatus; priority?: TaskPriority }) {
  const session = await auth()
  if (!session?.user?.id) return []

  return db.task.findMany({
    where: {
      userId: session.user.id,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.priority && { priority: filters.priority }),
    },
    orderBy: { updatedAt: "desc" },
    include: {
      project: { select: { id: true, name: true } },
    },
  })
}

export async function getTasksByProject(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) return []

  return db.task.findMany({
    where: { projectId, userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })
}

export async function getDashboardStats() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [total, byStatus, byPriority, recentTasks, projectCount, recentProjects] = await Promise.all([
    db.task.count({ where: { userId: session.user.id } }),
    db.task.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: true,
    }),
    db.task.groupBy({
      by: ["priority"],
      where: { userId: session.user.id },
      _count: true,
    }),
    db.task.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { project: { select: { name: true } } },
    }),
    db.project.count({ where: { userId: session.user.id } }),
    db.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        _count: { select: { tasks: true } },
      },
    }),
  ])

  const byStatusMap = Object.fromEntries(
    byStatus.map((s) => [s.status, s._count])
  )

  const byPriorityMap = Object.fromEntries(
    byPriority.map((p) => [p.priority, p._count])
  )

  const completed = byStatusMap["DONE"] ?? 0
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    totalTasks: total,
    totalProjects: projectCount,
    todo: byStatusMap["TODO"] ?? 0,
    inProgress: byStatusMap["IN_PROGRESS"] ?? 0,
    completed,
    completionRate,
    byStatus: byStatusMap,
    byPriority: byPriorityMap,
    recentTasks,
    recentProjects,
  }
}

export async function getBoardData() {
  const session = await auth()
  if (!session?.user?.id) return []

  const projects = await db.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      tasks: { select: { status: true, priority: true, dueDate: true } },
    },
  })

  return projects.map((project) => {
    const total = project.tasks.length
    const done = project.tasks.filter((t) => t.status === "DONE").length
    const inProgress = project.tasks.filter((t) => t.status === "IN_PROGRESS").length
    const todo = project.tasks.filter((t) => t.status === "TODO").length
    const progress = total > 0 ? Math.round((done / total) * 100) : 0
    const overdue = project.tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE"
    ).length

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      total,
      done,
      inProgress,
      todo,
      progress,
      overdue,
    }
  })
}
