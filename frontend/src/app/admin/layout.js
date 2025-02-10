"use client"

import { ThemeProvider } from "next-themes"
import { Sidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { 
  BellIcon, 
  Search,
  Sun,
  Moon,
  Laptop
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Breadcrumbs } from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1">
              {/* Top Navigation */}
              <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="w-[200px] flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="search" 
                      placeholder="Search..." 
                      className="h-8 w-[150px] lg:w-[180px]" 
                    />
                  </div>
                  <Breadcrumbs />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <BellIcon className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        {theme === "light" ? (
                          <Sun className="h-5 w-5" />
                        ) : theme === "dark" ? (
                          <Moon className="h-5 w-5" />
                        ) : (
                          <Laptop className="h-5 w-5" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        <Laptop className="mr-2 h-4 w-4" />
                        System
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>

              {/* Page Content */}
              <main className="flex-1">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}