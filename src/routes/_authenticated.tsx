import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayout } from '@/components/templates/AppLayout'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: ({ context }) => {
    const { auth } = context

  },
})

function AuthenticatedLayout(): ReactNode {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}