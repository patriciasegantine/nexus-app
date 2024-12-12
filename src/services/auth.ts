import { api } from './api'
import { API_ROUTES } from '@/constants/api'
import type {
  AuthResponse,
  ForgotPasswordCredentials,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials
} from '@/types/auth'
import type { ApiResponse } from '@/types/api'
import axios from 'axios'
import { AppRoutes } from "@/constants/routes";

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        API_ROUTES.AUTH.LOGIN,
        credentials
      )
      
      if (response.data.status === 'error') {
        throw response.data
      }
      
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw error.response.data
      }
      throw {
        status: 'error',
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      }
    }
  },
  
  async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post(API_ROUTES.AUTH.REGISTER, credentials)
    return response.data
  },
  
  async forgotPassword(credentials: ForgotPasswordCredentials): Promise<ApiResponse<void>> {
    const response = await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, {
      ...credentials,
      redirectTo: AppRoutes.RESET_PASSWORD,
      baseUrl: window.location.origin
    })
    
    return response.data
  },
  
  async resetPassword(credentials: ResetPasswordCredentials): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>(
        API_ROUTES.AUTH.RESET_PASSWORD,
        credentials
      )
      
      if (response.data.status === 'error') {
        throw response.data
      }
      
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw error.response.data
      }
      throw {
        status: 'error',
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      }
    }
  },
  
  logout() {
    localStorage.removeItem('@nexus:token')
    localStorage.removeItem('@nexus:user')
  }
}
