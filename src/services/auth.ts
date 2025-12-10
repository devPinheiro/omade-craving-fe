import http from '@/lib/http'
import type { AuthResponse, LoginCredentials, User } from '@/types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await http.post('/auth/login', credentials)
    return response.data
  },

  async logout(refreshToken: string): Promise<void> {
    await http.post('/auth/logout', { refreshToken })
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await http.post('/auth/refresh', { refreshToken })
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await http.get('/auth/profile')
    return response.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await http.patch('/auth/profile', data)
    return response.data
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await http.post('/auth/change-password', data)
  },

  async forgotPassword(email: string): Promise<void> {
    await http.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await http.post('/auth/reset-password', { token, password })
  },
}