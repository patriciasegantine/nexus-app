import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'

export function useUser() {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.USER,
    queryFn: () => {
      const storedUser = localStorage.getItem('@nexus:user')
      return storedUser ? JSON.parse(storedUser) : null
    },
    staleTime: Infinity
  })
}
