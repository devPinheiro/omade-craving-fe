import http from '@/lib/http'
import type {
  CreateAddressData,
  CreateCustomerData,
  Customer,
  CustomerActivity,
  CustomerAddress,
  CustomerFilters,
  CustomerStats,
  PaginatedCustomers,
  UpdateAddressData,
  UpdateCustomerData,
} from '@/types/customer'

// Transform API response fields from snake_case to camelCase
function transformCustomer(apiCustomer: any): Customer {
  return {
    id: apiCustomer.id,
    firstName: apiCustomer.first_name || apiCustomer.firstName,
    lastName: apiCustomer.last_name || apiCustomer.lastName,
    email: apiCustomer.email,
    phone: apiCustomer.phone,
    dateOfBirth: apiCustomer.date_of_birth || apiCustomer.dateOfBirth,
    gender: apiCustomer.gender,
    status: apiCustomer.status || 'active',
    verified: apiCustomer.verified ?? false,
    totalOrders: apiCustomer.total_orders ?? apiCustomer.totalOrders ?? 0,
    totalSpent:
      typeof apiCustomer.total_spent === 'string'
        ? Number.parseFloat(apiCustomer.total_spent)
        : (apiCustomer.total_spent ?? 0),
    averageOrderValue:
      typeof apiCustomer.average_order_value === 'string'
        ? Number.parseFloat(apiCustomer.average_order_value)
        : (apiCustomer.average_order_value ?? 0),
    lastOrderDate: apiCustomer.last_order_date || apiCustomer.lastOrderDate,
    registrationDate:
      apiCustomer.registration_date || apiCustomer.registrationDate || apiCustomer.createdAt,
    addresses: apiCustomer.addresses?.map(transformAddress) || [],
    tags: apiCustomer.tags || [],
    notes: apiCustomer.notes,
    createdAt: apiCustomer.createdAt || apiCustomer.created_at,
    updatedAt: apiCustomer.updatedAt || apiCustomer.updated_at,
  }
}

// Transform frontend data to API format (camelCase to snake_case)
function transformToApiFormat(frontendData: any): any {
  const apiData = { ...frontendData }

  if (frontendData.firstName) {
    apiData.first_name = frontendData.firstName
    delete apiData.firstName
  }

  if (frontendData.lastName) {
    apiData.last_name = frontendData.lastName
    delete apiData.lastName
  }

  if (frontendData.dateOfBirth) {
    apiData.date_of_birth = frontendData.dateOfBirth
    delete apiData.dateOfBirth
  }

  if (frontendData.totalOrders !== undefined) {
    apiData.total_orders = frontendData.totalOrders
    delete apiData.totalOrders
  }

  if (frontendData.totalSpent !== undefined) {
    apiData.total_spent = frontendData.totalSpent
    delete apiData.totalSpent
  }

  if (frontendData.averageOrderValue !== undefined) {
    apiData.average_order_value = frontendData.averageOrderValue
    delete apiData.averageOrderValue
  }

  if (frontendData.lastOrderDate) {
    apiData.last_order_date = frontendData.lastOrderDate
    delete apiData.lastOrderDate
  }

  if (frontendData.registrationDate) {
    apiData.registration_date = frontendData.registrationDate
    delete apiData.registrationDate
  }

  return apiData
}

function transformAddress(apiAddress: any): CustomerAddress {
  return {
    id: apiAddress.id,
    customerId: apiAddress.customer_id || apiAddress.customerId,
    type: apiAddress.type || 'shipping',
    firstName: apiAddress.first_name || apiAddress.firstName,
    lastName: apiAddress.last_name || apiAddress.lastName,
    company: apiAddress.company,
    address1: apiAddress.address1,
    address2: apiAddress.address2,
    city: apiAddress.city,
    province: apiAddress.province,
    country: apiAddress.country,
    zip: apiAddress.zip,
    phone: apiAddress.phone,
    isDefault: apiAddress.is_default ?? apiAddress.isDefault ?? false,
    createdAt: apiAddress.createdAt || apiAddress.created_at,
    updatedAt: apiAddress.updatedAt || apiAddress.updated_at,
  }
}

export const customersService = {
  // Get customers with filtering and pagination
  async getCustomers(filters?: CustomerFilters): Promise<PaginatedCustomers> {
    const params = new URLSearchParams()

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    const response = await http.get(`/api/v1/customers?${params.toString()}`)

    // Handle API response structure and transform field names
    const apiData = response.data.data || response.data
    return {
      customers: apiData.customers.map(transformCustomer),
      pagination: {
        page: apiData.page,
        limit: apiData.limit,
        total: apiData.total,
        totalPages: apiData.totalPages,
      },
    }
  },

  // Get single customer by ID
  async getCustomerById(id: string): Promise<Customer> {
    const response = await http.get(`/api/v1/customers/${id}`)
    const apiData = response.data.data || response.data
    return transformCustomer(apiData)
  },

  // Create new customer
  async createCustomer(data: CreateCustomerData): Promise<Customer> {
    const apiData = transformToApiFormat(data)
    const response = await http.post('/api/v1/customers', apiData)
    const responseData = response.data.data || response.data
    return transformCustomer(responseData)
  },

  // Update existing customer
  async updateCustomer(data: UpdateCustomerData): Promise<Customer> {
    const { id, ...updateData } = data
    const apiData = transformToApiFormat(updateData)
    const response = await http.patch(`/api/v1/customers/${id}`, apiData)
    const responseData = response.data.data || response.data
    return transformCustomer(responseData)
  },

  // Delete customer
  async deleteCustomer(id: string): Promise<void> {
    await http.delete(`/api/v1/customers/${id}`)
  },

  // Search customers
  async searchCustomers(query: string, limit = 10): Promise<Customer[]> {
    const response = await http.get(
      `/api/v1/customers/search?q=${encodeURIComponent(query)}&limit=${limit}`
    )
    const apiData = response.data.data || response.data
    return (apiData.customers || apiData).map(transformCustomer)
  },

  // Get customer statistics
  async getCustomerStats(): Promise<CustomerStats> {
    const response = await http.get('/api/v1/customers/stats')
    return response.data.data || response.data
  },

  // Get customer activity/timeline
  async getCustomerActivity(customerId: string): Promise<CustomerActivity[]> {
    const response = await http.get(`/api/v1/customers/${customerId}/activity`)
    return response.data.data || response.data
  },

  // Customer addresses management
  async getCustomerAddresses(customerId: string): Promise<CustomerAddress[]> {
    const response = await http.get(`/api/v1/customers/${customerId}/addresses`)
    const apiData = response.data.data || response.data
    return (apiData.addresses || apiData).map(transformAddress)
  },

  async addCustomerAddress(customerId: string, data: CreateAddressData): Promise<CustomerAddress> {
    const apiData = transformToApiFormat(data)
    const response = await http.post(`/api/v1/customers/${customerId}/addresses`, apiData)
    const responseData = response.data.data || response.data
    return transformAddress(responseData)
  },

  async updateCustomerAddress(
    customerId: string,
    data: UpdateAddressData
  ): Promise<CustomerAddress> {
    const { id, ...updateData } = data
    const apiData = transformToApiFormat(updateData)
    const response = await http.patch(`/api/v1/customers/${customerId}/addresses/${id}`, apiData)
    const responseData = response.data.data || response.data
    return transformAddress(responseData)
  },

  async deleteCustomerAddress(customerId: string, addressId: string): Promise<void> {
    await http.delete(`/api/v1/customers/${customerId}/addresses/${addressId}`)
  },

  // Bulk operations
  async bulkUpdateCustomers(
    customerIds: string[],
    updates: Partial<CreateCustomerData>
  ): Promise<{ success: boolean; updatedCustomers: Customer[] }> {
    const apiData = transformToApiFormat(updates)
    const response = await http.patch('/api/v1/customers/bulk', {
      customerIds,
      updates: apiData,
    })
    return response.data.data || response.data
  },

  async exportCustomers(filters?: CustomerFilters): Promise<Blob> {
    const params = new URLSearchParams()

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    const response = await http.get(`/api/v1/customers/export?${params.toString()}`, {
      responseType: 'blob',
    })
    return response.data
  },
}
