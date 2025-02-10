import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Settings,
  History,
  Star,
  FileText,
  Users,
  Plane,
  MoreHorizontal,
  Building2
} from "lucide-react"

const Sidebar = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pb-12", className)} {...props} />
))
Sidebar.displayName = "Sidebar"

const SidebarItem = React.forwardRef(({ className, icon: Icon, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    className={cn(
      "w-full justify-start gap-2 font-normal",
      className
    )}
    {...props}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </Button>
))
SidebarItem.displayName = "SidebarItem"

const SidebarGroup = React.forwardRef(({ title, children, className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props}>
    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{title}</h2>
    {children}
  </div>
))
SidebarGroup.displayName = "SidebarGroup"

export function MainSidebar({ className }) {
  return (
    <Sidebar className={cn("w-64 border-r bg-background", className)}>
      <div className="flex h-14 items-center border-b px-4">
        <Button variant="ghost" className="gap-2 font-semibold">
          <Building2 className="h-5 w-5" />
          Acme Inc
        </Button>
      </div>
      
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 text-sm font-medium">Platform</h2>
          <div className="space-y-1">
            <SidebarItem icon={FileText}>Playground</SidebarItem>
            <SidebarItem icon={History}>History</SidebarItem>
            <SidebarItem icon={Star}>Starred</SidebarItem>
            <SidebarItem icon={Settings}>Settings</SidebarItem>
          </div>
        </div>

        <div className="px-4 py-2">
          <h2 className="mb-2 text-sm font-medium">Projects</h2>
          <div className="space-y-1">
            <SidebarItem icon={Building2}>Design Engineering</SidebarItem>
            <SidebarItem icon={Users}>Sales & Marketing</SidebarItem>
            <SidebarItem icon={Plane}>Travel</SidebarItem>
            <SidebarItem icon={MoreHorizontal}>More</SidebarItem>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}