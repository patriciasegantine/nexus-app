"use server"

import { auth } from "@/auth"
import { ACTION_MESSAGES, TAG_MESSAGES, TASK_MESSAGES } from "@/constants/messages"
import { MAX_TAG_LENGTH, MAX_TAGS } from "@/constants/tags"
import { db } from "@/lib/db"
import { DEMO_ERROR, isDemoUser } from "@/lib/demo-guard"
import { revalidateTaskPaths, type ActionResult } from "../shared"

export async function addTaskTag(
  taskId: string,
  value: string,
): Promise<ActionResult<string[]>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: ACTION_MESSAGES.UNAUTHORIZED }
  }
  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
  }

  const tag = value.trim().toLowerCase()
  if (!tag) return { success: false, error: TAG_MESSAGES.REQUIRED }
  if (tag.length > MAX_TAG_LENGTH) {
    return { success: false, error: TAG_MESSAGES.MAX_LENGTH(MAX_TAG_LENGTH) }
  }

  const task = await db.task.findUnique({
    where: { id: taskId, userId: session.user.id },
    select: { tags: true },
  })

  if (!task) return { success: false, error: TASK_MESSAGES.NOT_FOUND }
  if (task.tags.includes(tag)) return { success: false, error: TAG_MESSAGES.ALREADY_ADDED }
  if (task.tags.length >= MAX_TAGS) {
    return { success: false, error: TAG_MESSAGES.MAX_COUNT(MAX_TAGS) }
  }

  const tags = [...task.tags, tag]
  await db.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { tags },
  })

  revalidateTaskPaths()
  return { success: true, data: tags }
}
