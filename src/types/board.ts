import { Task } from "@/types/task";
import { WorkItem } from "@/types/work-item";

export interface BoardColumn {
  id: string
  title: string
  tasks: Task[]
}

export interface Board {
  workItems: WorkItem[]
  columns: {
    [key: string]: BoardColumn
  }
}
