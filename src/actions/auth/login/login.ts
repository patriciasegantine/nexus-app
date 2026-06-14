"use server"

import { AuthError } from "next-auth"
import { signIn } from "@/auth"
import { AUTH_MESSAGES } from "@/constants/messages"
import { loginSchema } from "@/validations/auth"

export type LoginState = {
  success: boolean
  error?: string
}

export async function loginUser(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/",
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: AUTH_MESSAGES.INVALID_CREDENTIALS }
    }
    throw error
  }
}
