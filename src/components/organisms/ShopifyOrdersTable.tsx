import { OrderStatusModal } from '@/components/organisms/OrderStatusModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders'
import { usePermissions } from '@/hooks/usePermissions'
import type { Order, OrderFilters, OrderStatus } from '@/types/order'
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface ShopifyOrdersTableProps {
  filters?: OrderFilters
}

export function ShopifyOrdersTable({ filters = {} }: ShopifyOrdersTableProps) {
  const [currentFilters, setCurrentFilters] = useState<OrderFilters>(filters)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const { data, isLoading, error } = useOrders(currentFilters)
  const updateStatusMutation = useUpdateOrderStatus()
  const hasPermission = usePermissions()

  const canEdit = hasPermission('orders:write') || hasPermission('admin:access')

  const handleSelectAll = () => {
    if (selectedOrders.length === data?.orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(data?.orders.map((o) => o.id) || [])
    }
  }

  const handleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: OrderStatus) => {
    const icons: Record<string, any> = {
      pending: Clock,
      confirmed: Package,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: X,
      refunded: RefreshCw,
    }
    const Icon = icons[status] || Clock
    return <Icon className="h-3 w-3" />
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setShowStatusModal(true)
  }

  const handleCloseModal = () => {
    setShowStatusModal(false)
    setEditingOrder(null)
  }

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus, notes?: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        orderId,
        status: newStatus,
        notes,
      })
      setShowStatusModal(false)
      setEditingOrder(null)
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className="p-0 bg-white border border-gray-200">
        <div className="p-12 flex items-center justify-center">
          <div className="text-gray-500">Loading orders...</div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-0 bg-white border border-gray-200">
        <div className="p-6">
          <div className="text-red-500">Error loading orders: {error.message}</div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search Bar */}
      <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setCurrentFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            onChange={(e) =>
              setCurrentFilters((prev) => ({
                ...prev,
                status: (e.target.value as OrderStatus) || undefined,
              }))
            }
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More filters
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="p-0 bg-white border border-gray-200">
        {data?.orders?.length ? (
          <>
            {/* Table Header Actions */}
            {selectedOrders.length > 0 && (
              <div className="p-4 bg-blue-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Export selected
                    </Button>
                    <Button variant="outline" size="sm">
                      Mark as shipped
                    </Button>
                    <Button variant="outline" size="sm">
                      Mark as delivered
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="w-10 py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === data.orders.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <div className="flex items-center space-x-1">
                        <span>Order</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Items
                    </th>
                    <th className="w-10 py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                          #{order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">{order.id.slice(-8)}</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer
                            ? `${order.customer.firstName} ${order.customer.lastName}`
                            : 'Guest'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customer?.email || order.email}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="truncate max-w-xs">
                              {item.quantity}x {item.product.name}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{order.items.length - 2} more
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Package className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.pagination && data.pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-500">
                  Showing {(data.pagination.page - 1) * data.pagination.limit + 1}-
                  {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
                  {data.pagination.total} orders
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.pagination.page === 1}
                    onClick={() =>
                      setCurrentFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) - 1,
                      }))
                    }
                  >
                    Previous
                  </Button>

                  <span className="px-3 py-1 text-sm bg-white border rounded">
                    {data.pagination.page} of {data.pagination.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.pagination.page === data.pagination.totalPages}
                    onClick={() =>
                      setCurrentFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) + 1,
                      }))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Orders will appear here when customers make purchases.</p>
          </div>
        )}
      </Card>

      {/* Order Status Modal */}
      <OrderStatusModal
        order={editingOrder}
        isOpen={showStatusModal}
        onStatusUpdate={handleStatusUpdate}
        onCancel={handleCloseModal}
      />
    </div>
  )
}
