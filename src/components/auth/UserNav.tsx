'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { logout } from '@/app/(auth)/auth/actions'
import { useAuth } from '@/lib/auth/AuthContext'
import { usePathname } from 'next/navigation'

export function UserNav() {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  // Don't show anything while loading or on login page
  if (isLoading || pathname === '/login') {
    return null
  }

  return (
    <div className="flex items-center px-2">
      {user ? (
        <form action={logout}>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </form>
      ) : (
        <Link href="/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
      )}
    </div>
  )
} 