import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Eye, EyeOffIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { useState } from "react"

const ResetPasswordForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic here
    console.log("Account created")
  }
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
                <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    required
                />
                <InputGroupAddon align="inline-end" onClick={() => setShowPassword((prev) => !prev)} className="cursor-pointer">
                {showPassword ? <Eye /> : <EyeOffIcon />}
                </InputGroupAddon>
            </InputGroup>
          <FieldDescription>
          Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <InputGroup>
                <InputGroupInput
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    required
                />
                <InputGroupAddon align="inline-end" onClick={() => setShowConfirmPassword((prev) => !prev)} className="cursor-pointer">
                {showConfirmPassword ? <Eye /> : <EyeOffIcon />}
                </InputGroupAddon>
            </InputGroup>
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <div className="grid grid-cols-1 gap-4">
          <Field>
            <Button type="submit" className="w-full">Set New Password</Button>
          </Field>
        </div>
      </FieldGroup>
    </form>
  )
}

export default ResetPasswordForm
