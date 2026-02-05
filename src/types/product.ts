export interface Category {
  id: string
  category: string
  name: string
  description?: string
  slug: string
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  cost?: number
  sku: string
  category: Category | string
  imageUrl?: string
  images?: string[]
  stock: number
  minStock?: number
  isActive: boolean
  isFeatured?: boolean
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  tags?: string[]
  variants?: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  value: string
  price?: number
  stock?: number
  sku?: string
}

export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  tags?: string[]
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt' | 'stock'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedProducts {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateProductData {
  name: string
  category: string
  description: string
  price: number
  cost?: number
  sku: string
  categoryId: string
  imageUrl?: string
  images?: string[]
  stock: number
  minStock?: number
  isActive?: boolean
  isFeatured?: boolean
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  tags?: string[]
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

export interface UpdateStockData {
  productId: string
  quantity: number
  operation: 'set' | 'add' | 'subtract'
  reason?: string
}

export interface BulkStockUpdate {
  products: Array<{
    productId: string
    quantity: number
    operation: 'set' | 'add' | 'subtract'
  }>
  reason?: string
}

export interface LowStockProduct {
  id: string
  name: string
  sku: string
  currentStock: number
  minStock: number
  category: string
}

export interface ProductStats {
  overview: {
    total_products: number
    low_stock_products: number
    out_of_stock_products: number
    customizable_products: number
    products_without_image: number
    total_inventory_value: number
  }
  categories: {
    distribution: Array<{
      category: string
      count: number
    }>
    pricing: Array<{
      category: string
      average_price: number
      product_count: number
    }>
  }
  top_rated_products: any[]
  recent_products: Array<{
    id: string
    name: string
    category: string
    price: number
    created_at: string
  }>
  stock_analysis: {
    low_stock_threshold: number
    products_needing_restock: number
    out_of_stock: number
    total_inventory_value: number
  }
}

export interface CreateCategoryData {
  name: string
  description?: string
  imageUrl?: string
  isActive?: boolean
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string
}
