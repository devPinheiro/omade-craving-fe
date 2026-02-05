export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string | null
  role: string
  permissions?: string[]
  phone?: string | null
  social_provider?: string | null
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface NormalizedAuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  hasHydrated: boolean
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  refreshAuth: () => Promise<void>
  setHasHydrated: () => void
}

export type AuthStore = AuthState & AuthActions
