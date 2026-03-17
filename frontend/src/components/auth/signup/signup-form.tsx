import { cn } from "@/lib/utils"
import { SignupFormStep1 } from "./signup-step1"
import { SignupFormStep2 } from "./signup-step2"
import { SignupFormStep3 } from "./signup-step3"

interface SignupFormProps extends React.ComponentProps<"div"> {
  currentStep: number
  onStepChange: (step: number) => void
}

export function SignupForm({
  className,
  currentStep,
  onStepChange,
  ...props
}: SignupFormProps) {
  
  const handleNext = () => onStepChange(currentStep + 1)
  const handlePrev = () => onStepChange(currentStep - 1)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Fill in the form below to create your account
        </p>
      </div>
      
      <div className={cn(currentStep === 1 ? "block" : "hidden")}>
        <SignupFormStep1 onNext={handleNext} />
      </div>
      
      <div className={cn(currentStep === 2 ? "block" : "hidden")}>
        <SignupFormStep2 onNext={handleNext} onPrev={handlePrev} />
      </div>

      <div className={cn(currentStep === 3 ? "block" : "hidden")}>
        <SignupFormStep3 onPrev={handlePrev} />
      </div>
    </div>
  )
}
