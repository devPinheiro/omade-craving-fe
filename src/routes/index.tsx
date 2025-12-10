import ComingSoon from '@/components/organisms/ComingSoon'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  // beforeLoad: ({ context }) => {
  //   const { auth } = context

  // },
})

function RouteComponent() {
  return <ComingSoon />
}