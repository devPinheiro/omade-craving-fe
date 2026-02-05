export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  status: CustomerStatus
  verified: boolean
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: string
  registrationDate: string
  addresses?: CustomerAddress[]
  tags?: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export interface CustomerAddress {
  id: string
  customerId: string
  type: AddressType
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
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export enum AddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing',
  BOTH = 'both',
}

export interface CreateCustomerData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  status?: CustomerStatus
  tags?: string[]
  notes?: string
  addresses?: Omit<CustomerAddress, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>[]
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {
  id: string
}

export interface CustomerFilters {
  status?: CustomerStatus
  verified?: boolean
  search?: string
  email?: string
  phone?: string
  registrationDateStart?: string
  registrationDateEnd?: string
  minTotalSpent?: number
  maxTotalSpent?: number
  minOrders?: number
  maxOrders?: number
  tags?: string[]
  page?: number
  limit?: number
  sortBy?:
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'totalSpent'
    | 'totalOrders'
    | 'createdAt'
    | 'lastOrderDate'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedCustomers {
  customers: Customer[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  newCustomersThisMonth: number
  averageCustomerValue: number
  totalCustomerValue: number
  repeatCustomerRate: number
  topSpenders: Array<{
    id: string
    name: string
    email: string
    totalSpent: number
    totalOrders: number
  }>
}

export interface CustomerActivity {
  id: string
  customerId: string
  type: ActivityType
  description: string
  metadata?: Record<string, any>
  createdAt: string
}

export enum ActivityType {
  ORDER_PLACED = 'order_placed',
  ORDER_CANCELLED = 'order_cancelled',
  ORDER_REFUNDED = 'order_refunded',
  PROFILE_UPDATED = 'profile_updated',
  ADDRESS_ADDED = 'address_added',
  ADDRESS_UPDATED = 'address_updated',
  NOTE_ADDED = 'note_added',
  STATUS_CHANGED = 'status_changed',
  EMAIL_SENT = 'email_sent',
}

export interface CreateAddressData
  extends Omit<CustomerAddress, 'id' | 'customerId' | 'createdAt' | 'updatedAt'> {}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: string
}
