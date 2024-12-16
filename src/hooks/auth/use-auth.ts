import { useUser } from './use-user'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppRoutes } from '@/constants/routes'

export function useAuth(requireAuth: boolean = true) {
  const {data: user, isLoading} = useUser()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    if (isLoading) return
    
    const authRoutes = [
      AppRoutes.AUTH.LOGIN,
      AppRoutes.AUTH.REGISTER,
      AppRoutes.AUTH.FORGOT_PASSWORD,
      AppRoutes.AUTH.RESET_PASSWORD,
    ]
    
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
    
    if (requireAuth && !user && !isAuthRoute) {
      router.push(AppRoutes.AUTH.LOGIN)
    }
    
    if (!requireAuth && user && isAuthRoute) {
      router.push(AppRoutes.DASHBOARD.HOME)
    }
  }, [user, isLoading, pathname, requireAuth, router])
  
  return {user, isLoading}
}
