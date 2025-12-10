import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth'
import { authService } from '@/services/auth'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'

export function useAuth() {
  const router = useRouter()
  const { user, isAuthenticated, login, logout } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      useAuthStore.setState({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
      })
      toast.success('Login successful')
      router.navigate({ to: '/dashboard' })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      toast.success('Logged out successfully')
      router.navigate({ to: '/auth/login' })
    },
  })

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    user: user || profile,
    isAuthenticated,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    isLoadingProfile,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
  }
}