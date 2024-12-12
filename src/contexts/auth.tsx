'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth'
import { AppRoutes } from '@/constants/routes'
import type { LoginCredentials, RegisterCredentials, User } from '@/types/auth'

interface AuthContextData {
  user: User | null
  isAuthenticated: boolean
  signIn: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: RegisterCredentials) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({children}: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('@nexus:user')
      return storedUser ? JSON.parse(storedUser) : null
    }
    return null
  })
  
  const signIn = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      const {user, token} = response.data
      
      localStorage.setItem('@nexus:token', token)
      localStorage.setItem('@nexus:user', JSON.stringify(user))
      
      setUser(user)
      router.push(AppRoutes.HOME)
    } catch (error) {
      throw error
    }
  }, [router])
  
  const signUp = useCallback(async (credentials: RegisterCredentials) => {
    try {
      const response = await authService.register(credentials)
      const {user, token} = response.data
      
      localStorage.setItem('@nexus:token', token)
      localStorage.setItem('@nexus:user', JSON.stringify(user))
      
      setUser(user)
      router.push(AppRoutes.HOME)
    } catch (error) {
      throw error
    }
  }, [router])
  
  const signOut = useCallback(() => {
    authService.logout()
    setUser(null)
    router.push(AppRoutes.LOGIN)
  }, [router])
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
