import { AdminDashboard } from '@/components/organisms/AdminDashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/home')({
  component: AdminDashboard,
})
