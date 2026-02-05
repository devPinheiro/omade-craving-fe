import { ProductForm } from '@/components/organisms/ProductForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useDeleteProduct, useProducts, useUpdateProductStock } from '@/hooks/useProducts'
import type { Product, ProductFilters } from '@/types/product'
import { AlertTriangle, Edit, Package, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ProductsTableProps {
  filters?: ProductFilters
}

export function ProductsTable({ filters = {} }: ProductsTableProps) {
  const [currentFilters, setCurrentFilters] = useState<ProductFilters>(filters)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const { data, isLoading, error } = useProducts(currentFilters)
  const deleteProductMutation = useDeleteProduct()
  const updateStockMutation = useUpdateProductStock()

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowEditForm(true)
  }

  const handleEditSave = (updatedProduct: Product) => {
    setShowEditForm(false)
    setEditingProduct(null)
    // Optionally refresh the product list or update local state
  }

  const handleEditCancel = () => {
    setShowEditForm(false)
    setEditingProduct(null)
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

  const handleUpdateStock = async (productId: string, quantity: number) => {
    try {
      await updateStockMutation.mutateAsync({
        productId,
        quantity,
        operation: 'set',
        reason: 'Manual adjustment',
      })
    } catch (error) {
      console.error('Failed to update stock:', error)
    }
  }

  const getStockStatusColor = (product: Product) => {
    if (product.stock === 0) return 'text-red-600'
    if (product.minStock && product.stock <= product.minStock) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStockStatusIcon = (product: Product) => {
    if (product.stock === 0) return <AlertTriangle className="h-4 w-4 text-red-600" />
    if (product.minStock && product.stock <= product.minStock)
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <Package className="h-4 w-4 text-green-600" />
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">Error loading products: {error.message}</div>
      </Card>
    )
  }

  if (!data?.products?.length) {
    return (
      <Card className="p-6">
        <div className="text-gray-500 text-center">No products found</div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">SKU</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm font-mono">{product.sku}</td>
                <td className="py-3 px-4 text-sm">
                  {typeof product.category === 'string'
                    ? product.category
                    : product.category?.name || 'Uncategorized'}
                </td>
                <td className="py-3 px-4 text-sm font-medium">${product.price.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {getStockStatusIcon(product)}
                    <span className={`text-sm font-medium ${getStockStatusColor(product)}`}>
                      {product.stock}
                    </span>
                    {product.minStock && (
                      <span className="text-xs text-gray-400">(min: {product.minStock})</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4">
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

      {data.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(data.pagination.page - 1) * data.pagination.limit + 1} to{' '}
            {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
            {data.pagination.total} products
          </div>

          <div className="flex space-x-2">
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

            <span className="px-3 py-1 text-sm bg-gray-100 rounded">
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

      {/* Edit Product Modal */}
      <ProductForm
        product={editingProduct}
        isOpen={showEditForm}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />
    </Card>
  )
}
