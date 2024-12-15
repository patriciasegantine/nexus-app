import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'

interface DashboardStats {
  totalWorkItems: number
  inProgress: number
  completed: number
  completionRate: number
  byStatus: Record<string, number>
  byAssignee: Record<string, number>
}

// mock data
const fetchStats = async (): Promise<DashboardStats> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    totalWorkItems: 24,
    inProgress: 8,
    completed: 12,
    completionRate: 50,
    byStatus: {
      'TODO': 4,
      'IN_PROGRESS': 8,
      'DONE': 12
    },
    byAssignee: {
      'John Doe': 5,
      'Jane Smith': 8,
      'Bob Johnson': 11
    }
  }
}

export function useStats() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.STATS,
    queryFn: fetchStats
  })
}
