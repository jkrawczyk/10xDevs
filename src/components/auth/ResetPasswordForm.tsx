'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { resetPassword } from '@/app/reset-password/actions'

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await resetPassword(formData)
    
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
        <Label htmlFor="password">Nowe hasło</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
          disabled={isLoading}
          minLength={8}
        />
        <p className="text-xs text-muted-foreground">
          Hasło musi zawierać minimum 8 znaków
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Aktualizowanie...' : 'Ustaw nowe hasło'}
      </Button>
    </form>
  )
} 