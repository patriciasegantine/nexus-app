import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ApiErrorResponse, ApiSuccessResponse } from './api'

export type QueryConfig<TData, TError = ApiErrorResponse> = Omit<
  UseQueryOptions<TData, TError>,
  'queryKey' | 'queryFn'
>

export type MutationConfig<TData, TVariables, TError = ApiErrorResponse> = Omit<
  UseMutationOptions<ApiSuccessResponse<TData>, TError, TVariables>,
  'mutationFn'
>

export interface QueryData<T> {
  data: T
  isLoading: boolean
  isError: boolean
  error: AxiosError<ApiErrorResponse> | null
}
