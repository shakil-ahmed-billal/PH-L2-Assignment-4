"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Tag,
  ChefHat,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Store,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Users",
    url: "/admin/dashboard/users",
    icon: Users,
    badge: "12",
  },
  {
    title: "Orders",
    url: "/admin/dashboard/orders",
    icon: ShoppingBag,
    badge: "5",
  },
  {
    title: "Categories",
    url: "/admin/dashboard/category",
    icon: Tag,
    badge: null,
  },
  {
    title: "Meals",
    url: "/admin/dashboard/menu",
    icon: ChefHat,
    badge: null,
  },
  {
    title: "Providers",
    url: "/admin/dashboard/providers",
    icon: Store,
    badge: null,
  },
  {
    title: "Analytics",
    url: "/admin/dashboard/analytics",
    icon: BarChart3,
    badge: null,
  },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props} className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
            <ChefHat className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">FoodHub</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main Menu
            </p>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`
                    group relative my-0.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" 
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                    <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : ""}`} />
                    <span className="flex-1 font-medium">{item.title}</span>
                    {item.badge && (
                      <span className={`
                        rounded-full px-2 py-0.5 text-xs font-semibold
                        ${isActive 
                          ? "bg-primary-foreground/20 text-primary-foreground" 
                          : "bg-primary/10 text-primary"
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-primary-foreground" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <div className="mt-6 px-3">
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">Quick Stats</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Your platform is performing great!
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Users</span>
                <span className="font-semibold">2,543</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-semibold text-emerald-600">$12,482</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-6 hover:bg-muted/50"
            >
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start flex-1 overflow-hidden">
                <span className="text-sm font-semibold text-foreground">Admin User</span>
                <span className="text-xs text-muted-foreground truncate">admin@foodhub.com</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}