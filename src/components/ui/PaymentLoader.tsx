import { CheckCircle, CreditCard, Loader2, RefreshCw, Shield, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { announceToScreenReader, createFocusTrap } from '../../utils/accessibility'

export type PaymentStatus =
  | 'processing'
  | 'verifying'
  | 'creating_order'
  | 'success'
  | 'error'
  | 'timeout'
  | 'cancelled'

interface PaymentLoaderProps {
  isVisible: boolean
  status: PaymentStatus
  message?: string
  onRetry?: () => void
  onCancel?: () => void
  autoHideOnSuccess?: boolean
  successDelay?: number
}

const statusConfig = {
  processing: {
    icon: CreditCard,
    title: 'Processing Payment',
    description: 'Please wait while we process your payment securely...',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    showLoader: true,
  },
  verifying: {
    icon: Shield,
    title: 'Verifying Payment',
    description: "We're confirming your payment with the bank...",
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    showLoader: true,
  },
  creating_order: {
    icon: RefreshCw,
    title: 'Creating Your Order',
    description: "Almost done! We're setting up your order...",
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    showLoader: true,
  },
  success: {
    icon: CheckCircle,
    title: 'Payment Successful!',
    description: 'Your order has been placed successfully.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    showLoader: false,
  },
  error: {
    icon: X,
    title: 'Payment Failed',
    description: 'There was an issue processing your payment. Please try again.',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    showLoader: false,
  },
  timeout: {
    icon: X,
    title: 'Payment Timeout',
    description: 'Payment verification is taking longer than expected.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    showLoader: false,
  },
  cancelled: {
    icon: X,
    title: 'Payment Cancelled',
    description: 'Payment was cancelled. You can try again.',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    showLoader: false,
  },
}

export function PaymentLoader({
  isVisible,
  status,
  message,
  onRetry,
  onCancel,
  autoHideOnSuccess = true,
  successDelay = 2000,
}: PaymentLoaderProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const config = statusConfig[status]
  const IconComponent = config.icon
  
  // Announce status changes to screen readers
  useEffect(() => {
    if (isVisible) {
      const announcement = message || config.description
      announceToScreenReader(announcement, status === 'error' || status === 'timeout' ? 'assertive' : 'polite')
    }
  }, [status, isVisible, message, config.description])
  
  // Focus trap for modal
  useEffect(() => {
    if (isVisible) {
      const modalElement = document.querySelector('[role="dialog"]') as HTMLElement
      if (modalElement) {
        const cleanup = createFocusTrap(modalElement)
        return cleanup
      }
    }
  }, [isVisible])

  // Track time elapsed for timeout handling
  useEffect(() => {
    if (!isVisible || status === 'success' || status === 'error' || status === 'cancelled') {
      setTimeElapsed(0)
      return
    }

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible, status])

  // Auto hide on success
  useEffect(() => {
    if (status === 'success' && autoHideOnSuccess && onCancel) {
      const timeout = setTimeout(() => {
        onCancel()
      }, successDelay)

      return () => clearTimeout(timeout)
    }
  }, [status, autoHideOnSuccess, successDelay, onCancel])

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-overlay"
      role="dialog" 
      aria-modal="true"
      aria-labelledby="payment-title"
      aria-describedby="payment-description"
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-300 modal-content">
        {/* Status Icon */}
        <div
          className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 relative`}
        >
          <IconComponent className={`h-10 w-10 ${config.color}`} />
          {config.showLoader && (
            <div className="absolute inset-0 rounded-full">
              <Loader2 className="h-20 w-20 animate-spin text-gray-300" />
            </div>
          )}
        </div>

        {/* Status Title */}
        <h2 id="payment-title" className="text-2xl font-semibold text-gray-900 text-center mb-3">{config.title}</h2>

        {/* Description */}
        <p id="payment-description" className="text-gray-600 text-center mb-6">{message || config.description}</p>
        
        {/* Live region for status updates */}
        <div aria-live={status === 'error' || status === 'timeout' ? 'assertive' : 'polite'} aria-atomic="true" className="sr-only">
          {config.title}: {message || config.description}
        </div>

        {/* Progress Steps */}
        {(status === 'processing' || status === 'verifying' || status === 'creating_order') && (
          <div className="mb-6">
            <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{timeElapsed}s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  status === 'processing'
                    ? 'bg-blue-500 w-1/3'
                    : status === 'verifying'
                      ? 'bg-orange-500 w-2/3'
                      : status === 'creating_order'
                        ? 'bg-green-500 w-full'
                        : 'bg-gray-500 w-0'
                }`}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span className={status === 'processing' ? 'text-blue-600' : ''}>Payment</span>
              <span className={status === 'verifying' ? 'text-orange-600' : ''}>Verification</span>
              <span className={status === 'creating_order' ? 'text-green-600' : ''}>Order</span>
            </div>
          </div>
        )}

        {/* Timeout Warning */}
        {timeElapsed > 30 && (status === 'processing' || status === 'verifying') && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              This is taking longer than usual. Please wait a moment longer or try again.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Cancel/Close Button */}
          {(status === 'error' ||
            status === 'timeout' ||
            status === 'cancelled' ||
            status === 'success') &&
            onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium focus-enhanced"
                aria-label={status === 'success' ? 'Continue to order confirmation' : 'Close payment dialog'}
              >
                {status === 'success' ? 'Continue' : 'Close'}
              </button>
            )}

          {/* Retry Button */}
          {(status === 'error' || status === 'timeout') && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus-enhanced"
              aria-label="Retry payment process"
            >
              Retry Payment
            </button>
          )}

          {/* Force Close for Stuck States */}
          {timeElapsed > 60 &&
            (status === 'processing' || status === 'verifying' || status === 'creating_order') &&
            onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium focus-enhanced"
                aria-label="Cancel payment and try again"
              >
                Cancel & Try Again
              </button>
            )}
        </div>

        {/* Loading Dots for Processing States */}
        {config.showLoader && (
          <div className="flex justify-center mt-4 space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 ${config.color.replace('text-', 'bg-')} rounded-full animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )}

        {/* Security Notice */}
        {status === 'processing' && (
          <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
            <Shield className="h-3 w-3 mr-1" />
            <span>Secured by 256-bit SSL encryption</span>
          </div>
        )}
      </div>
    </div>
  )
}
