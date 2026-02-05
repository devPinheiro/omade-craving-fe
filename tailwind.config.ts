import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Luxury Display (Brand Headlines)
        'luxury-display': ['Holipop', 'Playfair Display', 'Georgia', 'serif'],
        
        // Elegant Serif (Secondary Headlines & Features)
        'luxury-serif': ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        
        // Sophisticated Accent (Product Names & Special Content)
        'luxury-accent': ['Cormorant Garamond', 'Crimson Text', 'Georgia', 'serif'],
        
        // Classic Quote (Testimonials & Stories)
        'luxury-quote': ['Libre Baskerville', 'Crimson Text', 'Georgia', 'serif'],
        
        // Premium Sans-serif (Navigation & UI)
        'luxury-sans': ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
        
        // Clean Content (Body Text)
        'content': ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
        
        // Brand Primary (Holipop)
        'brand': ['Holipop', 'Playfair Display', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'luxury': '0.025em',
        'premium': '0.015em',
        'refined': '0.005em',
      },
      lineHeight: {
        'luxury': '1.1',
        'elegant': '1.3',
        'refined': '1.5',
      }
    },
  },
  plugins: [],
}

export default config