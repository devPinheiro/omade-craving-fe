import { CheckoutForm } from '@/components/organisms/CheckoutForm'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { useCartStore } from '@/store/cart'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/checkout')({
  component: CheckoutRoute,
})

function CheckoutRoute() {
  const router = useRouter()
  const { items, subtotal, updateQuantity, removeItem } = useCartStore()

  const handleOrderComplete = (orderId: string) => {
    // Navigate to order confirmation page
    router.navigate({
      to: '/order-confirmation',
      search: { orderId },
    })
  }

  if (items.length === 0) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-light text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <a
              href="/shop"
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-block"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </PublicLayout>
    )
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <PublicLayout>
      <div data-order className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-wide">
            CHECKOUT
          </h1>
          <p className="text-lg text-gray-600">
            Complete your order details and payment information
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Order Summary */}
          <div className="space-y-6 mb-8 lg:mb-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary ({totalItems} items)
              </h2>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-18 h-18 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                          {item.name}
                        </h4>
                      </div>

                      {/* Customizations */}
                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                        <div className="mb-3 space-y-1">
                          {item.customizations.layers && (
                            <div className="flex items-center">
                              <span className="inline-block w-12 text-xs font-medium text-gray-500">
                                Layers:
                              </span>
                              <span className="text-xs text-gray-700">
                                {item.customizations.layers}
                              </span>
                            </div>
                          )}
                          {item.customizations.flavors &&
                            item.customizations.flavors.length > 0 && (
                              <div className="flex items-center">
                                <span className="inline-block w-12 text-xs font-medium text-gray-500">
                                  Flavors:
                                </span>
                                <span className="text-xs text-gray-700">
                                  {item.customizations.flavors.join(', ')}
                                </span>
                              </div>
                            )}
                          {item.customizations.size && (
                            <div className="flex items-center">
                              <span className="inline-block w-12 text-xs font-medium text-gray-500">
                                Size:
                              </span>
                              <span className="text-xs text-gray-700">
                                {item.customizations.size}
                              </span>
                            </div>
                          )}
                          {item.customizations.message && (
                            <div className="flex items-start">
                              <span className="inline-block w-12 text-xs font-medium text-gray-500">
                                Message:
                              </span>
                              <span className="text-xs text-gray-700 italic">
                                "{item.customizations.message}"
                              </span>
                            </div>
                          )}
                          {item.customizations.extras && item.customizations.extras.length > 0 && (
                            <div className="flex items-center">
                              <span className="inline-block w-12 text-xs font-medium text-gray-500">
                                Extras:
                              </span>
                              <span className="text-xs text-gray-700">
                                {item.customizations.extras.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="lg:flex items-center lg:justify-between">
                        <span className="text-sm font-semibold text-gray-900 ">
                          ₦{item.totalPrice.toLocaleString()}
                        </span>

                        <div className="flex items-center space-x-2 mt-1 lg:mt-0">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-1.5 text-sm font-medium min-w-[2.5rem] text-center border-x border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>₦{subtotal.toLocaleString()}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">Delivery fees calculated at checkout.</p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <CheckoutForm onOrderComplete={handleOrderComplete} />
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
