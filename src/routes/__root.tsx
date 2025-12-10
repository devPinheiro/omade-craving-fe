import { ErrorBoundary } from 'react-error-boundary'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { User } from '@/types/auth'

type AuthContext = {
  user: User | null
  isAuthenticated: boolean
}

type RouterContext = {
  auth: AuthContext
  queryClient: QueryClient
  hasPermission: (permission: string) => boolean
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Reload page
        </button>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go home
        </a>
      </div>
    </div>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent(): ReactNode {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
    </ErrorBoundary>
  )
}