"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  BarChart,
  Sun,
  Moon,
  Laptop
} from "lucide-react"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const NavButton = React.forwardRef(({ item, ...props }, ref) => {
    const button = (
      <Button
        ref={ref}
        variant={pathname === item.href ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start transition-colors",
          isCollapsed ? "justify-center px-2" : "px-2",
          pathname === item.href && "bg-primary/10 dark:bg-primary/20 hover:bg-primary/15 dark:hover:bg-primary/25",
          "hover:bg-accent/50 dark:hover:bg-accent/50",
          "group relative"
        )}
        asChild
        {...props}
      >
        <Link href={item.href} className="flex items-center gap-2">
          <item.icon className={cn(
            "h-4 w-4 transition-colors",
            pathname === item.href 
              ? "text-primary dark:text-primary" 
              : "text-muted-foreground group-hover:text-foreground"
          )} />
          {!isCollapsed && (
            <span className="transition-colors group-hover:text-foreground">
              {item.title}
            </span>
          )}
          {!isCollapsed && item.badge && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {item.badge}
            </span>
          )}
        </Link>
      </Button>
    )

    if (isCollapsed && item.title) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.title}
            {item.badge && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {item.badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      )
    }

    return button
  })
  NavButton.displayName = "NavButton"

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen border-r transition-all duration-300 ease-in-out",
        "bg-background dark:bg-background",
        "border-border dark:border-border",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex h-[60px] items-center justify-between px-4 border-b",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}>
        <div className="flex items-center gap-2">
          <MonitorDot className={cn(
            "h-6 w-6 transition-colors",
            "text-primary dark:text-primary"
          )} />
          {!isCollapsed && (
            <span className="font-semibold">Admin Portal</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 transition-colors",
            "hover:bg-accent/50 dark:hover:bg-accent/50",
            "text-muted-foreground hover:text-foreground"
          )}
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
        {Object.entries({ main: navigationItems.main, management: navigationItems.management, system: navigationItems.system })
          .map(([key, groups]) => (
            <div key={key} className="px-3 py-2">
              {groups.map((group) => (
                <div key={group.title} className="pb-4">
                  {!isCollapsed && (
                    <h2 className={cn(
                      "mb-2 px-2 text-xs font-semibold tracking-tight",
                      "text-muted-foreground/80"
                    )}>
                      {group.title}
                    </h2>
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <NavButton key={item.href} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* Theme Toggle at Bottom */}
      <div className="mt-auto border-t p-4">
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-full h-9">
                    {theme === "light" ? (
                      <Sun className="h-4 w-4" />
                    ) : theme === "dark" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Laptop className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right">
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
            </TooltipTrigger>
            <TooltipContent side="right">
              Change theme
            </TooltipContent>
          </Tooltip>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
              >
                {theme === "light" ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : theme === "dark" ? (
                  <Moon className="mr-2 h-4 w-4" />
                ) : (
                  <Laptop className="mr-2 h-4 w-4" />
                )}
                <span>Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isCollapsed ? "end" : "start"}>
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
        )}
      </div>
    </div>
  )
}