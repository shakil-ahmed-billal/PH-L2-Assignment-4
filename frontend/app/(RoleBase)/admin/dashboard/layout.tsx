"use client"

import { AdminSidebar } from "@/components/layout/dashboard/AdminSidebar";
import { Bell, Search, Sun, Moon, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/layout/navbar/ModeToggle";
import Link from "next/link";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Get page title based on current route
  const getPageTitle = () => {
    if (pathname.includes('/users')) return 'User Management';
    if (pathname.includes('/orders')) return 'Order Management';
    if (pathname.includes('/category')) return 'Categories';
    if (pathname.includes('/menu')) return 'Meals';
    if (pathname.includes('/providers')) return 'Providers';
    if (pathname.includes('/analytics')) return 'Analytics';
    return 'Dashboard';
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        {/* Modern Header */}
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <SidebarTrigger className="-ml-1 hover:bg-muted/50" />
          
          {/* Page Title */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{getPageTitle()}</h1>
          </div>

         <Link href={"/"}>
         <Button variant={"outline"} className="rounded-full"><Home/></Button>
         </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search anything..."
                className="pl-10 bg-muted/50 border-none focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" className="rounded-full">
              {/* <Sun className="h-5 w-5" /> */}
              <ModeToggle/>
             
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4">
                  <h3 className="font-semibold mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-muted-foreground">Order #12345 from John Doe</p>
                        <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">Sarah Smith joined</p>
                        <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Low stock alert</p>
                        <p className="text-xs text-muted-foreground">Burger Palace running low</p>
                        <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full mt-3">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto p-6 max-w-[1600px]">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}