"use client"

import { ThemeProvider } from "@/components/providers/theme-provider"
import Link from "next/link"
import { MonitorDot } from "lucide-react"

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen bg-background">
            <aside className="w-64 border-r bg-card">
              <div className="flex h-[60px] items-center px-4 border-b">
                <Link href="/admin" className="flex items-center gap-2">
                  <MonitorDot className="h-6 w-6" />
                  <span className="font-semibold">Admin Portal</span>
                </Link>
              </div>
            </aside>
            
            <main className="flex-1 overflow-y-auto">
              <div className="flex h-[60px] items-center px-4 border-b">
                <h1 className="text-lg font-semibold">Dashboard</h1>
              </div>
              <div className="p-6">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}