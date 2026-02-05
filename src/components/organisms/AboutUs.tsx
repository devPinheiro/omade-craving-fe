import { useSEO } from '@/hooks/useSEO'
import { getBusinessStructuredData } from '@/lib/seo'
import { Award, ChefHat, Clock, Heart, Leaf, Users } from 'lucide-react'

export default function AboutUs() {
  useSEO({
    title: 'About Us - Omade Cravings | Our Story & Mission',
    description:
      'Discover the story behind Omade Cravings. Learn about our passion for artisanal baking, commitment to quality ingredients, and the journey that brought our bakery to life.',
    keywords: [
      'about omade cravings',
      'bakery story',
      'artisan baking',
      'bakery mission',
      'founder story',
    ],
    structuredData: getBusinessStructuredData(),
  })

  const values = [
    {
      icon: Heart,
      title: 'Passion for Craft',
      description:
        'Every loaf, pastry, and cake is crafted with genuine love and dedication to the art of baking.',
    },
    {
      icon: Leaf,
      title: 'Quality Ingredients',
      description:
        'We source the finest organic flours, premium chocolates, and fresh local ingredients for exceptional flavor.',
    },
    {
      icon: Users,
      title: 'Community Focus',
      description:
        'Building connections through shared meals and bringing people together around our handcrafted goods.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description:
        'Committed to maintaining the highest standards in every aspect of our baking and customer service.',
    },
  ]

  const milestones = [
    {
      year: '2020',
      title: 'The Beginning',
      description:
        'Started as a passion project in a home kitchen, perfecting traditional bread recipes.',
    },
    {
      year: '2022',
      title: 'First Storefront',
      description:
        'Opened our flagship location in Lagos, bringing artisanal baking to the community.',
    },
    {
      year: '2023',
      title: 'Custom Cakes',
      description:
        'Launched our custom cake service, creating memorable celebrations for families.',
    },
    {
      year: '2024',
      title: 'Digital Expansion',
      description: 'Introduced online ordering and delivery to serve customers across the city.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Omade Cravings Bakery Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-40" />
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="font-luxury-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-luxury text-luxury-shadow">OUR STORY</h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
              From a passion for traditional baking to creating moments of joy, one handcrafted loaf
              at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            WHO WE ARE
          </h2>
          <div className="space-y-6 text-lg sm:text-xl text-gray-700 leading-relaxed">
            <p>
              Omade Cravings was born from a simple belief: that bread is more than sustenance— it's
              a cornerstone of community, comfort, and connection. What began as weekend experiments
              in a home kitchen has blossomed into Lagos's premier artisanal bakery.
            </p>
            <p>
              We combine time-honored techniques with innovative flavors, using only the finest
              organic ingredients to create breads, pastries, and cakes that don't just satisfy
              hunger, but nourish the soul.
            </p>
          </div>
        </div>
      </section>

      {/* Founder's Story */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                THE FOUNDER'S JOURNEY
              </h2>

              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  <strong>Omade's journey</strong> into the world of artisanal baking began during
                  the quiet moments of the pandemic. What started as a therapeutic escape from the
                  corporate world quickly revealed itself as a true calling.
                </p>

                <p>
                  With a background in business and a newfound passion for the ancient art of bread
                  making, Omade spent countless hours perfecting sourdough starters, studying
                  traditional European techniques, and experimenting with locally sourced Nigerian
                  ingredients.
                </p>

                <p>
                  "Every loaf tells a story," Omade reflects. "I wanted to create a space where that
                  story could bring people together—where the aroma of fresh bread could transform
                  an ordinary day into something special."
                </p>

                <p>
                  Today, Omade leads a dedicated team of bakers who share the same commitment to
                  quality and craft, ensuring that every product that leaves our ovens meets the
                  exacting standards that built our reputation.
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <ChefHat className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="font-semibold text-gray-900">Omade Adebayo</p>
                  <p className="text-gray-600">Founder & Head Baker</p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Founder Omade in the bakery"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-100 rounded-full opacity-80" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-amber-50 rounded-full opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              OUR VALUES
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide every decision we make and every loaf we bake
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-white p-6 rounded-2xl shadow-sm group-hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                    <value.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              OUR JOURNEY
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Key milestones in our story of growth and community building
            </p>
          </div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className="flex flex-col md:flex-row md:items-center gap-6 group"
              >
                <div className="md:w-24 flex-shrink-0">
                  <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-center font-bold">
                    {milestone.year}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="bg-white p-6 rounded-lg border border-gray-100 group-hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">OUR PROCESS</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              From grain to golden crust, every step is carefully crafted
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-orange-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Time & Patience</h3>
              <p className="text-gray-300 leading-relaxed">
                Our sourdough starters are nurtured for days, allowing natural fermentation to
                develop complex flavors and perfect texture.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Premium Ingredients</h3>
              <p className="text-gray-300 leading-relaxed">
                We source organic flours, natural yeast cultures, and the finest ingredients to
                ensure exceptional quality in every bite.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Master Craftsmanship</h3>
              <p className="text-gray-300 leading-relaxed">
                Traditional techniques combined with modern precision create breads and pastries
                that honor both heritage and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              BEHIND THE SCENES
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              A glimpse into our daily craft and the passion that drives us
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Fresh baked bread"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Baking process"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Artisan pastries"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Cake decoration"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            JOIN OUR COMMUNITY
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the difference that passion, quality, and craftsmanship make. Visit us today
            and taste the Omade Cravings difference.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
            <a
              href="/shop"
              className="inline-block bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors rounded-lg"
            >
              Shop Our Products
            </a>
            <a
              href="/feedback"
              className="inline-block bg-transparent border-2 border-black text-black px-8 py-4 font-medium hover:bg-black hover:text-white transition-colors rounded-lg"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
