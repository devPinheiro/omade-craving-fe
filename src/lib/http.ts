import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { router } from '@/main'
import { useAuthStore } from '@/store/auth'

type RequestInterceptor = (
  config: InternalAxiosRequestConfig,
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>

type ResponseInterceptor = (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
type ErrorInterceptor = (error: AxiosError) => Promise<never>

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const baseConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const http: AxiosInstance = axios.create(baseConfig)

const requestInterceptor: RequestInterceptor = (config) => {
  const authStore = localStorage.getItem('auth-store')
  const accessToken = authStore ? JSON.parse(authStore)?.state?.accessToken : null

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

const responseInterceptor: ResponseInterceptor = (response) => {
  return response
}

const errorInterceptor: ErrorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config

  if (error.response?.status === 401 && originalRequest) {
    try {
      const authStore = useAuthStore.getState()
      await authStore.refreshAuth()
      
      // Retry original request
      const accessToken = useAuthStore.getState().accessToken
      if (accessToken) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axios(originalRequest)
      }
    } catch (refreshError) {
      // Refresh failed, redirect to login
      const authStore = useAuthStore.getState()
      authStore.clearAuth()
      
      await router.navigate({
        to: '/auth/login',
        search: { redirectUrl: location.pathname },
      })
    }
  }

  return Promise.reject(error)
}

// Add interceptors
http.interceptors.request.use(requestInterceptor)
http.interceptors.response.use(responseInterceptor, errorInterceptor)

export default http