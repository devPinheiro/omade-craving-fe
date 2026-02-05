export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  images: string[]
  description: string
  category: string
  flavor: string
  tag: string
  featured: boolean
  ingredients: string[]
  allergens: string[]
  nutritionalInfo?: {
    calories: number
    protein: string
    carbs: string
    fat: string
    fiber: string
  }
  variants?: {
    sizes?: { name: string; price: number }[]
    flavors?: { name: string; price: number }[]
  }
  specifications: {
    weight?: string
    servings?: string
    shelfLife?: string
    storage?: string
  }
}

export const allProducts: Product[] = [
  // Cakes
  {
    id: 1,
    name: 'Chocolate Layer Cake',
    price: 12500,
    originalPrice: 15000,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
    ],
    description:
      'Rich, moist chocolate cake layered with premium dark chocolate ganache. Made with Belgian cocoa and finished with chocolate shavings. Perfect for chocolate lovers and special celebrations.',
    category: 'Cakes',
    flavor: 'Chocolate',
    tag: 'New',
    featured: true,
    ingredients: [
      'Premium dark chocolate',
      'Belgian cocoa powder',
      'Free-range eggs',
      'Organic flour',
      'Pure vanilla extract',
      'Fresh butter',
      'Heavy cream',
    ],
    allergens: ['Gluten', 'Eggs', 'Dairy'],
    nutritionalInfo: {
      calories: 420,
      protein: '6g',
      carbs: '45g',
      fat: '24g',
      fiber: '3g',
    },
    variants: {
      sizes: [
        { name: '6" (Serves 6-8)', price: 12500 },
        { name: '8" (Serves 12-15)', price: 18500 },
        { name: '10" (Serves 20-25)', price: 28500 },
      ],
    },
    specifications: {
      weight: '1.2kg',
      servings: '8-10 people',
      shelfLife: '3-4 days',
      storage: 'Refrigerate and consume within 4 days',
    },
  },
  {
    id: 2,
    name: 'Lemon Drizzle Cake',
    price: 6500,
    images: [
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
    ],
    description:
      'Light and zesty lemon sponge cake topped with a tangy lemon glaze. Made with fresh lemon juice and zest for that perfect citrus burst in every bite.',
    category: 'Cakes',
    flavor: 'Lemon',
    tag: 'New',
    featured: true,
    ingredients: [
      'Fresh lemons',
      'Organic flour',
      'Free-range eggs',
      'Pure butter',
      'Caster sugar',
      'Lemon zest',
      'Vanilla extract',
    ],
    allergens: ['Gluten', 'Eggs', 'Dairy'],
    nutritionalInfo: {
      calories: 285,
      protein: '4g',
      carbs: '38g',
      fat: '14g',
      fiber: '1g',
    },
    variants: {
      sizes: [
        { name: 'Small Loaf', price: 6500 },
        { name: 'Large Loaf', price: 9500 },
      ],
    },
    specifications: {
      weight: '800g',
      servings: '6-8 people',
      shelfLife: '4-5 days',
      storage: 'Store in airtight container at room temperature',
    },
  },
  {
    id: 3,
    name: 'Strawberry Cheesecake',
    price: 8800,
    images: [
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
    ],
    description:
      'Creamy New York-style cheesecake with a graham cracker crust, topped with fresh strawberries and strawberry coulis. Made with premium cream cheese for that perfect smooth texture.',
    category: 'Cakes',
    flavor: 'Strawberry',
    tag: 'New',
    featured: false,
    ingredients: [
      'Cream cheese',
      'Fresh strawberries',
      'Graham crackers',
      'Free-range eggs',
      'Heavy cream',
      'Pure vanilla',
      'Sugar',
    ],
    allergens: ['Gluten', 'Eggs', 'Dairy'],
    nutritionalInfo: {
      calories: 380,
      protein: '7g',
      carbs: '32g',
      fat: '26g',
      fiber: '2g',
    },
    specifications: {
      weight: '1kg',
      servings: '8-10 people',
      shelfLife: '3-4 days',
      storage: 'Must be refrigerated',
    },
  },
  // Loaves
  {
    id: 13,
    name: 'Artisan Sourdough Loaf',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
    ],
    description:
      'Traditional sourdough bread with a crispy crust and soft, tangy interior. Naturally fermented for 24 hours using our heritage starter for complex flavors and digestibility.',
    category: 'Loaves',
    flavor: 'Sourdough',
    tag: 'Bestseller',
    featured: true,
    ingredients: ['Organic wheat flour', 'Sourdough starter', 'Sea salt', 'Filtered water'],
    allergens: ['Gluten'],
    nutritionalInfo: {
      calories: 180,
      protein: '6g',
      carbs: '35g',
      fat: '1g',
      fiber: '4g',
    },
    specifications: {
      weight: '800g',
      servings: '10-12 slices',
      shelfLife: '4-5 days',
      storage: 'Store in bread box or paper bag at room temperature',
    },
  },
  {
    id: 14,
    name: 'Whole Wheat Bread',
    price: 2800,
    images: [
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
    ],
    description:
      'Nutritious whole wheat bread made with stone-ground flour. Rich in fiber and nutrients, perfect for daily consumption and healthy eating.',
    category: 'Loaves',
    flavor: 'Whole Wheat',
    tag: 'Bestseller',
    featured: true,
    ingredients: [
      'Whole wheat flour',
      'Organic honey',
      'Olive oil',
      'Sea salt',
      'Active dry yeast',
      'Filtered water',
    ],
    allergens: ['Gluten'],
    nutritionalInfo: {
      calories: 160,
      protein: '5g',
      carbs: '28g',
      fat: '2g',
      fiber: '6g',
    },
    specifications: {
      weight: '700g',
      servings: '12-14 slices',
      shelfLife: '3-4 days',
      storage: 'Store in airtight container at room temperature',
    },
  },
  // Add more products...
  {
    id: 6,
    name: 'Chocolate Brownies',
    price: 3800,
    images: [
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80',
    ],
    description:
      'Fudgy chocolate brownies with a rich, dense texture. Made with premium dark chocolate and walnuts for the ultimate chocolate experience.',
    category: 'Brownies',
    flavor: 'Chocolate',
    tag: 'Bestseller',
    featured: true,
    ingredients: [
      'Dark chocolate',
      'Butter',
      'Free-range eggs',
      'Brown sugar',
      'Flour',
      'Walnuts',
      'Vanilla extract',
    ],
    allergens: ['Gluten', 'Eggs', 'Dairy', 'Nuts'],
    nutritionalInfo: {
      calories: 320,
      protein: '4g',
      carbs: '28g',
      fat: '22g',
      fiber: '2g',
    },
    specifications: {
      weight: '500g',
      servings: '9 pieces',
      shelfLife: '5-6 days',
      storage: 'Store in airtight container at room temperature',
    },
  },
]

export const getProductById = (id: number): Product | undefined => {
  return allProducts.find((product) => product.id === id)
}

export const getRelatedProducts = (productId: number, category: string, limit = 4): Product[] => {
  return allProducts
    .filter((product) => product.id !== productId && product.category === category)
    .slice(0, limit)
}

export const getProductsByCategory = (category: string): Product[] => {
  return allProducts.filter((product) => product.category === category)
}
