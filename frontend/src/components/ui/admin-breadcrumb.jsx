"use client"

import Link from "next/link"
import { Home, ChevronRight } from "lucide-react"

export function AdminBreadcrumb({ segments = [] }) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            href="/admin" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {segments.map((segment, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
            {typeof segment === 'string' ? (
              <span className="text-foreground">{segment}</span>
            ) : (
              <Link
                href={segment.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {segment.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}