import { SalesChart } from '@/components/ui/SalesChart'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useOrderStats, useRecentOrders } from '@/hooks/useOrders'
import { useProductStats } from '@/hooks/useProducts'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  DollarSign,
  ExternalLink,
  Eye,
  MoreHorizontal,
  Package,
  Settings,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
  Warehouse,
} from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'increase' | 'decrease'
  period?: string
  icon?: React.ComponentType<{ className?: string }>
}

function MetricCard({
  title,
  value,
  change,
  changeType,
  period = 'vs last period',
  icon: Icon,
}: MetricCardProps) {
  return (
    <Card className="p-6 bg-white border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {Icon && <Icon className="h-4 w-4 text-gray-400" />}
        </div>

        <div className="space-y-1">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center space-x-1 text-sm">
              {changeType === 'increase' ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600 font-medium">+{change}</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                  <span className="text-red-600 font-medium">-{change}</span>
                </>
              )}
              <span className="text-gray-500">{period}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

function RecentOrders() {
  const { data: orders, isLoading } = useRecentOrders(5)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  if (isLoading) {
    return (
      <Card className="p-6 bg-white border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-0 bg-white border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent orders</h3>
          <Button variant="ghost" size="sm" className="text-sm text-blue-600 hover:text-blue-700">
            View all
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {orders?.length ? (
          orders.map((order) => (
            <div key={order.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {order.customer
                        ? `${order.customer.firstName} ${order.customer.lastName}`
                        : order.email}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(order.createdAt)}</p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No recent orders</p>
          </div>
        )}
      </div>
    </Card>
  )
}

function TopProducts() {
  const { data: productStats } = useProductStats()

  // Use recent products from API or fallback to empty array
  const products =
    productStats?.recent_products?.map((product) => ({
      name: product.name,
      sales: 'N/A', // Sales data not available in current API
      revenue: `$${product.price.toLocaleString()}`,
      category: product.category,
    })) || []

  return (
    <Card className="p-0 bg-white border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
          <Button variant="ghost" size="sm" className="text-sm text-blue-600 hover:text-blue-700">
            View all
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.name} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                    <Package className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.revenue}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p>No products found</p>
            <p className="text-sm">Add some products to see them here</p>
          </div>
        )}
      </div>
    </Card>
  )
}

export function AdminDashboard() {
  const { data: orderStats } = useOrderStats()
  const { data: productStats, isLoading, error } = useProductStats()

  // Temporary debug logging - remove in production
  if (import.meta.env.DEV) {
    console.log('ProductStats Debug:', {
      data: productStats,
      isLoading,
      error,
      overview: productStats?.overview,
      totalProducts: productStats?.overview?.total_products,
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Home</h1>
        <p className="text-gray-600 mt-1">Overview of your store</p>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Today</span>
          <Button variant="outline" size="sm" className="text-sm">
            {new Date().toLocaleDateString()}
            <MoreHorizontal className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Live View
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total sales"
          value={orderStats?.totalRevenue ? `$${orderStats.totalRevenue.toLocaleString()}` : '$0'}
          change="5%"
          changeType="increase"
          icon={DollarSign}
        />
        <MetricCard
          title="Orders"
          value={orderStats?.totalOrders?.toString() || '0'}
          change="8%"
          changeType="increase"
          icon={ShoppingCart}
        />
        <MetricCard
          title="Products"
          value={productStats?.overview?.total_products?.toString() || '0'}
          change="12%"
          changeType="increase"
          icon={Package}
        />
        <MetricCard
          title="Avg Order Value"
          value={
            orderStats?.averageOrderValue ? `$${orderStats.averageOrderValue.toFixed(2)}` : '$0'
          }
          change="2.3%"
          changeType="increase"
          icon={TrendingUp}
        />
      </div>

      {/* Inventory Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Inventory Value"
          value={
            productStats?.overview?.total_inventory_value
              ? `$${productStats.overview.total_inventory_value.toLocaleString()}`
              : '$0'
          }
          change="2%"
          changeType="increase"
          icon={Warehouse}
        />
        <MetricCard
          title="Low Stock Items"
          value={productStats?.overview?.low_stock_products?.toString() || '0'}
          change={
            productStats?.overview?.low_stock_products > 0
              ? `${productStats.overview.low_stock_products} items`
              : 'All good'
          }
          changeType={productStats?.overview?.low_stock_products > 0 ? 'decrease' : 'increase'}
          icon={AlertTriangle}
        />
        <MetricCard
          title="Out of Stock"
          value={productStats?.overview?.out_of_stock_products?.toString() || '0'}
          change={
            productStats?.overview?.out_of_stock_products > 0 ? 'Needs attention' : 'All in stock'
          }
          changeType={productStats?.overview?.out_of_stock_products > 0 ? 'decrease' : 'increase'}
          icon={Package}
        />
        <MetricCard
          title="Categories"
          value={productStats?.categories?.distribution?.length?.toString() || '0'}
          change="Active categories"
          changeType="increase"
          icon={BarChart3}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <RecentOrders />

        {/* Top Products */}
        <TopProducts />
      </div>

      {/* Sales Chart */}
      <SalesChart period="7d" />
    </div>
  )
}
