import Feedback from '@/components/organisms/Feedback'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/feedback')({
  component: FeedbackRoute,
})

function FeedbackRoute() {
  return (
    <PublicLayout>
      <Feedback />
    </PublicLayout>
  )
}
