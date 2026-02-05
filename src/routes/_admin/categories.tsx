import { CategoryForm } from '@/components/organisms/CategoryForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePermissions } from '@/hooks/usePermissions'
import { useCategories, useDeleteCategory } from '@/hooks/useProducts'
import type { Category } from '@/types/product'
import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Edit, Eye, EyeOff, MoreHorizontal, Plus, Tag, Trash2 } from 'lucide-react'
import { useState } from 'react'

function CategoriesManagement() {
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { data: categories, isLoading } = useCategories()
  const deleteCategory = useDeleteCategory()
  const hasPermission = usePermissions()

  const canEdit = hasPermission('products:write') || hasPermission('admin:access')
  const canDelete = hasPermission('products:delete') || hasPermission('admin:access')

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setShowCategoryForm(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowCategoryForm(true)
  }

  const handleDeleteCategory = async (category: Category) => {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      try {
        await deleteCategory.mutateAsync(category.id)
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  const handleCategorySaved = () => {
    setShowCategoryForm(false)
    setEditingCategory(null)
  }

  const handleCategoryCancel = () => {
    setShowCategoryForm(false)
    setEditingCategory(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading categories...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your product categories and organization</p>
        </div>
        {canEdit && (
          <Button onClick={handleCreateCategory} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Category
          </Button>
        )}
      </div>

      {/* Categories Grid */}
      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              {/* Category Image */}
              <div className="h-32 bg-gray-100 relative">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  {category.isActive ? (
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      <Eye className="h-3 w-3" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      <EyeOff className="h-3 w-3" />
                      <span>Inactive</span>
                    </div>
                  )}
                </div>

                {/* Actions Dropdown */}
                {(canEdit || canDelete) && (
                  <div className="absolute top-2 left-2">
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/80 hover:bg-white text-gray-700 h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>

                      {/* Dropdown Menu */}
                      <div className="absolute left-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        {canEdit && (
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{category.description}</p>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="font-mono">{category.slug}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-12 text-center">
          <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first product category.</p>
          {canEdit && (
            <Button onClick={handleCreateCategory} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          )}
        </Card>
      )}

      {/* Category Form Modal */}
      <CategoryForm
        category={editingCategory}
        isOpen={showCategoryForm}
        onSave={handleCategorySaved}
        onCancel={handleCategoryCancel}
      />
    </div>
  )
}

export const Route = createFileRoute('/_admin/categories')({
  component: CategoriesManagement,
})
