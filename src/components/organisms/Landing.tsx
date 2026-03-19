import { useEffect, useState } from "react";

import { Link } from "@tanstack/react-router";
import type { Product } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import { getBusinessStructuredData } from "@/lib/seo";
import { subscribeNewsletter } from "@/services/newsletter";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { useLandingProducts } from "@/hooks/useProducts";
import { useSEO } from "@/hooks/useSEO";

const Landing = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const { productsByCategory, isLoading: loading } = useLandingProducts();

  useSEO({
    title: "Omade Cravings - Handcrafted Cakes",
    description:
      "Experience the finest artisanal cakes. Custom celebration cakes, signature flavors, and specialty cakes made with care and quality ingredients.",
    keywords: [
      "artisanal bakery",
      "handcrafted cakes",
      "custom cakes",
      "celebration cakes",
    ],
    structuredData: getBusinessStructuredData(),
  });

  const heroSlides = [
    {
      id: 1,
      image:
        "https://res.cloudinary.com/appnet/image/upload/v1773096899/products/phrsr0octibydndforfm.png",
      title: "OMADE CRAVINGS",
      subtitle: "Artisanal baked goods crafted with love and tradition",
      cta: "SHOP NOW",
      link: "/shop",
    },
    // {
    //   id: 2,
    //   image:
    //     'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    //   title: 'FRESH DAILY',
    //   subtitle: 'Handcrafted cakes made fresh with care',
    //   cta: 'EXPLORE CAKES',
    //   link: '#bestsellers',
    // },
    // {
    //   id: 3,
    //   image:
    //     'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    //   title: 'CUSTOM CAKES',
    //   subtitle: 'Design your perfect celebration cake with our expert bakers',
    //   cta: 'BUILD YOUR CAKE',
    //   link: 'javascript:void(0)',
    // },
  ];

  // Hero carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = (product: Product) => {
    const categoryLabel =
      typeof product.category === "string"
        ? product.category
        : (product.category?.name ?? "");
    addItem({
      productId: product.id,
      name: product.name,
      image: product.imageUrl || "",
      basePrice: product.price,
      quantity: 1,
      category: categoryLabel,
    });
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}

      {/* Hero Carousel Section - Salt Lagos Style with Animation */}
      <section className="">
        <div className="hidden lg:flex  h-[20vh] lg:h-[100vh] overflow-hidden lg:-pt-32">
          {/* Carousel Images */}
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover animate-scale-in"
              />
              <div className="absolute inset-0 bg-black opacity-60" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                  <h1 className="font-luxury-accent text-5xl md:text-7xl lg:text-9xl font-bold mb-6 animate-fade-in tracking-luxury text-luxury-shadow">
                    {slide.title}
                  </h1>
                  <p className="font-brand text-lg md:text-3xl mb-8 font-light animate-slide-up tracking-premium">
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
      {/* {(featuredProducts.length > 0 ? featuredProducts : fallbackFeaturedProducts).length > 0 && (
        <section id="new-arrivals" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-brand  text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 tracking-wide">
                New Arrivals
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Discover our handpicked selection of the finest artisanal creations, crafted with
                premium ingredients.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {(featuredProducts.length > 0 ? featuredProducts : fallbackFeaturedProducts)
                .slice(0, 4)
                .map((product) => (
                  <div key={product.id} className="group">
                    <a href={`/products/${product.id}`} className="block">
                      <div className="aspect-square bg-gray-50 mb-4 overflow-hidden rounded-lg relative flex items-center justify-center">
                        <img
                          src={product.imageUrl || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-contain object-center"
                        />

                        
                        {/* <div className="absolute top-3 left-3">
                          <div className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                            Featured
                          </div>
                        </div> 

                        
                        {(product.stock === 0 || !product.isActive) && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                            <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                              <span className="text-sm font-medium text-gray-900">
                                {product.stock === 0 ? 'Out of Stock' : 'Unavailable'}
                              </span>
                            </div>
                          </div>
                        )}

               
                        {product.isActive && product.stock > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleAddToCart(product)
                            }}
                            className="absolute inset-x-3 bottom-3 bg-black text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 z-10"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span className="text-sm font-medium">Add to Cart</span>
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
                      {/* <div className="flex items-center justify-center space-x-1 mb-2">
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
                className="inline-block bg-orange-600 rounded-full text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                See All Products
              </a>
            </div>
          </div>
        </section>
      )} */}

      {/* Category Sections */}
      {Object.entries(productsByCategory).map(
        ([categoryName, products], index) => {
          if (products.length === 0) return null;

          const bgClass = index % 2 === 1 ? "bg-gray-50" : "bg-white";

          return (
            <section
              key={categoryName}
              className={`py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 ${bgClass}`}
            >
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="font-brand  text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 tracking-wide">
                    New Arrivals
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                    Discover our exquisite selection of New Arrivals crafted
                    with the finest ingredients and traditional techniques.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {products.slice(0, 4).map((product: Product) => (
                    <div key={product.id} className="group">
                      <Link
                        to="/products/$productId"
                        params={{ productId: product.id }}
                        className="block"
                      >
                        <div className="aspect-square bg-gray-50 mb-4 overflow-hidden rounded-lg relative flex items-center justify-center">
                          <img
                            src={product.imageUrl || "/placeholder-product.jpg"}
                            alt={product.name}
                            className="w-full h-full object-contain object-center"
                          />

                          {/* Product Labels */}
                          <div className="absolute top-3 left-3 space-y-1">
                            {/* {product.isFeatured && (
                            <div className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                              Featured
                            </div>
                          )} */}
                            {product.stock > 0 &&
                              product.stock <= (product.minStock || 5) && (
                                <div className="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-800">
                                  Low Stock
                                </div>
                              )}
                          </div>

                          {/* Out of Stock Overlay */}
                          {(product.stock === 0 || !product.isActive) && (
                            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                              <div className="bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg">
                                <span className="text-xs sm:text-sm font-medium text-gray-900">
                                  {product.stock === 0
                                    ? "Out of Stock"
                                    : "Unavailable"}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Add to Cart Button */}
                          {product.isActive && product.stock > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 bg-black text-white py-1.5 px-2 sm:py-2 sm:px-4 rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 hover:bg-gray-800 z-10"
                            >
                              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                              <span className="text-xs sm:text-sm font-medium">
                                Add to Cart
                              </span>
                            </button>
                          )}
                        </div>
                      </Link>

                      <div className="text-center">
                        <Link
                          to="/products/$productId"
                          params={{ productId: product.id }}
                        >
                          <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2 hover:text-gray-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        {/* <div className="flex items-center justify-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={`${product.id}-star-${i}`}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                      </div> */}
                        <div className="flex items-center justify-center space-x-2 mb-2 sm:mb-3">
                          <span className="text-sm sm:text-lg font-semibold text-gray-900">
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
                    className="inline-block bg-orange-600 rounded-full text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
                  >
                    See All New Arrivals
                  </a>
                </div>
              </div>
            </section>
          );
        },
      )}

      {/* Who We Are Section */}
      <section
        id="who-we-are"
        className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-10 tracking-wide">
            Who We Are
          </h2>
          <div className="space-y-5 sm:space-y-6 text-base sm:text-lg text-gray-600 leading-relaxed">
            <p className="px-2 sm:px-4">
              At Omade Cravings, every cake tells a story—and this one began
              long before the business. I grew up in a home where celebrations
              were simple. Birthdays came and went without cakes, without
              candles, without that special moment of gathering around something
              sweet. I would watch others celebrate and quietly wish for what
              felt like a small thing… but meant so much. To many people, a cake
              is just dessert. But to me, it became a symbol—of joy, of love, of
              being seen and celebrated. That desire stayed with me.
            </p>
            <p className="px-2 sm:px-4">
              Over time, it turned into a passion. I didn’t just want to bake
              cakes—I wanted to create the kind of moments I once longed for.
              The kind where people feel special, remembered, and deeply
              celebrated. That’s how Omade Cravings was born.
            </p>
            <p className="px-2 sm:px-4">
              Today, every cake we make is more than flour, sugar, and frosting.
              It is:
            </p>
            <ul className="list-none space-y-2 px-2 sm:px-4 text-base sm:text-lg text-gray-600 leading-relaxed mb-5 sm:mb-6">
              <li className="flex items-center justify-center gap-2">
                <span className="text-amber-600" aria-hidden>•</span>
                <span>A celebration of life</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-amber-600" aria-hidden>•</span>
                <span>A touch of love</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-amber-600" aria-hidden>•</span>
                <span>A moment turned into a memory</span>
              </li>
            </ul>
            <p className="px-2 sm:px-4">
              We pay attention to every detail because we understand what
              it means to someone on the other side of that cake. Whether it’s
              your birthday, wedding, or just a reason to smile, we are honored
              to be part of your story—creating the moments we once only dreamed
              of. Because at Omade Cravings, every celebration deserves to feel
              special.
            </p>
            
          </div>
          {/* <a
            href="/about"
            className="inline-block mt-8 sm:mt-10 text-gray-900 font-medium underline underline-offset-4 hover:no-underline focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded"
          >
            Read our story →
          </a> */}
        </div>
      </section>

      {/* Build Your Cake Section - Salt Lagos Style
     <section id="build-your-cake" className="py-64 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
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
      </section> */}

      {/* Publications Section - Salt Lagos Style */}
      {/* <section id="publications" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
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
                  Discover the time-honored methods that make our cakes extraordinary.
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
      </section> */}

      {/* Newsletter Section */}
      <section
        id="newsletter"
        className="py-12 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-100"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 tracking-wide">
            STAY IN THE KNOW
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4">
            Subscribe to our newsletter for exclusive recipes, baking tips, and
            first access to new products.
          </p>
          {newsletterSuccess ? (
            <p className="text-green-700 font-medium px-4">
              Thanks for subscribing! Check your inbox to confirm.
            </p>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (newsletterLoading || !newsletterEmail.trim()) return;
                setNewsletterLoading(true);
                try {
                  await subscribeNewsletter(newsletterEmail);
                  setNewsletterSuccess(true);
                  setNewsletterEmail("");
                  toast.success("Subscribed! Check your email to confirm.");
                } catch (err) {
                  const message =
                    err instanceof Error
                      ? err.message
                      : "Subscription failed. Try again.";
                  toast.error(message);
                } finally {
                  setNewsletterLoading(false);
                }
              }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto px-4"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={newsletterLoading}
                required
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base disabled:opacity-60"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                disabled={newsletterLoading || !newsletterEmail.trim()}
                className="px-6 sm:px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {newsletterLoading ? "Subscribing…" : "SUBSCRIBE"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
