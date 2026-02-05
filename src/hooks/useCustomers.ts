import { customersService } from '@/services/customers'
import type {
  CreateAddressData,
  CreateCustomerData,
  Customer,
  CustomerActivity,
  CustomerFilters,
  CustomerStats,
  UpdateAddressData,
  UpdateCustomerData,
} from '@/types/customer'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Query Keys
export const CUSTOMER_QUERY_KEYS = {
  all: ['customers'] as const,
  lists: () => [...CUSTOMER_QUERY_KEYS.all, 'list'] as const,
  list: (filters: CustomerFilters = {}) => [...CUSTOMER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...CUSTOMER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CUSTOMER_QUERY_KEYS.details(), id] as const,
  stats: () => [...CUSTOMER_QUERY_KEYS.all, 'stats'] as const,
  search: (query: string) => [...CUSTOMER_QUERY_KEYS.all, 'search', query] as const,
  activity: (customerId: string) => [...CUSTOMER_QUERY_KEYS.all, 'activity', customerId] as const,
  addresses: (customerId: string) => [...CUSTOMER_QUERY_KEYS.all, 'addresses', customerId] as const,
}

// Customers List Hook
export function useCustomers(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.list(filters),
    queryFn: () => customersService.getCustomers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Single Customer Hook
export function useCustomer(id: string) {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.detail(id),
    queryFn: () => customersService.getCustomerById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Customer Stats Hook
export function useCustomerStats() {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.stats(),
    queryFn: () => customersService.getCustomerStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Search Customers Hook
export function useSearchCustomers(query: string) {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.search(query),
    queryFn: () => customersService.searchCustomers(query),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Customer Activity Hook
export function useCustomerActivity(customerId: string) {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.activity(customerId),
    queryFn: () => customersService.getCustomerActivity(customerId),
    enabled: !!customerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Customer Addresses Hook
export function useCustomerAddresses(customerId: string) {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.addresses(customerId),
    queryFn: () => customersService.getCustomerAddresses(customerId),
    enabled: !!customerId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Customer Mutations
export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCustomerData) => customersService.createCustomer(data),
    onSuccess: () => {
      // Invalidate customers lists and stats
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.stats() })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCustomerData) => customersService.updateCustomer(data),
    onSuccess: (updatedCustomer) => {
      // Update specific customer in cache
      queryClient.setQueryData(CUSTOMER_QUERY_KEYS.detail(updatedCustomer.id), updatedCustomer)

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.stats() })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => customersService.deleteCustomer(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: CUSTOMER_QUERY_KEYS.detail(deletedId) })

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.stats() })
    },
  })
}

// Address Mutations
export function useAddCustomerAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: CreateAddressData }) =>
      customersService.addCustomerAddress(customerId, data),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.addresses(customerId) })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.detail(customerId) })
    },
  })
}

export function useUpdateCustomerAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: UpdateAddressData }) =>
      customersService.updateCustomerAddress(customerId, data),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.addresses(customerId) })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.detail(customerId) })
    },
  })
}

export function useDeleteCustomerAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerId, addressId }: { customerId: string; addressId: string }) =>
      customersService.deleteCustomerAddress(customerId, addressId),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.addresses(customerId) })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.detail(customerId) })
    },
  })
}

// Bulk Operations
export function useBulkUpdateCustomers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      customerIds,
      updates,
    }: { customerIds: string[]; updates: Partial<CreateCustomerData> }) =>
      customersService.bulkUpdateCustomers(customerIds, updates),
    onSuccess: () => {
      // Invalidate all customer-related queries
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.all })
    },
  })
}

// Export Hook
export function useExportCustomers() {
  return useMutation({
    mutationFn: (filters?: CustomerFilters) => customersService.exportCustomers(filters),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
  })
}

// Optimistic Updates Helper
export function useOptimisticCustomerUpdate() {
  const queryClient = useQueryClient()

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    queryClient.setQueryData(
      CUSTOMER_QUERY_KEYS.detail(customerId),
      (oldCustomer: Customer | undefined) =>
        oldCustomer ? { ...oldCustomer, ...updates } : undefined
    )
  }

  const revertCustomer = (customerId: string) => {
    queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.detail(customerId) })
  }

  return { updateCustomer, revertCustomer }
}

// Prefetch Helpers
export function usePrefetchCustomer() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: CUSTOMER_QUERY_KEYS.detail(id),
      queryFn: () => customersService.getCustomerById(id),
      staleTime: 10 * 60 * 1000,
    })
  }
}

export function usePrefetchCustomers() {
  const queryClient = useQueryClient()

  return (filters: CustomerFilters = {}) => {
    queryClient.prefetchQuery({
      queryKey: CUSTOMER_QUERY_KEYS.list(filters),
      queryFn: () => customersService.getCustomers(filters),
      staleTime: 5 * 60 * 1000,
    })
  }
}
