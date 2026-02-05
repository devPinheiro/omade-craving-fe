import { ShopifyProductsTable } from '@/components/organisms/ShopifyProductsTable'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLowStockProducts, useProductStats } from '@/hooks/useProducts'
import { createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  Eye,
  Package,
  Plus,
  TrendingUp,
} from 'lucide-react'

function ProductsManagement() {
  const { data: stats } = useProductStats()
  const { data: lowStockProducts } = useLowStockProducts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory and catalog</p>
        </div>
      </div>

      {/* Stats Cards - Shopify Style */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-white border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">All products</p>
                <Package className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.overview?.total_products || 0}
              </p>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <Eye className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.overview?.total_products || 0) -
                  (stats.overview?.out_of_stock_products || 0)}
              </p>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">+8%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Low inventory</p>
                <AlertTriangle className="h-4 w-4 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.overview?.low_stock_products || 0}
              </p>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowDownRight className="h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">-5%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Total inventory value</p>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${(stats.overview?.total_inventory_value || 0).toLocaleString()}
              </p>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">+15%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Low Stock Alert - Shopify Style */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <Card className="p-4 bg-orange-50 border border-orange-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-orange-800">
                    {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} low in
                    stock
                  </h3>
                  <p className="text-sm text-orange-700 mt-1">Restock soon to avoid stockouts</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  View all
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {lowStockProducts.slice(0, 3).map((product) => (
                  <span
                    key={product.id}
                    className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-md"
                  >
                    {product.name} ({product.currentStock} left)
                  </span>
                ))}
                {lowStockProducts.length > 3 && (
                  <span className="text-xs text-orange-700 px-2 py-1">
                    +{lowStockProducts.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Products Table */}
      <ShopifyProductsTable />
    </div>
  )
}

export const Route = createFileRoute('/_admin/products')({
  component: ProductsManagement,
})
