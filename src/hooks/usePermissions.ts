import { useAuthStore } from '@/store/auth'
import { useMemo } from 'react'

export function usePermissions() {
  const user = useAuthStore((state) => state.user)

  return useMemo(() => {
    return (permission: string): boolean => {
      if (!user) return false

      // Super admin has all permissions
      if (user.role === 'super_admin' || user.role === 'admin') return true

      // Check if user has specific permission (if permissions array exists)
      if (user.permissions) {
        return user.permissions.includes(permission)
      }

      // If no permissions array, allow based on role for now
      return user.role === 'admin' || user.role === 'super_admin'
    }
  }, [user])
}
