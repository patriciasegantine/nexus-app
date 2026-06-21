"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { updateProjectSchema } from "@/validations/project"
import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"
import { generateSlug, ensureUniqueSlug } from "@/lib/slug"
import type { ActionResult } from "@/types/actions"
import { parseTags } from "@/actions/shared"
import { isDemoUser, DEMO_ERROR } from "@/lib/demo-guard"

export async function updateProject(
  projectId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
  }

  const raw = {
    name: formData.get("name") || undefined,
    description: formData.get("description") || undefined,
    color: formData.get("color") || undefined,
    tags: parseTags(formData),
  }

  const parsed = updateProjectSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const existing = await db.project.findUnique({
    where: { id: projectId, userId: session.user.id },
    select: { id: true, name: true },
  })

  if (!existing) {
    return { success: false, error: "Project not found" }
  }

  let slug: string | undefined
  if (parsed.data.name && parsed.data.name !== existing.name) {
    slug = await ensureUniqueSlug(
      generateSlug(parsed.data.name),
      async (candidate) => {
        const found = await db.project.findUnique({ where: { slug: candidate }, select: { id: true } })
        return !!(found && found.id !== projectId)
      }
    )
  }

  await db.project.update({
    where: { id: projectId, userId: session.user.id },
    data: { ...parsed.data, ...(slug ? { slug } : {}) },
  })

  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  revalidatePath(AppRoutes.DASHBOARD.HOME)
  return { success: true, data: undefined }
}
