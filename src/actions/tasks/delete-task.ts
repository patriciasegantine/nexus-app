"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidateTaskPaths, type ActionResult } from "./shared"

export async function deleteTask(
  taskId: string
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: "Task not found" }
  }

  await db.task.delete({
    where: { id: taskId, userId: session.user.id },
  })

  revalidateTaskPaths()
  return { success: true, data: undefined }
}
