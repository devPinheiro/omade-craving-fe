import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Order, OrderStatus } from '@/types/order'
import {
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  RefreshCw,
  Truck,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface OrderStatusModalProps {
  order?: Order | null
  onStatusUpdate?: (orderId: string, newStatus: OrderStatus, notes?: string) => void
  onCancel?: () => void
  isOpen?: boolean
}

export function OrderStatusModal({
  order,
  onStatusUpdate,
  onCancel,
  isOpen = true,
}: OrderStatusModalProps) {
  const [newStatus, setNewStatus] = useState<OrderStatus>(order?.status || 'pending')
  const [notes, setNotes] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')

  if (!isOpen || !order) return null

  const statusOptions: {
    value: OrderStatus
    label: string
    description: string
    icon: React.ReactNode
  }[] = [
    {
      value: 'pending',
      label: 'Pending',
      description: 'Order received, awaiting processing',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      value: 'processing',
      label: 'Processing',
      description: 'Order is being prepared',
      icon: <Package className="h-4 w-4" />,
    },
    {
      value: 'shipped',
      label: 'Shipped',
      description: 'Order has been dispatched',
      icon: <Truck className="h-4 w-4" />,
    },
    {
      value: 'delivered',
      label: 'Delivered',
      description: 'Order has been delivered to customer',
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      description: 'Order has been cancelled',
      icon: <X className="h-4 w-4" />,
    },
    {
      value: 'refunded',
      label: 'Refunded',
      description: 'Order has been refunded',
      icon: <RefreshCw className="h-4 w-4" />,
    },
  ]

  const handleSubmit = () => {
    const updateNotes = notes.trim() || undefined
    onStatusUpdate?.(order.id, newStatus, updateNotes)
  }

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'border-yellow-200 bg-yellow-50',
      processing: 'border-blue-200 bg-blue-50',
      shipped: 'border-purple-200 bg-purple-50',
      delivered: 'border-green-200 bg-green-50',
      cancelled: 'border-red-200 bg-red-50',
      refunded: 'border-gray-200 bg-gray-50',
    }
    return colors[status] || 'border-gray-200 bg-gray-50'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Update Order Status</h2>
            <p className="text-sm text-gray-600 mt-1">
              Order #{order.orderNumber} • {order.customer.name}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-3 w-3 text-gray-400 mr-2" />
                  <span className="font-medium">
                    {order.customer
                      ? `${order.customer.firstName} ${order.customer.lastName}`
                      : 'Guest Customer'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-3 w-3 text-gray-400 mr-2" />
                  <span className="text-gray-600">{order.customer?.email || order.email}</span>
                </div>
                {order.customer?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 text-gray-400 mr-2" />
                    <span className="text-gray-600">{order.customer.phone}</span>
                  </div>
                )}
              </div>
              {order.shippingAddress && (
                <div className="space-y-2">
                  <div className="flex items-start">
                    <MapPin className="h-3 w-3 text-gray-400 mr-2 mt-0.5" />
                    <div className="text-gray-600">
                      <div className="font-medium">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </div>
                      <div>{order.shippingAddress.address1}</div>
                      {order.shippingAddress.address2 && (
                        <div>{order.shippingAddress.address2}</div>
                      )}
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
                        {order.shippingAddress.zip}
                      </div>
                      {order.shippingAddress.phone && <div>{order.shippingAddress.phone}</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Current Order Info */}
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Total:</span>
                <span className="ml-2 font-medium">${order.total.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">Items:</span>
                <span className="ml-2 font-medium">{order.items.length} items</span>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="ml-2">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Current Status:</span>
                <span className="ml-2 capitalize font-medium">{order.status}</span>
              </div>
              <div>
                <span className="text-gray-500">Subtotal:</span>
                <span className="ml-2">${order.subtotal.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">Shipping:</span>
                <span className="ml-2">${order.shipping.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Status Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">New Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {statusOptions.map((option) => (
                <div
                  key={option.value}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    newStatus === option.value
                      ? `${getStatusColor(option.value)} border-current`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setNewStatus(option.value)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`${newStatus === option.value ? 'text-current' : 'text-gray-400'}`}
                    >
                      {option.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Number - Show for shipped status */}
          {newStatus === 'shipped' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number (Optional)
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter tracking number"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="h-4 w-4 inline mr-1" />
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              placeholder="Add any notes about this status change..."
            />
            <p className="text-xs text-gray-500 mt-1">
              These notes will be visible to the customer and team members.
            </p>
          </div>

          {/* Order Items */}
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {order.items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{item.product.name}</div>
                        <div className="text-sm text-gray-600">{item.product.description}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                        </div>

                        {/* Customizations */}
                        {item.customCakeConfig && Object.keys(item.customCakeConfig).length > 0 && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                            <div className="text-xs font-medium text-blue-900 mb-1">
                              Customizations:
                            </div>
                            <div className="space-y-1 text-xs text-blue-800">
                              {item.customCakeConfig.size && (
                                <div>• Size: {item.customCakeConfig.size}</div>
                              )}
                              {item.customCakeConfig.flavor && (
                                <div>• Flavor: {item.customCakeConfig.flavor}</div>
                              )}
                              {item.customCakeConfig.layers && (
                                <div>• Layers: {item.customCakeConfig.layers}</div>
                              )}
                              {item.customCakeConfig.message && (
                                <div>• Message: "{item.customCakeConfig.message}"</div>
                              )}
                              {item.customCakeConfig.extras &&
                                item.customCakeConfig.extras.length > 0 && (
                                  <div>• Extras: {item.customCakeConfig.extras.join(', ')}</div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${item.total.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">
                        ${item.product.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
            disabled={newStatus === order.status}
          >
            Update Status
          </Button>
        </div>
      </div>
    </div>
  )
}
