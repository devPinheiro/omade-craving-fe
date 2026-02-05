import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader'
import { useSEO } from '@/hooks/useSEO'
import { getBusinessStructuredData } from '@/lib/seo'
import { useCartStore } from '@/store/cart'
import { Camera, ChevronDown, Minus, Palette, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const CakeBuilder = () => {
  // State for cake customization
  const [selectedSize, setSelectedSize] = useState('8"')
  const [selectedLayers, setSelectedLayers] = useState(3)
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [selectedFrosting, setSelectedFrosting] = useState('')
  const [customDesignImage, setCustomDesignImage] = useState('')
  const [designNotes, setDesignNotes] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [addGreetingCard, setAddGreetingCard] = useState(false)
  const [addBalloons, setAddBalloons] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [uploadError, setUploadError] = useState('')

  const addItem = useCartStore((state) => state.addItem)

  // Pricing configuration - base prices for 2-layer cakes
  const basePricing = {
    '6"': 65000,
    '8"': 120000,
    '10"': 180000,
    '12"': 250000,
  }

  // Layer multipliers
  const layerMultiplier = {
    1: 0.6, // 60% of base price for single layer
    2: 1.0, // 100% base price (reference)
    3: 1.4, // 140% for 3 layers
    4: 1.8, // 180% for 4 layers
  }

  const extras = {
    greetingCard: 2500,
    balloons: 5000,
  }

  // Available flavors with pricing tiers
  const availableFlavors = [
    { name: 'Vanilla Sponge', price: 0, tier: 'Standard' },
    { name: 'White Cake', price: 0, tier: 'Standard' },
    { name: 'Chocolate', price: 3000, tier: 'Premium' },
    { name: 'Lemon', price: 2000, tier: 'Premium' },
    { name: 'Red Velvet', price: 5000, tier: 'Signature' },
    { name: 'Carrot Cake', price: 4000, tier: 'Signature' },
    { name: 'Strawberry', price: 3500, tier: 'Premium' },
    { name: 'Funfetti', price: 2500, tier: 'Premium' },
  ]

  // Available frosting types with pricing
  const availableFrostings = [
    {
      name: 'Vanilla Buttercream',
      price: 0,
      tier: 'Standard',
      description: 'Classic smooth vanilla frosting',
    },
    {
      name: 'Chocolate Buttercream',
      price: 2000,
      tier: 'Standard',
      description: 'Rich chocolate buttercream',
    },
    {
      name: 'Cream Cheese Frosting',
      price: 3000,
      tier: 'Premium',
      description: 'Tangy and creamy, perfect for red velvet',
    },
    {
      name: 'Swiss Meringue',
      price: 4000,
      tier: 'Premium',
      description: 'Light and airy, less sweet',
    },
    {
      name: 'Fondant',
      price: 8000,
      tier: 'Signature',
      description: 'Smooth finish, perfect for detailed designs',
    },
    {
      name: 'Ganache',
      price: 5000,
      tier: 'Premium',
      description: 'Rich chocolate ganache coating',
    },
    {
      name: 'Caramel Buttercream',
      price: 3500,
      tier: 'Premium',
      description: 'Sweet caramel flavored frosting',
    },
    {
      name: 'Peanut Butter Frosting',
      price: 3000,
      tier: 'Premium',
      description: 'Creamy peanut butter frosting',
    },
  ]

  useSEO({
    title: 'Build Your Custom Cake - Omade Cravings | Personalized Celebration Cakes',
    description:
      'Design your perfect celebration cake with our interactive cake builder. Choose size, flavors, and personalization options for your special occasion.',
    keywords: [
      'custom cake',
      'cake builder',
      'celebration cake',
      'personalized cake',
      'artisanal bakery',
    ],
    structuredData: getBusinessStructuredData(),
  })

  // Calculate total price
  const calculateTotal = () => {
    const basePrice = basePricing[selectedSize as keyof typeof basePricing]
    const layerPrice = basePrice * layerMultiplier[selectedLayers as keyof typeof layerMultiplier]

    // Calculate flavor premiums
    const flavorPremium = selectedFlavors.reduce((sum, flavorName) => {
      const flavor = availableFlavors.find((f) => f.name === flavorName)
      return sum + (flavor?.price || 0)
    }, 0)

    // Calculate frosting premium
    const frosting = availableFrostings.find((f) => f.name === selectedFrosting)
    const frostingPremium = frosting?.price || 0

    let total = layerPrice + flavorPremium + frostingPremium

    if (addGreetingCard) total += extras.greetingCard
    if (addBalloons) total += extras.balloons

    return total * quantity
  }

  // Reset flavors when layers change and exceed current selection
  useEffect(() => {
    if (selectedFlavors.length > selectedLayers) {
      setSelectedFlavors((prev) => prev.slice(0, selectedLayers))
    }
  }, [selectedLayers, selectedFlavors.length])

  // Handle custom design image upload
  const handleImageUpload = (url: string) => {
    setCustomDesignImage(url)
    setUploadError('')
    if (url) {
      toast.success('Design image uploaded successfully!')
    }
  }

  // Handle image upload error
  const handleUploadError = (error: string) => {
    setUploadError(error)
    toast.error(`Upload failed: ${error}`)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddToCart = () => {
    const customizations = {
      size: selectedSize,
      layers: selectedLayers,
      flavors: selectedFlavors,
      frosting: selectedFrosting,
      customDesignImage: customDesignImage || undefined,
      designNotes: designNotes || undefined,
      message: customMessage || undefined,
      extras: [...(addGreetingCard ? ['greetingCard'] : []), ...(addBalloons ? ['balloons'] : [])],
    }

    const basePrice = basePricing[selectedSize as keyof typeof basePricing]

    addItem({
      productId: 999, // Special ID for custom cakes
      name: `Custom ${selectedLayers}-Layer Cake (${selectedSize})`,
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
      basePrice,
      quantity,
      category: 'Custom Cakes',
      customizations,
    })

    toast.success('Custom cake added to cart!')

    // Reset form or redirect user
    // Optional: Reset form after successful addition
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Fixed Image Upload & Details */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
            {/* Custom Design Upload */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">Custom Design Preview</h3>
              </div>

              <CloudinaryUploader
                onUpload={handleImageUpload}
                onError={handleUploadError}
                placeholder="Upload your custom cake design"
                accept="image/*"
                maxSize={5242880}
                currentImage={customDesignImage}
                className="w-full"
              />

              {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}

              {!customDesignImage && (
                <div className="aspect-square bg-gray-50 overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80"
                    alt="Custom Celebration Cake Example"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900 tracking-wide">
                BUILD YOUR CUSTOM CAKE
              </h1>
              <p className="text-base text-gray-600 leading-relaxed">
                Create the perfect centerpiece for your celebration. Choose from multiple layers,
                premium flavors, professional frostings, and upload custom design images. Our
                skilled bakers will bring your vision to life with personalized touches and artistic
                detail.
              </p>
            </div>
          </div>

          {/* Right Column - Customization Form (Scrollable) */}
          <div className="space-y-8 lg:max-h-screen lg:overflow-y-auto lg:pr-4">
            {/* Price Display */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-light text-gray-900">Total</span>
                <span className="text-3xl font-medium text-gray-900">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>

            {/* Layer Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Choose Number of Layers</h3>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((layers) => (
                  <button
                    key={layers}
                    type="button"
                    onClick={() => setSelectedLayers(layers)}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      selectedLayers === layers
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium">{layers}</div>
                      <div className="text-xs opacity-75">Layer{layers !== 1 ? 's' : ''}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  More layers = more flavor combinations and height
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Price multiplier:{' '}
                  {selectedLayers === 1
                    ? '60%'
                    : selectedLayers === 2
                      ? '100%'
                      : selectedLayers === 3
                        ? '140%'
                        : '180%'}
                </p>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Choose Size</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(basePricing).map(([size, basePrice]) => {
                  const finalPrice =
                    basePrice * layerMultiplier[selectedLayers as keyof typeof layerMultiplier]
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-900'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium">{size}</div>
                        <div className="text-sm opacity-75">{formatCurrency(finalPrice)}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Flavor Selection - Dropdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-gray-900">Choose Flavors</h3>
                <span className="text-sm text-gray-500">
                  {selectedFlavors.length}/{selectedLayers} selected
                </span>
              </div>
              <p className="text-gray-600">
                Select up to {selectedLayers} flavor{selectedLayers !== 1 ? 's' : ''} for your{' '}
                {selectedLayers}-layer cake
              </p>

              {Array.from({ length: selectedLayers }, (_, index) => {
                const selectId = `flavor-layer-${index + 1}`
                return (
                  <div key={`layer-${index + 1}`} className="space-y-2">
                    <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
                      Layer {index + 1} Flavor
                    </label>
                    <div className="relative">
                      <select
                        id={selectId}
                        value={selectedFlavors[index] || ''}
                        onChange={(e) => {
                          const newFlavors = [...selectedFlavors]
                          if (e.target.value) {
                            newFlavors[index] = e.target.value
                          } else {
                            newFlavors.splice(index, 1)
                          }
                          setSelectedFlavors(newFlavors)
                        }}
                        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-gray-900 transition-colors"
                      >
                        <option value="">Select a flavor...</option>
                        {availableFlavors.map((flavor) => (
                          <option key={flavor.name} value={flavor.name}>
                            {flavor.name} - {flavor.tier}
                            {flavor.price > 0
                              ? ` (+${formatCurrency(flavor.price)})`
                              : ' (Included)'}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )
              })}

              {/* Flavor Pricing Summary */}
              {selectedFlavors.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Selected Flavors</h4>
                  <div className="space-y-1">
                    {selectedFlavors.map((flavorName, index) => {
                      const flavor = availableFlavors.find((f) => f.name === flavorName)
                      return flavor ? (
                        <div
                          key={`flavor-${index}-${flavorName}`}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            Layer {index + 1}: {flavor.name}
                          </span>
                          <span className="text-gray-900">
                            {flavor.price > 0 ? `+${formatCurrency(flavor.price)}` : 'Included'}
                          </span>
                        </div>
                      ) : null
                    })}
                    {selectedFlavors.reduce((sum, flavorName) => {
                      const flavor = availableFlavors.find((f) => f.name === flavorName)
                      return sum + (flavor?.price || 0)
                    }, 0) > 0 && (
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
                        <span>Total Flavor Premium:</span>
                        <span>
                          +
                          {formatCurrency(
                            selectedFlavors.reduce((sum, flavorName) => {
                              const flavor = availableFlavors.find((f) => f.name === flavorName)
                              return sum + (flavor?.price || 0)
                            }, 0)
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Frosting Selection - Dropdown */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-gray-600" />
                <h3 className="text-xl font-medium text-gray-900">Choose Frosting Type</h3>
              </div>
              <p className="text-gray-600">
                Select the perfect frosting to complement your cake flavors
              </p>

              <div className="space-y-2">
                <label htmlFor="frosting-select" className="text-sm font-medium text-gray-700">
                  Frosting Type
                </label>
                <div className="relative">
                  <select
                    id="frosting-select"
                    value={selectedFrosting}
                    onChange={(e) => setSelectedFrosting(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-gray-900 transition-colors"
                  >
                    <option value="">Select frosting type...</option>
                    {availableFrostings.map((frosting) => (
                      <option key={frosting.name} value={frosting.name}>
                        {frosting.name} - {frosting.tier}
                        {frosting.price > 0
                          ? ` (+${formatCurrency(frosting.price)})`
                          : ' (Included)'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Frosting Description & Premium Display */}
              {selectedFrosting && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Selected Frosting</h4>
                  {(() => {
                    const frosting = availableFrostings.find((f) => f.name === selectedFrosting)
                    return frosting ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{frosting.name}</span>
                          <span className="text-gray-900">
                            {frosting.price > 0 ? `+${formatCurrency(frosting.price)}` : 'Included'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{frosting.description}</p>
                        <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                          {frosting.tier}
                        </span>
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </div>

            {/* Design Notes */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Design Instructions</h3>
              <p className="text-gray-600">
                Describe your custom design requirements, colors, themes, or special instructions
              </p>

              <div className="space-y-2">
                <label htmlFor="design-notes" className="text-sm font-medium text-gray-700">
                  Design Notes & Instructions
                </label>
                <textarea
                  id="design-notes"
                  value={designNotes}
                  onChange={(e) => setDesignNotes(e.target.value)}
                  placeholder="Describe specific design requirements, colors, themes, or special instructions..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 resize-none"
                  rows={4}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500">{designNotes.length}/200 characters</p>
              </div>
            </div>

            {/* Custom Message */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Custom Message</h3>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personal message to be written on your cake..."
                className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 resize-none"
                rows={3}
                maxLength={50}
              />
              <p className="text-sm text-gray-500">{customMessage.length}/50 characters</p>
            </div>

            {/* Extras */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Add Extras</h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                  <div>
                    <div className="font-medium text-gray-900">Greeting Card</div>
                    <div className="text-sm text-gray-600">Beautiful handwritten card</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-900">{formatCurrency(extras.greetingCard)}</span>
                    <input
                      type="checkbox"
                      checked={addGreetingCard}
                      onChange={(e) => setAddGreetingCard(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                  <div>
                    <div className="font-medium text-gray-900">Celebration Balloons</div>
                    <div className="text-sm text-gray-600">Set of 5 premium balloons</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-900">{formatCurrency(extras.balloons)}</span>
                    <input
                      type="checkbox"
                      checked={addBalloons}
                      onChange={(e) => setAddBalloons(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-xl font-medium text-gray-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={selectedFlavors.length === 0 || !selectedFrosting}
                className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
                  selectedFlavors.length === 0 || !selectedFrosting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                Add to Cart - {formatCurrency(calculateTotal())}
              </button>

              {(selectedFlavors.length === 0 || !selectedFrosting) && (
                <div className="text-sm text-red-500 text-center space-y-1">
                  {selectedFlavors.length === 0 && <p>Please select at least one flavor</p>}
                  {!selectedFrosting && <p>Please select a frosting type</p>}
                </div>
              )}
            </div>

            {/* Delivery Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Custom cakes require 48-72 hours notice</li>
                <li>• Complex custom designs may require 5-7 days</li>
                <li>• Free delivery within Lagos for orders over ₦100,000</li>
                <li>• Available for pickup at our bakery</li>
                <li>• We'll contact you to confirm design details</li>
                <li>• Contact us for special dietary requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CakeBuilder
