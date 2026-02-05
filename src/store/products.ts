import { productsService } from '@/services/products'
import type {
  BulkStockUpdate,
  Category,
  CreateProductData,
  LowStockProduct,
  PaginatedProducts,
  Product,
  ProductFilters,
  ProductStats,
  UpdateProductData,
  UpdateStockData,
} from '@/types/product'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProductsState {
  // Data
  products: Product[]
  categories: Category[]
  selectedProduct: Product | null
  lowStockProducts: LowStockProduct[]
  productStats: ProductStats | null

  // Pagination & Filters
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: ProductFilters

  // Loading states
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Error states
  error: string | null
}

interface ProductsActions {
  // Products
  getProducts: (filters?: ProductFilters) => Promise<void>
  getProductById: (id: string) => Promise<void>
  createProduct: (data: CreateProductData) => Promise<Product>
  updateProduct: (data: UpdateProductData) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>

  // Categories
  getCategories: () => Promise<void>

  // Stock management
  updateProductStock: (data: UpdateStockData) => Promise<void>
  bulkUpdateStock: (data: BulkStockUpdate) => Promise<void>
  getLowStockProducts: () => Promise<void>

  // Search & Filters
  setFilters: (filters: Partial<ProductFilters>) => void
  clearFilters: () => void
  searchProducts: (query: string) => Promise<Product[]>

  // Stats
  getProductStats: () => Promise<void>

  // State management
  setSelectedProduct: (product: Product | null) => void
  clearError: () => void
  resetStore: () => void
}

type ProductsStore = ProductsState & ProductsActions

const initialState: ProductsState = {
  products: [],
  categories: [],
  selectedProduct: null,
  lowStockProducts: [],
  productStats: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
}

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Products
      getProducts: async (filters?: ProductFilters) => {
        set({ isLoading: true, error: null })
        try {
          const currentFilters = { ...get().filters, ...filters }
          const data = await productsService.getProducts(currentFilters)

          set({
            products: data.products,
            pagination: data.pagination,
            filters: currentFilters,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch products',
            isLoading: false,
          })
        }
      },

      getProductById: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const product = await productsService.getProductById(id)
          set({
            selectedProduct: product,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch product',
            isLoading: false,
          })
        }
      },

      createProduct: async (data: CreateProductData) => {
        set({ isCreating: true, error: null })
        try {
          const newProduct = await productsService.createProduct(data)

          // Add to products list if it matches current filters
          const currentProducts = get().products
          set({
            products: [newProduct, ...currentProducts],
            isCreating: false,
          })

          return newProduct
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create product',
            isCreating: false,
          })
          throw error
        }
      },

      updateProduct: async (data: UpdateProductData) => {
        set({ isUpdating: true, error: null })
        try {
          const updatedProduct = await productsService.updateProduct(data)

          // Update in products list
          const currentProducts = get().products
          const updatedProducts = currentProducts.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          )

          set({
            products: updatedProducts,
            selectedProduct:
              get().selectedProduct?.id === updatedProduct.id
                ? updatedProduct
                : get().selectedProduct,
            isUpdating: false,
          })

          return updatedProduct
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update product',
            isUpdating: false,
          })
          throw error
        }
      },

      deleteProduct: async (id: string) => {
        set({ isDeleting: true, error: null })
        try {
          await productsService.deleteProduct(id)

          // Remove from products list
          const currentProducts = get().products
          const filteredProducts = currentProducts.filter((p) => p.id !== id)

          set({
            products: filteredProducts,
            selectedProduct: get().selectedProduct?.id === id ? null : get().selectedProduct,
            isDeleting: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete product',
            isDeleting: false,
          })
          throw error
        }
      },

      // Categories
      getCategories: async () => {
        try {
          const categories = await productsService.getCategories()
          set({ categories })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch categories',
          })
        }
      },

      // Stock management
      updateProductStock: async (data: UpdateStockData) => {
        set({ isUpdating: true, error: null })
        try {
          const updatedProduct = await productsService.updateProductStock(data)

          // Update in products list
          const currentProducts = get().products
          const updatedProducts = currentProducts.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          )

          set({
            products: updatedProducts,
            selectedProduct:
              get().selectedProduct?.id === updatedProduct.id
                ? updatedProduct
                : get().selectedProduct,
            isUpdating: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update stock',
            isUpdating: false,
          })
          throw error
        }
      },

      bulkUpdateStock: async (data: BulkStockUpdate) => {
        set({ isUpdating: true, error: null })
        try {
          const result = await productsService.bulkUpdateStock(data)

          if (result.success) {
            // Update affected products in the list
            const currentProducts = get().products
            const updatedProducts = currentProducts.map((p) => {
              const updated = result.updatedProducts.find((up) => up.id === p.id)
              return updated || p
            })

            set({
              products: updatedProducts,
              isUpdating: false,
            })
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to bulk update stock',
            isUpdating: false,
          })
          throw error
        }
      },

      getLowStockProducts: async () => {
        try {
          const lowStockProducts = await productsService.getLowStockProducts()
          set({ lowStockProducts })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch low stock products',
          })
        }
      },

      // Search & Filters
      setFilters: (filters: Partial<ProductFilters>) => {
        const currentFilters = get().filters
        set({ filters: { ...currentFilters, ...filters } })
      },

      clearFilters: () => {
        set({ filters: {} })
      },

      searchProducts: async (query: string) => {
        try {
          const products = await productsService.searchProducts(query)
          return products
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Search failed',
          })
          return []
        }
      },

      // Stats
      getProductStats: async () => {
        try {
          const stats = await productsService.getProductStats()
          set({ productStats: stats })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch product stats',
          })
        }
      },

      // State management
      setSelectedProduct: (product: Product | null) => {
        set({ selectedProduct: product })
      },

      clearError: () => {
        set({ error: null })
      },

      resetStore: () => {
        set(initialState)
      },
    }),
    {
      name: 'products-store',
      partialize: (state) => ({
        categories: state.categories,
        filters: state.filters,
      }),
    }
  )
)
