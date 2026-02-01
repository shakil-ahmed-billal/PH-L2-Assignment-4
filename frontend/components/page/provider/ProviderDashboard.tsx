"use client"

import { useEffect, useState } from "react";
import { DollarSign, Package, ShoppingBag, TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface DashboardData {
  orders: {
    total: number;
    placed: number;
    preparing: number;
    ready: number;
    delivered: number;
    cancelled: number;
  };
  meals: {
    total: number;
    available: number;
    popular: number;
  };
  revenue: {
    total: number;
    monthly: number;
  };
  recentOrders: Array<{
    id: string;
    customerName: string;
    customerPhone: string;
    status: string;
    total: number;
    itemCount: number;
    createdAt: string;
  }>;
}

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchDashboard = async () => {
        try {
          setIsLoading(true);
          const result = await api.get<DashboardData>(`/api/provider/dashboard/${user.id}`);

          if (result.success && result.data) {
            setDashboardData(result.data);
          } else {
            toast.error("Failed to load dashboard");
          }
        } catch (error) {
          console.error("Error fetching dashboard:", error);
          toast.error("An error occurred while loading dashboard");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchDashboard();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 animate-pulse text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container py-8 mx-auto">
        <div className="text-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  ${dashboardData.revenue.total.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-100">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  ${dashboardData.revenue.monthly.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.orders.total}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Meals</p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardData.meals.total}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-100">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{dashboardData.orders.placed}</p>
            <p className="text-sm text-muted-foreground">Placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{dashboardData.orders.preparing}</p>
            <p className="text-sm text-muted-foreground">Preparing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{dashboardData.orders.ready}</p>
            <p className="text-sm text-muted-foreground">Ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{dashboardData.orders.delivered}</p>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{dashboardData.orders.cancelled}</p>
            <p className="text-sm text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Meal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{dashboardData.meals.available}</p>
            <p className="text-sm text-muted-foreground">out of {dashboardData.meals.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{dashboardData.meals.popular}</p>
            <p className="text-sm text-muted-foreground">marked as popular</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              ${dashboardData.orders.total > 0 
                ? (dashboardData.revenue.total / dashboardData.orders.delivered).toFixed(2) 
                : "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">per delivered order</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentOrders.length > 0 ? (
              dashboardData.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Order #{order.id.slice(0, 8)}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {order.customerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent orders</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderDashboard;