import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

export type LoginValues = z.infer<typeof loginSchema>