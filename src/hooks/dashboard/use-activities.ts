import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'

interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target: string
  createdAt: string
}

const fetchActivities = async (): Promise<Activity[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return [
    {
      id: '1',
      user: {
        name: 'John Doe',
      },
      action: 'completed',
      target: 'Setup Authentication',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      user: {
        name: 'Jane Smith',
      },
      action: 'moved',
      target: 'Implement Dashboard',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: '3',
      user: {
        name: 'Bob Johnson',
      },
      action: 'created',
      target: 'New Feature Request',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ]
}

export function useActivities() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.ACTIVITIES,
    queryFn: fetchActivities
  })
}
