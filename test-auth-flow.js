// Quick manual test of the auth flow to debug token attachment
// Run this in the browser console after navigating to the app

async function testAuthFlow() {
  console.log('🧪 Starting auth flow test...')
  
  // Step 1: Check initial auth state
  const authStore = window.useAuthStore?.getState?.() || {}
  console.log('1️⃣ Initial auth state:', {
    hasUser: !!authStore.user,
    hasAccessToken: !!authStore.accessToken,
    isAuthenticated: authStore.isAuthenticated,
    hasHydrated: authStore.hasHydrated
  })
  
  // Step 2: Check localStorage
  const stored = localStorage.getItem('auth-store')
  console.log('2️⃣ LocalStorage:', stored ? JSON.parse(stored) : 'null')
  
  // Step 3: Test a request with current state
  try {
    console.log('3️⃣ Testing API request...')
    const response = await fetch('https://omade-cravings-be-production.up.railway.app/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authStore.accessToken ? { 'Authorization': `Bearer ${authStore.accessToken}` } : {})
      }
    })
    
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response data:', data)
  } catch (error) {
    console.error('❌ API test failed:', error)
  }
  
  // Step 4: Check if auth debug component is working
  const debugElement = document.querySelector('[class*="fixed"][class*="bottom-4"]')
  console.log('4️⃣ Auth debug component found:', !!debugElement)
  
  return {
    authStore,
    stored,
    debugVisible: !!debugElement
  }
}

// Make it available globally
window.testAuthFlow = testAuthFlow

console.log('🔧 Auth flow test function loaded. Run testAuthFlow() to start debugging.')