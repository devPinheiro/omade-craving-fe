import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/components/organisms/Dashboard'
import ComingSoon from '@/components/organisms/ComingSoon'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: ComingSoon,
})