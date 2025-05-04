'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  // Revalidate all paths that depend on auth state
  revalidatePath('/', 'layout')
  revalidatePath('/history', 'layout')
  
  redirect('/')
} 