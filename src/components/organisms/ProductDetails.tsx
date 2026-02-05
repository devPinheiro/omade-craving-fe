import { useSEO } from '@/hooks/useSEO'
import { getBusinessStructuredData } from '@/lib/seo'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/types/product'
import { handleKeyboardNavigation, announceToScreenReader, announceSuccess } from '../../utils/accessibility'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share,
  ShoppingCart,
  Star,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProductDetailsProps {
  product: Product
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  useSEO({
    title: `${product.name} - Omade Cravings | Premium Artisanal Bakery`,
    description:
      product.description || `Delicious ${product.name} from our premium bakery collection.`,
    keywords: [product.name, product.category, ...(product.tags || []), 'bakery', 'artisanal'],
    structuredData: getBusinessStructuredData(),
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getCurrentPrice = () => {
    return product.price
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : ['/placeholder-product.jpg']

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleAddToCart = () => {
    // Check if product is available
    if (!product.isActive || product.stock === 0) {
      const message = 'This product is currently unavailable'
      toast.error(message)
      announceToScreenReader(message, 'assertive')
      return
    }

    // Check if requested quantity exceeds available stock
    if (quantity > product.stock) {
      const message = `Only ${product.stock} items available in stock`
      toast.error(message)
      announceToScreenReader(message, 'assertive')
      return
    }

    const currentPrice = getCurrentPrice()

    addItem({
      productId: product.id,
      name: selectedVariant ? `${product.name} (${selectedVariant})` : product.name,
      image: images[0],
      basePrice: currentPrice,
      quantity,
      category: product.category,
      customizations: selectedVariant
        ? {
            variant:
              product.variants?.find((v) => v.id === selectedVariant)?.name +
              ': ' +
              product.variants?.find((v) => v.id === selectedVariant)?.value,
          }
        : undefined,
    })

    const successMessage = `${product.name} added to cart!`
    toast.success(successMessage)
    announceSuccess(`${product.name} has been added to your cart. Quantity: ${quantity}. Cart updated.`)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Skip to main content */}
        <a href="#main-content" className="skip-link">
          Skip to product details
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
            <span>/</span>
            <a
              href={`/shop?category=${typeof product.category === 'string' ? product.category.toLowerCase() : product.category.slug}`}
              className="hover:text-gray-900 transition-colors"
            >
              {typeof product.category === 'string' ? product.category : product.category.name}
            </a>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        <main id="main-content" className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Product Images */}
          <section className="space-y-4" aria-label="Product images">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    onKeyDown={(e) => handleKeyboardNavigation(e, prevImage)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus-enhanced"
                    aria-label="View previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    onKeyDown={(e) => handleKeyboardNavigation(e, nextImage)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus-enhanced"
                    aria-label="View next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Product Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="absolute top-4 left-4 space-y-1">
                  {product.tags.slice(0, 2).map((tag, index) => (
                    <div
                      key={index}
                      className="bg-black bg-opacity-75 text-white px-3 py-1 text-sm font-medium rounded"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    onKeyDown={(e) => handleKeyboardNavigation(e, () => setCurrentImageIndex(index))}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 focus-enhanced ${
                      currentImageIndex === index ? 'border-black' : 'border-gray-200'
                    }`}
                    aria-label={`View image ${index + 1} of ${images.length}`}
                    aria-pressed={currentImageIndex === index}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="font-luxury-display text-3xl sm:text-4xl font-light text-gray-900 mb-2 tracking-luxury text-luxury-shadow">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">
                {typeof product.category === 'string' ? product.category : product.category.name}
              </p>
            </div>

            {/* Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(24 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="price-text text-3xl font-light text-gray-900">
                {formatCurrency(getCurrentPrice())}
              </span>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Options</h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        selectedVariant === variant.id
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {variant.name}: {variant.value}
                        </span>
                        {variant.price && (
                          <span className="font-semibold">{formatCurrency(variant.price)}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-medium text-gray-900">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium min-w-[3ch] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    (product.variants && product.variants.length > 0 && !selectedVariant) ||
                    !product.isActive ||
                    product.stock === 0
                  }
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    (product.variants && product.variants.length > 0 && !selectedVariant) ||
                    !product.isActive ||
                    product.stock === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>
                    {!product.isActive
                      ? 'Unavailable'
                      : product.stock === 0
                        ? 'Out of Stock'
                        : 'Add to Cart'}
                  </span>
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    isWishlisted
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => {
                    navigator.share?.({ title: product.name, url: window.location.href }) ||
                      navigator.clipboard?.writeText(window.location.href)
                    toast.success('Link copied to clipboard!')
                  }}
                  className="p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 text-gray-600 transition-all"
                >
                  <Share className="h-5 w-5" />
                </button>
              </div>

              {product.variants && product.variants.length > 0 && !selectedVariant && (
                <p className="text-sm text-red-500">Please select an option</p>
              )}
              {!product.isActive && (
                <p className="text-sm text-red-500">This product is currently unavailable</p>
              )}
              {product.stock === 0 && product.isActive && (
                <p className="text-sm text-red-500">This product is currently out of stock</p>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <p className="text-sm text-orange-600">Only {product.stock} left in stock!</p>
              )}
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Key Features</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Made with premium ingredients</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Fresh baked daily</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">No artificial preservatives</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Available for pickup or delivery</span>
                </div>
                {product.isActive && product.stock > 0 && (
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">
                      In stock ({product.stock} available)
                    </span>
                  </div>
                )}
                {!product.isActive && (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-red-600"></div>
                    </div>
                    <span className="text-sm text-red-600">Currently unavailable</span>
                  </div>
                )}
                {product.stock === 0 && product.isActive && (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full bg-red-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-red-600"></div>
                    </div>
                    <span className="text-sm text-red-600">Out of stock</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
              Product Description
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails
