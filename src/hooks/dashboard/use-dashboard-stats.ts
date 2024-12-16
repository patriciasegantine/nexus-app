import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import type { Activity, BurndownData, DashboardStats, TeamMember, VelocityData } from '@/types/dashboard'

// Mock data
const mockStats: DashboardStats = {
  totalWorkItems: 45,
  todo: 5,
  inProgress: 12,
  completed: 28,
  completionRate: 62,
  byPriority: {
    'HIGH': 10,
    'MEDIUM': 20,
    'LOW': 15
  },
  byStatus: {
    'TODO': 5,
    'IN_PROGRESS': 12,
    'DONE': 28
  },
  byAssignee: {
    'John Doe': 15,
    'Jane Smith': 18,
    'Bob Johnson': 12
  }
}

const mockTeam: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    completedTasks: 15,
    totalTasks: 20
  },
  {
    id: '2',
    name: 'Jane Smith',
    completedTasks: 18,
    totalTasks: 22
  },
  {
    id: '3',
    name: 'Bob Johnson',
    completedTasks: 12,
    totalTasks: 15
  }
]

const mockActivities: Activity[] = [
  {
    id: '1',
    user: {name: 'John Doe'},
    action: 'completed',
    target: 'Setup Authentication',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: '2',
    user: {name: 'Jane Smith'},
    action: 'started',
    target: 'Implement Dashboard',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: '3',
    user: {name: 'Bob Johnson'},
    action: 'updated',
    target: 'Fix Login Bug',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  }
]

const mockVelocity: VelocityData[] = [
  {sprint: 'Sprint 1', planned: 20, completed: 18},
  {sprint: 'Sprint 2', planned: 22, completed: 20},
  {sprint: 'Sprint 3', planned: 18, completed: 18},
  {sprint: 'Sprint 4', planned: 24, completed: 21}
]

const mockBurndown: BurndownData[] = [
  {date: '01/03', remaining: 20, ideal: 20},
  {date: '02/03', remaining: 18, ideal: 17},
  {date: '03/03', remaining: 15, ideal: 14},
  {date: '04/03', remaining: 12, ideal: 11},
  {date: '05/03', remaining: 8, ideal: 8},
  {date: '06/03', remaining: 5, ideal: 5},
  {date: '07/03', remaining: 3, ideal: 2}
]

export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.STATS,
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockStats
    }
  })
}

export function useTeamProgress() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.TEAM_PROGRESS,
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockTeam
    }
  })
}

export function useActivities() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.ACTIVITIES,
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockActivities
    }
  })
}

export function useVelocity() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.VELOCITY,
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockVelocity
    }
  })
}

export function useBurndown() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.BURNDOWN,
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockBurndown
    }
  })
}
