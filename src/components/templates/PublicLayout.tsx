import { CartDrawer } from '@/components/ui/CartDrawer'
import { SearchOverlay } from '@/components/ui/SearchOverlay'
import { Outlet } from '@tanstack/react-router'
import { Menu, Search, X } from 'lucide-react'
import { Children, useEffect, useState } from 'react'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

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

  return (
    <div className="min-h-screen bg-white">
      {/* Skip Links */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#primary-navigation" className="skip-link">
        Skip to navigation
      </a>
      
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
                <h1 className="font-brand text-xl sm:text-2xl font-bold text-black tracking-luxury hover:text-gray-700 transition-colors text-luxury-shadow">
                  OMADE CRAVINGS
                </h1>
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
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 group hover:scale-110 active:scale-95"
                aria-label="Search products (⌘K)"
                title="Search products (⌘K)"
              >
                <Search className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-all duration-300 group-hover:rotate-12" />
              </button>
              <CartDrawer />

              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden p-2 -m-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
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

      {/* Page Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                SHOP
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600">
                <li>
                  <a href="/shop" className="hover:text-gray-900 transition-colors">
                    All Products
                  </a>
                </li>
                <li>
                  <a href="/shop?category=bread" className="hover:text-gray-900 transition-colors">
                    Breads
                  </a>
                </li>
                <li>
                  <a href="/shop?category=pastry" className="hover:text-gray-900 transition-colors">
                    Pastries
                  </a>
                </li>
                <li>
                  <a href="/shop?category=cake" className="hover:text-gray-900 transition-colors">
                    Cakes
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                COMPANY
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600">
                <li>
                  <a href="/about" className="hover:text-gray-900 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-gray-900 transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="/build-cake" className="hover:text-gray-900 transition-colors">
                    Custom Cakes
                  </a>
                </li>
                <li>
                  <a href="/#publications" className="hover:text-gray-900 transition-colors">
                    Publications
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                SUPPORT
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600">
                <li>
                  <a href="/feedback" className="hover:text-gray-900 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/feedback" className="hover:text-gray-900 transition-colors">
                    Feedback
                  </a>
                </li>
                <li>
                  <a href="/checkout" className="hover:text-gray-900 transition-colors">
                    Checkout
                  </a>
                </li>
                <li>
                  <a href="/shop" className="hover:text-gray-900 transition-colors">
                    Shop
                  </a>
                </li>
                <li>
                  <a href="/#newsletter" className="hover:text-gray-900 transition-colors">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                CONNECT
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600">
                <li>
                  <a
                    href="https://instagram.com/omadecravings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com/omadecravings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/omadecravings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="/#newsletter" className="hover:text-gray-900 transition-colors">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-gray-600 text-xs sm:text-sm text-center sm:text-left">
                © 2024 Omade Cravings. All rights reserved.
              </p>
              <div className="flex space-x-4 sm:space-x-6">
                <a
                  href="/feedback"
                  className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/feedback"
                  className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
