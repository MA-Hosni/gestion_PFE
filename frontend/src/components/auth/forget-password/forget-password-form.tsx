import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <Button type="submit">Send Reset Link</Button>
        </Field>
        <Field>
             <Button type="button" variant="outline" className="w-full">
              <ArrowLeft className="mr-2 size-4" /> Back to Login
            </Button>
          </Field>
      </FieldGroup>
    </form>
  )
}
