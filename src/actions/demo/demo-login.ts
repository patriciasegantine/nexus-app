"use server"

import { headers } from "next/headers"
import { AuthError } from "next-auth"
import { signIn } from "@/auth"
import { isRateLimited } from "@/lib/rate-limit"
import { DEMO_MESSAGES } from "@/constants/messages"

export type DemoLoginResult =
  | { success: true }
  | { success: false; error: string }

export async function demoLogin(): Promise<DemoLoginResult> {
  const headersList = await headers()
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"

  const { limited, retryAfterSeconds } = isRateLimited(`demo:${ip}`, 10, 60 * 1000)
  if (limited) {
    return { success: false, error: `Too many requests. Try again in ${retryAfterSeconds} seconds.` }
  }

  const secret = process.env.DEMO_LOGIN_SECRET
  const demoEmail = process.env.DEMO_USER_EMAIL

  if (!secret || !demoEmail) {
    console.error("demo_login_not_configured", {
      hasDemoLoginSecret: Boolean(secret),
      hasDemoUserEmail: Boolean(demoEmail),
    })
    return { success: false, error: DEMO_MESSAGES.UNAVAILABLE }
  }

  try {
    await signIn("demo", {
      secret,
      redirectTo: "/",
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("demo_login_failed", { type: error.type })
      return { success: false, error: DEMO_MESSAGES.UNAVAILABLE }
    }

    throw error
  }

  return { success: true }
}
