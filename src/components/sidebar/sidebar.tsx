'use client'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useApp } from '@/contexts/app-context'
import { SIDEBAR_CONFIG } from './config'
import { NavigationSection } from './navigation-section'

// banner: py-3 (24px) + text-sm line-height (~20px) = 44px
const DESKTOP_TOP_DEFAULT = SIDEBAR_CONFIG.TOP_OFFSET
const DESKTOP_TOP_BANNER = 'top-[108px]'
const DESKTOP_HEIGHT_DEFAULT = SIDEBAR_CONFIG.HEIGHT
const DESKTOP_HEIGHT_BANNER = 'h-[calc(100vh-108px)]'

interface SidebarProps {
  isBannerVisible?: boolean
}

export function Sidebar({ isBannerVisible = false }: SidebarProps) {
  const pathname = usePathname()
  const { isCollapsed, isMobileSidebarOpen, closeMobileSidebar } = useApp()

  const sidebarWidth = isCollapsed ? SIDEBAR_CONFIG.COLLAPSED_WIDTH : SIDEBAR_CONFIG.EXPANDED_WIDTH
  const desktopTop = isBannerVisible ? DESKTOP_TOP_BANNER : DESKTOP_TOP_DEFAULT
  const desktopHeight = isBannerVisible ? DESKTOP_HEIGHT_BANNER : DESKTOP_HEIGHT_DEFAULT

  return (
    <>
      {/* Mobile overlay */}
      <button
        type="button"
        className={cn(
          'fixed inset-0 top-16 z-30 bg-black/40 backdrop-blur-[1px] md:hidden',
          'transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMobileSidebar}
        aria-label="Close sidebar"
      />

      {/* Mobile sidebar */}
      <div
        className={cn(
          `fixed ${SIDEBAR_CONFIG.TOP_OFFSET} left-0 ${SIDEBAR_CONFIG.HEIGHT} border-r border-border bg-chrome text-foreground shadow-[10px_0_28px_-18px_rgb(15_23_42/0.08)] dark:shadow-[4px_0_12px_-8px_rgb(0_0_0/0.5)] z-40`,
          'w-64 md:hidden overflow-hidden will-change-transform',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavigationSection pathname={pathname} isCollapsed={false} onItemSelect={closeMobileSidebar} />
      </div>

      {/* Desktop sidebar */}
      <div
        suppressHydrationWarning
        className={cn(
          `fixed ${desktopTop} left-0 ${desktopHeight} border-r border-border bg-chrome text-foreground shadow-[10px_0_28px_-18px_rgb(15_23_42/0.08)] dark:shadow-[4px_0_12px_-8px_rgb(0_0_0/0.5)]`,
          'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex flex-col hidden overflow-hidden',
          sidebarWidth
        )}
      >
        <NavigationSection pathname={pathname} isCollapsed={isCollapsed} />
      </div>
    </>
  )
}
