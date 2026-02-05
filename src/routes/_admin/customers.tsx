import { CustomersTable } from '@/components/organisms/CustomersTable'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCustomerStats } from '@/hooks/useCustomers'
import { createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Crown,
  DollarSign,
  Mail,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react'

function CustomersManagement() {
  const { data: stats } = useCustomerStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships and data</p>
        </div>
      </div>

      {/* Stats Cards - Shopify Style */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-white border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Total customers</p>
                <Users className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
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
                <p className="text-sm font-medium text-gray-600">Active customers</p>
                <UserCheck className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
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
                <p className="text-sm font-medium text-gray-600">New this month</p>
                <UserPlus className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.newCustomersThisMonth}</p>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-green-600 font-medium">+25%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Avg customer value</p>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.averageCustomerValue.toLocaleString()}
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

      {/* Top Spenders Widget */}
      {stats?.topSpenders && stats.topSpenders.length > 0 && (
        <Card className="p-6 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Crown className="h-5 w-5 mr-2 text-yellow-500" />
              Top Customers
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.topSpenders.slice(0, 3).map((customer, index) => (
              <div key={customer.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{customer.name}</div>
                    <div className="text-sm text-gray-500 truncate">{customer.email}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-green-600">
                        ${customer.totalSpent.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">{customer.totalOrders} orders</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Additional Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Insights</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total customer value</span>
                <span className="font-medium text-gray-900">
                  ${stats.totalCustomerValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Repeat customer rate</span>
                <span className="font-medium text-gray-900">
                  {(stats.repeatCustomerRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active vs Total</span>
                <span className="font-medium text-gray-900">
                  {((stats.activeCustomers / stats.totalCustomers) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send newsletter to all customers
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Export customer list
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View customer analytics
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Customers Table */}
      <CustomersTable />
    </div>
  )
}

export const Route = createFileRoute('/_admin/customers')({
  component: CustomersManagement,
})
