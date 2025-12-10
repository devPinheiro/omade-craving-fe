import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useSEO } from '@/hooks/useSEO'

export function Dashboard() {
  const { user } = useAuth()

  useSEO({
    title: 'Dashboard - Omade Cravings | Your Account Hub',
    description: 'Access your Omade Cravings dashboard to manage orders, track preferences, and stay updated with the latest artisanal baked goods and bakery news.',
    keywords: ['dashboard', 'account', 'orders', 'preferences', 'customer portal'],
    noIndex: true // Private dashboard shouldn't be indexed
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back to your dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>You're successfully logged in!</CardDescription>
          </CardHeader>
          <CardContent>
            {user && (
              <div className="space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>What's included in this starter</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li>✅ TanStack Router</li>
              <li>✅ TanStack Query</li>
              <li>✅ Zustand State Management</li>
              <li>✅ Authentication</li>
              <li>✅ TypeScript</li>
              <li>✅ Tailwind CSS</li>
              <li>✅ Radix UI Components</li>
              <li>✅ Vite Build Tool</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Next steps for development</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              <li>• Add your API endpoints</li>
              <li>• Create new pages</li>
              <li>• Add more components</li>
              <li>• Setup your database</li>
              <li>• Configure deployment</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}