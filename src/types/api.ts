export interface ApiSuccessResponse<T> {
  status: 'success'
  data: T
  message?: string
}

export interface ApiErrorResponse {
  status: 'error'
  message: string
  code: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
