import { useAuthStore } from '@/store/auth'

export function debugAuthState() {
  const state = useAuthStore.getState()

  console.log('🔍 Full Auth State Debug:', {
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    isAuthenticated: state.isAuthenticated,
    hasHydrated: state.hasHydrated,
    isLoading: state.isLoading,
  })

  // Check localStorage
  const stored = localStorage.getItem('auth-store')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      console.log('💾 LocalStorage Auth Data:', parsed)
    } catch (e) {
      console.error('❌ Failed to parse localStorage auth data:', e)
    }
  } else {
    console.log('❌ No auth data in localStorage')
  }

  return state
}
