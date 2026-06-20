"use client"

import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { AppRoutes } from "@/constants/routes"

export function DemoBanner() {
  const { data: session } = useSession()
  const [isLeavingDemo, setIsLeavingDemo] = useState(false)

  const demoEmail = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL
  if (!demoEmail || session?.user?.email !== demoEmail) return null

  async function handleSignUp() {
    setIsLeavingDemo(true)
    await signOut({ callbackUrl: AppRoutes.AUTH.REGISTER })
  }

  return (
    <div className="border-b border-yellow-300 bg-yellow-200 px-4 py-3 text-center text-sm text-red-700">
      You&apos;re viewing a demo. Feel free to explore. Changes won&apos;t be saved.{" "}
      <button
        type="button"
        onClick={handleSignUp}
        disabled={isLeavingDemo}
        className="font-medium underline underline-offset-2 transition-colors hover:text-red-900 disabled:cursor-wait disabled:opacity-70"
      >
        {isLeavingDemo ? "Opening sign up..." : "Sign up free"}
      </button>{" "}
      to create your own workspace.
    </div>
  )
}
