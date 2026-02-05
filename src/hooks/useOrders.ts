import { ordersService } from '@/services/orders'
import type {
  CreateOrderData,
  Order,
  OrderFilters,
  OrderStatus,
  PaymentStatus,
  UpdateOrderData,
} from '@/types/order'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Query Keys
export const ORDER_QUERY_KEYS = {
  all: ['orders'] as const,
  lists: () => [...ORDER_QUERY_KEYS.all, 'list'] as const,
  list: (filters: OrderFilters = {}) => [...ORDER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...ORDER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ORDER_QUERY_KEYS.details(), id] as const,
  stats: () => [...ORDER_QUERY_KEYS.all, 'stats'] as const,
  recent: () => [...ORDER_QUERY_KEYS.all, 'recent'] as const,
  today: () => [...ORDER_QUERY_KEYS.all, 'today'] as const,
  search: (query: string) => [...ORDER_QUERY_KEYS.all, 'search', query] as const,
}

// Orders List Hook
export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.list(filters),
    queryFn: () => ordersService.getOrders(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Single Order Hook
export function useOrder(id: string) {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.detail(id),
    queryFn: () => ordersService.getOrderById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Order by Number Hook
export function useOrderByNumber(orderNumber: string) {
  return useQuery({
    queryKey: [...ORDER_QUERY_KEYS.all, 'number', orderNumber],
    queryFn: () => ordersService.getOrderByNumber(orderNumber),
    enabled: !!orderNumber,
    staleTime: 5 * 60 * 1000,
  })
}

// Order Stats Hook
export function useOrderStats(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [...ORDER_QUERY_KEYS.stats(), startDate, endDate],
    queryFn: () => ordersService.getOrderStats(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  })
}

// Recent Orders Hook
export function useRecentOrders(limit = 10) {
  return useQuery({
    queryKey: [...ORDER_QUERY_KEYS.recent(), limit],
    queryFn: () => ordersService.getRecentOrders(limit),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Today's Orders Hook
export function useTodayOrders() {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.today(),
    queryFn: () => ordersService.getTodayOrders(),
    staleTime: 1 * 60 * 1000,
  })
}

// Search Orders Hook
export function useSearchOrders(query: string) {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.search(query),
    queryFn: () => ordersService.searchOrders(query),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000,
  })
}

// Customer Orders Hook
export function useCustomerOrders(customerId: string) {
  return useQuery({
    queryKey: [...ORDER_QUERY_KEYS.all, 'customer', customerId],
    queryFn: () => ordersService.getOrdersByCustomer(customerId),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
  })
}

// Mutations
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOrderData) => ordersService.createOrder(data),
    onSuccess: () => {
      // Invalidate orders lists and stats
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.stats() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.recent() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.today() })
    },
  })
}

export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateOrderData) => ordersService.updateOrder(data),
    onSuccess: (updatedOrder) => {
      // Update specific order in cache
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(updatedOrder.id), updatedOrder)

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.stats() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.recent() })
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      ordersService.cancelOrder(id, reason),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(updatedOrder.id), updatedOrder)
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.stats() })
    },
  })
}

export function useFulfillOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, trackingNumber }: { id: string; trackingNumber?: string }) =>
      ordersService.fulfillOrder(id, trackingNumber),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(updatedOrder.id), updatedOrder)
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.stats() })
    },
  })
}

export function useRefundOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, amount, reason }: { id: string; amount: number; reason: string }) =>
      ordersService.refundOrder(id, amount, reason),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(updatedOrder.id), updatedOrder)
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.stats() })
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ordersService.deleteOrder(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ORDER_QUERY_KEYS.detail(deletedId) })

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.stats() })
    },
  })
}

export function useBulkUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderIds, status }: { orderIds: string[]; status: OrderStatus }) =>
      ordersService.bulkUpdateOrderStatus(orderIds, status),
    onSuccess: () => {
      // Invalidate all order-related queries
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.all })
    },
  })
}

export function useBulkUpdatePaymentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderIds,
      paymentStatus,
    }: { orderIds: string[]; paymentStatus: PaymentStatus }) =>
      ordersService.bulkUpdatePaymentStatus(orderIds, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.all })
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { orderId: string; status: OrderStatus; notes?: string }) =>
      ordersService.updateOrderStatus(data),
    onSuccess: (updatedOrder, { orderId }) => {
      // Update specific order in cache
      queryClient.setQueryData(ORDER_QUERY_KEYS.detail(orderId), updatedOrder)

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.stats() })
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.recent() })
    },
  })
}

// Optimistic Updates Helper
export function useOptimisticOrderUpdate() {
  const queryClient = useQueryClient()

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    queryClient.setQueryData(ORDER_QUERY_KEYS.detail(orderId), (oldOrder: Order | undefined) =>
      oldOrder ? { ...oldOrder, ...updates } : undefined
    )
  }

  const revertOrder = (orderId: string) => {
    queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.detail(orderId) })
  }

  return { updateOrder, revertOrder }
}

// Prefetch Helpers
export function usePrefetchOrder() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ORDER_QUERY_KEYS.detail(id),
      queryFn: () => ordersService.getOrderById(id),
      staleTime: 5 * 60 * 1000,
    })
  }
}

export function usePrefetchOrders() {
  const queryClient = useQueryClient()

  return (filters: OrderFilters = {}) => {
    queryClient.prefetchQuery({
      queryKey: ORDER_QUERY_KEYS.list(filters),
      queryFn: () => ordersService.getOrders(filters),
      staleTime: 2 * 60 * 1000,
    })
  }
}
