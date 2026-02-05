import { AdminDashboard } from '@/components/organisms/AdminDashboard'
import ComingSoon from '@/components/organisms/ComingSoon'
import { Dashboard } from '@/components/organisms/Dashboard'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard')({
  // component: AdminDashboard,
  beforeLoad: ({ context }) => {
    const { auth, hasPermission } = context

    if (!auth.isAuthenticated || !hasPermission('view_admin_dashboard')) {
      return ComingSoon
    }

    throw redirect({
      to: '/home',
    })
  },
})
