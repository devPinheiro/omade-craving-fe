import { ReactNode } from 'react'

interface PublicPageLayoutProps {
  children: ReactNode
}

export function PublicPageLayout({ children }: PublicPageLayoutProps) {
  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {children}
    </div>
  )
}
