import axios, { type AxiosRequestHeaders } from "axios"

type Env = { VITE_BACKEND_URL?: string }

const env = import.meta.env as unknown as Env
const apiBaseUrl = env.VITE_BACKEND_URL ?? "/api"

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

api.interceptors.request.use((config) => {
  if (!accessToken) return config

  const headers = (config.headers ??= {} as unknown as AxiosRequestHeaders)
  ;(headers as Record<string, string>).Authorization = `Bearer ${accessToken}`
  return config
})

export default api