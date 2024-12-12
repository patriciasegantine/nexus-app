import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { AppRoutes } from '@/constants/routes'
import type { ApiErrorResponse } from '@/types/api'
import { ResetPasswordCredentials } from "@/types/auth";

export function useResetPassword() {
  const {toast} = useToast()
  const router = useRouter()
  
  return useMutation({
    mutationFn: async (data: ResetPasswordCredentials) => {
      const response = await authService.resetPassword(data)
      return response
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset successful. You can now login with your new password.",
      })
      router.push(AppRoutes.LOGIN)
    },
    onError: (error: ApiErrorResponse) => {
      let errorMessage = error.message
      
      if (error.code === 'SAME_PASSWORD') {
        errorMessage = "New password must be different from your current password"
      } else if (error.code === 'INVALID_TOKEN') {
        errorMessage = "This reset link is invalid or has expired"
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage || "Failed to reset password. Please try again.",
      })
    }
  })
}
