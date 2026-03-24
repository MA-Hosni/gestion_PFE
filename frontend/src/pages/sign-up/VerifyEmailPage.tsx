import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

import * as authApi from "@/services/auth/auth-api"

type VerifyState = "idle" | "verifying" | "success" | "error"

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [state, setState] = useState<VerifyState>(token ? "verifying" : "idle")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    let active = true
    if (!token) return

    ;(async () => {
      try {
        const res = await authApi.verifyEmail(token)
        if (!active) return
        setState("success")
        setMessage(res.message)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Verification failed"
        if (!active) return
        setState("error")
        setMessage(errorMessage)
        toast.error(errorMessage)
      }
    })()

    return () => {
      active = false
    }
  }, [token])

  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute blur-xl">
        <img src="/favicon.svg" alt="Mentorlink logo" className="size-180 object-contain" />
      </div>

      <Card className="z-1 w-full border-none shadow-md sm:max-w-md">
        <CardHeader className="gap-6">
          <div>
            <CardTitle className="mb-1.5 text-2xl flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-md text-primary-foreground">
                <img src="/favicon.svg" alt="Mentorlink logo" className="size-14 object-contain" />
              </div>
              {token ? "Verify your email" : "Check your inbox"}
            </CardTitle>

            <CardDescription className="text-base">
              {token ? (
                state === "verifying" ? (
                  "Verifying your account..."
                ) : state === "success" ? (
                  message
                ) : (
                  message
                )
              ) : (
                <>
                  We&apos;ve sent an activation link to your email. Please check your inbox and click the link to
                  complete the activation process.
                </>
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground text-center">
            {token ? (
              state === "success" ? (
                <>
                  You can now{" "}
                  <Link to="/login" className="text-card-foreground hover:underline">
                    log in
                  </Link>
                  .
                </>
              ) : (
                <>
                  If your email isn&apos;t verified yet, try{" "}
                  <Link to="/login" className="text-card-foreground hover:underline">
                    logging in
                  </Link>{" "}
                  (the backend will resend the verification email).
                </>
              )
            ) : (
              <>
                Already have access?{" "}
                <Link to="/login" className="text-card-foreground hover:underline">
                  Go to login
                </Link>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmailPage