import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import { useFormContext } from "react-hook-form"

import type { SignupValues } from "@/lib/validation/signup-validation"

interface SignupFormStep1Props {
  onNext: () => void
}

export function SignupFormStep1({ onNext }: SignupFormStep1Props) {
  const {
    register,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SignupValues>()

  const role = watch("role")

  const handleNext = async () => {
    const ok = await trigger(["fullName", "email", "phoneNumber", "role"])
    if (ok) onNext()
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName?.message ? (
            <FieldError>{errors.fullName.message}</FieldError>
          ) : null}
        </Field>
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
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="phoneNumber">Phone</FieldLabel>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="(+216) 12 345 678"
              autoComplete="tel"
              aria-invalid={!!errors.phoneNumber}
              {...register("phoneNumber")}
            />
            {errors.phoneNumber?.message ? (
              <FieldError>{errors.phoneNumber.message}</FieldError>
            ) : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <Select
              value={role}
              onValueChange={(v) =>
                setValue("role", v as SignupValues["role"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="UniSupervisor">University Supervisor</SelectItem>
                <SelectItem value="CompSupervisor">Company Supervisor</SelectItem>
              </SelectContent>
            </Select>
            {errors.role?.message ? (
              <FieldError>{errors.role.message}</FieldError>
            ) : null}
          </Field>
        </div>
        <Field>
          <Button type="button" className="w-full" onClick={handleNext}>
            Next <ArrowRight className="ml-2 size-4" />
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center mt-4">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
)}