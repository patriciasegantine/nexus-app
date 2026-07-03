"use server"

import { auth } from "@/auth"
import { AppRoutes } from "@/constants/routes"
import { MAX_TAG_LENGTH, MAX_TAGS } from "@/constants/tags"
import { db } from "@/lib/db"
import { DEMO_ERROR, isDemoUser } from "@/lib/demo-guard"
import { ACTION_MESSAGES, PROJECT_MESSAGES, TAG_MESSAGES } from "@/constants/messages"
import type { ActionResult } from "@/types/actions"
import { revalidatePath } from "next/cache"

export type ProjectTagOperation = "add" | "remove"

export async function updateProjectTag(
  projectId: string,
  value: string,
  operation: ProjectTagOperation,
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

  const project = await db.project.findUnique({
    where: { id: projectId, userId: session.user.id },
    select: { tags: true },
  })

  if (!project) return { success: false, error: PROJECT_MESSAGES.NOT_FOUND }

  if (operation === "add" && project.tags.includes(tag)) {
    return { success: false, error: TAG_MESSAGES.ALREADY_ADDED }
  }

  if (operation === "add" && project.tags.length >= MAX_TAGS) {
    return { success: false, error: TAG_MESSAGES.MAX_COUNT(MAX_TAGS) }
  }

  const tags =
    operation === "add"
      ? [...project.tags, tag]
      : project.tags.filter((currentTag) => currentTag !== tag)

  await db.project.update({
    where: { id: projectId, userId: session.user.id },
    data: { tags },
  })

  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  revalidatePath(AppRoutes.DASHBOARD.HOME)
  return { success: true, data: tags }
}
