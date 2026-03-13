// Font Showcase - Luxury Typography Demo
// This component showcases all the luxury fonts implemented for the Omade Cravings brand

export const FontShowcase = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 bg-white">
      <div className="text-center mb-16">
        <h1 className="font-luxury-display text-6xl font-bold mb-4 tracking-luxury text-luxury-shadow">
          Omade Cravings
        </h1>
        <p className="font-luxury-serif text-xl text-gray-600 tracking-premium">
          Luxury Typography Showcase
        </p>
      </div>

      {/* Font Hierarchy Showcase */}
      <section className="space-y-8">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="font-luxury-serif text-3xl font-bold text-gray-900 mb-2">Typography Hierarchy</h2>
          <p className="font-content text-gray-600">Elegant font combinations for luxury branding</p>
        </div>

        {/* Primary Display - Holipop + Playfair */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h3 className="font-luxury-sans text-sm font-semibold text-gray-500 uppercase tracking-luxury mb-4">
            Primary Display (Holipop + Playfair Display)
          </h3>
          <h1 className="font-luxury-display text-5xl font-bold mb-4 tracking-luxury text-luxury-shadow">
            ARTISANAL LUXURY
          </h1>
          <p className="font-luxury-serif text-lg text-gray-700 tracking-premium leading-refined">
            Premium handcrafted experiences that celebrate tradition and sophistication
          </p>
        </div>

        {/* Secondary Serif - Playfair + Cormorant */}
        <div className="bg-white border border-gray-200 p-8 rounded-lg">
          <h3 className="font-luxury-sans text-sm font-semibold text-gray-500 uppercase tracking-luxury mb-4">
            Elegant Serif (Playfair + Cormorant Garamond)
          </h3>
          <h2 className="font-luxury-serif text-4xl font-semibold mb-4 tracking-premium">
            Exquisite Craftsmanship
          </h2>
          <p className="font-luxury-accent text-lg text-gray-700 tracking-refined leading-elegant">
            Each creation tells a story of passion, precision, and the pursuit of perfection. 
            Our master bakers blend time-honored techniques with innovative approaches.
          </p>
        </div>

        {/* Accent Font - Cormorant Garamond */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-lg">
          <h3 className="font-luxury-sans text-sm font-semibold text-gray-500 uppercase tracking-luxury mb-4">
            Sophisticated Accent (Cormorant Garamond)
          </h3>
          <h3 className="font-luxury-accent text-3xl font-medium mb-4 text-gray-800">
            Signature Collection
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-luxury-accent text-xl font-semibold text-gray-800 mb-2">
                Golden Croissant
              </h4>
              <p className="price-text text-2xl font-bold text-amber-600">₦3,500</p>
            </div>
            <div>
              <h4 className="font-luxury-accent text-xl font-semibold text-gray-800 mb-2">
                Chocolate Éclair
              </h4>
              <p className="price-text text-2xl font-bold text-amber-600">₦2,800</p>
            </div>
          </div>
        </div>

        {/* Quote Font - Libre Baskerville */}
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="font-luxury-sans text-sm font-semibold text-gray-500 uppercase tracking-luxury mb-6">
            Classic Quote (Libre Baskerville)
          </h3>
          <blockquote className="font-luxury-quote text-2xl text-gray-800 mb-4 leading-refined">
            "Every cake is a masterpiece, a moment of pure indulgence."
          </blockquote>
          <cite className="font-luxury-sans text-sm text-gray-600 font-medium tracking-premium">
            — Chef Amara, Head Baker
          </cite>
        </div>

        {/* Clean Sans-serif - Inter */}
        <div className="bg-white border border-gray-200 p-8 rounded-lg">
          <h3 className="font-luxury-sans text-sm font-semibold text-gray-500 uppercase tracking-luxury mb-4">
            Premium Sans-serif (Inter + Montserrat)
          </h3>
          <h4 className="font-luxury-sans text-2xl font-semibold text-gray-900 mb-4 tracking-premium">
            Navigation & Interface
          </h4>
          <div className="space-y-3">
            <button className="font-luxury-sans bg-black text-white px-6 py-3 rounded font-medium tracking-premium hover:bg-gray-800 transition-colors">
              Order Now
            </button>
            <button className="font-luxury-sans bg-transparent border-2 border-gray-300 text-gray-700 px-6 py-3 rounded font-medium tracking-premium hover:border-gray-400 transition-colors ml-4">
              View Menu
            </button>
          </div>
        </div>

        {/* Body Content - Inter */}
        <div className="bg-white p-8 rounded-lg">
          <h3 className="font-luxury-sans text-sm font-semibold text-gray-500 uppercase tracking-luxury mb-4">
            Body Content (Inter)
          </h3>
          <h4 className="font-content text-xl font-semibold text-gray-900 mb-4">
            About Our Ingredients
          </h4>
          <div className="font-content text-base text-gray-700 leading-refined space-y-4">
            <p>
              We source only the finest organic flour from local farms, ensuring each grain meets our 
              exacting standards. Our commitment to quality begins with the raw materials and extends 
              through every step of our baking process.
            </p>
            <p>
              Traditional fermentation methods, premium European butter, and hand-selected spices 
              combine to create the distinctive flavors that have made us a destination for 
              discerning food lovers.
            </p>
          </div>
        </div>
      </section>

      {/* Color Palette with Typography */}
      <section className="space-y-8">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="font-luxury-serif text-3xl font-bold text-gray-900 mb-2">Luxury Color Effects</h2>
          <p className="font-content text-gray-600">Premium typography with sophisticated styling</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-8 rounded-lg">
            <h3 className="font-luxury-display text-3xl font-bold mb-4 text-luxury-gradient">
              Golden Elegance
            </h3>
            <p className="font-luxury-serif text-lg text-gray-700 leading-refined">
              Warm, inviting tones that evoke the elegance of freshly crafted cakes
            </p>
          </div>

          <div className="bg-gray-900 text-white p-8 rounded-lg">
            <h3 className="font-luxury-display text-3xl font-bold mb-4 text-luxury-shadow">
              Sophisticated Dark
            </h3>
            <p className="font-luxury-serif text-lg text-gray-300 leading-refined">
              Deep, rich contrast for dramatic impact and premium appeal
            </p>
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="font-luxury-serif text-2xl font-bold text-gray-900 mb-6">Usage Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-luxury-sans text-lg font-semibold text-gray-900 mb-3">
              Primary Fonts
            </h3>
            <ul className="font-content space-y-2 text-gray-700">
              <li><strong>Holipop:</strong> Hero headlines, brand names</li>
              <li><strong>Playfair Display:</strong> Secondary headlines</li>
              <li><strong>Cormorant Garamond:</strong> Product names, accents</li>
              <li><strong>Inter:</strong> Body text, navigation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-luxury-sans text-lg font-semibold text-gray-900 mb-3">
              Tailwind Classes
            </h3>
            <ul className="font-content space-y-2 text-gray-700">
              <li><code>font-luxury-display</code></li>
              <li><code>font-luxury-serif</code></li>
              <li><code>font-luxury-accent</code></li>
              <li><code>font-luxury-sans</code></li>
              <li><code>font-content</code></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}