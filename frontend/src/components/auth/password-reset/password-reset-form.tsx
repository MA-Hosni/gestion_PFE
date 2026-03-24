import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Eye, EyeOffIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import * as authApi from "@/services/auth/auth-api"

const passwordPattern = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$",
)

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .regex(
        passwordPattern,
        "Password must contain lowercase, uppercase, number, special character, and be at least 8 characters long",
      ),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      })
    }
  })

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const resetToken = searchParams.get("resetToken")

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  const onSubmit = handleSubmit(async (values) => {
    if (!resetToken) {
      toast.error("Reset token is missing or invalid")
      return
    }

    try {
      const res = await authApi.resetPassword(resetToken, values.newPassword)
      toast.success(res.message)
      navigate("/login")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Reset failed"
      toast.error(message)
    }
  })

  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
          <InputGroup>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <InputGroupInput
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.newPassword}
                  {...field}
                />
              )}
            />
            <InputGroupAddon
              align="inline-end"
              onClick={() => setShowPassword((prev) => !prev)}
              className="cursor-pointer"
            >
              {showPassword ? <Eye /> : <EyeOffIcon />}
            </InputGroupAddon>
          </InputGroup>
          {errors.newPassword?.message ? (
            <FieldError>{errors.newPassword.message}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <InputGroup>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <InputGroupInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  {...field}
                />
              )}
            />
            <InputGroupAddon
              align="inline-end"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="cursor-pointer"
            >
              {showConfirmPassword ? <Eye /> : <EyeOffIcon />}
            </InputGroupAddon>
          </InputGroup>
          {errors.confirmPassword?.message ? (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          ) : null}
        </Field>

        <div className="grid grid-cols-1 gap-4">
          <Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Set New Password"}
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  )
}

export default ResetPasswordForm
