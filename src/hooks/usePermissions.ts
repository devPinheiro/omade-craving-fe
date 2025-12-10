import { useAuthStore } from '@/store/auth'
import { useMemo } from 'react'

export function usePermissions() {
  const user = useAuthStore((state) => state.user)

  return useMemo(() => {
    return (permission: string): boolean => {
      if (!user) return false
      
      // Super admin has all permissions
      if (user.role === 'super_admin') return true
      
      // Check if user has specific permission
      return user.permissions.includes(permission)
    }
  }, [user])
}