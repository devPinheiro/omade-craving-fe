# React TanStack Starter

A robust, production-ready React starter template featuring TanStack Router, Zustand state management, TypeScript, and modern development tools.

## 🚀 Features

- **🔥 Modern Stack**: React 19, TypeScript, Vite
- **🎯 Type-Safe Routing**: TanStack Router with file-based routing
- **🗃️ Smart Data Fetching**: TanStack Query for server state management
- **📱 State Management**: Zustand for client state
- **🎨 UI Components**: Radix UI + Tailwind CSS
- **🔒 Authentication**: JWT-based auth with refresh tokens
- **✨ Code Quality**: Biome for linting and formatting
- **🧪 Testing**: Vitest + React Testing Library
- **📦 Build Tool**: Vite with optimized production builds

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── molecules/      # Composite components
│   ├── organisms/      # Complex feature components
│   └── templates/      # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── routes/             # File-based routing pages
├── services/           # API service functions
├── store/              # Zustand state stores
├── styles/             # Global styles
├── test/               # Test utilities and setup
└── types/              # TypeScript type definitions
```

## 🛠️ Quick Start

1. **Clone and Install**
   ```bash
   cd react-tanstack-starter
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Login with Demo Credentials**
   - Email: `admin@example.com`
   - Password: `password123`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run typecheck` - Run TypeScript checks
- `npm run lint` - Lint and format code
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## 🏗️ Architecture

### Authentication Flow
- JWT-based authentication with access and refresh tokens
- Automatic token refresh on API calls
- Protected routes with redirect handling
- Persistent auth state with Zustand

### Routing Strategy
- File-based routing with TanStack Router
- Route protection with authentication checks
- Type-safe navigation and search params
- Nested layouts for complex UIs

### State Management
- **Server State**: TanStack Query for API data
- **Client State**: Zustand for UI state and auth
- **Form State**: React Hook Form with validation

### API Integration
- Axios-based HTTP client with interceptors
- Automatic error handling and retry logic
- Request/response transformations
- Environment-based API configuration

## 🎨 UI Development

### Component Guidelines
- Follow atomic design principles (atoms → molecules → organisms)
- Use Radix UI primitives for accessibility
- Implement consistent styling with Tailwind CSS
- Include proper TypeScript types

### Styling Approach
- Tailwind CSS for utility-first styling
- Custom design tokens in CSS variables
- Responsive design with mobile-first approach
- Dark mode support ready

## 🧪 Testing

### Setup
- Vitest as test runner
- React Testing Library for component testing
- MSW for API mocking
- Coverage reports with V8

### Testing Patterns
```typescript
// Component test example
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { YourComponent } from '../YourComponent'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The `dist` folder contains the production build ready for deployment to any static hosting provider.

### Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop or Git integration
- **AWS S3 + CloudFront**: For AWS infrastructure
- **Docker**: Container-based deployment

## 📦 Adding Features

### Create a New Page
```bash
# Create route file
touch src/routes/your-page.tsx
```

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { YourPageComponent } from '@/components/organisms/YourPageComponent'

export const Route = createFileRoute('/your-page')({
  component: YourPageComponent,
})
```

### Add API Service
```typescript
// src/services/your-service.ts
import http from '@/lib/http'

export const yourService = {
  async getData() {
    const response = await http.get('/your-endpoint')
    return response.data
  },
}
```

### Create Zustand Store
```typescript
// src/store/your-store.ts
import { create } from 'zustand'

interface YourState {
  data: any[]
  loading: boolean
  actions: {
    setData: (data: any[]) => void
  }
}

export const useYourStore = create<YourState>((set) => ({
  data: [],
  loading: false,
  actions: {
    setData: (data) => set({ data }),
  },
}))
```

## 🔧 Configuration

### Environment Variables
```bash
# .env
VITE_API_BASE_URL=https://your-api.com/api
VITE_APP_TITLE=Your App Name
```

### TypeScript Paths
Path aliases are pre-configured in `tsconfig.app.json` and `vite.config.ts`:
- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/hooks/*` → `src/hooks/*`

## 📚 Learn More

- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [TanStack Query](https://tanstack.com/query) - Server state management
- [Zustand](https://zustand-demo.pmnd.rs/) - Client state management
- [Radix UI](https://radix-ui.com/) - Accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.