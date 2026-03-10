import http from '@/lib/http'

/**
 * Newsletter subscribe – client posts to backend; backend should add the email
 * to your provider (Resend, Mailchimp, Buttondown, etc.) using server-side API keys.
 * See: Resend Contacts API, Mailchimp Lists, Buttondown Subscribers API.
 */
export async function subscribeNewsletter(email: string): Promise<void> {
  const trimmed = email.trim()
  if (!trimmed) throw new Error('Email is required')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) throw new Error('Please enter a valid email address')

  await http.post('/api/v1/newsletter/subscribe', { email: trimmed })
}
