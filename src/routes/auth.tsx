import { AuthLayout } from '@/components/templates/AuthLayout'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/auth')({
  component: UnauthenticatedLayout,
  // beforeLoad: ({ context }) => {
  //   const { auth } = context

  //   if (auth.isAuthenticated) {
  //     throw redirect({ to: '/dashboard' })
  //   }
  // },
})

function UnauthenticatedLayout(): ReactNode {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}
