"use client"

import { useState } from "react"
import Link from "next/link"
import { Github, LoaderCircle, LogIn } from "lucide-react"
import { DemoLoginButton } from "@/components/about/demo-login-button"
import { Button } from "@/components/ui/button"
import { AppRoutes } from "@/constants/routes"
import { cn } from "@/lib/utils"

type AboutActionsProps = {
  sourceUrl: string
  className?: string
}

type DemoCallToActionProps = {
  className?: string
}

export function DemoCallToAction({ className }: DemoCallToActionProps) {
  return (
    <section className={cn("flex w-full max-w-md flex-col items-center gap-2 text-center", className)}>
      <DemoLoginButton />
      <p className="text-xs text-muted-foreground">Instant access · No signup required</p>
    </section>
  )
}

export function AboutActions({ sourceUrl, className }: AboutActionsProps) {
  const [opening, setOpening] = useState<"sign-in" | "source" | null>(null)

  function handleOpen(action: "sign-in" | "source") {
    setOpening(action)

    if (action === "source") {
      window.setTimeout(() => setOpening(null), 800)
    }
  }

  return (
    <section className={cn("w-full text-center", className)}>
      <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
        <Button asChild variant="outline" size="lg" className="h-11 w-full gap-2 px-8">
          <Link
            href={AppRoutes.AUTH.LOGIN}
            onClick={() => handleOpen("sign-in")}
            aria-busy={opening === "sign-in"}
            className={cn(opening === "sign-in" && "pointer-events-none opacity-70")}
          >
            {opening === "sign-in" ? <LoaderCircle className="animate-spin" /> : <LogIn />}
            {opening === "sign-in" ? "Opening sign in..." : "Sign in to Nexus"}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 w-full gap-2 px-8">
          <Link
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleOpen("source")}
            aria-busy={opening === "source"}
            className={cn(opening === "source" && "pointer-events-none opacity-70")}
          >
            {opening === "source" ? <LoaderCircle className="animate-spin" /> : <Github />}
            {opening === "source" ? "Opening source..." : "View source"}
          </Link>
        </Button>
      </div>
    </section>
  )
}
