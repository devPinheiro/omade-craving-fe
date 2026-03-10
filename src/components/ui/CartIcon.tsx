import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

interface CartIconProps {
  onClick?: () => void
  className?: string
  showCount?: boolean
}

export const CartIcon = ({ onClick, className, showCount = true }: CartIconProps) => {
  const totalItems = useCartStore((state) => state.totalItems)

  return (
    <button
      onClick={onClick}
      className={cn('relative p-2 hover:bg-gray-100 rounded-lg transition-colors', className)}
      aria-label={`Cart with ${totalItems} items`}
    >
      <ShoppingCart className={cn("h-5 w-5", className)} />

      {showCount && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
