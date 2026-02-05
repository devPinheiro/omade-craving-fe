import http from '@/lib/http'
import type { AuthResponse, LoginCredentials, NormalizedAuthResponse, User } from '@/types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<NormalizedAuthResponse> {
    console.log('🔐 Auth Service - Making login request to:', '/api/v1/auth/login')
    const response = await http.post('/api/v1/auth/login', credentials)
    console.log('📥 Auth Service - Raw login response:', response.data)

    const data: { data: AuthResponse } = response.data

    console.log(data.data, '---->')

    // Normalize the response to match frontend expectations
    const normalized = {
      user: data.data.user,
      accessToken: data.data.access_token,
      refreshToken: data.data.refresh_token,
      expiresIn: data.data.expires_in,
    }

    return normalized
  },

  async logout(refreshToken: string): Promise<void> {
    await http.post('/api/v1/auth/logout', { refresh_token: refreshToken })
  },

  async refresh(refreshToken: string): Promise<NormalizedAuthResponse> {
    const response = await http.post('/api/v1/auth/refresh', { refresh_token: refreshToken })
    const data: AuthResponse = response.data

    // Normalize the response
    return {
      user: data.user,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    }
  },

  async getProfile(): Promise<User> {
    const response = await http.get('/api/v1/auth/me')
    return response.data
  },

  async register(userData: {
    email: string
    password: string
    name: string
  }): Promise<NormalizedAuthResponse> {
    const response = await http.post('/api/v1/auth/register', userData)
    const data: AuthResponse = response.data

    // Normalize the response
    return {
      user: data.user,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    }
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
