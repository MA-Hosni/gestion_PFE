import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title cannot exceed 200 characters"),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").optional(),
  status: z.enum(["ToDo", "InProgress", "Standby", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  assignedTo: z.string().min(1, "Assignee is required"),
})

export type TaskFormValues = z.infer<typeof taskSchema>
