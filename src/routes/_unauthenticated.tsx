import { PublicPageLayout } from '@/components/templates/PublicPageLayout'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ReactNode } from 'react'

export const Route = createFileRoute('/_unauthenticated')({
  component:  UnauthenticatedLayout,
})

function UnauthenticatedLayout(): ReactNode {
  return (
    <PublicPageLayout>
      <Outlet />
    </PublicPageLayout>
  )
}