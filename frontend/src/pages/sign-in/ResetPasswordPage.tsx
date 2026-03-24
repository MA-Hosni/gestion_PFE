import ResetPasswordForm from "@/components/auth/password-reset/password-reset-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeftIcon } from "lucide-react"
import { Link } from "react-router-dom"


function ResetPasswordPage() {
     return (
    <div className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute blur-xl'>
        <img src="/favicon.svg" alt="Mentorlink logo" className="size-180 object-contain" />
      </div>

      <Card className='z-1 w-full border-none shadow-md sm:max-w-md'>
        <CardHeader className='gap-6'>
          <div>
            <CardTitle className='mb-1.5 text-2xl flex items-center gap-2'>
            <div className="flex size-10 items-center justify-center rounded-md text-primary-foreground">
              <img src="/favicon.svg" alt="Mentorlink logo" className="size-14 object-contain" />
            </div>
            Reset Password</CardTitle>
            <CardDescription className='text-base'>
              Please enter a new password to update your account security.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          <ResetPasswordForm />

          <Link to="/login" className='group mx-auto flex w-fit items-center gap-2'>
            <ChevronLeftIcon className='size-5 transition-transform duration-200 group-hover:-translate-x-0.5' />
            <span>Back to login</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordPage