"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"

export function useBreadcrumb() {
  const pathname = usePathname()

  return useMemo(() => {
    // Skip if no pathname
    if (!pathname) return []

    // Split the pathname into segments
    const segments = pathname
      .split('/')
      .filter(segment => segment !== '')

    // Build the breadcrumb items
    const items = segments.map((segment, index) => {
      // Build the href for this level
      const href = '/' + segments.slice(0, index + 1).join('/')
      
      // Format the label
      let label = segment
      
      // Handle dynamic segments
      if (segment.startsWith('[') && segment.endsWith(']')) {
        label = 'Loading...' // This will be replaced by actual data
      } else {
        // Capitalize and clean the label
        label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }

      return {
        href: index === segments.length - 1 ? null : href,
        label,
        segment
      }
    })

    return items
  }, [pathname])
}