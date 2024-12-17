export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  workItemId: string,
  description: string
  priority: TaskPriority
  assignee: {
    avatar: string,
    name: string,
  }
}
