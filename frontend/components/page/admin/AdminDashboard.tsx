"use client"

import { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Store,
  ChefHat,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProviders: number;
  totalMeals: number;
  totalCategories: number;
  pendingOrders: number;
  deliveredOrders: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    providerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const result = await api.get("/api/admin/dashboard");
      
      if (result.success) {
        setStats(result.data as any);
      } else {
        toast.error("Failed to load dashboard statistics");
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("An error occurred while loading dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "text-emerald-600 bg-emerald-100";
      case "PREPARING":
        return "text-amber-600 bg-amber-100";
      case "PLACED":
        return "text-blue-600 bg-blue-100";
      case "READY":
        return "text-purple-600 bg-purple-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const completionRate = stats.totalOrders > 0 
    ? (stats.deliveredOrders / stats.totalOrders) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, Admin! 👋</h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-4 py-2">
          <Clock className="h-3 w-3 mr-1" />
          Last updated: Just now
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 rounded-full px-2 py-1">
                <ArrowUpRight className="h-3 w-3" />
                <span>+12.5%</span>
              </div>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
              <p className="text-xs opacity-75 mt-2">vs last month</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 rounded-full px-2 py-1">
                <ArrowUpRight className="h-3 w-3" />
                <span>+8.2%</span>
              </div>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
              <p className="text-xs opacity-75 mt-2">{stats.pendingOrders} pending</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 rounded-full px-2 py-1">
                <ArrowUpRight className="h-3 w-3" />
                <span>+15.3%</span>
              </div>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Total Customers</p>
              <p className="text-3xl font-bold">{stats.totalCustomers}</p>
              <p className="text-xs opacity-75 mt-2">Active users</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Providers */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Store className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 rounded-full px-2 py-1">
                <ArrowUpRight className="h-3 w-3" />
                <span>+2</span>
              </div>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Active Providers</p>
              <p className="text-3xl font-bold">{stats.totalProviders}</p>
              <p className="text-xs opacity-75 mt-2">Restaurant partners</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Meals</p>
                <p className="text-2xl font-bold">{stats.totalMeals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <Tag className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{stats.totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">{stats.deliveredOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="lg:col-span-4 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-xl">Recent Orders</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Latest transactions on your platform</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {stats.recentOrders.length} New
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <ChefHat className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground truncate">{order.providerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">${order.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(order.createdAt)}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} border-none`}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No recent orders
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Completion & Quick Stats */}
        <div className="lg:col-span-3 space-y-6">
          {/* Order Completion Rate */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Order Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="text-2xl font-bold text-emerald-600">{completionRate.toFixed(1)}%</span>
                </div>
                <Progress value={completionRate} className="h-3" />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 rounded-lg bg-emerald-50">
                    <p className="text-2xl font-bold text-emerald-600">{stats.deliveredOrders}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-amber-50">
                    <p className="text-2xl font-bold text-amber-600">{stats.pendingOrders}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Overview */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Platform Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Users</p>
                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                  </div>
                </div>
                <p className="text-xl font-bold">2,543</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Growth Rate</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-emerald-600">+23%</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Store className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Top Provider</p>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">Burger Palace</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;