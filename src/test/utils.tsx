import { routeTree } from '@/routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, createRouter } from '@tanstack/react-router'
import { type RenderOptions, render } from '@testing-library/react'
import type { ReactElement } from 'react'

// Create test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

// Test router setup
const createTestRouter = (initialEntries = ['/']) => {
  const history = createMemoryHistory({ initialEntries })
  return createRouter({
    routeTree,
    history,
    context: {
      auth: { user: null, isAuthenticated: false },
      queryClient: createTestQueryClient(),
      hasPermission: () => false,
    },
  })
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
  initialEntries?: string[]
}

const customRender = (
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    initialEntries,
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const router = createTestRouter(initialEntries)

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
    router,
  }
}

export * from '@testing-library/react'
export { customRender as render, createTestQueryClient, createTestRouter }
