import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { AppRoutes } from '@/constants/routes'
import type { ApiErrorResponse } from '@/types/api'
import { AUTH_ERROR_CODES } from "@/constants/erros";
import { AUTH_MESSAGES } from "@/constants/messagens";

export function useLogin() {
  const {toast} = useToast()
  const router = useRouter()
  
  return useMutation({
    mutationFn: authService.login,
    
    onSuccess: () => {
      toast({
        title: "Success",
        description: AUTH_MESSAGES.LOGIN_SUCCESS,
      })
      router.push(AppRoutes.HOME)
    },
    onError: (error: ApiErrorResponse) => {
      let errorMessage = error.message
      
      if (error.code === AUTH_ERROR_CODES.INVALID_CREDENTIALS) {
        errorMessage = AUTH_MESSAGES.INVALID_CREDENTIALS
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    }
  })
}
