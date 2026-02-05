import { ProductForm } from '@/components/organisms/ProductForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useDeleteProduct, useProducts, useUpdateProductStock } from '@/hooks/useProducts'
import type { Product, ProductFilters } from '@/types/product'
import {
  AlertTriangle,
  ArrowUpDown,
  Check,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

interface ShopifyProductsTableProps {
  filters?: ProductFilters
}

export function ShopifyProductsTable({ filters = {} }: ShopifyProductsTableProps) {
  const [currentFilters, setCurrentFilters] = useState<ProductFilters>(filters)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { data, isLoading, error } = useProducts(currentFilters)
  const deleteProductMutation = useDeleteProduct()
  const updateStockMutation = useUpdateProductStock()

  const handleSelectAll = () => {
    if (selectedProducts.length === data?.products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(data?.products.map((p) => p.id) || [])
    }
  }

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const getStockStatusColor = (product: Product) => {
    if (product.stock === 0) return 'text-red-600'
    if (product.minStock && product.stock <= product.minStock) return 'text-orange-600'
    return 'text-gray-900'
  }

  const getStockStatusBadge = (product: Product) => {
    if (product.stock === 0) return 'Out of stock'
    if (product.minStock && product.stock <= product.minStock) return 'Low stock'
    return `${product.stock} in stock`
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setShowProductForm(true)
  }

  const handleCloseForm = () => {
    setShowProductForm(false)
    setEditingProduct(null)
  }

  const handleProductSaved = (product: Product) => {
    setShowProductForm(false)
    setEditingProduct(null)
    // The React Query cache will automatically update
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete product:', error)
        alert('Failed to delete product. Please try again.')
      }
    }
  }

  if (isLoading) {
    return (
      <Card className="p-0 bg-white border border-gray-200">
        <div className="p-12 flex items-center justify-center">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </Card>
    )
  }

  // if (error) {
  //   return (
  //     <Card className="p-0 bg-white border border-gray-200">
  //       <div className="p-6">
  //         <div className="text-red-500">Error loading products: {error.message}</div>
  //       </div>
  //     </Card>
  //   )
  // }

  return (
    <div className="space-y-4">
      {/* Filters and Search Bar */}
      <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button
            size="sm"
            onClick={handleCreateProduct}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <Card className="p-0 bg-white border border-gray-200">
        {data?.products?.length ? (
          <>
            {/* Table Header Actions */}
            {selectedProducts.length > 0 && (
              <div className="p-4 bg-blue-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''}{' '}
                    selected
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Export selected
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      Delete selected
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="w-10 py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === data.products.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <div className="flex items-center space-x-1">
                        <span>Product</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Inventory
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      SKU
                    </th>
                    <th className="w-10 py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {data.products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                            product.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className={`font-medium ${getStockStatusColor(product)}`}>
                            {getStockStatusBadge(product)}
                          </div>
                          {product.minStock && product.stock <= product.minStock && (
                            <div className="flex items-center text-orange-600 text-xs mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Low stock
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-sm text-gray-600">
                        {typeof product.category === 'string'
                          ? product.category
                          : product.category.name}
                      </td>

                      <td className="py-4 px-4 text-sm font-mono text-gray-600">{product.sku}</td>

                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            title="Edit product"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deleteProductMutation.isPending}
                            className="text-red-600 hover:text-red-800"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.pagination && data.pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-500">
                  Showing {(data.pagination.page - 1) * data.pagination.limit + 1}-
                  {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
                  {data.pagination.total} products
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.pagination.page === 1}
                    onClick={() =>
                      setCurrentFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) - 1,
                      }))
                    }
                  >
                    Previous
                  </Button>

                  <span className="px-3 py-1 text-sm bg-white border rounded">
                    {data.pagination.page} of {data.pagination.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.pagination.page === data.pagination.totalPages}
                    onClick={() =>
                      setCurrentFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) + 1,
                      }))
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first product.</p>
            <Button onClick={handleCreateProduct} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add product
            </Button>
          </div>
        )}
      </Card>

      {/* Product Form Modal */}
      <ProductForm
        product={editingProduct}
        isOpen={showProductForm}
        onSave={handleProductSaved}
        onCancel={handleCloseForm}
      />
    </div>
  )
}
