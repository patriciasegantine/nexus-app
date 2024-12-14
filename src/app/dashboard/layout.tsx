'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import React from "react";

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-background">
        <DashboardSidebar/>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
