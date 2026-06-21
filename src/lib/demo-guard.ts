export const DEMO_ERROR = "Editing is disabled in the demo. Sign up to save your own workspace."

export function isDemoUser(email: string | null | undefined): boolean {
  const demoEmail = process.env.DEMO_USER_EMAIL
  if (!demoEmail || !email) return false
  return email.trim().toLowerCase() === demoEmail.trim().toLowerCase()
}
