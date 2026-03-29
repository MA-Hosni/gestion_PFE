import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { ArrowLeft, CheckIcon, Eye, EyeOffIcon, XIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"

import type { SignupValues } from "@/validation/signup-validation"

interface SignupFormStep3Props {
  onPrev: () => void
  onSubmitClick: (e?: React.BaseSyntheticEvent) => Promise<void>
}

const requirements = [
  { regex: /^.{8,}$/, text: "At least 8 characters" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[\W_]/, text: "At least 1 special character" },
]

export function SignupFormStep3({ onPrev, onSubmitClick }: SignupFormStep3Props) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext<SignupValues>()

  const password = useWatch({ name: "password" }) ?? ""

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  const strength = useMemo(
    () =>
      requirements.map((req) => ({
        met: req.regex.test(password),
        text: req.text,
      })),
    [password],
  )

  const strengthScore = useMemo(
    () => strength.filter((req) => req.met).length,
    [strength],
  )

  const getColor = (score: number) => {
    if (score === 0) return "bg-border"
    if (score <= 1) return "bg-destructive"
    if (score <= 2) return "bg-orange-500"
    if (score <= 3) return "bg-amber-500"
    if (score === 4) return "bg-yellow-400"
    return "bg-green-500"
  }

  const getText = (score: number) => {
    if (score === 0) return "Enter a password"
    if (score <= 2) return "Weak password"
    if (score <= 3) return "Medium password"
    if (score === 4) return "Strong password"
    return "Very strong password"
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <InputGroup>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputGroupInput
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...field}
                />
              )}
            />
            <InputGroupAddon
              align="inline-end"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="cursor-pointer"
            >
              {isPasswordVisible ? <Eye /> : <EyeOffIcon />}
            </InputGroupAddon>
          </InputGroup>
          {errors.password?.message ? (
            <FieldError>{errors.password.message}</FieldError>
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
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  {...field}
                />
              )}
            />
            <InputGroupAddon
              align="inline-end"
              onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
              className="cursor-pointer"
            >
              {isConfirmPasswordVisible ? <Eye /> : <EyeOffIcon />}
            </InputGroupAddon>
          </InputGroup>
          {errors.confirmPassword?.message ? (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          ) : null}
        </Field>

        <div className="mb-4 flex h-1 w-full gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-full flex-1 rounded-full transition-all duration-500 ease-out",
                index < strengthScore ? getColor(strengthScore) : "bg-border",
              )}
            />
          ))}
        </div>

        <p className="text-foreground text-sm font-medium">
          {getText(strengthScore)}. Must contain :
        </p>

        <ul className="mb-4 space-y-1.5">
          {strength.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              {req.met ? (
                <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
              ) : (
                <XIcon className="text-muted-foreground size-4" />
              )}
              <span
                className={cn(
                  "text-xs",
                  req.met
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground",
                )}
              >
                {req.text}
                <span className="sr-only">
                  {req.met ? " - Requirement met" : " - Requirement not met"}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-4">
          <Field>
            <Button type="button" onClick={onSubmitClick} className="w-full" disabled={isSubmitting}>
              Create Account
            </Button>
          </Field>
          <Field>
            <Button
              type="button"
              variant="outline"
              onClick={onPrev}
              className="w-full"
            >
              <ArrowLeft className="mr-2 size-4" /> Back
            </Button>
          </Field>
        </div>

        <Field>
          <FieldDescription className="px-6 text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}