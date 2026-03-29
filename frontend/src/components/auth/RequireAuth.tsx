import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "@/context/auth-context"

export default function RequireAuth() {
  const { status } = useAuth()

  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        Loading...
      </div>
    )
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}