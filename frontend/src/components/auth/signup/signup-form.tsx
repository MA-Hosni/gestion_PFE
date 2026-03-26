import { cn } from "@/lib/utils"
import { SignupFormStep1 } from "./signup-step1"
import { SignupFormStep2 } from "./signup-step2"
import { SignupFormStep3 } from "./signup-step3"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { FieldError } from "@/components/ui/field"

import * as authApi from "@/services/auth/auth-api"
import { signupSchema, type SignupValues } from "@/validation/signup-validation"

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
  const navigate = useNavigate()

  const methods = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      role: "Student",
      password: "",
      confirmPassword: "",
      degree: "Bachelor",
      cin: undefined,
      studentIdCardIMG: undefined,
      degreeType: undefined,
      companyName: undefined,
      uniSupervisorId: undefined,
      compSupervisorId: undefined,
      badgeIMG: undefined,
    },
  })

  const handlePrev = () => onStepChange(currentStep - 1)
  const handleNext = () => {
    methods.clearErrors("root")
    onStepChange(currentStep + 1)
  }

  const onSubmit = methods.handleSubmit(
    async (values) => {
      methods.clearErrors("root")

      try {
        if (values.role === "Student") {
          const response = await authApi.signupStudent({
            role: "Student",
            fullName: values.fullName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
            cin: values.cin!,
            studentIdCardIMG: values.studentIdCardIMG!,
            degree: values.degree!,
            degreeType: values.degreeType!,
            companyName: values.companyName!,
            uniSupervisorId: values.uniSupervisorId!,
            compSupervisorId: values.compSupervisorId!,
          })
          toast.success(response.message)
        } else if (values.role === "CompSupervisor") {
          const response = await authApi.signupCompanySupervisor({
            role: "CompSupervisor",
            fullName: values.fullName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
            companyName: values.companyName!,
            badgeIMG: values.badgeIMG!,
          })
          toast.success(response.message)
        } else {
          const response = await authApi.signupUniversitySupervisor({
            role: "UniSupervisor",
            fullName: values.fullName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
            badgeIMG: values.badgeIMG!,
          })
          toast.success(response.message)
        }

        navigate("/verify-email")
        onStepChange(1)
        methods.reset()
      } catch (err) {
        const message = err instanceof Error ? err.message : "Signup failed"
        methods.setError("root", { type: "server", message })
        toast.error(message)
      }
    },
    (errors) => {
      console.log("Validation Errors:", errors)
      // If there are errors on steps other than 3, we should let the user know
      const errorKeys = Object.keys(errors)
      if (errorKeys.length > 0) {
        toast.error(`Validation error in fields: ${errorKeys.join(", ")}`)
      }
    }
  )

  return (
    <FormProvider {...methods}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {methods.formState.errors.root?.message ? (
          <FieldError>{methods.formState.errors.root.message}</FieldError>
        ) : null}

        <form onSubmit={onSubmit}>
          <div className={cn(currentStep === 1 ? "block" : "hidden")}>
            <SignupFormStep1 onNext={handleNext} />
          </div>

          <div className={cn(currentStep === 2 ? "block" : "hidden")}>
            <SignupFormStep2 onNext={handleNext} onPrev={handlePrev} />
          </div>

          <div className={cn(currentStep === 3 ? "block" : "hidden")}>
            <SignupFormStep3 onPrev={handlePrev} onSubmitClick={onSubmit} />
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
