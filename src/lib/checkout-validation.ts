import { NIGERIAN_STATES } from '@/types/checkout'
import * as v from 'valibot'

export const checkoutSchema = v.object({
  // Customer Details
  firstName: v.pipe(
    v.string(),
    v.minLength(2, 'First name must be at least 2 characters'),
    v.maxLength(50, 'First name must be less than 50 characters'),
    v.trim()
  ),
  lastName: v.pipe(
    v.string(),
    v.minLength(2, 'Last name must be at least 2 characters'),
    v.maxLength(50, 'Last name must be less than 50 characters'),
    v.trim()
  ),
  email: v.pipe(
    v.string(),
    v.email('Please enter a valid email address'),
    v.trim(),
    v.toLowerCase()
  ),
  phone: v.pipe(
    v.string(),
    v.minLength(11, 'Phone number must be at least 11 characters'),
    v.maxLength(14, 'Phone number must be less than 14 characters'),
    v.regex(/^(\+234|234|0)[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number'),
    v.trim()
  ),

  // Delivery Details
  address: v.pipe(
    v.string(),
    v.minLength(10, 'Address must be at least 10 characters'),
    v.maxLength(200, 'Address must be less than 200 characters'),
    v.trim()
  ),
  city: v.pipe(
    v.string(),
    v.minLength(2, 'City must be at least 2 characters'),
    v.maxLength(50, 'City must be less than 50 characters'),
    v.trim()
  ),
  state: v.pipe(v.string(), v.picklist(NIGERIAN_STATES, 'Please select a valid Nigerian state')),
  postalCode: v.string(),
  deliveryInstructions: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(500, 'Delivery instructions must be less than 500 characters'),
      v.trim()
    )
  ),
  deliveryMethod: v.picklist(['home_delivery', 'pickup'], 'Please select a delivery method'),
  deliveryDate: v.optional(v.pipe(v.string(), v.isoDate('Please select a valid date'))),
  deliveryTime: v.optional(v.string()),

  // Agreements
  acceptTerms: v.pipe(v.boolean(), v.literal(true, 'You must accept the terms and conditions')),
  marketingConsent: v.optional(v.boolean()),
})

export type CheckoutFormData = v.InferInput<typeof checkoutSchema>

// Validation function
export const validateCheckoutForm = (data: unknown) => {
  return v.safeParse(checkoutSchema, data)
}

// Field-specific validation helpers
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')

  // Handle different Nigerian phone number formats
  if (digits.startsWith('234')) {
    return `+${digits}`
  }
  if (digits.startsWith('0')) {
    return `+234${digits.slice(1)}`
  }
  if (digits.length === 10) {
    return `+234${digits}`
  }

  return phone
}

export const validateEmailDomain = (email: string): boolean => {
  const commonDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'aol.com',
    'protonmail.com',
  ]
  const domain = email.split('@')[1]?.toLowerCase()
  return commonDomains.includes(domain) || domain?.includes('.com') || domain?.includes('.ng')
}
