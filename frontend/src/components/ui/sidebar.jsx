"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Boxes
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

  return (
    <div className="flex h-screen flex-col border-r bg-background">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6" />
          <span>Admin Portal</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6">
          {sidebarNavItems.map((group) => (
            <div key={group.title} className="space-y-2">
              <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h4>
              <div className="grid gap-1">
                {group.items.map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      {item.title}
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