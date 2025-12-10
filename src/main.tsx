import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/store/auth'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { routeTree } from './routeTree.gen'
import { useAuthStore } from '@/store/auth'
import { usePermissions } from '@/hooks/usePermissions'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
        <App />
        <Toaster />
        <ReactQueryDevtools buttonPosition="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  )
}