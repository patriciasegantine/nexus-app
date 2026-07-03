"use server"

import { auth } from "@/auth"
import { ACTION_MESSAGES, TASK_MESSAGES } from "@/constants/messages"
import { db } from "@/lib/db"
import { revalidateTaskPaths, type ActionResult } from "../shared"
import { isDemoUser, DEMO_ERROR } from "@/lib/demo-guard"

export async function deleteTask(
  taskId: string
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: ACTION_MESSAGES.UNAUTHORIZED }
  }

  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
  }

  const existing = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { id: true },
  })

  if (!existing) {
    return { success: false, error: TASK_MESSAGES.NOT_FOUND }
  }

  await db.task.delete({
    where: { id: taskId, userId: session.user.id },
  })

  revalidateTaskPaths()
  return { success: true, data: undefined }
}
