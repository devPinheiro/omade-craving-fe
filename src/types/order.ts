export interface OrderItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    imageUrl?: string
    price: number
  }
  quantity: number
  price: number
  total: number
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  zip: string
  phone?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId?: string
  customer?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  email: string
  phone?: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount?: number
  total: number
  currency: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  notes?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  processedAt?: string
  cancelledAt?: string
  refunds?: OrderRefund[]
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  FAILED = 'failed',
}

export enum FulfillmentStatus {
  UNFULFILLED = 'unfulfilled',
  PARTIAL = 'partial',
  FULFILLED = 'fulfilled',
  RESTOCKED = 'restocked',
}

export interface OrderRefund {
  id: string
  orderId: string
  amount: number
  reason: string
  createdAt: string
}

export interface CreateOrderData {
  customerId?: string
  email: string
  phone?: string
  items: Array<{
    productId: string
    quantity: number
    price?: number
  }>
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  notes?: string
  tags?: string[]
}

export interface UpdateOrderData {
  id: string
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  fulfillmentStatus?: FulfillmentStatus
  notes?: string
  tags?: string[]
  shippingAddress?: ShippingAddress
  billingAddress?: ShippingAddress
}

export interface OrderFilters {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  fulfillmentStatus?: FulfillmentStatus
  customerId?: string
  email?: string
  search?: string
  startDate?: string
  endDate?: string
  minTotal?: number
  maxTotal?: number
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'total' | 'orderNumber'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedOrders {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface OrderStats {
  status_counts: Array<{
    status: string
    count: number
  }>
  payment_status_counts: Array<{
    payment_status: string
    count: number
  }>
  recent_orders: Array<{
    id: string
    user_id: string | null
    guest_email: string
    guest_phone: string
    guest_name: string
    status: string
    payment_status: string
    payment_method: string
    payment_reference: string | null
    total_amount: string
    discount_amount: string
    promo_code: string | null
    pickup_instructions: string | null
    preferred_pickup_date: string
    preferred_pickup_time: string | null
    order_number: string
    staff_notes: string | null
    createdAt: string
    updatedAt: string
    user: any | null
    orderItems: Array<{
      id: string
      order_id: string
      product_id: string
      quantity: number
      unit_price: string
      subtotal: string
      product: {
        id: string
        name: string
        price: string
        image_url: string
      }
    }>
  }>
  total_orders: number
}
