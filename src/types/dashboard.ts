export interface DashboardStats {
  totalWorkItems: number
  todo: number
  inProgress: number
  completed: number
  completionRate: number
  byStatus: Record<string, number>
  byAssignee: Record<string, number>
  byPriority: Record<string, number>
}

export interface TeamMember {
  id: string
  name: string
  avatar?: string
  completedTasks: number
  totalTasks: number
}

export interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target: string
  createdAt: string
}

export interface VelocityData {
  sprint: string
  planned: number
  completed: number
}

export interface BurndownData {
  date: string
  remaining: number
  ideal: number
}
