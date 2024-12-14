'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { AppRoutes } from '@/constants/routes'
import { LayoutDashboard, ListTodo, Settings, User } from "lucide-react"

const sidebarItems = [
  {
    title: "Overview",
    href: AppRoutes.DASHBOARD.HOME,
    icon: <LayoutDashboard className="mr-2 h-4 w-4"/>
  },
  {
    title: "Tasks",
    href: AppRoutes.DASHBOARD.TASKS,
    icon: <ListTodo className="mr-2 h-4 w-4"/>
  },
  {
    title: "Profile",
    href: AppRoutes.DASHBOARD.PROFILE,
    icon: <User className="mr-2 h-4 w-4"/>
  },
  {
    title: "Settings",
    href: AppRoutes.DASHBOARD.SETTINGS,
    icon: <Settings className="mr-2 h-4 w-4"/>
  }
]

export function DashboardSidebar() {
  const pathname = usePathname()
  
  return (
    <div className="w-64 border-r bg-muted/10 py-4">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-4 px-4 text-lg font-semibold">
              Navigation
            </h2>
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-muted"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
