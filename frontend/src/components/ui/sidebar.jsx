"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  AlertCircle,
  FileText,
  Boxes
} from "lucide-react"

const sidebarNavItems = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Tasks",
        href: "/admin/tasks",
        icon: FileText,
      },
    ],
  },
  {
    title: "Apps",
    items: [
      {
        title: "Apps",
        href: "/admin/apps",
        icon: Boxes,
      },
      {
        title: "Chats",
        href: "/admin/chats",
        icon: MessageSquare,
        badge: 2,
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
      },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        title: "Auth",
        href: "/admin/auth",
        icon: Settings,
      },
      {
        title: "Errors",
        href: "/admin/errors",
        icon: AlertCircle,
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Help Center",
        href: "/admin/help",
        icon: HelpCircle,
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "flex flex-col border-r bg-background",
      isCollapsed ? "w-[70px]" : "w-[200px]"
    )}>
      <div className="flex h-14 lg:h-[60px] items-center border-b px-4">
        <Link href="/admin" className="flex items-center space-x-2">
          <Boxes className="h-6 w-6" />
          {!isCollapsed && <span className="font-bold">Admin</span>}
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <div className="space-y-4 py-2">
          {sidebarNavItems.map((group) => (
            <div key={group.title} className="px-3 py-2">
              {!isCollapsed && (
                <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
                  {group.title}
                </h2>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn(
                        "h-4 w-4",
                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                      )} />
                      {!isCollapsed && (
                        <span className="ml-2">{item.title}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}