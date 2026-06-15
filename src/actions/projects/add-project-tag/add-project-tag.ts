"use server"

import { auth } from "@/auth"
import { MAX_TAG_LENGTH, MAX_TAGS } from "@/constants/tags"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"
import type { ActionResult } from "@/types/actions"

export async function addProjectTag(
  projectId: string,
  value: string,
): Promise<ActionResult<string[]>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const tag = value.trim().toLowerCase()
  if (!tag) return { success: false, error: "Tag is required" }
  if (tag.length > MAX_TAG_LENGTH) {
    return { success: false, error: `Tags must be at most ${MAX_TAG_LENGTH} characters` }
  }

  const project = await db.project.findUnique({
    where: { id: projectId, userId: session.user.id },
    select: { tags: true },
  })

  if (!project) return { success: false, error: "Project not found" }
  if (project.tags.includes(tag)) return { success: false, error: "Tag already added" }
  if (project.tags.length >= MAX_TAGS) {
    return { success: false, error: `Maximum ${MAX_TAGS} tags allowed` }
  }

  const tags = [...project.tags, tag]
  await db.project.update({
    where: { id: projectId, userId: session.user.id },
    data: { tags },
  })

  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  revalidatePath(AppRoutes.DASHBOARD.HOME)
  return { success: true, data: tags }
}
