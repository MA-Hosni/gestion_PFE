import { z } from 'zod';

export const userStorySchema = z.object({
  storyName: z.string().min(3, "Story name must be at least 3 characters long").max(200, "Story name cannot exceed 200 characters"),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").optional(),
  startDate: z.string().min(1, "Start date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["lowest", "low", "medium", "high", "highest"]),
  storyPointEstimate: z.number().int("Must be a whole number").min(0, "Story points must be non-negative"),
}).refine((data) => {
  if (!data.startDate || !data.dueDate) return true;
  return new Date(data.dueDate) > new Date(data.startDate);
}, {
  message: "Due date must be after start date",
  path: ["dueDate"]
});

export type UserStoryFormValues = z.infer<typeof userStorySchema>;
