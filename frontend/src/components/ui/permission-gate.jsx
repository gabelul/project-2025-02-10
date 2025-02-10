"use client"

import { useEffect, useState } from "react"
import { hasPermission } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

export function PermissionGate({ 
  children, 
  permission, 
  userRole, 
  fallback = null,
  showError = false 
}) {
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    setHasAccess(hasPermission(userRole, permission))
  }, [userRole, permission])

  if (!hasAccess) {
    if (showError) {
      return (
        <Alert variant="destructive" className="my-4">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this feature
          </AlertDescription>
        </Alert>
      )
    }
    return fallback
  }

  return children
}