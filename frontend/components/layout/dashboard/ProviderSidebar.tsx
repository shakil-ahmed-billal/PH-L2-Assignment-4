"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  Star,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

// Navigation data with icons and badges
const navigationData = {
  main: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/provider/dashboard",
          icon: LayoutDashboard,
          description: "Your business overview",
        }
      ],
    },
    {
      title: "Menu Management",
      items: [
        {
          title: "All Meals",
          url: "/provider/dashboard/menu",
          icon: UtensilsCrossed,
          description: "View & edit meals",
        },
        {
          title: "Add New Meal",
          url: "/provider/dashboard/add-menu",
          icon: PlusCircle,
          description: "Create new meal",
        },
      ],
    },
    {
      title: "Orders & Sales",
      items: [
        {
          title: "Orders",
          url: "/provider/dashboard/orders",
          icon: Package,
          description: "Manage orders",
          badge: "5",
          badgeVariant: "default" as const,
        },
        {
          title: "Revenue",
          url: "/provider/dashboard/revenue",
          icon: DollarSign,
          description: "Earnings & payouts",
        },
        {
          title: "Profile",
          url: "/provider/dashboard/profile",
          icon: Users,
          description: "Customer insights",
        },
      ],
    },
    {
      title: "Business",
      items: [
        {
          title: "Reviews",
          url: "/provider/dashboard/reviews",
          icon: Star,
          description: "Customer feedback",
        },
        {
          title: "Customers",
          url: "/provider/dashboard/customers",
          icon: Users,
          description: "Customer insights",
        },
      ],
    },
  ],
};

export function ProviderSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (url: string) => {
    return pathname === url;
  };

  const getUserInitials = () => {
    if (!user?.name) return "PR";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  };

  return (
    <Sidebar {...props} className="border-r">
      {/* Header with Logo & Brand */}
      <SidebarHeader className="border-b px-6 py-5">
        <Link
          href="/provider/dashboard"
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-xl">🍱</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              FoodHub
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Provider Panel
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* User Profile Section */}
      <div className="px-4 py-4 border-b">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all cursor-pointer group">
          <Avatar className="h-12 w-12 border-2 border-primary/20 ring-2 ring-primary/10">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name || "Provider"}
            />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">
              {user?.name || "Restaurant Name"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || "provider@foodhub.com"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-background hover:bg-primary/5 transition-colors cursor-pointer">
            <p className="text-xs text-muted-foreground">Orders</p>
            <p className="text-lg font-bold text-primary">24</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background hover:bg-green-500/5 transition-colors cursor-pointer">
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-500">
              $1.2K
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background hover:bg-amber-500/5 transition-colors cursor-pointer">
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-500">
              4.8⭐
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <SidebarContent className="px-3 py-4">
        {navigationData.main.map((section, index) => (
          <SidebarGroup key={section.title} className="mb-4">
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "group relative px-3 py-6 rounded-lg transition-all duration-200",
                          active
                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md hover:shadow-lg"
                            : "hover:bg-muted/80 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Link href={item.url}>
                          <div className="flex items-center gap-3 flex-1">
                            <Icon
                              className={cn(
                                "h-5 w-5 transition-transform group-hover:scale-110",
                                active
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground group-hover:text-primary",
                              )}
                            />
                            <div className="flex flex-col flex-1">
                              <span className="font-medium text-sm">
                                {item.title}
                              </span>
                              {item.description && !active && (
                                <span className="text-xs text-muted-foreground group-hover:text-foreground/70">
                                  {item.description}
                                </span>
                              )}
                            </div>
                            {item.badge && (
                              <Badge
                                variant={item.badgeVariant || "secondary"}
                                className={cn(
                                  "ml-auto text-xs",
                                  active
                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                    : "",
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Log out</span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
