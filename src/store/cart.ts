import type {
  Cart,
  CartDiscount,
  CartItem,
  CartStore,
  calculateItemTotal,
  generateCartItemId,
} from '@/types/cart'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Helper functions (moving from types file for better organization)
export const generateCartItemId = (
  productId: string,
  customizations?: CartItem['customizations']
): string => {
  const customizationHash = customizations
    ? btoa(JSON.stringify(customizations)).slice(0, 8)
    : 'default'
  return `${productId}-${customizationHash}`
}

export const calculateItemTotal = (
  basePrice: number,
  quantity: number,
  customizations?: CartItem['customizations']
): number => {
  let total = basePrice * quantity

  // Add customization costs
  if (customizations?.extras) {
    const extrasMap: Record<string, number> = {
      greetingCard: 2500,
      balloons: 5000,
    }

    const extrasPrice = customizations.extras.reduce((sum, extra) => {
      return sum + (extrasMap[extra] || 0)
    }, 0)

    total += extrasPrice * quantity
  }

  // Add flavor premiums (for custom cakes)
  if (customizations?.flavors) {
    const flavorPremiumMap: Record<string, number> = {
      'Red Velvet': 5000,
      'Carrot Cake': 4000,
      Strawberry: 3500,
      Chocolate: 3000,
      Funfetti: 2500,
      Lemon: 2000,
    }

    const flavorPremium = customizations.flavors.reduce((sum, flavor) => {
      return sum + (flavorPremiumMap[flavor] || 0)
    }, 0)

    total += flavorPremium * quantity
  }

  // Add layer multiplier (for custom cakes)
  if (customizations?.layers && customizations.layers !== 2) {
    const layerMultipliers = { 1: 0.6, 2: 1.0, 3: 1.4, 4: 1.8 }
    const multiplier =
      layerMultipliers[customizations.layers as keyof typeof layerMultipliers] || 1.0
    total = total - basePrice * quantity + basePrice * quantity * multiplier
  }

  return Math.round(total)
}

const calculateCartTotals = (items: CartItem[], discounts: CartDiscount[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate discount amount
  const discountAmount = discounts.reduce((sum, discount) => {
    if (discount.type === 'percentage') {
      return sum + (subtotal * discount.value) / 100
    }
    return sum + discount.value
  }, 0)

  const totalPrice = Math.max(0, subtotal - discountAmount)

  return { subtotal, totalItems, discountAmount, totalPrice }
}

const initialState: Cart = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  discounts: [],
  discountAmount: 0,
  totalPrice: 0,
  updatedAt: new Date().toISOString(),
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (itemData) => {
        const cartItemId = generateCartItemId(itemData.productId, itemData.customizations)
        const totalPrice = calculateItemTotal(
          itemData.basePrice,
          itemData.quantity,
          itemData.customizations
        )

        const newItem: CartItem = {
          ...itemData,
          id: cartItemId,
          totalPrice,
        }

        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => item.id === cartItemId)
          let updatedItems: CartItem[]

          if (existingItemIndex >= 0) {
            // Item with same customizations exists, increase quantity
            updatedItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? {
                    ...item,
                    quantity: item.quantity + newItem.quantity,
                    totalPrice: calculateItemTotal(
                      item.basePrice,
                      item.quantity + newItem.quantity,
                      item.customizations
                    ),
                  }
                : item
            )
          } else {
            // New item, add to cart
            updatedItems = [...state.items, newItem]
          }

          const totals = calculateCartTotals(updatedItems, state.discounts)

          return {
            items: updatedItems,
            ...totals,
            updatedAt: new Date().toISOString(),
          }
        })
      },

      removeItem: (itemId) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== itemId)
          const totals = calculateCartTotals(updatedItems, state.discounts)

          return {
            items: updatedItems,
            ...totals,
            updatedAt: new Date().toISOString(),
          }
        })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  totalPrice: calculateItemTotal(item.basePrice, quantity, item.customizations),
                }
              : item
          )

          const totals = calculateCartTotals(updatedItems, state.discounts)

          return {
            items: updatedItems,
            ...totals,
            updatedAt: new Date().toISOString(),
          }
        })
      },

      clearCart: () => {
        set({
          ...initialState,
          updatedAt: new Date().toISOString(),
        })
      },

      applyDiscount: (discount) => {
        set((state) => {
          const existingDiscount = state.discounts.find((d) => d.id === discount.id)
          if (existingDiscount) return state

          const updatedDiscounts = [...state.discounts, discount]
          const totals = calculateCartTotals(state.items, updatedDiscounts)

          return {
            discounts: updatedDiscounts,
            ...totals,
            updatedAt: new Date().toISOString(),
          }
        })
      },

      removeDiscount: (discountId) => {
        set((state) => {
          const updatedDiscounts = state.discounts.filter((d) => d.id !== discountId)
          const totals = calculateCartTotals(state.items, updatedDiscounts)

          return {
            discounts: updatedDiscounts,
            ...totals,
            updatedAt: new Date().toISOString(),
          }
        })
      },

      getItemCount: () => {
        return get().totalItems
      },

      getCartTotal: () => {
        return get().totalPrice
      },
    }),
    {
      name: 'omade-cart-storage',
      version: 1,
    }
  )
)
