'use client'

import { useApp } from '@/contexts/app-context'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Sidebar } from "@/components/sidebar/sidebar"
import { Header } from "@/components/header/header"
import { Footer } from "@/components/footer/footer"
import { DemoBanner } from "@/components/dashboard/demo-banner"
import React from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useApp()
  const { data: session } = useSession()

  const demoEmail = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL
  const isBannerVisible = !!demoEmail && session?.user?.email === demoEmail

  return (
    <div className="min-h-screen bg-background pt-16 flex flex-col">
      <Header />
      <DemoBanner />
      <div className="flex flex-1">
        <Sidebar isBannerVisible={isBannerVisible} />
        <main
          className={cn(
            "flex-1 min-w-0 transition-all duration-300 ease-in-out flex flex-col",
            isCollapsed
              ? "md:ml-16"
              : "md:ml-[180px]"
          )}
        >
          <div className="container mx-auto p-4 md:p-6 flex-1">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
