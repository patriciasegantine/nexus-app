"use server"

import bcrypt from "bcryptjs"
import crypto from "node:crypto"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { AUTH_MESSAGES } from "@/constants/messages"
import { resetPasswordSchema } from "@/validations/auth"
import { isRateLimited } from "@/lib/rate-limit"

export type ResetPasswordState = {
  success: boolean
  error?: string
}

export async function resetPassword(
  _prev: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  const rateLimit = isRateLimited(`reset-password:${ip}`, 10, 15 * 60 * 1000)
  if (rateLimit.limited) {
    return {
      success: false,
      error: `Too many requests. Try again in ${rateLimit.retryAfterSeconds}s.`,
    }
  }

  const raw = {
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  }

  const parsed = resetPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const { token, newPassword } = parsed.data
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  const verificationToken = await db.verificationToken.findUnique({
    where: { token: hashedToken },
  })

  if (!verificationToken || verificationToken.expires < new Date()) {
    return { success: false, error: AUTH_MESSAGES.INVALID_RESET_LINK }
  }

  const user = await db.user.findUnique({
    where: { email: verificationToken.identifier },
    select: { id: true, password: true },
  })

  if (!user || !user.password) {
    return { success: false, error: AUTH_MESSAGES.INVALID_RESET_LINK }
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password)
  if (isSamePassword) {
    return { success: false, error: AUTH_MESSAGES.SAME_PASSWORD }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { password: hashedPassword } }),
    db.verificationToken.deleteMany({ where: { identifier: verificationToken.identifier } }),
  ])

  return { success: true }
}
