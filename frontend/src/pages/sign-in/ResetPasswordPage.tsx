import ResetPasswordForm from "@/components/auth/password-reset/password-reset-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeftIcon } from "lucide-react"


function ResetPasswordPage() {
     return (
    <div className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute blur-xl'>
            <div 
            className="size-dvh bg-blue-600 dark:bg-white transition-colors" 
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

      <Card className='z-1 w-full border-none shadow-md sm:max-w-md'>
        <CardHeader className='gap-6'>
          <div>
            <CardTitle className='mb-1.5 text-2xl flex items-center gap-2'>
            <div className="flex size-10 items-center justify-center rounded-md text-primary-foreground">
              <div 
                className="size-10 bg-blue-600 dark:bg-white transition-colors" 
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
            Reset Password</CardTitle>
            <CardDescription className='text-base'>
              Please enter a new password to update your account security.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          <ResetPasswordForm />

          <a href='#' className='group mx-auto flex w-fit items-center gap-2'>
            <ChevronLeftIcon className='size-5 transition-transform duration-200 group-hover:-translate-x-0.5' />
            <span>Back to login</span>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordPage