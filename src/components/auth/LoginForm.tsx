'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { login, signup } from '@/app/(auth)/login/actions'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { refreshAuthState } = useAuth()

  async function handleAuth(formData: FormData, authAction: typeof login | typeof signup) {
    try {
      setIsLoading(true)
      setError(null)

      const result = await authAction(formData)
      
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        await refreshAuthState()
        router.push('/')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await handleAuth(formData, login)
  }

  async function handleSignup(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget.form!)
    await handleAuth(formData, signup)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="your@email.com"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={isLoading}
          onClick={handleSignup}
        >
          Sign up
        </Button>
      </div>
    </form>
  )
} 