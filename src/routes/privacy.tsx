import PrivacyPolicy from '@/components/organisms/PrivacyPolicy'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: PrivacyRoute,
})

function PrivacyRoute() {
  return (
    <PublicLayout>
      <PrivacyPolicy />
    </PublicLayout>
  )
}
