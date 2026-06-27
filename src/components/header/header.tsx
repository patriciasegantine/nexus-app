'use client'

import Link from "next/link"
import { useSession } from "next-auth/react"
import { AppRoutes } from "@/constants/routes"
import { UserNav } from "@/components/header/user-nav"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { CollapseToggle } from "@/components/sidebar/collapse-toggle"
import { cn } from "@/lib/utils"
import { BrandMark } from "@/components/brand/brand-mark"

export function Header() {
  const { data: session, status } = useSession()
  const { isCollapsed, toggleSidebar, toggleMobileSidebar } = useApp()

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 h-16 border-b border-border bg-chrome text-foreground z-40",
        "after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:content-['']",
        "after:shadow-[0_4px_16px_0px_rgb(15_23_42/0.06)] dark:after:shadow-[0_4px_12px_1px_rgb(0_0_0/0.35)]",
        isCollapsed ? "md:after:left-16" : "md:after:left-[180px]"
      )}
    >
      <div className="h-full px-4 md:pl-0 md:pr-6 flex items-center justify-between gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 mr-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
            onClick={toggleMobileSidebar}
            aria-label="Open sidebar menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="hidden w-16 shrink-0 items-center justify-center md:flex">
            <CollapseToggle
              isCollapsed={isCollapsed}
              onToggle={toggleSidebar}
            />
          </div>
          <div className="hidden h-6 w-px bg-border md:block" />
          <Link href={AppRoutes.DASHBOARD.HOME} className="flex items-center gap-2 md:ml-3">
            <BrandMark />
          </Link>
        </div>

        {status === 'loading' && (
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        )}
        {status === 'authenticated' && session?.user && (
          <div className="flex items-center gap-1">
            <ThemeToggle className="text-muted-foreground hover:bg-secondary hover:text-foreground" />
            <UserNav user={session.user} />
          </div>
        )}
      </div>
    </header>
  )
}
