"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  LayoutDashboard,
  Settings,
  Activity,
  Server,
  Shield,
  Users,
  MessageSquare,
  Bell,
  ChevronLeft,
  MonitorDot,
  Boxes,
  FileText,
  HelpCircle,
  BarChart
} from "lucide-react"

const navigationItems = {
  main: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          href: "/admin",
        },
        {
          title: "Analytics",
          icon: BarChart,
          href: "/admin/analytics",
        },
        {
          title: "Monitoring",
          icon: Activity,
          href: "/admin/monitoring",
        },
      ],
    }
  ],
  management: [
    {
      title: "Content",
      items: [
        {
          title: "Providers",
          icon: Server,
          href: "/admin/providers",
        },
        {
          title: "Models",
          icon: Boxes,
          href: "/admin/models",
        },
        {
          title: "Tasks",
          icon: FileText,
          href: "/admin/tasks",
          badge: "New"
        },
      ],
    }
  ],
  system: [
    {
      title: "System",
      items: [
        {
          title: "Security",
          icon: Shield,
          href: "/admin/security",
        },
        {
          title: "Users",
          icon: Users,
          href: "/admin/users",
        },
        {
          title: "Messages",
          icon: MessageSquare,
          href: "/admin/messages",
          badge: "3"
        },
        {
          title: "Notifications",
          icon: Bell,
          href: "/admin/notifications",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          title: "Settings",
          icon: Settings,
          href: "/admin/settings",
        },
        {
          title: "Help",
          icon: HelpCircle,
          href: "/admin/help",
        },
      ],
    }
  ],
}

export function MainSidebar({ className, isCollapsed: defaultCollapsed = false }) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const pathname = React.useRef("/admin")

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen border-r bg-background duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-[60px] items-center justify-between px-4 border-b">
        <div className="flex items-center gap-2">
          <MonitorDot className="h-6 w-6" />
          {!isCollapsed && (
            <span className="font-semibold">Admin Portal</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto">
        {/* Main Navigation */}
        <div className="px-3 py-2">
          {navigationItems.main.map((group) => (
            <div key={group.title} className="pb-4">
              {!isCollapsed && (
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
                  {group.title}
                </h2>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname.current === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed && "justify-center px-2",
                      pathname.current === item.href && "bg-secondary"
                    )}
                    asChild
                  >
                    <a href={item.href} className="flex items-center gap-2">
                      <item.icon className={cn(
                        "h-4 w-4",
                        pathname.current === item.href ? "text-primary" : "text-muted-foreground"
                      )} />
                      {!isCollapsed && (
                        <span>{item.title}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Management */}
        <div className="px-3 py-2">
          {navigationItems.management.map((group) => (
            <div key={group.title} className="pb-4">
              {!isCollapsed && (
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
                  {group.title}
                </h2>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname.current === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed && "justify-center px-2",
                      pathname.current === item.href && "bg-secondary"
                    )}
                    asChild
                  >
                    <a href={item.href} className="flex items-center gap-2">
                      <item.icon className={cn(
                        "h-4 w-4",
                        pathname.current === item.href ? "text-primary" : "text-muted-foreground"
                      )} />
                      {!isCollapsed && (
                        <span>{item.title}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* System */}
        <div className="px-3 py-2">
          {navigationItems.system.map((group) => (
            <div key={group.title} className="pb-4">
              {!isCollapsed && (
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
                  {group.title}
                </h2>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname.current === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed && "justify-center px-2",
                      pathname.current === item.href && "bg-secondary"
                    )}
                    asChild
                  >
                    <a href={item.href} className="flex items-center gap-2">
                      <item.icon className={cn(
                        "h-4 w-4",
                        pathname.current === item.href ? "text-primary" : "text-muted-foreground"
                      )} />
                      {!isCollapsed && (
                        <span>{item.title}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}