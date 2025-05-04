'use server'

import { createClient } from '@/lib/supabase/server'

export type ForgotPasswordActionResponse = {
  error?: string;
  success?: string;
}

export async function forgotPassword(formData: FormData): Promise<ForgotPasswordActionResponse> {
  const supabase = await createClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: 'Link do zresetowania hasła został wysłany na podany adres email'
  }
} 