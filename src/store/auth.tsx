import { authService } from '@/services/auth'
import type { AuthStore, LoginCredentials, User } from '@/types/auth'
import type { ReactNode } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  hasHydrated: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => {
      console.log('Auth store initialized')
      return {
        ...initialState,

        login: async (credentials: LoginCredentials) => {
          console.log('🚀 Login: Starting login process')
          set({ isLoading: true })
          try {
            console.log('🔐 Login: Attempting login with credentials:', {
              email: credentials.email,
            })
            const response = await authService.login(credentials)
            console.log('✅ Login: Login response received:', {
              user: response.user?.email,
              hasAccessToken: !!response.accessToken,
              hasRefreshToken: !!response.refreshToken,
            })

            const newState = {
              user: response.user,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              isAuthenticated: true,
              isLoading: false,
            }

            console.log('💾 Login: Setting new auth state...')
            set(newState)

            console.log('✅ Login: Auth state updated successfully')

            // Immediate verification
            const immediateState = get()
            console.log('🔍 Login: Immediate verification after set:', {
              hasUser: !!immediateState.user,
              hasAccessToken: !!immediateState.accessToken,
              isAuthenticated: immediateState.isAuthenticated,
            })

            // Force persistence flush - wait for next tick to ensure persistence
            await new Promise((resolve) => setTimeout(resolve, 0))
            console.log('🔑 Login: Tokens stored:', {
              hasAccessToken: !!newState.accessToken,
              hasRefreshToken: !!newState.refreshToken,
              isAuthenticated: newState.isAuthenticated,
            })

            // Check if localStorage was updated with explicit flush
            setTimeout(() => {
              const stored = localStorage.getItem('auth-store')
              console.log(
                '💾 Login: LocalStorage after login:',
                stored ? JSON.parse(stored) : 'null'
              )

              // Validate stored data structure
              if (stored) {
                const parsed = JSON.parse(stored)
                console.log('📊 Login: Stored auth structure:', {
                  hasState: !!parsed.state,
                  hasDirectAccess: !!parsed.accessToken,
                  version: parsed.version,
                })
              }

              // Double-check current state hasn't been reset
              const currentState = get()
              console.log('🔍 Login: Current state after delay:', {
                hasUser: !!currentState.user,
                hasAccessToken: !!currentState.accessToken,
                isAuthenticated: currentState.isAuthenticated,
              })

              if (!currentState.isAuthenticated) {
                console.error('🚨 Login: AUTH STATE WAS RESET AFTER LOGIN!')
              }
            }, 500)
          } catch (error) {
            console.error('❌ Login: Login failed:', error)
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
          set({ ...initialState, hasHydrated: true })
        },

        setHasHydrated: () => {
          set({ hasHydrated: true })
        },

        refreshAuth: async () => {
          const { refreshToken } = get()
          if (!refreshToken) {
            console.log('🔑 RefreshAuth: No refresh token available')
            set({ isAuthenticated: false })
            return
          }

          console.log('🔄 RefreshAuth: Attempting to refresh token...')
          try {
            const response = await authService.refresh(refreshToken)
            console.log('✅ RefreshAuth: Token refresh successful')
            set({
              user: response.user,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              isAuthenticated: true,
            })
          } catch (error) {
            console.error('❌ RefreshAuth: Token refresh failed:', error)

            // Only clear auth if the error is a legitimate auth failure (not network error)
            if (error.response?.status === 401 || error.response?.status === 403) {
              console.log('🔑 RefreshAuth: Clearing auth due to invalid refresh token')
              set({ ...initialState, hasHydrated: true })
            } else {
              console.log('🌐 RefreshAuth: Network error, keeping tokens for retry')
              set({ isAuthenticated: false }) // Mark as not authenticated but keep tokens for retry
            }
            throw error
          }
        },
      }
    },
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const { hasHydrated, isLoading, ...persistedState } = state
        console.log('Partializing state for persistence:', {
          hasUser: !!persistedState.user,
          hasAccessToken: !!persistedState.accessToken,
          hasRefreshToken: !!persistedState.refreshToken,
          isAuthenticated: persistedState.isAuthenticated,
        })
        return persistedState
      },
      onRehydrateStorage: () => (state, error) => {
        console.log('Zustand rehydration callback executed')
        if (error) {
          console.error('Rehydration error:', error)
          return
        }

        if (state) {
          console.log('Successfully rehydrated auth state:', {
            hasUser: !!state.user,
            hasAccessToken: !!state.accessToken,
            hasRefreshToken: !!state.refreshToken,
            isAuthenticated: state.isAuthenticated,
          })

          // Ensure hydration flag is set
          setTimeout(() => {
            state.setHasHydrated?.()
          }, 0)
        } else {
          console.log('No auth state to rehydrate, setting as hydrated')
          // Even if no state, mark as hydrated
          setTimeout(() => {
            useAuthStore.getState().setHasHydrated()
          }, 0)
        }
      },
      version: 1,
      skipHydration: false,
    }
  )
)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
