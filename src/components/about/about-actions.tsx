import Link from "next/link"
import { Github, LogIn } from "lucide-react"
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
  return (
    <section className={cn("w-full text-center", className)}>
      <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
        <Button asChild variant="outline" size="lg" className="h-11 w-full gap-2 px-8">
          <Link href={AppRoutes.AUTH.LOGIN}>
            <LogIn size={16} />
            Sign in to Nexus
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 w-full gap-2 px-8">
          <Link href={sourceUrl} target="_blank" rel="noopener noreferrer">
            <Github size={16} />
            View source
          </Link>
        </Button>
      </div>
    </section>
  )
}
