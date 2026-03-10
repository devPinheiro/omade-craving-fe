import { ShopifyOrdersTable } from '@/components/organisms/ShopifyOrdersTable'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useOrderStats, useRecentOrders } from '@/hooks/useOrders'
import type { OrderStats } from '@/types/order'
import { createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react'

function normalizeStats(raw: OrderStats | undefined): {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
  orderGrowth: number
  revenueGrowth: number
} {
  if (!raw) {
    return {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      orderGrowth: 0,
      revenueGrowth: 0,
    }
  }
  const pending =
    raw.status_counts?.find((s) => s.status === 'pending')?.count ?? 0
  const completed =
    raw.status_counts?.find((s) => s.status === 'picked_up')?.count ?? 0
  const totalRevenue =
    raw.recent_orders?.reduce(
      (sum, o) => sum + Number.parseFloat(o.total_amount || '0'),
      0
    ) ?? 0
  const apiRevenue = (raw as { total_revenue?: number }).total_revenue
  return {
    totalOrders: raw.total_orders ?? 0,
    pendingOrders: pending,
    completedOrders: completed,
    totalRevenue: apiRevenue ?? totalRevenue,
    orderGrowth: (raw as { order_growth?: number }).order_growth ?? 0,
    revenueGrowth: (raw as { revenue_growth?: number }).revenue_growth ?? 0,
  }
}

function OrdersManagement() {
  const { data: rawStats, isLoading: statsLoading } = useOrderStats()
  const { data: recentOrders } = useRecentOrders(5)
  const stats = normalizeStats(rawStats)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
      </div>

      {/* Stats Cards - Shopify Style */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 bg-white border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-white border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Total orders</p>
                <ShoppingBag className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">
                  {stats.orderGrowth > 0 ? '+' : ''}{stats.orderGrowth}%
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <Clock className="h-4 w-4 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders || 0}</p>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowDownRight className="h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">
                  {stats.orderGrowth > 0 ? '+' : ''}{stats.orderGrowth}%
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedOrders || 0}</p>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">
                  {stats.orderGrowth > 0 ? '+' : ''}{stats.orderGrowth}%
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Total sales</p>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₦{stats.totalRevenue?.toLocaleString() || '0'}
              </p>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">
                  {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth}%
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Pending Orders Alert - Shopify Style */}
      {stats && (stats.pendingOrders || 0) > 10 && (
        <Card className="p-4 bg-orange-50 border border-orange-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-orange-800">
                    {stats.pendingOrders || 0} pending orders require attention
                  </h3>
                  <p className="text-sm text-orange-700 mt-1">
                    Review and process orders to maintain customer satisfaction
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Process all
                </Button>
              </div>

              {recentOrders && recentOrders.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {recentOrders.slice(0, 3).map((order) => (
                    <span
                      key={order.id}
                      className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-md"
                    >
                      #{order.orderNumber} - ${order.total}
                    </span>
                  ))}
                  {recentOrders.length > 3 && (
                    <span className="text-xs text-orange-700 px-2 py-1">
                      +{recentOrders.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Orders Table */}
      <ShopifyOrdersTable />
    </div>
  )
}

export const Route = createFileRoute('/_admin/orders')({
  component: OrdersManagement,
})
