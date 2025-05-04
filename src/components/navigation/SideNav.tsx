'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { History, Wand2 } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthContext'

export function SideNav() {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  const navigation = [
    {
      name: 'Generate Corrections',
      href: '/',
      icon: Wand2,
      showAlways: true,
    },
    {
      name: 'History',
      href: '/history',
      icon: History,
      showAlways: false,
    },
  ]

  return (
    <nav className="flex flex-col gap-1 p-4 min-w-52 border-r">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        // Only show items that should be shown always or when user is authenticated
        if (!item.showAlways && !user) return null

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
} 