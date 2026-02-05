import { AdminLayout } from '@/components/templates/AdminLayout'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/_admin')({
  component: AdminLayoutWrapper,
  beforeLoad: ({ context }) => {
    console.log(context, '-> context')

    const { auth, hasPermission } = context

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
      if (!persistedAuth?.isAuthenticated) {
        throw redirect({
          to: '/auth/login',
          search: {
            redirect: window.location.pathname,
          },
        })
      }

      // Use persisted auth for permission check
      const userRole = persistedAuth.user?.role
      const hasAdminAccess = userRole === 'admin'

      //   if (!hasAdminAccess) {
      //     throw redirect({
      //       to: '/dashboard',
      //     })
      //   }

      //   return
      // }

      // Check if user has admin permissions
      // const hasAdminAccess = hasPermission('admin:access') ||
      //                       auth.user?.role === 'admin' ||
      //                       auth.user?.role === 'super_admin'

      // if (!hasAdminAccess) {
      //   throw redirect({
      //     to: '/dashboard',
      //   })
      // }
    }
  },
})

function AdminLayoutWrapper(): ReactNode {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
