import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useSEO } from '@/hooks/useSEO'
import { useForm } from 'react-hook-form'
import { type InferInput, type ValiError, email, minLength, object, string } from 'valibot'
import { EyeOff, Eye } from 'lucide-react';
import { useState } from 'react'

const loginSchema = object({
  email: string([email('Please enter a valid email address')]),
  password: string([minLength(6, 'Password must be at least 6 characters')]),
})

type LoginFormData = InferInput<typeof loginSchema>

export function LoginForm() {
  const { login, isLoginPending } = useAuth()
  const [passwordVisible, setPasswordVisible]  = useState (false)

  useSEO({
    title: 'Login - Omade Cravings | Access Your Account',
    description:
      'Sign in to your Omade Cravings account to access exclusive features, track your orders, and manage your preferences for premium artisanal baked goods.',
    keywords: ['login', 'sign in', 'account access', 'customer portal'],
    noIndex: true, // Login pages typically shouldn't be indexed
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onChange',
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

   const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>Enter your email and password to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

          
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              disabled={isLoginPending}

            />
          
            
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <div className="relative ">
            <Input
              id="password"
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
              disabled={isLoginPending}
            />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoginPending}>
            {isLoginPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Demo credentials: admin@example.com / password123</p>
        </div>
      </CardContent>
    </Card>
  )
}
