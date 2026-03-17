import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { ArrowLeft, CheckIcon, Eye, EyeOffIcon, XIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { useMemo, useState } from "react"

interface SignupFormStep3Props extends React.ComponentProps<"form"> {
  onPrev: () => void
}

const requirements = [
  { regex: /.{12,}/, text: 'At least 12 characters' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  {
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
    text: 'At least 1 special character'
  }
]

export function SignupFormStep3({
  className,
  onPrev,
  ...props
}: SignupFormStep3Props) {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Submit logic here
        console.log("Account created")
    }

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
    const [password, setPassword] = useState('')

    const strength = requirements.map(req => ({
        met: req.regex.test(password),
        text: req.text
    }))

    const strengthScore = useMemo(() => {
        return strength.filter(req => req.met).length
    }, [strength])

    const getColor = (score: number) => {
        if (score === 0) return 'bg-border'
        if (score <= 1) return 'bg-destructive'
        if (score <= 2) return 'bg-orange-500 '
        if (score <= 3) return 'bg-amber-500'
        if (score === 4) return 'bg-yellow-400'

        return 'bg-green-500'
    }

    const getText = (score: number) => {
        if (score === 0) return 'Enter a password'
        if (score <= 2) return 'Weak password'
        if (score <= 3) return 'Medium password'
        if (score === 4) return 'Strong password'

        return 'Very strong password'
    }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
                <InputGroupInput
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <InputGroupAddon align="inline-end" onClick={() => setIsPasswordVisible((prev) => !prev)} className="cursor-pointer">
                {isPasswordVisible ? <Eye /> : <EyeOffIcon />}
                </InputGroupAddon>
            </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <InputGroup>
                <InputGroupInput
                    id="confirm-password"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirm password"
                    required
                />
                <InputGroupAddon align="inline-end" onClick={() => setIsConfirmPasswordVisible((prev) => !prev)} className="cursor-pointer">
                {isConfirmPasswordVisible ? <Eye /> : <EyeOffIcon />}
                </InputGroupAddon>
            </InputGroup>
        </Field>

        <div className='mb-4 flex h-1 w-full gap-1'>
            {Array.from({ length: 5 }).map((_, index) => (
            <span
                key={index}
                className={cn(
                'h-full flex-1 rounded-full transition-all duration-500 ease-out',
                index < strengthScore ? getColor(strengthScore) : 'bg-border'
                )}
            />
            ))}
        </div>

        <p className='text-foreground text-sm font-medium'>{getText(strengthScore)}. Must contain :</p>

        <ul className='mb-4 space-y-1.5'>
            {strength.map((req, index) => (
            <li key={index} className='flex items-center gap-2'>
                {req.met ? (
                <CheckIcon className='size-4 text-green-600 dark:text-green-400' />
                ) : (
                <XIcon className='text-muted-foreground size-4' />
                )}
                <span
                className={cn('text-xs', req.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground')}
                >
                {req.text}
                <span className='sr-only'>{req.met ? ' - Requirement met' : ' - Requirement not met'}</span>
                </span>
            </li>
            ))}
        </ul>

        <div className="grid grid-cols-1 gap-4">
          <Field>
            <Button type="submit" className="w-full">Create Account</Button>
          </Field>
          <Field>
             <Button type="button" variant="outline" onClick={onPrev} className="w-full">
              <ArrowLeft className="mr-2 size-4" /> Back
            </Button>
          </Field>
        </div>
        <Field>
          <FieldDescription className="px-6 text-center mt-4">
            Already have an account? <a href="/sign-in" className="text-primary hover:underline">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
)}