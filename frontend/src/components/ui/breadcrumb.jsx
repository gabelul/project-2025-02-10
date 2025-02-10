"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link 
        href="/admin"
        className="hover:text-foreground"
      >
        Admin
      </Link>
      {segments.slice(1).map((segment, index) => (
        <div key={segment} className="flex items-center">
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/admin/${segments.slice(1, index + 2).join('/')}`}
            className="ml-1 capitalize hover:text-foreground"
          >
            {segment}
          </Link>
        </div>
      ))}
    </div>
  )
}