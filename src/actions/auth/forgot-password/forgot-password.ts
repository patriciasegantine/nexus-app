"use server"

import crypto from "node:crypto"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { forgotPasswordSchema } from "@/validations/auth"
import { sendResetPasswordEmail } from "@/lib/mail"
import { isRateLimited } from "@/lib/rate-limit"
import { getBaseUrl } from "@/lib/base-url"

export type ForgotPasswordState = {
  success: boolean
  error?: string
  rateLimited?: boolean
  retryAfterSeconds?: number
}

export async function requestPasswordReset(
  _prev: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  const rateLimit = isRateLimited(`forgot-password:${ip}`, 5, 15 * 60 * 1000)
  if (rateLimit.limited) {
    return {
      success: false,
      rateLimited: true,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
      error: `Too many requests. Try again in ${rateLimit.retryAfterSeconds}s.`,
    }
  }

  const raw = { email: formData.get("email") }
  const parsed = forgotPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const email = parsed.data.email.trim().toLowerCase()
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password: true },
  })

  if (!user || !user.password) {
    return { success: true }
  }

  await db.verificationToken.deleteMany({ where: { identifier: email } })

  const rawToken = crypto.randomBytes(32).toString("hex")
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")
  const expires = new Date(Date.now() + 1000 * 60 * 30)

  await db.verificationToken.create({
    data: { identifier: email, token: hashedToken, expires },
  })

  const baseUrl = getBaseUrl()
  const resetLink = `${baseUrl}/reset-password?token=${rawToken}`

  await sendResetPasswordEmail({
    name: user.name?.trim() || "there",
    email,
    resetLink,
  })

  return { success: true }
}
