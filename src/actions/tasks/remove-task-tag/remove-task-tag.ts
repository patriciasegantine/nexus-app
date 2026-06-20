"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { DEMO_ERROR, isDemoUser } from "@/lib/demo-guard"
import { revalidateTaskPaths, type ActionResult } from "../shared"

export async function removeTaskTag(
  taskId: string,
  tag: string,
): Promise<ActionResult<string[]>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }
  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
  }

  const task = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { tags: true },
  })

  if (!task) return { success: false, error: "Task not found" }

  const tags = task.tags.filter((t) => t !== tag)
  await db.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { tags },
  })

  revalidateTaskPaths()
  return { success: true, data: tags }
}
