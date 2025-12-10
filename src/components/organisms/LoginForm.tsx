import { useForm } from 'react-hook-form'
import { object, string, minLength, email, type InferInput, type ValiError } from 'valibot'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useSEO } from '@/hooks/useSEO'

const loginSchema = object({
  email: string([email('Please enter a valid email address')]),
  password: string([minLength(6, 'Password must be at least 6 characters')]),
})

type LoginFormData = InferInput<typeof loginSchema>

export function LoginForm() {
  const { login, isLoginPending } = useAuth()
  
  useSEO({
    title: 'Login - Omade Cravings | Access Your Account',
    description: 'Sign in to your Omade Cravings account to access exclusive features, track your orders, and manage your preferences for premium artisanal baked goods.',
    keywords: ['login', 'sign in', 'account access', 'customer portal'],
    noIndex: true // Login pages typically shouldn't be indexed
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
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
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              disabled={isLoginPending}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoginPending}
          >
            {isLoginPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Demo credentials: admin@example.com / password123
          </p>
        </div>
      </CardContent>
    </Card>
  )
}