'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { AppRoutes } from '@/constants/routes'
import { ChevronLeft, KanbanSquare, LayoutDashboard, ListTodo, Settings, User } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useApp } from "@/contexts/app-context"

const sidebarItems = [
  {
    title: "Overview",
    href: AppRoutes.DASHBOARD.HOME,
    icon: <LayoutDashboard className="h-4 w-4"/>
  },
  
  {
    title: "Board",
    href: AppRoutes.DASHBOARD.BOARD,
    icon: <KanbanSquare className="h-4 w-4"/>
  },
  {
    title: "Work Items",
    href: AppRoutes.DASHBOARD.WORK_ITEMS,
    icon: <ListTodo className="h-4 w-4"/>
  },
  {
    title: "Profile",
    href: AppRoutes.DASHBOARD.PROFILE,
    icon: <User className="h-4 w-4"/>
  },
  {
    title: "Settings",
    href: AppRoutes.DASHBOARD.SETTINGS,
    icon: <Settings className="h-4 w-4"/>
  }
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const {isCollapsed, toggleSidebar} = useApp()
  
  return (
    <div
      className={cn("fixed top-[64px] left-0 h-[calc(100vh-64px)] border-r bg-background",
        "transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-[70px]" : "w-64"
      )}
    >
      {/* Main Content */}
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <TooltipProvider key={item.href} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          pathname === item.href && "bg-muted",
                          isCollapsed && "justify-center px-2"
                        )}
                      >
                        <span className={cn(
                          "flex items-center",
                          !isCollapsed && "mr-2"
                        )}>
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <span>{item.title}</span>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="pointer-events-none">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="p-1 border-t">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full flex items-center justify-center",
                  "transition-all duration-300 ease-in-out"
                )}
                onClick={toggleSidebar}
              >
                <ChevronLeft
                  className={cn("h-4 w-4 transition-transform",
                    isCollapsed && "rotate-180"
                  )}
                />
                {!isCollapsed && (
                  <span className="ml-2">Collapse sidebar</span>
                )}
              </Button>
            </TooltipTrigger>
            
            {isCollapsed && (
              <TooltipContent side="right" className="pointer-events-none">
                Expand sidebar
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
