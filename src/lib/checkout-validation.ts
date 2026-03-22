import * as v from 'valibot'

import { NIGERIAN_STATES } from '@/types/checkout'

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
    v.trim(),
    v.transform((input) => input.replace(/\D/g, '')),
    v.regex(/^\d{11}$/, 'Phone must be exactly 11 digits'),
  ),

  // Delivery Details
  address: v.pipe(
    v.string(),
    v.minLength(10, 'Address must be at least 10 characters'),
    v.maxLength(200, 'Address must be less than 200 characters'),
    v.trim()
  ),
  /** Optional: empty or 2–50 characters if provided */
  city: v.optional(v.string()),
  state: v.pipe(v.string()),
  postalCode: v.optional(v.string()),
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

/** Strip non-digits (e.g. for display or API); validation uses 11 digits in schema */
export const digitsOnly = (phone: string): string => phone.replace(/\D/g, '')

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
