import TermsOfService from '@/components/organisms/TermsOfService'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsRoute,
})

function TermsRoute() {
  return (
    <PublicLayout>
      <TermsOfService />
    </PublicLayout>
  )
}
