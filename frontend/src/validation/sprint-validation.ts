import { z } from 'zod';

export const sprintSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").max(150, "Title cannot exceed 150 characters"),
  goal: z.string().min(3, "Goal must be at least 3 characters long").max(1000, "Goal cannot exceed 1000 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine((data) => {
  if (!data.startDate || !data.endDate) return true;
  return new Date(data.endDate) >= new Date(data.startDate);
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"]
});

export type SprintFormValues = z.infer<typeof sprintSchema>;