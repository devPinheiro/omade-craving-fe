import ComingSoon from '@/components/organisms/ComingSoon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated/comingSoon')({
  component: ComingSoon,
})

