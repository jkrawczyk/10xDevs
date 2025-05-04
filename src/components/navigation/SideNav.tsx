'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { History, Wand2 } from 'lucide-react'

const navigation = [
  {
    name: 'Generowanie poprawek',
    href: '/',
    icon: Wand2,
  },
  {
    name: 'Historia',
    href: '/history',
    icon: History,
  },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-4 min-w-52 border-r">
      <div className="mb-4 px-2">
        <h2 className="text-lg font-semibold">Text Correction</h2>
      </div>
      {navigation.map((item) => {
        const isActive = pathname === item.href
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