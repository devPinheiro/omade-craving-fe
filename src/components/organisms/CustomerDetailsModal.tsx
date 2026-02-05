import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Customer } from '@/types/customer'
import {
  Calendar,
  Check,
  DollarSign,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingCart,
  Tag,
  User,
  X,
} from 'lucide-react'

interface CustomerDetailsModalProps {
  customer?: Customer | null
  onClose?: () => void
  isOpen?: boolean
}

export function CustomerDetailsModal({
  customer,
  onClose,
  isOpen = true,
}: CustomerDetailsModalProps) {
  if (!isOpen || !customer) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              {customer.firstName} {customer.lastName}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{customer.totalOrders}</div>
              <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
                <ShoppingCart className="h-3 w-3 mr-1" />
                Total Orders
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(customer.totalSpent)}
              </div>
              <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
                <DollarSign className="h-3 w-3 mr-1" />
                Total Spent
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(customer.averageOrderValue)}
              </div>
              <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
                <DollarSign className="h-3 w-3 mr-1" />
                Avg Order Value
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Never'}
              </div>
              <div className="text-sm text-gray-500 flex items-center justify-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                Last Order
              </div>
            </Card>
          </div>

          {/* Customer Information */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{customer.email}</p>
                  </div>
                </div>
                {customer.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{customer.phone}</p>
                    </div>
                  </div>
                )}
                {customer.dateOfBirth && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">{formatDate(customer.dateOfBirth)}</p>
                  </div>
                )}
                {customer.gender && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900 capitalize">{customer.gender}</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : customer.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : customer.status === 'suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <span className="capitalize">{customer.status}</span>
                    </span>
                    {customer.verified && (
                      <div className="flex items-center text-green-600 ml-3">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-sm">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Member Since</label>
                  <p className="text-gray-900">{formatDate(customer.registrationDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer ID</label>
                  <p className="text-gray-900 font-mono text-sm">{customer.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">{formatDate(customer.updatedAt)}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tags */}
          {customer.tags && customer.tags.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Addresses */}
          {customer.addresses && customer.addresses.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Addresses
              </h3>
              <div className="space-y-4">
                {customer.addresses.map((address) => (
                  <div key={address.id} className="border border-gray-200 rounded-lg p-4 relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {address.type} Address
                        </span>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
                        {address.firstName} {address.lastName}
                      </p>
                      {address.company && <p>{address.company}</p>}
                      <p>{address.address1}</p>
                      {address.address2 && <p>{address.address2}</p>}
                      <p>
                        {address.city}, {address.province} {address.zip}
                      </p>
                      <p>{address.country}</p>
                      {address.phone && <p>Phone: {address.phone}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Notes */}
          {customer.notes && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{customer.notes}</p>
            </Card>
          )}

          {/* Order History Placeholder */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Recent Orders
            </h3>
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>Order history integration coming soon</p>
              <p className="text-sm">This will show the customer's recent orders with details</p>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">Edit Customer</Button>
        </div>
      </div>
    </div>
  )
}
