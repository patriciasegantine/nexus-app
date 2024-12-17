import { Task } from "@/types/task";

export type WorkItemStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type WorkItemPriority = 'LOW' | 'MEDIUM' | 'HIGH'
export type WorkItemType = 'FEATURE' | 'BUG' | 'TASK' | 'IDEA'

export interface WorkItem {
  id: string
  title: string
  description: string
  type: WorkItemType
  status?: WorkItemStatus
  priority: WorkItemPriority
  tasks: Task[]
  assignee?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  createdAt?: string
  updatedAt?: string
  dueDate?: string
  tags?: string[]
}

export interface CreateWorkItemDTO {
  title: string
  description: string
  priority: WorkItemPriority
  assigneeId?: string
  dueDate?: string
  tags?: string[]
}

export interface UpdateWorkItemDTO extends Partial<CreateWorkItemDTO> {
  status?: WorkItemStatus
}
