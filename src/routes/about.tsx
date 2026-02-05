import AboutUs from '@/components/organisms/AboutUs'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutRoute,
})

function AboutRoute() {
  return (
    <PublicLayout>
      <AboutUs />
    </PublicLayout>
  )
}
