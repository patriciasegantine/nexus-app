import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error) => {
          // Don't retry on 401/403 errors
          if (error instanceof AxiosError) {
            if (error.response?.status === 401 || error.response?.status === 403) {
              return false
            }
          }
          return failureCount < 2
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
        onError: (error) => {
          // Global error handling for mutations
          console.error('Mutation error:', error)
        },
      },
    },
  })
}
