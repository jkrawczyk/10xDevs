'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type AuthActionResponse = {
  error?: string;
  success?: boolean;
}

export async function login(formData: FormData): Promise<AuthActionResponse> {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Revalidate all paths that depend on auth state
  revalidatePath('/', 'layout')
  revalidatePath('/history', 'layout')
  
  return { success: true }
}

export async function signup(formData: FormData): Promise<AuthActionResponse> {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  // Revalidate all paths that depend on auth state
  revalidatePath('/', 'layout')
  revalidatePath('/history', 'layout')
  
  return { success: true }
}