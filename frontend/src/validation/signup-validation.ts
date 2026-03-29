import { z } from "zod"

const phoneNumberPattern = /^(\+216|216)?[0-9]{8}$|^(\+216|00216|216)?\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{3}$/

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

const objectIdPattern = /^[0-9a-fA-F]{24}$/

const degreeTypeByDegree: Record<
  "Engineer" | "Master" | "Bachelor",
  string[]
> = {
  Engineer: ["INLOG", "INREV"],
  Master: ["Pro IM", "Pro DCA", "Pro PAR", "R DISR", "R TMAC"],
  Bachelor: ["AV", "CMM", "IMM", "BD", "MIME", "Coco-JV", "Coco-3D"],
}

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters long")
      .max(60, "Full name cannot exceed 60 characters"),
    phoneNumber: z.string().regex(
      phoneNumberPattern,
      "Phone number must be a valid Tunisian number (8 digits or formatted)",
    ),
    email: z.string().email("Please provide a valid email address"),

    role: z.enum(["Student", "CompSupervisor", "UniSupervisor"]),

    password: z
      .string()
      .regex(
        passwordPattern,
        "Password must contain lowercase, uppercase, number, special character, and be at least 8 characters long",
      ),
    confirmPassword: z.string(),

    cin: z.string().regex(/^\d{8}$/, "CIN must be exactly 8 digits").optional(),
    studentIdCardIMG: z.string().optional(),
    degree: z.enum(["Bachelor", "Master", "Engineer"]).optional(),
    degreeType: z.string().optional(),
    uniSupervisorId: z
      .string()
      .regex(objectIdPattern, "University supervisor ID is invalid")
      .optional(),
    compSupervisorId: z
      .string()
      .regex(objectIdPattern, "Company supervisor ID is invalid")
      .optional(),
    companyName: z.string().optional(),

    badgeIMG: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      })
    }

    if (data.role === "Student") {
      if (!data.cin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cin"],
          message: "ID card number is required",
        })
      }
      if (!data.studentIdCardIMG) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["studentIdCardIMG"],
          message: "student university card image is required",
        })
      }
      if (!data.degree) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["degree"],
          message: "Degree is required",
        })
      }
      if (!data.degreeType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["degreeType"],
          message: "Degree type is required",
        })
      }

      if (data.degree && data.degreeType) {
        const allowed = degreeTypeByDegree[data.degree]
        if (!allowed.includes(data.degreeType)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["degreeType"],
            message: `Invalid degree type for ${data.degree}`,
          })
        }
      }

      if (!data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: "Company of internship is required",
        })
      }

      if (!data.uniSupervisorId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["uniSupervisorId"],
          message: "University supervisor ID is required",
        })
      }

      if (!data.compSupervisorId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["compSupervisorId"],
          message: "Company supervisor ID is required",
        })
      }
    }

    if (data.role === "CompSupervisor") {
      if (!data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: "Company name is required",
        })
      }
      if (!data.badgeIMG) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["badgeIMG"],
          message: "Working badge image is required",
        })
      }
    }

    if (data.role === "UniSupervisor") {
      if (!data.badgeIMG) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["badgeIMG"],
          message: "University badge image is required",
        })
      }
    }
  })

export type SignupValues = z.infer<typeof signupSchema>