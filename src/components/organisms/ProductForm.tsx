import { CategoryForm } from '@/components/organisms/CategoryForm'
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCategories, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts'
import type { Category, CreateProductData, Product } from '@/types/product'
import { AlertCircle, Image as ImageIcon, Minus, Plus, Save, Tag, Upload, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface ProductFormProps {
  product?: Product | null
  onSave?: (product: Product) => void
  onCancel?: () => void
  isOpen?: boolean
}

type FormData = CreateProductData & {
  images?: string[]
  tags?: string[]
}

export function ProductForm({ product, onSave, onCancel, isOpen = true }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')

  const { data: categories } = useCategories()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()

  const isEditing = !!product
  const isLoading = createMutation.isPending || updateMutation.isPending
  console.log(product, '=======>')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          cost: product.cost,
          sku: product.sku || '',
          categoryId:
            typeof product.category === 'string' ? product.category : product.category?.id || '',
          imageUrl: product.imageUrl || '',
          images: product.images || [],
          stock: product.stock,
          minStock: product.minStock,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          weight: product.weight,
          dimensions: product.dimensions,
          tags: product.tags || [],
        }
      : {
          isActive: true,
          isFeatured: false,
          stock: 0,
          price: 0,
          categoryId: '',
        },
  })

  const watchedImages = watch('images') || []
  const watchedTags = watch('tags') || []

  useEffect(() => {
    if (product) {
      setImagePreview(product.images || [])
      // Reset form with new product data
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        cost: product.cost,
        sku: product.sku || '',
        category:
          typeof product.category === 'string' ? product.category : product.category?.id || '',
        imageUrl: product.imageUrl || '',
        images: product.images || [],
        stock: product.stock,
        minStock: product.minStock,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        weight: product.weight,
        dimensions: product.dimensions,
        tags: product.tags || [],
      })
    } else {
      // Reset to default values when no product (creating new)
      reset({
        isActive: true,
        isFeatured: false,
        stock: 0,
        price: 0,
        categoryId: '',
      })
      setImagePreview([])
    }
  }, [product, reset])

  const categoriesOptions = [
    { id: 'cake', name: 'Cake' },
    { id: 'cookie', name: 'Cookie' },
    { id: 'bread', name: 'Bread' },
  ]
  const addImage = () => {
    const imageUrl = prompt('Enter image URL:')
    if (imageUrl) {
      const newImages = [...watchedImages, imageUrl]
      setValue('images', newImages)
      setImagePreview(newImages)
    }
  }

  const removeImage = (index: number) => {
    const newImages = watchedImages.filter((_, i) => i !== index)
    setValue('images', newImages)
    setImagePreview(newImages)
  }

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      const newTags = [...watchedTags, tagInput.trim()]
      setValue('tags', newTags)
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    const newTags = watchedTags.filter((t) => t !== tag)
    setValue('tags', newTags)
  }

  const handleCreateCategory = () => {
    setShowCategoryForm(true)
  }

  const handleCategorySaved = (newCategory: Category) => {
    setShowCategoryForm(false)
    // Set the newly created category as selected
    setValue('categoryId', newCategory.id)
  }

  const handleCategoryCancel = () => {
    setShowCategoryForm(false)
  }

  const handleImageUpload = (url: string) => {
    setValue('imageUrl', url)
    setUploadError('')
  }

  const handleImageUploadError = (error: string) => {
    setUploadError(error)
  }

  const onSubmit = async (data: FormData) => {
    try {
      // Get the uploaded image URL from localStorage
      const uploadedImageUrl = localStorage.getItem('tempUploadedImageUrl')

      const submitData = {
        ...data,
        imageUrl: uploadedImageUrl || data.imageUrl || watch('imageUrl'),
      }

      console.log('Submitting with imageUrl:', submitData.imageUrl) // Debug log

      let result: Product

      if (isEditing && product) {
        result = await updateMutation.mutateAsync({
          id: product.id,
          ...submitData,
        })
      } else {
        result = await createMutation.mutateAsync(submitData)
      }

      // Clear localStorage after successful submission
      if (uploadedImageUrl) {
        localStorage.removeItem('tempUploadedImageUrl')
      }

      onSave?.(result)
      if (!isEditing) {
        reset()
        setImagePreview([])
        setTagInput('')
        setUploadError('')
      }
    } catch (error) {
      console.error('Failed to save product:', error)
      setUploadError('Failed to save product. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  {...register('name', { required: 'Product name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  {...register('sku', { required: 'SKU is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter SKU"
                />
                {errors.sku && (
                  <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
                )}
              </div> */}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Pricing & Inventory */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    {...register('price', { required: 'Price is required', min: 0 })}
                    type="number"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    {...register('cost', { min: 0 })}
                    type="number"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                  />
                </div>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                <input
                  {...register('stock', { required: 'Stock is required', min: 0 })}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock</label>
                <input
                  {...register('minStock', { min: 0 })}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="0"
                />
              </div>
            </div>
          </Card>

          {/* Category & Organization */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category & Organization</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCreateCategory}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    Create Category
                  </Button> */}
                </div>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select category</option>
                  {categoriesOptions?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
                {(!categories || categories.length === 0) && (
                  <p className="text-sm text-gray-500 mt-1">
                    No categories found.{' '}
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="text-green-600 underline"
                    >
                      Create your first category
                    </button>
                  </p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  {...register('weight', { min: 0 })}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="0.00"
                />
              </div> */}
            </div>

            {/* Tags */}
            {/* <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {watchedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  placeholder="Add tag..."
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>
            </div> */}
          </Card>

          {/* Images */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Image</label>
              <CloudinaryUploader
                onUpload={handleImageUpload}
                onError={handleImageUploadError}
                currentImage={watch('imageUrl')}
                placeholder="Upload product image"
                className="w-full"
              />
              {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
            </div>

            <div className="mt-6">
              {/* <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Additional Images
                </label>
                <Button type="button" onClick={addImage} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div> */}

              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreview.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active (visible to customers)</label>
              </div>

              <div className="flex items-center">
                <input
                  {...register('isFeatured')}
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label className="ml-2 text-sm text-gray-700">Featured product</label>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
              {isLoading ? (
                <>Loading...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update' : 'Create'} Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={showCategoryForm}
        onSave={handleCategorySaved}
        onCancel={handleCategoryCancel}
      />
    </div>
  )
}
