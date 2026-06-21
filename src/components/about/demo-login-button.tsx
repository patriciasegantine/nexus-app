"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { demoLogin } from "@/actions/demo/demo-login"
import { LoaderCircle, Play } from "lucide-react"

export function DemoLoginButton() {
  const router = useRouter()
  const { update } = useSession()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setError(null)
    setIsPending(true)

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
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        size="lg"
        className="h-11 px-8 gap-2"
        onClick={handleClick}
        disabled={isPending}
        aria-busy={isPending}
      >
        {isPending ? <LoaderCircle className="animate-spin" /> : <Play />}
        {isPending ? "Opening demo..." : "View live demo"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
