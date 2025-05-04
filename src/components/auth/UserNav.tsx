'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { logout } from '@/app/auth/actions'

interface UserNavProps {
  user: boolean
}

export function UserNav({ user }: UserNavProps) {
  return (
    <div className="flex items-center gap-4">
      {user && (
        <form action={logout}>
          <Button variant="outline" size="sm">
            Wyloguj się
          </Button>
        </form>
      )}
    </div>
  )
} 