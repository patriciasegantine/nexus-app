"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { DEMO_ERROR, isDemoUser } from "@/lib/demo-guard"
import { revalidateTaskPaths, type ActionResult } from "../shared"

export async function duplicateTask(
  taskId: string
): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }
  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: {
      title: true,
      description: true,
      priority: true,
      status: true,
      tags: true,
      projectId: true,
      dueDate: true,
    },
  })

  if (!existing) {
    return { success: false, error: "Task not found" }
  }

  const task = await db.task.create({
    data: {
      title: `${existing.title} (copy)`,
      description: existing.description,
      priority: existing.priority,
      status: existing.status,
      tags: existing.tags,
      projectId: existing.projectId,
      userId: session.user.id,
      dueDate: existing.dueDate,
    },
    select: { id: true },
  })

  revalidateTaskPaths()
  return { success: true, data: { id: task.id } }
}
