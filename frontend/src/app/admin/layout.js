"use client"

import { ThemeProvider } from "@/components/providers/theme-provider"
import { Sidebar } from "@/components/ui/sidebar"

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
            <Sidebar />
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