import * as z from 'zod'

export const createReportSchema = z.object({
  versionLabel: z.coerce.number().int().min(1, "Version label must be at least 1"),
  notes: z.string().trim().min(3, "Notes must be at least 3 characters").max(5000, "Notes must not exceed 5000 characters"),
})

export type CreateReportInput = z.infer<typeof createReportSchema>

export const updateReportSchema = z.object({
  notes: z.string().min(3, "Notes must be at least 3 characters").max(5000, "Notes must not exceed 5000 characters"),
})

export type UpdateReportInput = z.infer<typeof updateReportSchema>
