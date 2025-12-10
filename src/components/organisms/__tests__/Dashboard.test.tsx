import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { Dashboard } from '../Dashboard'

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      permissions: [],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    isAuthenticated: true,
  })),
}))

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Welcome back to your dashboard')).toBeInTheDocument()
  })

  it('displays user information', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('user')).toBeInTheDocument()
  })

  it('shows features list', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('✅ TanStack Router')).toBeInTheDocument()
    expect(screen.getByText('✅ TypeScript')).toBeInTheDocument()
    expect(screen.getByText('✅ Tailwind CSS')).toBeInTheDocument()
  })
})