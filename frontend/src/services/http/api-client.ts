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

// --- REFRESH TOKEN LOGIC ---
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: import("axios").AxiosError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalRequest = error.config as any

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !(originalRequest.url || "").includes("/api/auth/refresh-token") &&
      !(originalRequest.url || "").includes("/api/auth/login")
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post(
          "/api/auth/refresh-token",
          {},
          {
            withCredentials: true,
            baseURL: apiBaseUrl,
          }
        )

        // Adjust based on your RefreshResponse shape
        const newAccessToken = res.data.data.accessToken
        setAccessToken(newAccessToken)
        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        window.dispatchEvent(new CustomEvent("auth:unauthorized"))
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api