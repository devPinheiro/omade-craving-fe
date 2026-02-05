import ProductDetails from '@/components/organisms/ProductDetails'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { productsService } from '@/services/products'
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailsRoute,
  loader: async ({ params }) => {
    try {
      const product = await productsService.getProductById(params.productId)

      if (!product) {
        throw notFound()
      }

      return { product }
    } catch (error) {
      console.error('Failed to load product:', error)
      throw notFound()
    }
  },
})

function ProductDetailsRoute() {
  const { product } = Route.useLoaderData()

  return (
    <PublicLayout>
      <ProductDetails product={product} />
    </PublicLayout>
  )
}
