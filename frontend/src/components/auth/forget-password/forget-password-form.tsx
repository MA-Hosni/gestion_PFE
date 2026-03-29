import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import * as authApi from "@/services/auth/auth-api"

const forgetPasswordSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .min(1, "Email is required"),
})

type ForgetPasswordValues = z.infer<typeof forgetPasswordSchema>

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordValues>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await authApi.requestPasswordReset(values.email)
      toast.success(res.message)
      navigate("/login")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed"
      toast.error(message)
    }
  })

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={onSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email and we&apos;ll send you instructions to reset your
            password
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email?.message ? (
            <FieldError>{errors.email.message}</FieldError>
          ) : null}
        </Field>
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </Field>
        <Field>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft className="mr-2 size-4" /> Back to Login
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
