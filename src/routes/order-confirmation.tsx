import { PublicLayout } from '@/components/templates/PublicLayout'
import { ordersService } from '@/services/orders'
import { formatAmountForDisplay } from '@/services/paystack'
import type { Order } from '@/types/order'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle, Clock, Loader2, Mail, Phone, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/order-confirmation')({
  component: OrderConfirmationRoute,
  validateSearch: (search) => ({
    orderId: (search.orderId as string) || '',
  }),
})

function OrderConfirmationRoute() {
  const { orderId } = Route.useSearch()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No order ID provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const orderData = await ordersService.getOrderById(orderId)
        setOrder(orderData)
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError('Failed to load order details')
        toast.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (error || !order) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find the order you're looking for."}
            </p>
            <a
              href="/shop"
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-block"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div data-order className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-wide">
            ORDER CONFIRMED!
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Thank you for your order, {order.customer?.firstName || 'valued customer'}. We'll start
            preparing your delicious items right away.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-xl font-medium text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-medium text-gray-900">
                  {formatAmountForDisplay(order.total)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium text-gray-900">
                  {formatAmountForDisplay(item.total)}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatAmountForDisplay(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="text-gray-900">{formatAmountForDisplay(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatAmountForDisplay(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Delivery Information</h2>
          <div className="space-y-2">
            <p className="font-medium text-gray-900">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p className="text-gray-600">{order.shippingAddress.address1}</p>
            {order.shippingAddress.address2 && (
              <p className="text-gray-600">{order.shippingAddress.address2}</p>
            )}
            <p className="text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
              {order.shippingAddress.zip}
            </p>
            {order.shippingAddress.phone && (
              <p className="text-gray-600">{order.shippingAddress.phone}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* What Happens Next */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">What happens next?</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Order Processing</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We'll review your order and start baking your items within 2 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <Truck className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Delivery Preparation</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your order will be carefully packaged for delivery or pickup.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Order Ready</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We'll notify you when your order is ready for delivery or pickup.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Need Help?</h2>

            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">+234 801 234 5678</span>
              </div>

              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">support@omadecravings.com</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              If you have any questions about your order, please don't hesitate to contact us. We're
              here to help make sure your experience is perfect!
            </p>
          </div>

          {/* Continue Shopping */}
          <div className="text-center">
            <a
              href="/shop"
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-block font-medium"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
