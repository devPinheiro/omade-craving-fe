import { AuthHydrationProvider } from '@/components/providers/AuthHydrationProvider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/store/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { AuthDebug } from '@/components/debug/AuthDebug'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuthStore } from '@/store/auth'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { routeTree } from './routeTree.gen'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Create router instance
export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient,
    hasPermission: () => false,
  },
  defaultPreloadStaleTime: 0,
  defaultPendingMinMs: 0,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const { user, isAuthenticated } = useAuthStore()
  const hasPermission = usePermissions()

  return (
    <RouterProvider
      router={router}
      context={{
        auth: { user, isAuthenticated },
        hasPermission,
      }}
    />
  )
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthHydrationProvider>
          <App />
          <AuthDebug />
          <Toaster />
          <ReactQueryDevtools buttonPosition="bottom-right" />
        </AuthHydrationProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
