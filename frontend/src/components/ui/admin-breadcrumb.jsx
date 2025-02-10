"use client"

import Link from "next/link"
import { Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useBreadcrumb } from "@/hooks/use-breadcrumb"
import { cn } from "@/lib/utils"

export function AdminBreadcrumb({ 
  className, 
  overrides = {}, // Allow overriding specific segment labels
  ...props 
}) {
  const items = useBreadcrumb()

  return (
    <Breadcrumb className={cn("mb-6", className)} {...props}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin" className="flex items-center">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbSeparator />
            {item.href ? (
              <BreadcrumbLink asChild>
                <Link 
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {overrides[item.segment] || item.label}
                </Link>
              </BreadcrumbLink>
            ) : (
              <span className="text-foreground">
                {overrides[item.segment] || item.label}
              </span>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}