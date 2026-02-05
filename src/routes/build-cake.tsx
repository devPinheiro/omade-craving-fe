import CakeBuilder from '@/components/organisms/CakeBuilder'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/build-cake')({
  component: BuildCakeRoute,
})

function BuildCakeRoute() {
  return (
    <PublicLayout>
      <CakeBuilder />
    </PublicLayout>
  )
}
