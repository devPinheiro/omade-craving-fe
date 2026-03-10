import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { CartIcon } from './CartIcon'
import { createPortal } from 'react-dom'
import { useCartStore } from '@/store/cart'

function getCategoryLabel(
  category: string | { name?: string; category?: string } | undefined
): string {
  if (!category) return ''
  if (typeof category === 'string') return category
  if ('name' in category && category.name) return category.name
  if ('category' in category && category.category) return category.category
  return ''
}

const PLACEHOLDER_IMAGE = '/placeholder-product.jpg'

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    items,
    totalItems,
    subtotal,
    discountAmount,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore()

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [isOpen])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const overlayAndDrawer = (
    <>
      {isOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop is click-to-dismiss; Escape handled in useEffect
        <div
          className="fixed inset-0 z-[9998] bg-black/50"
          onClick={() => setIsOpen(false)}
          role="presentation"
          aria-hidden
        />
      )}
      <dialog
        data-cart
        open={isOpen}
        aria-label="Shopping cart"
        className={`fixed left-auto right-0 top-0 z-[9999] m-0 h-full w-full max-w-lg border-0 bg-white p-0 shadow-xl transition-transform duration-300 ease-in-out [&::backdrop]:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 className="text-xl font-medium text-gray-900">Shopping Cart ({totalItems})</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="h-5 w-5 " />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
                <p className="mb-6 text-gray-500">Add some delicious items to get started!</p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4 p-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-lg bg-gray-50 p-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                      <img
                        src={item.image || PLACEHOLDER_IMAGE}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const el = e.currentTarget
                          if (el.src !== PLACEHOLDER_IMAGE) el.src = PLACEHOLDER_IMAGE
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {getCategoryLabel(item.category)}
                      </p>

                      {/* Customizations */}
                      {item.customizations && (
                        <div className="mt-2 space-y-1">
                          {'variant' in item.customizations &&
                            item.customizations.variant && (
                              <p className="text-xs text-gray-600">
                                {String(item.customizations.variant)}
                              </p>
                            )}
                          {item.customizations.size && (
                            <p className="text-xs text-gray-600">
                              Size: {item.customizations.size}
                            </p>
                          )}
                          {item.customizations.layers && (
                            <p className="text-xs text-gray-600">
                              Layers: {item.customizations.layers}
                            </p>
                          )}
                          {item.customizations.flavors &&
                            item.customizations.flavors.length > 0 && (
                              <p className="text-xs text-gray-600">
                                Flavors: {item.customizations.flavors.join(', ')}
                              </p>
                            )}
                          {item.customizations.message && (
                            <p className="text-xs text-gray-600">
                              Message: "{item.customizations.message}"
                            </p>
                          )}
                          {item.customizations.extras && item.customizations.extras.length > 0 && (
                            <p className="text-xs text-gray-600">
                              Extras: {item.customizations.extras.join(', ')}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="rounded p-1 hover:bg-white transition-colors"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[2ch] text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="rounded p-1 hover:bg-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.totalPrice)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="rounded p-1 text-red-600 hover:bg-red-100 transition-colors"
                            aria-label="Remove from cart"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="space-y-4 border-t border-gray-200 p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    setIsOpen(false)
                    window.location.href = '/checkout'
                  }}
                >
                  Proceed to Checkout
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your cart?')) {
                        clearCart()
                      }
                    }}
                    className="w-full text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  )

  return (
    <>
      <CartIcon className='text-black group-hover:text-gray-900 transition-all duration-300 group-hover:rotate-12'  onClick={() => setIsOpen(true)} />
      {createPortal(overlayAndDrawer, document.body)}
    </>
  )
}
