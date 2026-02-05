import http from '@/lib/http'
import { useAuthStore } from '@/store/auth'

export function AuthDebug() {
  const auth = useAuthStore()

  const handleClearStorage = () => {
    localStorage.removeItem('auth-store')
    window.location.reload()
  }

  const handleCheckStorage = () => {
    const stored = localStorage.getItem('auth-store')
    console.log('🔍 Current localStorage auth-store:', stored ? JSON.parse(stored) : 'null')
    console.log('🔍 Current Zustand state:', {
      user: auth.user?.email || 'null',
      hasAccessToken: !!auth.accessToken,
      hasRefreshToken: !!auth.refreshToken,
      isAuthenticated: auth.isAuthenticated,
      hasHydrated: auth.hasHydrated,
    })
  }

  const handleTestRequest = async () => {
    console.log('🧪 Testing API request with current auth state...')
    console.log('🔍 Current auth before request:', {
      hasUser: !!auth.user,
      hasAccessToken: !!auth.accessToken,
      hasRefreshToken: !!auth.refreshToken,
      isAuthenticated: auth.isAuthenticated,
      hasHydrated: auth.hasHydrated,
    })

    try {
      const response = await http.get('/api/v1/auth/me')
      console.log('✅ Test request successful:', response.data)
    } catch (error) {
      console.error('❌ Test request failed:', error)
      console.log('🔍 Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        headers: error.config?.headers,
      })
    }
  }

  const handleTestLogin = async () => {
    console.log('🧪 Manual login test - Use actual login form instead')
    console.log('💡 To test the authentication flow:')
    console.log('1. Navigate to login page')
    console.log('2. Use valid credentials')
    console.log('3. Watch console for auth flow logs')
    console.log('4. Click "Test Request" after login to verify token attachment')
    console.log('5. Use "Check Storage" to inspect stored auth data')

    console.log('🔍 Current auth state:', {
      hasUser: !!auth.user,
      hasAccessToken: !!auth.accessToken,
      isAuthenticated: auth.isAuthenticated,
      hasHydrated: auth.hasHydrated,
    })
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="text-sm font-medium text-gray-900 mb-2">Auth Debug</div>

      <div className="space-y-1 text-xs text-gray-600 mb-3">
        <div>User: {auth.user?.email || 'None'}</div>
        <div>Authenticated: {auth.isAuthenticated ? '✅' : '❌'}</div>
        <div>Hydrated: {auth.hasHydrated ? '✅' : '❌'}</div>
        <div>Access Token: {auth.accessToken ? '✅' : '❌'}</div>
        <div>Refresh Token: {auth.refreshToken ? '✅' : '❌'}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCheckStorage}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Check Storage
        </button>
        <button
          onClick={handleTestRequest}
          className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          Test Request
        </button>
        <button
          onClick={handleTestLogin}
          className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 col-span-2"
        >
          Manual Test Guide
        </button>
        <button
          onClick={handleClearStorage}
          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 col-span-2"
        >
          Clear Storage
        </button>
      </div>
    </div>
  )
}
