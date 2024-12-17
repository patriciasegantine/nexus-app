'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { useApp } from '@/contexts/app-context'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import React from "react";

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode
}) {
  const {isCollapsed} = useApp()
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background mt-8">
        <div className="flex">
          <DashboardSidebar/>
          <main
            className={cn(
              "flex-1 transition-all duration-300 ease-in-out",
              isCollapsed
                ? "ml-[70px] w-[calc(100%-70px)]"
                : "ml-64 w-[calc(100%-256px)]"
            )}
          >
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
