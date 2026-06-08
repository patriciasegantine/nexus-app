import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200),
  description: z.string().max(1000).optional(),
  projectId: z.string().min(1, "Please select a project"),
})

export type TaskFormValues = z.infer<typeof taskSchema>
