import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCreateCategory, useUpdateCategory } from '@/hooks/useProducts'
import type { Category, CreateCategoryData } from '@/types/product'
import { AlertCircle, Image as ImageIcon, Save, Tag, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface CategoryFormProps {
  category?: Category | null
  onSave?: (category: Category) => void
  onCancel?: () => void
  isOpen?: boolean
}

type FormData = CreateCategoryData & {
  imageFile?: FileList
}

export function CategoryForm({ category, onSave, onCancel, isOpen = true }: CategoryFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(category?.imageUrl || '')

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  const isEditing = !!category
  const isLoading = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: category
      ? {
          name: category.name,
          description: category.description || '',
          imageUrl: category.imageUrl || '',
          isActive: category.isActive,
        }
      : {
          name: '',
          description: '',
          imageUrl: '',
          isActive: true,
        },
  })

  const watchedName = watch('name')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setValue('imageUrl', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview('')
    setValue('imageUrl', '')
  }

  const onSubmit = async (data: FormData) => {
    try {
      let result: Category

      if (isEditing && category) {
        result = await updateMutation.mutateAsync({
          id: category.id,
          ...data,
        })
      } else {
        result = await createMutation.mutateAsync(data)
      }

      onSave?.(result)
      if (!isEditing) {
        reset()
        setImagePreview('')
      }
    } catch (error) {
      console.error('Failed to save category:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Tag className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Category' : 'Create Category'}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  {...register('name', { required: 'Category name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter category name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter category description (optional)"
                />
              </div>
            </div>
          </Card>

          {/* Category Image */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Image</h3>

            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Upload a category image</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="category-image"
              />

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('category-image')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>

            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>
              <div className="text-sm">
                <label className="font-medium text-gray-700">Active Category</label>
                <p className="text-gray-500">
                  Active categories are visible to customers and can be assigned to products.
                </p>
              </div>
            </div>
          </Card>

          {/* Preview */}
          {watchedName && (
            <Card className="p-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              <div className="flex items-center space-x-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Tag className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{watchedName}</h4>
                  <p className="text-sm text-gray-500">
                    {watch('description') || 'No description provided'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
