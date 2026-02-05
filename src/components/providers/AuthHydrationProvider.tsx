import { useAuthStore } from '@/store/auth'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthHydrationProviderProps {
  children: ReactNode
}

export function AuthHydrationProvider({ children }: AuthHydrationProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const setHasHydrated = useAuthStore((state) => state.setHasHydrated)

  // Debug: Track all auth state changes
  useEffect(() => {
    let lastState = useAuthStore.getState()

    const unsubscribe = useAuthStore.subscribe((state) => {
      const authChanged =
        state.isAuthenticated !== lastState.isAuthenticated ||
        state.accessToken !== lastState.accessToken ||
        state.refreshToken !== lastState.refreshToken ||
        state.user?.id !== lastState.user?.id

      if (authChanged) {
        console.log('🔔 AUTH STATE CHANGED:', {
          from: {
            isAuthenticated: lastState.isAuthenticated,
            hasAccessToken: !!lastState.accessToken,
            hasRefreshToken: !!lastState.refreshToken,
            user: lastState.user?.email || 'none',
          },
          to: {
            isAuthenticated: state.isAuthenticated,
            hasAccessToken: !!state.accessToken,
            hasRefreshToken: !!state.refreshToken,
            user: state.user?.email || 'none',
          },
          stackTrace: new Error().stack,
        })
      }

      lastState = state
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    console.log('AuthHydrationProvider: Checking hydration status')

    // Check if Zustand has already hydrated
    if (hasHydrated) {
      console.log('AuthHydrationProvider: Already hydrated')
      setIsHydrated(true)
      return
    }

    // Force hydration check after a short delay
    const checkHydration = () => {
      const storedAuth = localStorage.getItem('auth-store')
      console.log('AuthHydrationProvider: Checking localStorage:', !!storedAuth)

      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth)
          const authData = parsed.state || parsed
          console.log('AuthHydrationProvider: Found persisted auth data:', {
            hasUser: !!authData.user,
            hasAccessToken: !!authData.accessToken,
            isAuthenticated: authData.isAuthenticated,
          })
        } catch (e) {
          console.warn('AuthHydrationProvider: Failed to parse stored auth:', e)
        }
      }

      // Mark as hydrated regardless
      setHasHydrated()
      setIsHydrated(true)
    }

    // Wait for initial render cycle
    const timeoutId = setTimeout(checkHydration, 100)

    return () => clearTimeout(timeoutId)
  }, [hasHydrated, setHasHydrated])

  // Show loading until hydration is complete
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
