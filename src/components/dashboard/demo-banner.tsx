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
    <div className="sticky top-16 z-40 border-b border-slate-300 bg-slate-200 px-4 py-3 text-center text-sm text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
      You&apos;re viewing a demo. Feel free to explore. Changes won&apos;t be saved.{" "}
      <button
        type="button"
        onClick={handleSignUp}
        disabled={isLeavingDemo}
        className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70 disabled:cursor-wait disabled:opacity-40"
      >
        {isLeavingDemo ? "Opening sign up..." : "Sign up free"}
      </button>{" "}
      to create your own workspace.
    </div>
  )
}
