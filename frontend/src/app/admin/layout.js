"use client"

import { ThemeProvider } from "next-themes"
import { MainSidebar } from "@/components/ui/sidebar"

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            <MainSidebar />
            <div className="flex-1">
              <div className="border-b">
                <div className="flex h-14 items-center px-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">Building Your Application</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">Data Fetching</span>
                  </div>
                </div>
              </div>
              <main className="flex-1">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}