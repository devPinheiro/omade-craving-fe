import { useSEO } from '@/hooks/useSEO'
import { getBusinessStructuredData } from '@/lib/seo'
import { productsService } from '@/services/products'
import { useCartStore } from '@/store/cart'
import type { Category, Product } from '@/types/product'
import {  ShoppingCart, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
// import { Menu, Search, X, Heart } from 'lucide-react'
// import { CartDrawer } from '@/components/ui/CartDrawer'
import OmadeLogo from "@/assets/Images/Omade Cravings.png"
import { SearchOverlay } from '@/components/ui/SearchOverlay'



const Landing = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({})
  const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

    // Global keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useSEO({
    title: 'Omade Cravings - Artisanal Bakery | Fresh Handcrafted Breads & Pastries',
    description:
      'Experience the finest artisanal bakery in town. Premium handcrafted breads, fresh pastries, and specialty baked goods made with organic ingredients.',
    keywords: ['artisanal bakery', 'handcrafted bread', 'fresh pastries', 'organic ingredients'],
    structuredData: getBusinessStructuredData(),
  })

  const heroSlides = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'OMADE CRAVINGS',
      subtitle: 'Artisanal baked goods crafted with love and tradition',
      cta: 'SHOP NOW',
      link: '#new-arrivals',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'FRESH DAILY',
      subtitle: 'Handcrafted breads and pastries made fresh every morning',
      cta: 'EXPLORE BREADS',
      link: '#bestsellers',
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'CUSTOM CAKES',
      subtitle: 'Design your perfect celebration cake with our expert bakers',
      cta: 'BUILD YOUR CAKE',
      link: 'javascript:void(0)',
    },
  ]

  // Fallback static data
  const fallbackFeaturedProducts: Product[] = [
    {
      id: 'fallback-1',
      name: 'Artisan Sourdough',
      description: 'Traditional sourdough with perfect crust',
      price: 2500,
      category: 'bread',
      stock: 12,
      imageUrl:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      isActive: true,
      isFeatured: true,
    },
    {
      id: 'fallback-2',
      name: 'Chocolate Croissant',
      description: 'Buttery croissant with rich chocolate',
      price: 1800,
      category: 'pastry',
      stock: 8,
      imageUrl:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      isActive: true,
      isFeatured: true,
    },
    {
      id: 'fallback-3',
      name: 'Red Velvet Cake',
      description: 'Classic red velvet with cream cheese frosting',
      price: 8500,
      category: 'cake',
      stock: 3,
      imageUrl:
        'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      isActive: true,
      isFeatured: true,
    },
    {
      id: 'fallback-4',
      name: 'Honey Oat Bread',
      description: 'Wholesome bread with natural honey',
      price: 2200,
      category: 'bread',
      stock: 15,
      imageUrl:
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      isActive: true,
      isFeatured: true,
    },
  ]

  const fallbackCategoryProducts = {
    Breads: [
      {
        id: 'bread-1',
        name: 'Multigrain Loaf',
        description: 'Healthy multigrain bread',
        price: 2800,
        category: 'bread',
        stock: 10,
        imageUrl:
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
        isActive: true,
      },
      {
        id: 'bread-2',
        name: 'French Baguette',
        description: 'Classic French baguette',
        price: 1500,
        category: 'bread',
        stock: 20,
        imageUrl:
          'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
        isActive: true,
      },
    ],
    Cakes: [
      {
        id: 'cake-1',
        name: 'Vanilla Sponge',
        description: 'Light and fluffy vanilla cake',
        price: 7500,
        category: 'cake',
        stock: 5,
        imageUrl:
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
        isActive: true,
      },
      {
        id: 'cake-2',
        name: 'Chocolate Fudge',
        description: 'Rich chocolate fudge cake',
        price: 9200,
        category: 'cake',
        stock: 2,
        imageUrl:
          'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
        isActive: true,
      },
    ],
  }

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [categoriesData, productsData] = await Promise.all([
          productsService.getCategories(),
          productsService.getProducts({ limit: 20, isActive: true }),
        ])

        setCategories(categoriesData)
        setFeaturedProducts(productsData.products.filter((p) => p.isFeatured))

        // Group products by category
        const grouped: Record<string, Product[]> = {}
        for (const category of categoriesData.slice(0, 4)) {
          // Limit to 4 categories
          const categoryProducts = await productsService.getProducts({
            category: category.name,
            limit: 4,
            isActive: true,
          })
          grouped[category.name] = categoryProducts.products
        }
        setProductsByCategory(grouped)
      } catch (error) {
        console.error('Failed to fetch landing page data:', error)
        toast.error('Failed to load products')
        // Set fallback data on error
        setFeaturedProducts(fallbackFeaturedProducts)
        setProductsByCategory(fallbackCategoryProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Hero carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [heroSlides.length])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        {/* Announcement Bar */}
        {/* <div className="bg-gray-100 text-center py-2">
          <p className="text-sm text-gray-600">
            Due to high demand, orders may take 3-5 business days to fulfill.
          </p>
        </div> */}

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="block">
              <img src={OmadeLogo} alt="Omade Cravings Logo" width={60}  className="inline-block" />
                {/* <h1 className="font-brand text-xl sm:text-2xl font-bold text-black tracking-luxury hover:text-gray-700 transition-colors text-luxury-shadow">
                  OMADE CRAVINGS
                </h1> */}
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8">
              <a
                href="/shop?category=bread"
                className="font-luxury-sans text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors tracking-premium"
              >
                BREADS
              </a>
              <a
                href="/shop?category=pastry"
                className="font-luxury-sans text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors tracking-premium"
              >
                PASTRIES
              </a>
              <a
                href="/shop?category=cake"
                className="font-luxury-sans text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors tracking-premium"
              >
                CAKES
              </a>
              <a
                href="/shop?category=seasonal"
                className="font-luxury-sans text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors tracking-premium"
              >
                SEASONAL
              </a>
              <a
                href="/about"
                className="font-luxury-sans text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors tracking-premium"
              >
                ABOUT
              </a>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 group hover:scale-110 active:scale-95"
                aria-label="Search products (⌘K)"
                title="Search products (⌘K)"
              >
                <Search className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-all duration-300 group-hover:rotate-12" />
              </button>
              <CartDrawer /> */}

              {/* Mobile menu button */}
              {/* <button
                type="button"
                className="lg:hidden p-2 -m-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button> */}
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <a
                  href="/shop?category=bread"
                  className="text-gray-900 block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded transition-colors"
                >
                  BREADS
                </a>
                <a
                  href="/shop?category=pastry"
                  className="text-gray-900 block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded transition-colors"
                >
                  PASTRIES
                </a>
                <a
                  href="/shop?category=cake"
                  className="text-gray-900 block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded transition-colors"
                >
                  CAKES
                </a>
                <a
                  href="/shop?category=seasonal"
                  className="text-gray-900 block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded transition-colors"
                >
                  SEASONAL
                </a>
                <a
                  href="/about"
                  className="text-gray-900 block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded transition-colors"
                >
                  ABOUT
                </a>
                <a
                  href="/feedback"
                  className="text-gray-900 block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded transition-colors"
                >
                  FEEDBACK
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

           {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />


      {/* Hero Carousel Section - Salt Lagos Style with Animation */}
      <section className="relative">
        <div className="relative h-[70vh] overflow-hidden">
          {/* Carousel Images */}
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover animate-scale-in"
              />
              <div className="absolute inset-0 bg-black opacity-50" />

              {/* Slide Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                  <h1 className="font-luxury-display text-5xl md:text-7xl lg:text-9xl font-bold mb-6 animate-fade-in tracking-luxury text-luxury-shadow">
                    {slide.title}
                  </h1>
                  <p className="font-luxury-serif text-lg md:text-xl mb-8 font-light animate-slide-up tracking-premium">
                    {slide.subtitle}
                  </p>
                  <a
                    href={slide.link}
                    className="font-luxury-sans inline-block bg-transparent border-2 border-white text-white px-8 py-3 font-medium hover:bg-white hover:text-black transition-colors animate-slide-up tracking-premium"
                  >
                    {slide.cta}
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          {/* <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button> */}

          {/* Dots Indicator */}
          {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-110' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div> */}
        </div>
      </section>

      {/* Featured Products Section */}
      {(featuredProducts.length > 0 ? featuredProducts : fallbackFeaturedProducts).length > 0 && (
        <section id="new-arrivals" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 tracking-wide">
                FEATURED PRODUCTS
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Discover our handpicked selection of the finest artisanal creations, crafted with
                premium ingredients.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {(featuredProducts.length > 0 ? featuredProducts : fallbackFeaturedProducts)
                .slice(0, 4)
                .map((product) => (
                  <div key={product.id} className="group">
                    <a href={`/products/${product.id}`} className="block">
                      <div className="aspect-square bg-gray-50 mb-4 overflow-hidden rounded-lg relative">
                        <img
                          src={product.imageUrl || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Product Labels */}
                        <div className="absolute top-3 left-3">
                          <div className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                            Featured
                          </div>
                        </div>

                        {/* Out of Stock Overlay */}
                        {(product.stock === 0 || !product.isActive) && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                            <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                              <span className="text-sm font-medium text-gray-900">
                                {product.stock === 0 ? 'Out of Stock' : 'Unavailable'}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Quick Add to Cart Button */}
                        {product.isActive && product.stock > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleAddToCart(product)
                            }}
                            className="absolute inset-x-3 bottom-3 bg-black text-white py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center space-x-2 hover:bg-gray-800 z-10"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span className="text-sm font-medium">Quick Add</span>
                          </button>
                        )}
                      </div>
                    </a>

                    <div className="text-center">
                      <a href={`/products/${product.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-gray-600 transition-colors">
                          {product.name}
                        </h3>
                      </a>
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={`featured-star-${product.id}-${i}`}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {typeof product.category === 'string'
                          ? product.category
                          : product.category.name}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="/shop"
                className="inline-block bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                See All Products
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Category Sections */}
      {Object.entries(
        Object.keys(productsByCategory).length > 0 ? productsByCategory : fallbackCategoryProducts
      ).map(([categoryName, products], index) => {
        if (products.length === 0) return null

        const bgClass = index % 2 === 1 ? 'bg-gray-50' : 'bg-white'

        return (
          <section
            key={categoryName}
            className={`py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 ${bgClass}`}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 tracking-wide">
                  {categoryName.toUpperCase()}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                  Discover our exquisite selection of {categoryName.toLowerCase()} crafted with the
                  finest ingredients and traditional techniques.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {products.slice(0, 4).map((product: Product) => (
                  <div key={product.id} className="group">
                    <a href={`/products/${product.id}`} className="block">
                      <div className="aspect-square bg-gray-50 mb-4 overflow-hidden rounded-lg relative">
                        <img
                          src={product.imageUrl || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                          <div className="absolute inset-0  bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                            <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                              <span className="text-sm font-medium text-gray-900">
                                {product.stock === 0 ? 'Out of Stock' : 'Unavailable'}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Quick Add to Cart Button */}
                        {product.isActive && product.stock > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleAddToCart(product)
                            }}
                            className="absolute inset-x-3 bottom-3 bg-black text-white py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center space-x-2 hover:bg-gray-800 z-10"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span className="text-sm font-medium">Quick Add</span>
                          </button>
                        )}
                      </div>
                    </a>

                    <div className="text-center">
                      <a href={`/products/${product.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-gray-600 transition-colors">
                          {product.name}
                        </h3>
                      </a>
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={`${product.id}-star-${i}`}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      {product.stock <= 5 && product.stock > 0 && (
                        <p className="text-xs text-orange-600 mb-2">
                          Only {product.stock} left in stock!
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <a
                  href={`/shop?category=${categoryName.toLowerCase()}`}
                  className="inline-block bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
                >
                  See All {categoryName}
                </a>
              </div>
            </div>
          </section>
        )
      })}

      {/* Who We Are Section */}
      <section id="who-we-are" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-wide">
            WHO WE ARE
          </h2>
          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-600 leading-relaxed">
            <p className="px-4">
              Omade Cravings is a modern artisanal bakery dedicated to creating exceptional baked
              goods that bring people together. Founded with a passion for traditional techniques
              and innovative flavors, we craft each item with meticulous attention to detail.
            </p>
            <p className="px-4">
              Our mission is to elevate the everyday bread experience through carefully sourced
              ingredients, time-honored methods, and creative inspiration. From our signature
              sourdough to seasonal specialties, every product tells a story of craftsmanship and
              care.
            </p>
            <p className="font-medium text-gray-900 px-4">
              We believe that great bread is more than sustenance - it's a cornerstone of community,
              comfort, and connection.
            </p>
          </div>
        </div>
      </section>

      {/* Build Your Cake Section - Salt Lagos Style */}
      <section id="build-your-cake" className="py-64 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 tracking-wide">
                BUILD YOUR CAKE
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Design the perfect cake for your special occasion. Our interactive cake builder lets
                you customize every detail from flavor to decoration, creating a truly unique
                centerpiece for your celebration.
              </p>
              <a
                href="/build-cake"
                className="inline-block bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                START BUILDING
              </a>
            </div>

            {/* Image */}
            <div>
              <div className="aspect-[4/3] bg-white overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                  alt="Build Your Custom Cake"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Section - Salt Lagos Style */}
      <section id="publications" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 tracking-wide">
              PUBLICATIONS
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our featured stories, recipes, and insights from the world of artisanal
              baking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="group cursor-pointer">
              <div className="aspect-[4/3] bg-white mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                  alt="Baking Techniques"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Traditional Baking Techniques
                </h3>
                <p className="text-gray-600 mb-3">
                  Discover the time-honored methods that make our bread extraordinary.
                </p>
                <span className="text-sm text-gray-500">March 15, 2024</span>
              </div>
            </article>

            <article className="group cursor-pointer">
              <div className="aspect-[4/3] bg-white mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                  alt="Seasonal Ingredients"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Seasonal Ingredient Guide
                </h3>
                <p className="text-gray-600 mb-3">
                  How we source the finest seasonal ingredients for our creations.
                </p>
                <span className="text-sm text-gray-500">February 28, 2024</span>
              </div>
            </article>

            <article className="group cursor-pointer">
              <div className="aspect-[4/3] bg-white mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                  alt="Custom Cakes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Custom Cake Design Process
                </h3>
                <p className="text-gray-600 mb-3">
                  Behind the scenes of creating your perfect celebration cake.
                </p>
                <span className="text-sm text-gray-500">February 10, 2024</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 tracking-wide">
            STAY IN THE KNOW
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4">
            Subscribe to our newsletter for exclusive recipes, baking tips, and first access to new
            products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto px-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-900 text-sm sm:text-base"
              onClick={(e) => e.preventDefault()}
            />
            <button
              type="button"
              className="px-6 sm:px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
