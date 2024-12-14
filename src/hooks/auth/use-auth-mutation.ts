import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { AUTH_MESSAGES } from "@/constants/messagens";
import { AppRoutes } from "@/constants/routes";
import type { ApiErrorResponse } from "@/types/api";
import { AUTH_ERROR_CODES } from "@/constants/erros";
import { ResetPasswordCredentials } from "@/types/auth";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useLogin() {
  const {toast} = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      if (response.status === 'success') {
        const {user, accessToken} = response.data
        
        localStorage.setItem('@nexus:token', accessToken)
        localStorage.setItem('@nexus:user', JSON.stringify(user))
        
        queryClient.setQueryData(QUERY_KEYS.AUTH.USER, user)
        
        toast({
          title: "Success",
          description: AUTH_MESSAGES.LOGIN_SUCCESS,
        })
        router.push(AppRoutes.DASHBOARD.HOME)
      }
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
      router.push(AppRoutes.AUTH.LOGIN)
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

export function useForgotPassword() {
  const {toast} = useToast()
  const router = useRouter()
  
  return useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast({
        title: "Check your email",
        description: AUTH_MESSAGES.FORGOT_PASSWORD,
      })
      router.push(AppRoutes.AUTH.LOGIN)
    },
    onError: () => {
      toast({
        title: "Check your email",
        description: AUTH_MESSAGES.FORGOT_PASSWORD,
      })
      router.push(AppRoutes.AUTH.LOGIN)
    }
  })
}

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
        description: AUTH_MESSAGES.RESET_PASSWORD_SUCCESS,
      })
      router.push(AppRoutes.AUTH.LOGIN)
    },
    onError: (error: ApiErrorResponse) => {
      let errorMessage = error.message
      
      if (error.code === 'SAME_PASSWORD') {
        errorMessage = AUTH_MESSAGES.SAME_PASSWORD
      } else if (error.code === 'INVALID_TOKEN') {
        errorMessage = AUTH_MESSAGES.INVALID_RESET_LINK
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage || AUTH_MESSAGES.RESET_PASSWORD_FAIL
      })
    }
  })
}

export function useLogout() {
  const {toast} = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => {
      localStorage.removeItem('@nexus:token')
      localStorage.removeItem('@nexus:user')
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.AUTH.USER, null)
      toast({
        title: "Success",
        description: AUTH_MESSAGES.LOGOUT_SUCCESS,
      })
      router.push(AppRoutes.AUTH.LOGIN)
    }
  })
}
