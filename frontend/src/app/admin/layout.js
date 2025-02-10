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
            <div className="flex-1 flex flex-col">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}