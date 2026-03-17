import { useState } from "react"
import { SignupForm } from "@/components/auth/signup/signup-form"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const progress = (step / 3) * 100

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted">
          <div 
            className="h-full bg-blue-600 dark:bg-white transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="flex justify-center gap-2 md:justify-start pt-4">
          <a href="#" className="flex items-center gap-2 font-bold text-2xl">
            <div className="flex size-14 items-center justify-center rounded-md text-primary-foreground">
              <div 
                className="size-14 bg-blue-600 dark:bg-white transition-colors" 
                style={{
                  maskImage: "url(/favicon.svg)",
                  maskSize: "contain",
                  maskPosition: "center",
                  maskRepeat: "no-repeat",
                  WebkitMaskImage: "url(/favicon.svg)",
                  WebkitMaskSize: "contain",
                  WebkitMaskPosition: "center",
                  WebkitMaskRepeat: "no-repeat"
                }}
              />
            </div>
            MENTORLINK
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SignupForm currentStep={step} onStepChange={setStep} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="src/assets/mentorlink.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] dark:grayscale"
        />
      </div>
    </div>
  )
}
