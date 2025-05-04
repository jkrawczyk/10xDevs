'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { login, signup } from '@/app/login/actions'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  async function handleSignup(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await signup(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
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
          placeholder="twoj@email.com"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Hasło</Label>
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
          {isLoading ? 'Logowanie...' : 'Zaloguj się'}
        </Button>
        <Button
          type="submit"
          variant="outline"
          className="flex-1"
          disabled={isLoading}
          formAction={handleSignup}
        >
          Zarejestruj się
        </Button>
      </div>
    </form>
  )
} 