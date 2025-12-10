
import { useSEO } from '@/hooks/useSEO'
import { getBusinessStructuredData } from '@/lib/seo'

const ComingSoon = () => {
  useSEO({
    title: 'Omade Cravings - Coming Soon | Artisanal Bakery',
    description: 'Omade Cravings is baking something special! Our artisanal bakery will soon offer premium handcrafted breads, fresh pastries, and specialty baked goods made with organic ingredients. Stay tuned for our grand opening.',
    keywords: ['coming soon', 'new bakery', 'artisan bread', 'grand opening', 'fresh baked goods', 'artisanal bakery'],
    structuredData: getBusinessStructuredData()
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4 flex-col relative">
      <h1 className="text-3xl lg:text-[9rem] m-0 p-0 max-w-3xl font-bold text-center">Omade Cravings <br /> is <br /> baking!</h1>
      <p className="text-lg text-gray-600 mt-4 max-w-2xl text-center">
        We're crafting something extraordinary. Our artisanal bakery will soon bring you the finest handcrafted breads, 
        fresh pastries, and specialty baked goods made with premium organic ingredients.
      </p>
      <img src="https://res.cloudinary.com/appnet/image/upload/v1765399940/loaf_tcnxv5.png" alt="Omade Cravings - Fresh artisanal bread illustration" className="my-8 lg:w-96 lg:h-96 lg:absolute lg:bottom-10 lg:right-10 w-16 h-16 top-10" />
    </div>
  )
}

export default ComingSoon
