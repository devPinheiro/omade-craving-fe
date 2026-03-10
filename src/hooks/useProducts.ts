import { productsService } from '@/services/products'
import { useProductsStore } from '@/store/products'
import type {
  BulkStockUpdate,
  Category,
  CreateCategoryData,
  CreateProductData,
  Product,
  ProductFilters,
  UpdateCategoryData,
  UpdateProductData,
  UpdateStockData,
} from '@/types/product'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'

// Query Keys
export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (filters: ProductFilters = {}) => [...PRODUCT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCT_QUERY_KEYS.details(), id] as const,
  categories: () => [...PRODUCT_QUERY_KEYS.all, 'categories'] as const,
  lowStock: () => [...PRODUCT_QUERY_KEYS.all, 'low-stock'] as const,
  stats: () => [...PRODUCT_QUERY_KEYS.all, 'stats'] as const,
  search: (query: string) => [...PRODUCT_QUERY_KEYS.all, 'search', query] as const,
}

// Products List Hook
export function useProducts(filters: ProductFilters = {}) {
  const { setFilters } = useProductsStore()

  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(filters),
    queryFn: () => productsService.getProducts(filters),
    onSuccess: () => {
      setFilters(filters)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Single Product Hook
export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: () => productsService.getProductById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Categories Hook
export function useCategories() {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.categories(),
    queryFn: () => productsService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Low Stock Products Hook
export function useLowStockProducts() {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.lowStock(),
    queryFn: () => productsService.getLowStockProducts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Product Stats Hook
export function useProductStats() {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.stats(),
    queryFn: () => productsService.getProductStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Search Products Hook
export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.search(query),
    queryFn: () => productsService.searchProducts(query),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Featured Products Hook
export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEYS.all, 'featured', limit],
    queryFn: () => productsService.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Products by Category Hook
export function useProductsByCategory(categoryId: string, filters: Partial<ProductFilters> = {}) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list({ ...filters, category: categoryId }),
    queryFn: () => productsService.getProductsByCategory(categoryId, filters),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutations
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductData) => productsService.createProduct(data),
    onSuccess: () => {
      // Invalidate products lists
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.stats() })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProductData) => productsService.updateProduct(data),
    onSuccess: (updatedProduct) => {
      // Update specific product in cache
      queryClient.setQueryData(PRODUCT_QUERY_KEYS.detail(updatedProduct.id), updatedProduct)

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.stats() })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(deletedId) })

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.stats() })
    },
  })
}

export function useUpdateProductStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateStockData) => productsService.updateProductStock(data),
    onSuccess: (updatedProduct, { productId }) => {
      // Update specific product in cache
      queryClient.setQueryData(PRODUCT_QUERY_KEYS.detail(productId), updatedProduct)

      // Invalidate lists, low stock, and stats
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lowStock() })
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.stats() })
    },
  })
}

export function useBulkUpdateStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BulkStockUpdate) => productsService.bulkUpdateStock(data),
    onSuccess: () => {
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all })
    },
  })
}

// Optimistic Updates Helper
export function useOptimisticProductUpdate() {
  const queryClient = useQueryClient()

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    queryClient.setQueryData(
      PRODUCT_QUERY_KEYS.detail(productId),
      (oldProduct: Product | undefined) => (oldProduct ? { ...oldProduct, ...updates } : undefined)
    )
  }

  const revertProduct = (productId: string) => {
    queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(productId) })
  }

  return { updateProduct, revertProduct }
}

// Prefetch Helpers
export function usePrefetchProduct() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_QUERY_KEYS.detail(id),
      queryFn: () => productsService.getProductById(id),
      staleTime: 10 * 60 * 1000,
    })
  }
}

export function usePrefetchProducts() {
  const queryClient = useQueryClient()

  return (filters: ProductFilters = {}) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_QUERY_KEYS.list(filters),
      queryFn: () => productsService.getProducts(filters),
      staleTime: 5 * 60 * 1000,
    })
  }
}

// Category Mutations
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryData) => productsService.createCategory(data),
    onSuccess: () => {
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.categories() })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCategoryData) => productsService.updateCategory(data),
    onSuccess: () => {
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.categories() })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsService.deleteCategory(id),
    onSuccess: () => {
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.categories() })
    },
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEYS.categories(), id],
    queryFn: () => productsService.getCategoryById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

function asCategoryArray(data: unknown): Category[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.data)) return d.data as Category[]
    if (Array.isArray(d.categories)) return d.categories as Category[]
  }
  return []
}

/** Combined hook for Landing page: categories, featured products, and products grouped by category */
export function useLandingProducts() {
  const categoriesQuery = useCategories()
  const productsQuery = useProducts({ limit: 20 })
  const categories = asCategoryArray(categoriesQuery.data)
  const topCategories = categories.slice(0, 4)

  const categoryQueries = useQueries({
    queries: topCategories.map((cat) => ({
      queryKey: PRODUCT_QUERY_KEYS.list({ category: cat.slug || cat.name, limit: 4 }),
      queryFn: () =>
        productsService.getProductsByCategory(cat.slug || cat.name, { limit: 4 }),
      enabled: !!categoriesQuery.data && topCategories.length > 0,
      staleTime: 5 * 60 * 1000,
    })),
  })

  const productsByCategory: Record<string, Product[]> = {}
  topCategories.forEach((cat, i) => {
    const name = cat.name
    const data = categoryQueries[i]?.data
    productsByCategory[name] = data?.products ?? []
  })

  const isLoading =
    categoriesQuery.isLoading || productsQuery.isLoading || categoryQueries.some((q) => q.isLoading)
  const isError =
    categoriesQuery.isError || productsQuery.isError || categoryQueries.some((q) => q.isError)

  return {
    categories,
    featuredProducts: productsQuery.data?.products ?? [],
    productsByCategory,
    isLoading,
    isError,
    error: categoriesQuery.error || productsQuery.error,
  }
}
