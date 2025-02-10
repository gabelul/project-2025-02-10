import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  AlertCircle,
  FileText,
  Boxes,
  ChevronLeft
} from "lucide-react"

const Nav = ({ className, ...props }) => {
  return (
    <nav
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

const NavItem = ({
  className,
  title,
  icon: Icon,
  isCollapsed,
  isActive,
  children,
  href,
  ...props
}) => {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-2",
        isCollapsed && "flex-col h-auto gap-1 px-2 py-2",
        className
      )}
      {...props}
    >
      <Link href={href}>
        {Icon && <Icon className="h-4 w-4" />}
        {!isCollapsed && title}
        {isCollapsed && title && (
          <span className="text-xs font-medium">{title}</span>
        )}
        {children}
      </Link>
    </Button>
  )
}

const NavHeader = ({
  className,
  children,
  isCollapsed,
  ...props
}) => {
  return (
    <div
      className={cn("flex items-center gap-2 px-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const NavTitle = ({
  className,
  isCollapsed,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "text-xs font-medium text-muted-foreground",
        isCollapsed && "hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          href: "/admin",
          isActive: pathname === "/admin",
        },
        {
          title: "Tasks",
          icon: FileText,
          href: "/admin/tasks",
          isActive: pathname === "/admin/tasks",
        },
      ],
    },
    {
      title: "Apps",
      items: [
        {
          title: "Apps",
          icon: Boxes,
          href: "/admin/apps",
          isActive: pathname === "/admin/apps",
        },
        {
          title: "Chats",
          icon: MessageSquare,
          href: "/admin/chats",
          badge: "2",
          isActive: pathname === "/admin/chats",
        },
        {
          title: "Users",
          icon: Users,
          href: "/admin/users",
          isActive: pathname === "/admin/users",
        },
      ],
    },
    {
      title: "Pages",
      items: [
        {
          title: "Auth",
          icon: Settings,
          href: "/admin/auth",
          isActive: pathname === "/admin/auth",
        },
        {
          title: "Errors",
          icon: AlertCircle,
          href: "/admin/errors",
          isActive: pathname === "/admin/errors",
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: Settings,
          href: "/admin/settings",
          isActive: pathname === "/admin/settings",
        },
        {
          title: "Help Center",
          icon: HelpCircle,
          href: "/admin/help",
          isActive: pathname === "/admin/help",
        },
      ],
    },
  ]

  return (
    <aside
      className={cn(
        "flex flex-col gap-4 p-4 pt-0 border-r",
        isCollapsed ? "w-[80px]" : "w-[200px]"
      )}
    >
      <div className="flex h-[60px] items-center justify-between">
        <NavHeader isCollapsed={isCollapsed}>
          <Link href="/admin" className="flex items-center space-x-2">
            <Boxes className="h-6 w-6" />
            {!isCollapsed && <span className="font-bold">Admin</span>}
          </Link>
        </NavHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <Nav>
        {navItems.map((group, index) => (
          <div key={index} className="flex flex-col gap-2">
            <NavTitle isCollapsed={isCollapsed}>{group.title}</NavTitle>
            <div className="flex flex-col gap-1">
              {group.items.map((item, itemIndex) => (
                <NavItem
                  key={itemIndex}
                  title={item.title}
                  icon={item.icon}
                  href={item.href}
                  isCollapsed={isCollapsed}
                  isActive={item.isActive}
                >
                  {item.badge && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </NavItem>
              ))}
            </div>
          </div>
        ))}
      </Nav>
    </aside>
  )
}