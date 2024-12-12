import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { AppRoutes } from '@/constants/routes'
import type { ApiErrorResponse } from '@/types/api'
import { AUTH_ERROR_CODES } from "@/constants/erros";
import { AUTH_MESSAGES } from "@/constants/messagens";

export function useRegister() {
  const {toast} = useToast()
  const router = useRouter()
  
  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast({
        title: "Success",
        description: AUTH_MESSAGES.REGISTER_SUCCESS,
      })
      router.push(AppRoutes.LOGIN)
    },
    onError: (error: ApiErrorResponse) => {
      let errorMessage = error.message
      
      if (error.code === AUTH_ERROR_CODES.USER_ALREADY_EXISTS) {
        errorMessage = AUTH_MESSAGES.USER_ALREADY_EXISTS
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    }
  })
}
