import type { CartItem } from './cart'

export interface DeliveryDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode?: string
  deliveryInstructions?: string
  deliveryMethod: 'home_delivery' | 'pickup'
  deliveryDate?: string
  deliveryTime?: string
}

export interface PaymentDetails {
  method: 'paystack'
  reference: string
  amount: number
  currency: 'NGN'
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  paidAt?: string
  gatewayResponse?: any
}

export interface Order {
  id: string
  orderNumber: string
  items: CartItem[]
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  delivery: DeliveryDetails
  pricing: {
    subtotal: number
    deliveryFee: number
    discountAmount: number
    totalAmount: number
  }
  payment: PaymentDetails
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
}

export interface CheckoutFormData {
  // Customer Details
  firstName: string
  lastName: string
  email: string
  phone: string

  // Delivery Details
  address: string
  city: string
  state: string
  postalCode?: string
  deliveryInstructions?: string
  deliveryMethod: 'home_delivery' | 'pickup'
  deliveryDate?: string
  deliveryTime?: string

  // Agreement
  acceptTerms: boolean
  marketingConsent?: boolean
}

export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT - Abuja',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
]

export const DELIVERY_AREAS = {
  Lagos: {
    areas: ['Victoria Island', 'Ikoyi', 'Lekki', 'Surulere', 'Ikeja', 'Maryland', 'Yaba', 'Ajah'],
    baseFee: 2500,
    freeDeliveryThreshold: 50000,
  },
  'FCT - Abuja': {
    areas: ['Garki', 'Wuse', 'Maitama', 'Gwarinpa', 'Kubwa', 'Dutse', 'Kado'],
    baseFee: 3500,
    freeDeliveryThreshold: 75000,
  },
} as const

export const DELIVERY_TIME_SLOTS = [
  '9:00 AM - 12:00 PM',
  '12:00 PM - 3:00 PM',
  '3:00 PM - 6:00 PM',
  '6:00 PM - 9:00 PM',
] as const
