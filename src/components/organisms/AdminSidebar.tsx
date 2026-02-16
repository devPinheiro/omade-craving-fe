import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/hooks/usePermissions'
import { cn } from '@/lib/utils'
import { Link, useRouter } from '@tanstack/react-router'
import {
  BarChart3,
  Bell,
  ChevronDown,
  DollarSign,
  FileText,
  Home,
  MessageCircle,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Tag,
  Truck,
  Users,
  Zap,
} from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

interface NavItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  permission?: string
  badge?: string
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    items: [
      {
        to: '/home',
        icon: Home,
        label: 'Home',
      },
    ],
  },
  {
    title: 'Orders',
    items: [
      {
        to: '/orders',
        icon: ShoppingCart,
        label: 'Orders',
        // permission: 'orders:read',
        badge: '12',
      },
      // {
      //   to: '/admin/drafts',
      //   icon: FileText,
      //   label: 'Drafts',
      //   permission: 'orders:read',
      // },
      // {
      //   to: '/admin/abandoned',
      //   icon: ShoppingCart,
      //   label: 'Abandoned checkouts',
      //   permission: 'orders:read',
      // },
    ],
  },
  {
    title: 'Products',
    items: [
      {
        to: '/products',
        icon: Package,
        label: 'Products',
        permission: 'products:read',
      },
      {
        to: '/categories',
        icon: Tag,
        label: 'Categories',
        permission: 'products:read',
      },
      // {
      //   to: '/admin/inventory',
      //   icon: Package,
      //   label: 'Inventory',
      //   permission: 'products:read',
      // },
      // {
      //   to: '/admin/collections',
      //   icon: Package,
      //   label: 'Collections',
      //   permission: 'products:read',
      // },
    ],
  },
  {
    title: 'Customers',
    items: [
      {
        to: '/customers',
        icon: Users,
        label: 'Customers',
        permission: 'users:read',
      },
    ],
  },
  // {
  //   title: 'Analytics',
  //   items: [
  //     {
  //       to: '/admin/analytics',
  //       icon: BarChart3,
  //       label: 'Analytics',
  //       permission: 'analytics:read',
  //     },
  //   ]
  // },
  // {
  //   title: 'Sales channels',
  //   items: [
  //     {
  //       to: '/admin/online-store',
  //       icon: Zap,
  //       label: 'Online Store',
  //       permission: 'admin:access',
  //     },
  //   ]
  // },
  {
    title: 'Apps',
    items: [
      {
        to: '/admin/apps',
        icon: Zap,
        label: 'Apps',
        permission: 'admin:settings',
      },
    ],
  },
]

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const { user, logout } = useAuth()
  const hasPermission = usePermissions()
  const router = useRouter()

  const collapsedNavItems: NavItem[] = navSections.flatMap(
  (section) => section.items
)


  if (isCollapsed) {
    return (
      <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
        </div>
        <TooltipProvider delayDuration={100}>
        <nav className="flex-1 flex flex-col items-center py-4 space-y-3">
          {collapsedNavItems.map((item) => (
            <Tooltip key={item.to}>
                <TooltipTrigger asChild>
            <Link
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-center p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors ',
                  isActive && 'text-green-600 border-r-2'
                )
              }
            >
              <item.icon className="h-5 w-5 " />
            </Link>
             </TooltipTrigger>
                <TooltipContent side="right" 
                sideOffset={8} 
                className="text-sm px-2 py-1"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
          ))}
        </nav>
        </TooltipProvider >
      </div>
    )
  }

  return (
    <div className="w-60 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">Omade</span>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-900">Omade Cravings</h2>
            <p className="text-xs text-gray-500">omadecravings.com</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 space-y-6">
        {navSections.map((section, sectionIndex) => {
          const filteredItems = section.items

          if (filteredItems.length === 0) return null

          return (
            <div key={sectionIndex}>
              {section.title && (
                <div className="px-4 mb-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {section.title}
                  </h3>
                </div>
              )}
              <div className="space-y-1 px-2">
                {filteredItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex flex-1 items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      // "text-green-700 bg-green-50 border-green-600"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="flex w-6 h-6 justify-center items-center px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-gray-200 p-2">
        <Link
          to="/admin/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
              isActive && 'text-green-700 bg-green-50'
            )
          }
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>

      {/* User section */}
      <div className="border-t border-gray-200 p-3">
        {user && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
