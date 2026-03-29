/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import * as authApi from "@/services/auth/auth-api"
import { setAccessToken } from "@/services/http/api-client"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

type AuthContextValue = {
  status: AuthStatus
  user: authApi.AuthUser | null
  accessToken: string | null
  login: (payload: authApi.LoginPayload) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading")
  const [user, setUser] = useState<authApi.AuthUser | null>(null)
  const [accessToken, setAccessTokenState] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const refreshed = await authApi.refreshAccessToken()
    const token = refreshed.data.accessToken
    setAccessToken(token)
    setAccessTokenState(token)

    const profile = await authApi.getProfile()
    setUser(profile.data.user)
    setStatus("authenticated")
  }, [])

  const login = useCallback(async (payload: authApi.LoginPayload) => {
    const result = await authApi.login(payload)
    const token = result.data.accessToken
    setAccessToken(token)
    setAccessTokenState(token)
    setUser(result.data.user)
    setStatus("authenticated")
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setAccessToken(null)
      setAccessTokenState(null)
      setUser(null)
      setStatus("unauthenticated")
    }
  }, [])

  useEffect(() => {
    let active = true

    const handleUnauthorized = () => {
      setAccessToken(null)
      setAccessTokenState(null)
      setUser(null)
      setStatus("unauthenticated")
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized)

    ;(async () => {
      try {
        await refresh()
      } catch {
        if (!active) return
        handleUnauthorized()
      }
    })()

    return () => {
      active = false
      window.removeEventListener("auth:unauthorized", handleUnauthorized)
    }
  }, [refresh])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      accessToken,
      login,
      logout,
      refresh,
    }),
    [accessToken, login, logout, refresh, status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}