export interface CartCustomizations {
  size?: string
  layers?: number
  flavors?: string[]
  message?: string
  extras?: string[]
}

export interface CartItem {
  id: string // Unique cart item ID (product + customizations hash)
  productId: string
  name: string
  image: string
  basePrice: number
  quantity: number
  customizations?: CartCustomizations
  totalPrice: number // basePrice * quantity + customization costs
  category: string
}

export interface CartDiscount {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description: string
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  subtotal: number
  discounts: CartDiscount[]
  discountAmount: number
  totalPrice: number
  updatedAt: string
}

export interface CartActions {
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  applyDiscount: (discount: CartDiscount) => void
  removeDiscount: (discountId: string) => void
  getItemCount: () => number
  getCartTotal: () => number
}

export interface CartStore extends Cart, CartActions {}

// Helper function to generate unique cart item ID
export const generateCartItemId = (
  productId: number,
  customizations?: CartCustomizations
): string => {
  const customizationHash = customizations
    ? btoa(JSON.stringify(customizations)).slice(0, 8)
    : 'default'
  return `${productId}-${customizationHash}`
}

// Helper function to calculate item total price
export const calculateItemTotal = (
  basePrice: number,
  quantity: number,
  customizations?: CartCustomizations
): number => {
  let total = basePrice * quantity

  // Add customization costs if any
  if (customizations?.extras) {
    // Add logic for extras pricing
    const extrasPrice = customizations.extras.length * 2500 // Example pricing
    total += extrasPrice * quantity
  }

  return total
}
