import ProductsListing from '@/components/organisms/ProductsListing'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shop')({
  component: ProductsRoute,
})

function ProductsRoute() {
  return (
    <PublicLayout>
      <ProductsListing />
    </PublicLayout>
  )
}
