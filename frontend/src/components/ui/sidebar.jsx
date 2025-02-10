"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Activity,
  Server,
  BarChart,
  Shield,
  MessageSquare,
  Bell,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sun,
  Moon
} from "lucide-react"

const sidebarNavItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart,
      },
    ],
  },
  {
    title: "Content Management",
    items: [
      {
        title: "Providers",
        href: "/admin/providers",
        icon: Server,
      },
      {
        title: "Models",
        href: "/admin/models",
        icon: Boxes,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Monitoring",
        href: "/admin/monitoring",
        icon: Activity,
      },
      {
        title: "Security",
        href: "/admin/security",
        icon: Shield,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
      },
      {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { theme, setTheme } = useTheme()

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const SidebarContent = () => (
    <div className={cn(
      "flex h-screen flex-col border-r bg-background transition-all duration-300",
      isCollapsed ? "w-[80px]" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6" />
          {!isCollapsed && <span>Admin Portal</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6">
          {sidebarNavItems.map((group) => (
            <div key={group.title} className="space-y-2">
              {!isCollapsed && (
                <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </h4>
              )}
              <div className="grid gap-1">
                {group.items.map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && item.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={cn(
            "w-full",
            isCollapsed ? "justify-center" : "justify-start gap-2"
          )}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4" />
              {!isCollapsed && "Light Mode"}
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              {!isCollapsed && "Dark Mode"}
            </>
          )}
        </Button>
      </div>
    </div>
  )

  // Mobile sidebar using Sheet component
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return <SidebarContent />
}