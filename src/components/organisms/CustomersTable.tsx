import { CustomerDetailsModal } from '@/components/organisms/CustomerDetailsModal'
import { CustomerForm } from '@/components/organisms/CustomerForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  useBulkUpdateCustomers,
  useCustomers,
  useDeleteCustomer,
  useExportCustomers,
} from '@/hooks/useCustomers'
import type { Customer, CustomerFilters, CustomerStatus } from '@/types/customer'
import {
  ArrowUpDown,
  Calendar,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  UserCheck,
  UserX,
} from 'lucide-react'
import { useState } from 'react'

interface CustomersTableProps {
  filters?: CustomerFilters
}

export function CustomersTable({ filters = {} }: CustomersTableProps) {
  const [currentFilters, setCurrentFilters] = useState<CustomerFilters>(filters)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null)
  const { data, isLoading, error } = useCustomers(currentFilters)
  const deleteCustomerMutation = useDeleteCustomer()
  const bulkUpdateMutation = useBulkUpdateCustomers()
  const exportMutation = useExportCustomers()

  const handleSelectAll = () => {
    if (selectedCustomers.length === data?.customers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(data?.customers.map((c) => c.id) || [])
    }
  }

  const handleSelectCustomer = (customerId: string) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId))
    } else {
      setSelectedCustomers([...selectedCustomers, customerId])
    }
  }

  const getStatusColor = (status: CustomerStatus) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: CustomerStatus) => {
    const icons = {
      active: UserCheck,
      inactive: UserX,
      suspended: UserX,
      pending: User,
    }
    const Icon = icons[status] || User
    return <Icon className="h-3 w-3" />
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowCustomerForm(true)
  }

  const handleCreateCustomer = () => {
    setEditingCustomer(null)
    setShowCustomerForm(true)
  }

  const handleCloseForm = () => {
    setShowCustomerForm(false)
    setEditingCustomer(null)
  }

  const handleCustomerSaved = (customer: Customer) => {
    setShowCustomerForm(false)
    setEditingCustomer(null)
  }

  const handleViewCustomer = (customer: Customer) => {
    setViewingCustomer(customer)
    setShowCustomerDetails(true)
  }

  const handleCloseDetails = () => {
    setShowCustomerDetails(false)
    setViewingCustomer(null)
  }

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomerMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete customer:', error)
        alert('Failed to delete customer. Please try again.')
      }
    }
  }

  const handleBulkStatusUpdate = async (newStatus: CustomerStatus) => {
    if (selectedCustomers.length === 0) return

    try {
      await bulkUpdateMutation.mutateAsync({
        customerIds: selectedCustomers,
        updates: { status: newStatus },
      })
      setSelectedCustomers([])
    } catch (error) {
      console.error('Failed to update customers:', error)
      alert('Failed to update customers. Please try again.')
    }
  }

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync(currentFilters)
    } catch (error) {
      console.error('Failed to export customers:', error)
      alert('Failed to export customers. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (isLoading) {
    return (
      <Card className="p-0 bg-white border border-gray-200">
        <div className="p-12 flex items-center justify-center">
          <div className="text-gray-500">Loading customers...</div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-0 bg-white border border-gray-200">
        <div className="p-6">
          <div className="text-red-500">Error loading customers: {error.message}</div>
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
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setCurrentFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            onChange={(e) =>
              setCurrentFilters((prev) => ({
                ...prev,
                status: (e.target.value as CustomerStatus) || undefined,
              }))
            }
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More filters
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={handleCreateCustomer}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add customer
          </Button>
        </div>
      </div>

      {/* Customers Table */}
      <Card className="p-0 bg-white border border-gray-200">
        {data?.customers?.length ? (
          <>
            {/* Table Header Actions */}
            {selectedCustomers.length > 0 && (
              <div className="p-4 bg-blue-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''}{' '}
                    selected
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusUpdate('active')}
                    >
                      Mark as active
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusUpdate('inactive')}
                    >
                      Mark as inactive
                    </Button>
                    <Button variant="outline" size="sm">
                      Export selected
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
                        checked={selectedCustomers.length === data.customers.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <div className="flex items-center space-x-1">
                        <span>Customer</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Orders
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Total Spent
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Joined
                    </th>
                    <th className="w-10 py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data.customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => handleSelectCustomer(customer.id)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">ID: {customer.id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-3 w-3 mr-1 text-gray-400" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(customer.status)}`}
                        >
                          {getStatusIcon(customer.status)}
                          <span className="ml-1 capitalize">{customer.status}</span>
                        </span>
                        {customer.verified && (
                          <div className="text-xs text-green-600 mt-1">✓ Verified</div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.totalOrders} orders
                        </div>
                        {customer.lastOrderDate && (
                          <div className="text-xs text-gray-500">
                            Last: {formatDate(customer.lastOrderDate)}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(customer.totalSpent)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Avg: {formatCurrency(customer.averageOrderValue)}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(customer.registrationDate)}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                            title="View customer details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                            title="Edit customer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCustomer(customer.id)}
                            disabled={deleteCustomerMutation.isPending}
                            className="text-red-600 hover:text-red-800"
                            title="Delete customer"
                          >
                            <Trash2 className="h-4 w-4" />
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
                  {data.pagination.total} customers
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
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first customer.</p>
            <Button onClick={handleCreateCustomer} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add customer
            </Button>
          </div>
        )}
      </Card>

      {/* Customer Form Modal */}
      <CustomerForm
        customer={editingCustomer}
        isOpen={showCustomerForm}
        onSave={handleCustomerSaved}
        onCancel={handleCloseForm}
      />

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        customer={viewingCustomer}
        isOpen={showCustomerDetails}
        onClose={handleCloseDetails}
      />
    </div>
  )
}
