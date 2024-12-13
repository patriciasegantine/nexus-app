'use client'

import React from "react";
import { useAuth } from '@/hooks/auth/use-auth'
import { LoadingPage } from '@/components/loading-page'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({
                                 children,
                                 requireAuth = true
                               }: ProtectedRouteProps) {
  const {isLoading} = useAuth(requireAuth)
  
  if (isLoading) {
    return <LoadingPage/>
  }
  
  return <>{children}</>
}
