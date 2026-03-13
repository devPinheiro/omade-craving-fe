import { AlertCircle, ChevronDown, Filter, Loader2, ShoppingCart } from 'lucide-react'
import type { Category, Product } from '@/types/product'
import {
  announceLoadingState,
  announceSuccess,
  announceToScreenReader,
  handleKeyboardNavigation
} from '../../utils/accessibility'
import { useEffect, useState } from 'react'

import { Link } from '@tanstack/react-router'
import { getBusinessStructuredData } from '@/lib/seo'
import { productsService } from '@/services/products'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart'
import { useSEO } from '@/hooks/useSEO'

const ProductsListing = () => {
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  // Read category from URL search params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get('category')

    if (categoryParam) {
      setSelectedCategories([categoryParam])
    }
  }, [])

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch categories and products in parallel
        const [categoriesData, productsData] = await Promise.all([
          productsService.getCategories(),
          productsService.getProducts({
            page: currentPage,
            limit: 20,
            category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
            isActive: true,
          }),
        ])

        setCategories(categoriesData)
        setProducts(productsData.products)
        setTotalPages(productsData.pagination.totalPages)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load products. Please try again.')
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, selectedCategories])

  useSEO({
    title: 'All Products - Omade Cravings | Premium Cakes',
    description:
      'Browse our complete collection of artisanal cakes. Custom cakes, signature flavors, and seasonal specialties.',
    keywords: [
      'cakes',
      'celebration cakes',
      'bakery products',
      'custom cakes',
      'artisanal bakery',
      'desserts',
    ],
    structuredData: getBusinessStructuredData(),
  })

  // Extract unique flavors from products for filtering
  const flavors = [...new Set(products.flatMap((p) => p.tags || []))]
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
  ]

  // Filter and sort logic
  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(product.category)
    const flavorMatch =
      selectedFlavors.length === 0 ||
      selectedFlavors.some((flavor) => product.tags?.includes(flavor))
    return categoryMatch && flavorMatch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'featured':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    }
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
    setCurrentPage(1) // Reset to first page when filtering
  }

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor) ? prev.filter((f) => f !== flavor) : [...prev, flavor]
    )
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleAddToCart = (product: Product, event?: React.KeyboardEvent) => {
    // Prevent action if product is out of stock
    if (!product.isActive || product.stock === 0) {
      const message = `Cannot add ${product.name} to cart: ${!product.isActive ? 'Product unavailable' : 'Out of stock'}`
      toast.error(message)
      announceToScreenReader(message, 'assertive')
      return
    }
    addItem({
      productId: product.id,
      name: product.name,
      image: product.imageUrl || '',
      basePrice: product.price,
      quantity: 1,
      category: product.category,
    })
    
    const successMessage = `${product.name} added to cart!`
    toast.success(successMessage)
    announceSuccess(`${product.name} has been added to your cart. Cart updated.`)
  }

  // Announce loading state changes
  useEffect(() => {
    announceLoadingState(loading, 'product catalog')
  }, [loading])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Products</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Skip to main content */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb navigation">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900 transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/shop" className="hover:text-gray-900 transition-colors">
              Products
            </a>
            {selectedCategories.length === 1 && (
              <>
                <span>/</span>
                <span className="text-gray-900">{selectedCategories[0]}</span>
              </>
            )}
          </div>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-wide">
            {selectedCategories.length === 1 ? selectedCategories[0].toUpperCase() : 'ALL PRODUCTS'}
          </h1>
          <p className="text-lg text-gray-600">
            {selectedCategories.length === 1
              ? `Explore our exquisite collection of handcrafted ${selectedCategories[0].toLowerCase()}.`
              : 'Discover our complete collection of artisanal baked goods, from signature cakes to seasonal specialties.'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-3">
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Filters */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => toggleCategory(category.name)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Flavor Filters */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Flavors</h3>
                <div className="space-y-2">
                  {flavors.map((flavor) => (
                    <label key={flavor} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFlavors.includes(flavor)}
                        onChange={() => toggleFlavor(flavor)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="text-gray-700">{flavor}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategories.length > 0 || selectedFlavors.length > 0) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedCategories([])
                    setSelectedFlavors([])
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {sortedProducts.map((product) => (
            <div key={product.id} className="group">
              <Link
                to="/products/$productId"
                params={{ productId: product.id }}
                className="block"
              >
                <div className="aspect-square bg-gray-50 mb-4 overflow-hidden rounded-lg relative flex items-center justify-center">
                  <img
                    src={product.imageUrl || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-contain object-center"
                  />
                  {/* Product Labels */}
                  <div className="absolute top-3 left-3 space-y-1">
                    {product.isFeatured && (
                      <div className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                        Featured
                      </div>
                    )}
                    {product.stock > 0 && product.stock <= (product.minStock || 5) && (
                      <div className="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-800">
                        Low Stock
                      </div>
                    )}
                  </div>
                  {/* Out of Stock Overlay */}
                  {(product.stock === 0 || !product.isActive) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg">
                        <span className="text-xs sm:text-sm font-medium text-gray-900">
                          {product.stock === 0 ? 'Out of Stock' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  {/* {product.isActive && product.stock > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddToCart(product)
                      }}
                      className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 bg-black text-white py-1.5 px-2 sm:py-2 sm:px-4 rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 hover:bg-gray-800 z-10"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Add to Cart</span>
                    </button>
                  )} */}
                </div>
              </Link>

              <div className="text-center">
                <Link
                  to="/products/$productId"
                  params={{ productId: product.id }}
                >
                  <h3 className="product-title text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2 hover:text-gray-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-center space-x-2 mb-2 sm:mb-3">
                  <span className="price-text text-sm sm:text-lg font-semibold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 line-clamp-2">
                  {typeof product.category === 'string' ? product.category : product.category.name}{' '}
                  {product.tags && product.tags.length > 0 && `• ${product.tags.join(', ')}`}
                </p>
                {product.stock <= 5 && product.stock > 0 && (
                  <p className="text-xs text-orange-600 mb-2">
                    Only {product.stock} left in stock!
                  </p>
                )}

                {/* Mobile Actions */}
                <div className="sm:hidden space-y-2">
                  {/* <Link
                    to="/products/$productId"
                    params={{ productId: product.id }}
                    className="w-full bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-xs font-medium sm:text-sm"
                  >
                    <span>View Details</span>
                  </Link> */}
                  {product.isActive && product.stock > 0 ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-black text-white py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 text-xs font-medium sm:text-sm"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      <span>Add to Cart</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2 text-xs font-medium sm:text-sm"
                    >
                      <span>{product.stock === 0 ? 'Out of Stock' : 'Unavailable'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center mt-12 text-gray-600">
          {sortedProducts.length === 0 ? (
            <div className="py-12">
              <p className="text-lg text-gray-500 mb-4">No products found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <p>Showing {sortedProducts.length} products</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsListing
