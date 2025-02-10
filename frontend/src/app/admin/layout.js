"use client"

import { ThemeProvider } from "next-themes"
import { Sidebar } from "@/components/ui/sidebar"

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <div className="flex h-[60px] items-center justify-between px-4 border-b bg-background">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-monitor-dot h-6 w-6 transition-colors"
                  >
                    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                    <path d="M12 12h.01" />
                    <path d="M3 8c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6v8c0 3.314-2.686 6-6 6H9c-3.314 0-6-2.686-6-6V8Z" />
                  </svg>
                  <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                </div>
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