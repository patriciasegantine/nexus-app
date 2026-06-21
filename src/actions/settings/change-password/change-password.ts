"use server"

import bcrypt from "bcryptjs"
import { auth } from "@/auth"
import { AUTH_MESSAGES } from "@/constants/messages"
import { AppRoutes } from "@/constants/routes"
import { db } from "@/lib/db"
import type { ActionResult } from "@/types/actions"
import { changePasswordSchema } from "@/validations/auth"
import { revalidatePath } from "next/cache"
import { DEMO_ERROR, isDemoUser } from "@/lib/demo-guard"

export async function changePassword(formData: FormData): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }
  if (isDemoUser(session.user.email)) {
    return { success: false, error: DEMO_ERROR }
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, password: true },
  })

  if (!user?.password) {
    return { success: false, error: "Password changes are only available for email/password accounts" }
  }

  const currentPasswordMatches = await bcrypt.compare(parsed.data.currentPassword, user.password)
  if (!currentPasswordMatches) {
    return { success: false, error: "Current password is incorrect" }
  }

  const isSamePassword = await bcrypt.compare(parsed.data.newPassword, user.password)
  if (isSamePassword) {
    return { success: false, error: AUTH_MESSAGES.SAME_PASSWORD }
  }

  const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 12)

  await db.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  revalidatePath(AppRoutes.DASHBOARD.SETTINGS)
  return { success: true, data: undefined }
}
