import { PublicPageLayout } from '@/components/templates/PublicPageLayout'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/_unauthenticated')({
  component: UnauthenticatedLayout,
})

function UnauthenticatedLayout(): ReactNode {
  return (
    <PublicPageLayout>
      <Outlet />
    </PublicPageLayout>
  )
}
