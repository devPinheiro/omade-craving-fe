import { router } from '@/main'
import { useAuthStore } from '@/store/auth'
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

type RequestInterceptor = (
  config: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>

type ResponseInterceptor = (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
type ErrorInterceptor = (error: AxiosError) => Promise<never>

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://omade-cravings-be-production.up.railway.app'

const baseConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const http: AxiosInstance = axios.create(baseConfig)

const requestInterceptor: RequestInterceptor = (config) => {
  console.log('🌐 Request interceptor triggered for:', config.url)

  // Skip authentication for login/register/public routes
  const isPublicRoute =
    config.url?.includes('/auth/login') ||
    config.url?.includes('/auth/register') ||
    config.url?.includes('/auth/forgot-password') ||
    config.url?.includes('/auth/reset-password')

  if (isPublicRoute) {
    console.log('🔓 Request interceptor - Skipping auth for public route:', config.url)
    return config
  }

  // Get fresh reference to the auth store state
  let accessToken = null
  let tokenSource = 'none'

  // PRIMARY: Try localStorage first since it's more reliable for persistence
  try {
    const authStore = localStorage.getItem('auth-store')
    if (authStore) {
      const parsed = JSON.parse(authStore)
      console.log('📦 Request interceptor - Raw localStorage data:', parsed)

      // Handle Zustand persistence structure: { state: { ...actualState }, version: 0 }
      const storedAccessToken = parsed?.state?.accessToken || parsed?.accessToken

      if (
        storedAccessToken &&
        typeof storedAccessToken === 'string' &&
        storedAccessToken.length > 0
      ) {
        accessToken = storedAccessToken
        tokenSource = 'localStorage'
      }
    } else {
      console.log('⚠️ Request interceptor - No auth-store in localStorage')
    }
  } catch (error) {
    console.log('⚠️ Request interceptor - localStorage parsing failed:', error)
  }

  // FALLBACK: Try Zustand store as secondary option
  if (!accessToken) {
    try {
      const authState = useAuthStore.getState()

      if (authState) {
        const currentAccessToken = authState.accessToken

        if (
          currentAccessToken &&
          typeof currentAccessToken === 'string' &&
          currentAccessToken.length > 0
        ) {
          accessToken = currentAccessToken
          tokenSource = 'zustand'
        }
      }
    } catch (error) {
      console.log('⚠️ Request interceptor - Zustand fallback failed:', error)
    }
  }

  if (accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

const responseInterceptor: ResponseInterceptor = (response) => {
  return response
}

const errorInterceptor: ErrorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config

  // console.log('HTTP Error:', error.response?.status, error.response?.data)

  if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
    // Mark request as retried to prevent infinite loops
    ;(originalRequest as any)._retry = true

    try {
      const authStore = useAuthStore.getState()

      // Only try to refresh if we have a refresh token
      if (authStore.refreshToken) {
        console.log('🔄 HTTP Interceptor: Attempting token refresh...')
        await authStore.refreshAuth()

        // Retry original request with new token
        const newAccessToken = useAuthStore.getState().accessToken
        if (newAccessToken) {
          console.log('🔄 HTTP Interceptor: Token refresh successful, retrying request')
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return http(originalRequest)
        }
      }
    } catch (refreshError) {
      console.log('❌ HTTP Interceptor: Token refresh failed:', refreshError)
    }

    // Only clear auth if we're truly unauthenticated (not during hydration)
    const authStore = useAuthStore.getState()

    // Check if we're still hydrating - if so, don't clear auth yet
    if (!authStore.hasHydrated) {
      console.log('⏳ HTTP Interceptor: Skipping auth clear - still hydrating')
      return Promise.reject(error)
    }

    // Only clear if this is a legitimate auth failure
    if (authStore.isAuthenticated && (authStore.accessToken || authStore.refreshToken)) {
      console.log('🔑 HTTP Interceptor: Clearing auth after legitimate 401')
      authStore.clearAuth()
    }

    // Only redirect if we're not already on the login page
    if (!window.location.pathname.includes('/auth/login')) {
      await router.navigate({
        to: '/auth/login',
        search: { redirectUrl: window.location.pathname },
      })
    }
  }

  return Promise.reject(error)
}

// Add interceptors
http.interceptors.request.use(requestInterceptor)
http.interceptors.response.use(responseInterceptor, errorInterceptor)

export default http
