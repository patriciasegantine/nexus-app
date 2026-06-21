"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { createProjectSchema } from "@/validations/project"
import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"
import { generateSlug, ensureUniqueSlug } from "@/lib/slug"
import type { ActionResult } from "@/types/actions"
import { parseTags } from "@/actions/shared"
import { isDemoUser, DEMO_ERROR } from "@/lib/demo-guard"

export async function createProject(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
  }

  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    color: formData.get("color") || undefined,
    tags: parseTags(formData),
  }

  const parsed = createProjectSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const slug = await ensureUniqueSlug(
    generateSlug(parsed.data.name),
    async (candidate: string) =>
      !!(await db.project.findUnique({ where: { slug: candidate }, select: { id: true } }))
  )

  const project = await db.project.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      color: parsed.data.color,
      tags: parsed.data.tags ?? [],
      userId: session.user.id,
    },
    select: { id: true },
  })

  revalidatePath(AppRoutes.DASHBOARD.PROJECTS)
  revalidatePath(AppRoutes.DASHBOARD.HOME)
  return { success: true, data: { id: project.id } }
}
