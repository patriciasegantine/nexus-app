import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { AppRoutes } from '@/constants/routes'
import type { ApiErrorResponse } from '@/types/api'
import { AUTH_MESSAGES } from "@/constants/messagens";

export function useForgotPassword() {
  const {toast} = useToast()
  const router = useRouter()
  
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast({
        title: "Success",
        description: AUTH_MESSAGES.FORGOT_PASSWORD_SUCCESS,
      })
      router.push(AppRoutes.LOGIN)
    },
    onError: (error: ApiErrorResponse) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || AUTH_MESSAGES.FORGOT_PASSWORD_FAIL
      })
    }
  })
}
