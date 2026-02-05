import { useCartStore } from '@/store/cart'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { CartIcon } from './CartIcon'

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <>
      {/* Cart Icon Trigger */}
      <CartIcon onClick={() => setIsOpen(true)} />

      {/* Backdrop */}
      {isOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <div
        data-cart
        className={`
        fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900">Shopping Cart ({totalItems})</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.category}</p>

                      {/* Customizations */}
                      {item.customizations && (
                        <div className="mt-2 space-y-1">
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

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-medium min-w-[2ch] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.totalPrice)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 hover:bg-red-100 rounded transition-colors text-red-600"
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

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Order Summary */}
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
                <div className="flex justify-between font-medium border-t border-gray-200 pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  onClick={() => {
                    setIsOpen(false)
                    // Navigate to checkout - will implement this later
                    window.location.href = '/checkout'
                  }}
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
                {items.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your cart?')) {
                        clearCart()
                      }
                    }}
                    className="w-full text-red-600 text-sm hover:text-red-800 transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
