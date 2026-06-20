"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { demoLogin } from "@/actions/demo/demo-login"
import { Play } from "lucide-react"

export function DemoLoginButton() {
  const router = useRouter()
  const { update } = useSession()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      try {
        const result = await demoLogin()
        if (!result.success) {
          setError(result.error)
          return
        }

        await update()
        router.replace("/")
        router.refresh()
      } catch {
        setError("The demo is temporarily unavailable. Please try again later.")
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button size="lg" className="h-11 px-8 gap-2" onClick={handleClick} disabled={isPending}>
        <Play size={16} />
        {isPending ? "Loading demo..." : "View live demo"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
