import type { CheckoutFormData, Order } from '@/types/checkout'
import PaystackPop from '@paystack/inline-js'

// Paystack configuration
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string

export interface PaystackConfig {
  email: string
  amount: number // in kobo (multiply by 100)
  currency: 'NGN'
  ref: string
  callback: (response: any) => void
  onClose: () => void
  metadata?: {
    custom_fields: Array<{
      display_name: string
      variable_name: string
      value: string
    }>
  }
  channels?: string[]
  plan?: string
  quantity?: number
  subaccount?: string
  split_code?: string
  transaction_charge?: number
  bearer?: 'account' | 'subaccount'
}

export class PaystackService {
  private static instance: PaystackService

  private constructor() {}

  static getInstance(): PaystackService {
    if (!PaystackService.instance) {
      PaystackService.instance = new PaystackService()
    }
    return PaystackService.instance
  }

  /**
   * Generate a unique payment reference
   */
  generateReference(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 15)
    return `omade_${timestamp}_${random}`
  }

  /**
   * Convert amount to kobo (Paystack expects amounts in kobo)
   */
  convertToKobo(amount: number): number {
    return Math.round(amount * 100)
  }

  /**
   * Initialize Paystack payment (uses PaystackPop V2 API)
   */
  initializePayment(config: PaystackConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const paystack = new PaystackPop()
        paystack.newTransaction({
          key: PAYSTACK_PUBLIC_KEY,
          email: config.email,
          amount: config.amount,
          currency: config.currency,
          reference: config.ref,
          metadata: config.metadata,
          channels: config.channels,
          onSuccess: (response) => {
            resolve(response)
            config.callback(response)
          },
          onCancel: () => {
            reject(new Error('Payment was cancelled'))
            config.onClose()
          },
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Prepare order data for Paystack
   */
  preparePaymentConfig(
    orderData: CheckoutFormData,
    totalAmount: number,
    orderItems: any[]
  ): PaystackConfig {
    const reference = this.generateReference()
    const amountInKobo = this.convertToKobo(totalAmount)

    return {
      email: orderData.email,
      amount: amountInKobo,
      currency: 'NGN',
      ref: reference,
      callback: () => {}, // Will be overridden
      onClose: () => {}, // Will be overridden
      metadata: {
        custom_fields: [
          {
            display_name: 'Order Type',
            variable_name: 'order_type',
            value: 'bakery_order',
          },
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: `${orderData.firstName} ${orderData.lastName}`,
          },
          {
            display_name: 'Delivery Method',
            variable_name: 'delivery_method',
            value: orderData.deliveryMethod,
          },
          {
            display_name: 'Phone',
            variable_name: 'phone',
            value: orderData.phone,
          },
          {
            display_name: 'Items Count',
            variable_name: 'items_count',
            value: orderItems.length.toString(),
          },
        ],
      },
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    }
  }

  /**
   * Verify payment status with retries and timeout handling
   */
  async verifyPayment(
    reference: string,
    maxRetries = 3,
    timeoutMs = 30000
  ): Promise<{ success: boolean; status: string; error?: string }> {
    let attempts = 0

    while (attempts < maxRetries) {
      try {
        attempts++
        console.log(
          `Verifying payment attempt ${attempts}/${maxRetries} for reference: ${reference}`
        )

        // Create a promise that races between the API call and timeout
        const verificationPromise = this.makeVerificationRequest(reference)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Verification timeout')), timeoutMs)
        )

        const result = await Promise.race([verificationPromise, timeoutPromise])

        if (result) {
          return { success: true, status: 'verified' }
        } else {
          throw new Error('Payment verification failed')
        }
      } catch (error) {
        console.error(`Payment verification attempt ${attempts} failed:`, error)

        if (attempts === maxRetries) {
          return {
            success: false,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 1000))
      }
    }

    return { success: false, status: 'failed', error: 'Max retry attempts exceeded' }
  }

  /**
   * Make the actual verification request
   */
  private async makeVerificationRequest(reference: string): Promise<boolean> {
    // In a real application, this should be done on the backend
    // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-payment/${reference}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // })
    //
    // if (!response.ok) {
    //   throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    // }
    //
    // const data = await response.json()
    // return data.status === 'success'

    // Simulated verification for demo - sometimes fails to test retry logic
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))

    // 10% chance of failure for testing
    if (Math.random() < 0.1) {
      throw new Error('Simulated verification failure')
    }

    return true
  }

  /**
   * Get supported banks for bank transfer
   */
  async getSupportedBanks(): Promise<any[]> {
    try {
      // This would typically fetch from Paystack API or your backend
      return [
        { name: 'Access Bank', code: 'access-bank' },
        { name: 'First Bank', code: 'first-bank' },
        { name: 'GTBank', code: 'gtbank' },
        { name: 'UBA', code: 'uba' },
        { name: 'Zenith Bank', code: 'zenith-bank' },
        { name: 'Fidelity Bank', code: 'fidelity-bank' },
      ]
    } catch (error) {
      console.error('Failed to fetch banks:', error)
      return []
    }
  }
}

// Export singleton instance
export const paystackService = PaystackService.getInstance()

// Utility functions
export const formatAmountForDisplay = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const calculateDeliveryFee = (state: string, subtotal: number): number => {
  // Free delivery thresholds
  const freeDeliveryThreshold = state === 'Lagos' ? 50000 : 75000

  if (subtotal >= freeDeliveryThreshold) {
    return 0
  }

  // Base delivery fees by state
  const deliveryFees: Record<string, number> = {
    Lagos: 2500,
    'FCT - Abuja': 3500,
    Rivers: 4000,
    Kano: 4500,
    Oyo: 3000,
    Kaduna: 4000,
  }

  return deliveryFees[state] || 5000 // Default fee for other states
}

// Type guards and validation
export const isValidPaystackResponse = (response: any): boolean => {
  return response && response.status === 'success' && response.reference
}

export const extractOrderFromPaystackResponse = (response: any) => {
  return {
    reference: response.reference,
    status: response.status,
    amount: response.amount,
    currency: response.currency,
    paidAt: new Date().toISOString(),
    gatewayResponse: response,
  }
}
