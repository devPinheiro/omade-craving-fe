import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/organisms/LoginForm'
import { object, optional, string } from 'valibot'

const loginSearchSchema = object({
  redirectUrl: optional(string()),
})

export const Route = createFileRoute('/auth/login')({
  validateSearch: loginSearchSchema,
  component: LoginForm,
})