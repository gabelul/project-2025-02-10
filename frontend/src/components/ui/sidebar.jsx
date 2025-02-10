"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Settings,
  MonitorDot,
  Activity,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Sidebar({ className }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin"
    },
    {
      name: "Providers",
      href: "/admin/providers",
      icon: MonitorDot,
      current: pathname.startsWith("/admin/providers")
    },
    {
      name: "Monitoring",
      href: "/admin/monitoring",
      icon: Activity,
      current: pathname === "/admin/monitoring"
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: pathname === "/admin/settings"
    }
  ]

  return (
    <div className={cn(
      "relative flex flex-col border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Logo Section */}
      <div className="flex h-[60px] items-center px-4 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <MonitorDot className="h-6 w-6" />
          {!collapsed && <span className="font-semibold">Admin Portal</span>}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              item.current
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-secondary/50",
              collapsed && "justify-center"
            )}
          >
            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-20 h-8 w-8 rounded-full border bg-background"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}