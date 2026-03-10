import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/hooks/usePermissions'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth()
  const hasPermission = usePermissions()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </Link>
              <nav className="ml-8 space-x-4">
                <Link
                  to="/home"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  activeProps={{ className: 'text-gray-900 bg-gray-100' }}
                >
                  Dashboard
                </Link>
                {(hasPermission('admin:access') ||
                  user?.role === 'admin' ||
                  user?.role === 'super_admin') && (
                  <Link
                    to="/home"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    activeProps={{ className: 'text-gray-900 bg-gray-100' }}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {user && <div className="text-sm text-gray-600">Welcome, {user.name}</div>}
              <Button variant="outline" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{children}</div>
      </main>
    </div>
  )
}
