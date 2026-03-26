import { isAxiosError } from "axios"

import api from "@/services/http/api-client"

export type AuthRole = "Student" | "CompSupervisor" | "UniSupervisor"

export interface AuthUserProfile {
  // Backend returns a role-specific profile object (student/supervisor fields).
  // Keep it open-ended to avoid tight coupling.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface AuthUser {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  role: AuthRole
  isVerified: boolean
  profile: AuthUserProfile | null
}

export interface SupervisorLite {
  _id: string
  fullName: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: AuthUser
    accessToken: string
  }
}

export interface RefreshResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
  }
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: {
    user: AuthUser
  }
}

export interface LogoutResponse {
  success: boolean
  message: string
}

export interface SignupResponse {
  success: boolean
  message: string
  data: {
    userId: string
    email: string
    role: AuthRole
  }
}

function getErrorMessage(err: unknown) {
  if (isAxiosError(err)) {
    const status = err.response?.status
    const responseData = err.response?.data

    const detailsFromApi =
      typeof responseData === "object" &&
      responseData &&
      "details" in responseData &&
      Array.isArray((responseData as { details?: unknown }).details)
        ? (responseData as { details: unknown[] }).details
            .map((detail) => String(detail))
            .filter(Boolean)
            .join("\n")
        : undefined

    const messageFromApi =
      typeof responseData === "string"
        ? responseData
        : typeof responseData === "object" && responseData
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ("error" in responseData
              ? String((responseData as any).error)
              : "message" in responseData
                ? String((responseData as any).message)
                : undefined)
          : undefined

                if (detailsFromApi) return detailsFromApi
    if (messageFromApi) return messageFromApi
    if (status) return `Request failed with status ${status}`
    return "Network error"
  }
  if (err instanceof Error) return err.message
  return "Request failed"
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const res = await api.post<LoginResponse>("/api/auth/login", payload)
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function refreshAccessToken(): Promise<RefreshResponse> {
  try {
    const res = await api.post<RefreshResponse>("/api/auth/refresh-token")
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function logout(): Promise<LogoutResponse> {
  try {
    const res = await api.post<LogoutResponse>("/api/auth/logout")
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function getProfile(): Promise<ProfileResponse> {
  try {
    const res = await api.get<ProfileResponse>("/api/profile")
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function getCompanySupervisors(): Promise<
  { success: boolean; message: string; data: SupervisorLite[] }
> {
  try {
    const res = await api.get("/api/supervisors/company")
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function getUniversitySupervisors(): Promise<
  { success: boolean; message: string; data: SupervisorLite[] }
> {
  try {
    const res = await api.get("/api/supervisors/university")
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function verifyEmail(token: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    const res = await api.get("/api/auth/verify-email", { params: { token } })
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export type SignupStudentPayload = {
  fullName: string
  phoneNumber: string
  email: string
  password: string
  role: "Student"
  cin: string
  studentIdCardIMG: string
  degree: "Bachelor" | "Master" | "Engineer"
  degreeType: string
  companyName: string
  uniSupervisorId: string
  compSupervisorId: string
}

export type SignupCompanySupervisorPayload = {
  fullName: string
  phoneNumber: string
  email: string
  password: string
  role: "CompSupervisor"
  companyName: string
  badgeIMG: string
}

export type SignupUniversitySupervisorPayload = {
  fullName: string
  phoneNumber: string
  email: string
  password: string
  role: "UniSupervisor"
  badgeIMG: string
}

export async function signupStudent(
  payload: SignupStudentPayload,
): Promise<SignupResponse> {
  try {
    const res = await api.post<SignupResponse>("/api/auth/signup/student", payload)
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function signupCompanySupervisor(
  payload: SignupCompanySupervisorPayload,
): Promise<SignupResponse> {
  try {
    const res = await api.post<SignupResponse>(
      "/api/auth/signup/supervisor-company",
      payload,
    )
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function signupUniversitySupervisor(
  payload: SignupUniversitySupervisorPayload,
): Promise<SignupResponse> {
  try {
    const res = await api.post<SignupResponse>(
      "/api/auth/signup/supervisor-university",
      payload,
    )
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function requestPasswordReset(
  email: string,
): Promise<{ success: boolean; message: string; resetToken?: string }> {
  try {
    const res = await api.post("/api/auth/request-password-reset", { email })
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function resetPassword(
  resetToken: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.post(
      "/api/auth/reset-password",
      { newPassword },
      { params: { resetToken } },
    )
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

export async function changePassword(
  payload: { currentPassword: string; newPassword: string }
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.post("/api/change-password", payload)
    return res.data
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}