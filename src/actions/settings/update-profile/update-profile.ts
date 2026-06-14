"use server"

import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { AppRoutes } from "@/constants/routes"
import type { ActionResult } from "@/types/actions"

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = updateProfileSchema.safeParse({ name: formData.get("name") })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name.trim() },
  })

  revalidatePath(AppRoutes.DASHBOARD.SETTINGS)
  return { success: true, data: undefined }
}
