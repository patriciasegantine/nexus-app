import { ProtectedRoute } from '@/components/auth/protected-route'
import React from "react";

export default function AuthLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireAuth={false}>
      {children}
    </ProtectedRoute>
  )
}
