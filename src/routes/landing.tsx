import Landing from '@/components/organisms/Landing'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/landing')({
  component: LandingRoute,
})

function LandingRoute() {
  return (
    <PublicLayout>
      <Landing />
    </PublicLayout>
  )
}
