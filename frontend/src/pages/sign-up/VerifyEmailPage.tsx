import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function VerifyEmailPage() {
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
            Verify your email</CardTitle>
            <CardDescription className='text-base'>
              An activation link has been sent to your email address: hello@example.com. Please check your inbox and
              click on the link to complete the activation process.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
            <p className='text-muted-foreground text-center'>
              Didn&apos;t get the mail?{' '}
              <a href='#' className='text-card-foreground hover:underline'>
                Resend
              </a>
            </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmailPage