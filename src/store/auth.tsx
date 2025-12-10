import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ReactNode } from 'react'
import type { AuthStore, LoginCredentials, User } from '@/types/auth'
import { authService } from '@/services/auth'

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })
        try {
          const response = await authService.login(credentials)
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        const { refreshToken } = get()
        try {
          if (refreshToken) {
            await authService.logout(refreshToken)
          }
        } catch (error) {
          console.warn('Logout error:', error)
        } finally {
          set(initialState)
        }
      },

      setUser: (user: User) => {
        set({ user })
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken })
      },

      clearAuth: () => {
        set(initialState)
      },

      refreshAuth: async () => {
        const { refreshToken } = get()
        if (!refreshToken) {
          set({ isAuthenticated: false })
          return
        }

        try {
          const response = await authService.refresh(refreshToken)
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
          })
        } catch (error) {
          console.error('Token refresh failed:', error)
          set(initialState)
          throw error
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}