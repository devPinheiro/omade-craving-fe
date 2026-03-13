import { productsService } from '@/services/products'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/types/product'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Clock, Search, TrendingUp, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [search, setSearch] = useState ('')
  const [trendingSearches] = useState(['Red Velvet', 'Chocolate', 'Custom Cakes', 'Celebration Cakes'])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const addItem = useCartStore((state) => state.addItem)

  // Focus search input when overlay opens and handle keyboard shortcuts
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300) // Wait for animation to complete
    }

    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!isOpen) {
          // This would be handled by parent component
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('omade-recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Search functionality with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const searchProducts = async () => {
      try {
        setLoading(true)
        const response = await productsService.getProducts({
          search: searchQuery,
          limit: 8,
          isActive: true,
        })
        setSearchResults(response.products)
      } catch (error) {
        console.error('Search failed:', error)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

const handleClearSearch = () => {
  setSearch('')
  setSearchQuery ('')
}

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    // Add to recent searches
    if (query.trim() && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches.slice(0, 4)]
      setRecentSearches(updated)
      localStorage.setItem('omade-recent-searches', JSON.stringify(updated))
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.imageUrl || '',
      basePrice: product.price,
      quantity: 1,
      category: product.category,
    })
    toast.success(`${product.name} added to cart!`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Search Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-white transform transition-all duration-700 ease-out ${
          isOpen ? 'translate-y-0 opacity-100 search-slide-in' : '-translate-y-full opacity-0'
        }`}
      >
        {/* Header */}
        <div className="relative border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for cakes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-16 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-black focus:outline-none transition-all duration-300 font-content bg-gray-50 focus:bg-white focus:shadow-lg focus:shadow-black/5"
              />
              
             <button
                search = {search}
                onClick={handleClearSearch}
                aria-label=" clear-search"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Close Button - Top Right */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto max-h-[calc(100vh-140px)]">
          {!searchQuery ? (
            /* Default State */
            <div className="space-y-12">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">Recent Searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <h3 className="text-lg font-medium text-gray-900">Trending Now</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {trendingSearches.map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(trend)}
                      className="group p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl hover:from-orange-100 hover:to-amber-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-orange-100 hover:border-orange-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{trend}</span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Suggestions */}
              <div className="text-center py-12 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">Search our bakery collection</p>
                <p className="text-sm">
                  Find custom cakes, celebration cakes, and seasonal specialties
                </p>
              </div>
            </div>
          ) : (
            /* Search Results */
            <div className="space-y-6">
              {/* Search Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-gray-900">
                  {loading
                    ? 'Searching...'
                    : `${searchResults.length} results for "${searchQuery}"`}
                </h3>
                {searchResults.length > 0 && (
                  <a
                    href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {!loading && searchResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((product, index) => (
                    <div
                      key={product.id}
                      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 search-result-item"
                    >
                      <Link
                        to="/products/$productId"
                        params={{ productId: product.id }}
                        onClick={onClose}
                        className="block"
                      >
                        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 relative flex items-center justify-center">
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
                            {product.stock === 0 && (
                              <div className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                                Out of Stock
                              </div>
                            )}
                          </div>

                          {/* Add to Cart Button */}
                          {product.isActive && product.stock > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddToCart(product)
                              }}
                              className="absolute inset-x-3 bottom-3 bg-black text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800"
                            >
                              <span className="text-sm font-medium">Add to Cart</span>
                            </button>
                          )}
                        </div>
                      </Link>

                      <div className="space-y-2">
                        <Link
                          to="/products/$productId"
                          params={{ productId: product.id }}
                          onClick={onClose}
                        >
                          <h4 className="font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2">
                            {product.name}
                          </h4>
                        </Link>
                        <p className="text-sm text-gray-500">
                          {typeof product.category === 'string'
                            ? product.category
                            : product.category.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.stock <= 5 && product.stock > 0 && (
                            <span className="text-xs text-orange-600">
                              Only {product.stock} left!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && searchQuery && searchResults.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500 mb-6">
                    We couldn't find any products matching "{searchQuery}"
                  </p>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Try searching for:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {trendingSearches.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(suggestion)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
