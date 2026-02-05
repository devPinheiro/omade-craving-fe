import { AppLayout } from '@/components/templates/AppLayout'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: ({ context }) => {
    const { auth } = context

    // Check localStorage directly for persisted auth state if context auth is not ready
    if (!auth.isAuthenticated) {
      // Try to get auth state from localStorage directly
      const storedAuth = localStorage.getItem('auth-store')
      let persistedAuth = null

      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth)
          persistedAuth = parsed.state || parsed
        } catch (e) {
          console.warn('Failed to parse stored auth:', e)
        }
      }

      // If no persisted auth or not authenticated, redirect to login
      // if (!persistedAuth?.isAuthenticated) {
      //   throw redirect({
      //     to: '/auth/login',
      //     search: {
      //       redirect: window.location.pathname,
      //     },
      //   })
      // }
    }
  },
})

function AuthenticatedLayout(): ReactNode {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
