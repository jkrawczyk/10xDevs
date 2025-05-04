'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { forgotPassword } from '@/app/forgot-password/actions'

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await forgotPassword(formData)
    
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }
    
    setIsLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4">
          {success}
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

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send reset link'}
      </Button>
    </form>
  )
} 