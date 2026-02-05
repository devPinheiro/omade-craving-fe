import http from '@/lib/http'
import type {
  BulkStockUpdate,
  Category,
  CreateCategoryData,
  CreateProductData,
  LowStockProduct,
  PaginatedProducts,
  Product,
  ProductFilters,
  ProductStats,
  UpdateCategoryData,
  UpdateProductData,
  UpdateStockData,
} from '@/types/product'

// Transform API response fields from snake_case to camelCase
function transformProduct(apiProduct: any): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price:
      typeof apiProduct.price === 'string' ? Number.parseFloat(apiProduct.price) : apiProduct.price,
    cost: apiProduct.cost
      ? typeof apiProduct.cost === 'string'
        ? Number.parseFloat(apiProduct.cost)
        : apiProduct.cost
      : undefined,
    sku: apiProduct.sku || '',
    category: apiProduct.category || '',
    imageUrl: apiProduct.image_url || apiProduct.imageUrl,
    images: apiProduct.images || [],
    stock: apiProduct.stock || 0,
    minStock: apiProduct.min_stock || apiProduct.minStock,
    isActive: apiProduct.is_active ?? apiProduct.isActive ?? true,
    isFeatured: apiProduct.is_featured ?? apiProduct.isFeatured ?? false,
    weight: apiProduct.weight,
    dimensions: apiProduct.dimensions,
    tags: apiProduct.tags || [],
    createdAt: apiProduct.createdAt || apiProduct.created_at,
    updatedAt: apiProduct.updatedAt || apiProduct.updated_at,
  }
}

// Transform frontend data to API format (camelCase to snake_case)
function transformToApiFormat(frontendData: any): any {
  const apiData = { ...frontendData }

  if (frontendData.imageUrl) {
    apiData.image_url = frontendData.imageUrl
    delete apiData.imageUrl
  }

  if (frontendData.minStock !== undefined) {
    apiData.min_stock = frontendData.minStock
    delete apiData.minStock
  }

  if (frontendData.isActive !== undefined) {
    apiData.is_active = frontendData.isActive
    delete apiData.isActive
  }

  if (frontendData.isFeatured !== undefined) {
    apiData.is_featured = frontendData.isFeatured
    delete apiData.isFeatured
  }

  return apiData
}

export const productsService = {
  // Public Routes
  async getCategories(): Promise<Category[]> {
    const response = await http.get('/api/v1/products/categories')
    return response.data
  },

  async getProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
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

    const response = await http.get(`/api/v1/products?${params.toString()}`)

    // Handle API response structure and transform field names
    const apiData = response.data.data || response.data
    return {
      products: apiData.products.map(transformProduct),
      pagination: {
        page: apiData.page,
        limit: apiData.limit,
        total: apiData.total,
        totalPages: apiData.totalPages,
      },
    }
  },

  async getProductById(id: string): Promise<Product> {
    const response = await http.get(`/api/v1/products/${id}`)
    const apiData = response.data.data || response.data
    return transformProduct(apiData)
  },

  // Admin/Staff Routes
  async getLowStockProducts(): Promise<LowStockProduct[]> {
    const response = await http.get('/api/v1/products/low-stock')
    return response.data
  },

  async createProduct(data: CreateProductData): Promise<Product> {
    const apiData = transformToApiFormat(data)
    const response = await http.post('/api/v1/products', apiData)
    const responseData = response.data.data || response.data
    return transformProduct(responseData)
  },

  async updateProduct(data: UpdateProductData): Promise<Product> {
    const { id, ...updateData } = data
    const apiData = transformToApiFormat(updateData)
    const response = await http.patch(`/api/v1/products/${id}`, apiData)
    const responseData = response.data.data || response.data
    return transformProduct(responseData)
  },

  async updateProductStock(data: UpdateStockData): Promise<Product> {
    const { productId, ...stockData } = data
    const response = await http.patch(`/api/v1/products/${productId}/stock`, stockData)
    return response.data
  },

  async deleteProduct(id: string): Promise<void> {
    await http.delete(`/api/v1/products/${id}`)
  },

  async bulkUpdateStock(
    data: BulkStockUpdate
  ): Promise<{ success: boolean; updatedProducts: Product[] }> {
    const response = await http.post('/api/v1/products/bulk-stock', data)
    return response.data
  },

  // Additional utility methods
  async getProductStats(): Promise<ProductStats> {
    const response = await http.get('/api/v1/products/stats')
    if (import.meta.env.DEV) {
      console.log('ProductStats API Response:', response.data)
    }
    return response.data.data || response.data // Handle both API response formats
  },

  async searchProducts(query: string, limit = 10): Promise<Product[]> {
    const response = await http.get(
      `/api/v1/products/search?q=${encodeURIComponent(query)}&limit=${limit}`
    )
    return response.data
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const response = await http.get(`/api/v1/products?featured=true&limit=${limit}`)
    return response.data.products
  },

  async getProductsByCategory(
    categoryId: string,
    filters?: Partial<ProductFilters>
  ): Promise<PaginatedProducts> {
    return this.getProducts({
      ...filters,
      category: categoryId,
    })
  },

  // Category management
  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await http.post('/api/v1/products/categories', data)
    return response.data
  },

  async updateCategory(data: UpdateCategoryData): Promise<Category> {
    const { id, ...updateData } = data
    const response = await http.patch(`/api/v1/products/categories/${id}`, updateData)
    return response.data
  },

  async deleteCategory(id: string): Promise<void> {
    await http.delete(`/api/v1/products/categories/${id}`)
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await http.get(`/api/v1/products/categories/${id}`)
    return response.data
  },
}
