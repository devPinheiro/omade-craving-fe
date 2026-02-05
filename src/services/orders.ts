import http from '@/lib/http'
import type {
  CreateOrderData,
  FulfillmentStatus,
  Order,
  OrderFilters,
  OrderStats,
  OrderStatus,
  PaginatedOrders,
  PaymentStatus,
  UpdateOrderData,
} from '@/types/order'

export const ordersService = {
  // Public Routes
  async getOrders(filters?: OrderFilters): Promise<PaginatedOrders> {
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

    const response = await http.get(`/api/v1/orders/admin/all?${params.toString()}`)

    // Transform the API response to match expected format
    const apiData = response.data
    return {
      orders: apiData.data.map((order: any) => ({
        id: order.id,
        orderNumber: order.order_number,
        customerId: order.user_id,
        customer: order.user
          ? {
              id: order.user.id,
              firstName: order.user.firstName || order.guest_name?.split(' ')[0] || '',
              lastName:
                order.user.lastName || order.guest_name?.split(' ').slice(1).join(' ') || '',
              email: order.user.email || order.guest_email,
              phone: order.user.phone || order.guest_phone,
            }
          : {
              id: '',
              firstName: order.guest_name?.split(' ')[0] || '',
              lastName: order.guest_name?.split(' ').slice(1).join(' ') || '',
              email: order.guest_email,
              phone: order.guest_phone,
            },
        email: order.guest_email,
        phone: order.guest_phone,
        items:
          order.orderItems?.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            product: {
              id: item.product.id,
              name: item.product.name,
              imageUrl: item.product.image_url,
              price: Number.parseFloat(item.product.price),
            },
            quantity: item.quantity,
            price: Number.parseFloat(item.unit_price),
            total: Number.parseFloat(item.subtotal),
          })) || [],
        subtotal:
          Number.parseFloat(order.total_amount) - Number.parseFloat(order.discount_amount || '0'),
        shipping: 0, // Add shipping if available in your API
        tax: 0, // Add tax if available in your API
        discount: Number.parseFloat(order.discount_amount || '0'),
        total: Number.parseFloat(order.total_amount),
        currency: 'NGN',
        status: order.status as OrderStatus,
        paymentStatus: order.payment_status as PaymentStatus,
        fulfillmentStatus: 'unfulfilled' as FulfillmentStatus, // Default value
        shippingAddress: {
          firstName: order.guest_name?.split(' ')[0] || '',
          lastName: order.guest_name?.split(' ').slice(1).join(' ') || '',
          company: '',
          address1: '', // Add if available in your API
          address2: '',
          city: '',
          province: '',
          country: 'Nigeria',
          zip: '',
          phone: order.guest_phone,
        },
        notes: order.staff_notes,
        tags: [],
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        processedAt: undefined,
        cancelledAt: undefined,
        refunds: [],
      })),
      pagination: apiData.pagination,
    }
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await http.get(`/api/v1/orders/${id}`)
    return response.data
  },

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await http.get(`/api/v1/orders/number/${orderNumber}`)
    const order = response.data.data

    // Transform single order response to match expected format
    return {
      id: order.id,
      orderNumber: order.order_number,
      customerId: order.user_id,
      customer: order.user
        ? {
            id: order.user.id,
            firstName: order.user.firstName || order.guest_name?.split(' ')[0] || '',
            lastName: order.user.lastName || order.guest_name?.split(' ').slice(1).join(' ') || '',
            email: order.user.email || order.guest_email,
            phone: order.user.phone || order.guest_phone,
          }
        : {
            id: '',
            firstName: order.guest_name?.split(' ')[0] || '',
            lastName: order.guest_name?.split(' ').slice(1).join(' ') || '',
            email: order.guest_email,
            phone: order.guest_phone,
          },
      email: order.guest_email,
      phone: order.guest_phone,
      items:
        order.orderItems?.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          product: {
            id: item.product.id,
            name: item.product.name,
            imageUrl: item.product.image_url,
            price: Number.parseFloat(item.product.price),
          },
          quantity: item.quantity,
          price: Number.parseFloat(item.unit_price),
          total: Number.parseFloat(item.subtotal),
        })) || [],
      subtotal:
        Number.parseFloat(order.total_amount) - Number.parseFloat(order.discount_amount || '0'),
      shipping: 0,
      tax: 0,
      discount: Number.parseFloat(order.discount_amount || '0'),
      total: Number.parseFloat(order.total_amount),
      currency: 'NGN',
      status: order.status as OrderStatus,
      paymentStatus: order.payment_status as PaymentStatus,
      fulfillmentStatus: 'unfulfilled' as FulfillmentStatus,
      shippingAddress: {
        firstName: order.guest_name?.split(' ')[0] || '',
        lastName: order.guest_name?.split(' ').slice(1).join(' ') || '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        province: '',
        country: 'Nigeria',
        zip: '',
        phone: order.guest_phone,
      },
      notes: order.staff_notes,
      tags: [],
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      processedAt: undefined,
      cancelledAt: undefined,
      refunds: [],
    }
  },

  // Admin/Staff Routes
  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await http.post('/api/v1/orders', data)
    return response.data
  },

  async updateOrder(data: UpdateOrderData): Promise<Order> {
    const { id, ...updateData } = data
    const response = await http.patch(`/api/v1/orders/${id}`, updateData)
    return response.data
  },

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const response = await http.patch(`/api/v1/orders/${id}/cancel`, { reason })
    return response.data
  },

  async fulfillOrder(id: string, trackingNumber?: string): Promise<Order> {
    const response = await http.patch(`/api/v1/orders/${id}/fulfill`, { trackingNumber })
    return response.data
  },

  async refundOrder(id: string, amount: number, reason: string): Promise<Order> {
    const response = await http.post(`/api/v1/orders/${id}/refund`, { amount, reason })
    return response.data
  },

  async deleteOrder(id: string): Promise<void> {
    await http.delete(`/api/v1/orders/${id}`)
  },

  // Analytics and Stats
  async getOrderStats(startDate?: string, endDate?: string): Promise<OrderStats> {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)

    const response = await http.get(`/api/v1/orders/stats?${params.toString()}`)
    return response.data.data || response.data
  },

  async getTodayOrders(): Promise<Order[]> {
    const today = new Date().toISOString().split('T')[0]
    const response = await http.get(`/api/v1/orders?startDate=${today}`)
    return response.data.orders
  },

  async getRecentOrders(limit = 10): Promise<Order[]> {
    const response = await http.get(`/api/v1/orders?limit=${limit}&sortBy=createdAt&sortOrder=desc`)
    return response.data.orders
  },

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    const response = await http.get(`/api/v1/orders?customerId=${customerId}`)
    return response.data.orders
  },

  async searchOrders(query: string, limit = 20): Promise<Order[]> {
    const response = await http.get(
      `/api/v1/orders/search?q=${encodeURIComponent(query)}&limit=${limit}`
    )
    return response.data
  },

  // Bulk Operations
  async bulkUpdateOrderStatus(
    orderIds: string[],
    status: OrderStatus
  ): Promise<{ success: boolean; updatedOrders: Order[] }> {
    const response = await http.patch('/api/v1/orders/bulk/status', { orderIds, status })
    return response.data
  },

  async bulkUpdatePaymentStatus(
    orderIds: string[],
    paymentStatus: PaymentStatus
  ): Promise<{ success: boolean; updatedOrders: Order[] }> {
    const response = await http.patch('/api/v1/orders/bulk/payment', { orderIds, paymentStatus })
    return response.data
  },

  async exportOrders(filters?: OrderFilters): Promise<Blob> {
    const params = new URLSearchParams()

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await http.get(`/api/v1/orders/export?${params.toString()}`, {
      responseType: 'blob',
    })
    return response.data
  },

  // Update order status with notes
  async updateOrderStatus(data: {
    orderId: string
    status: OrderStatus
    notes?: string
  }): Promise<Order> {
    const { orderId, ...updateData } = data
    const response = await http.patch(`/api/v1/orders/${orderId}/status`, updateData)
    return response.data
  },
}
