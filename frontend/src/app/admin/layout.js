"use client"

import { Sidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { BellIcon, UserCircle } from "lucide-react"

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className="hidden w-64 lg:block">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Navigation */}
            <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <BellIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </div>
            </header>

            {/* Page Content */}
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}