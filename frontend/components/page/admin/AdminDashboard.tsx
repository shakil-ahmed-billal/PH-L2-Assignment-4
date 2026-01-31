"use client"


import {
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Store,
  ChefHat,
  ArrowUpRight,
  ArrowDownRight,
  Link,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { orders, adminUsers, providers, meals } from "@/lib/mockData";

const AdminDashboard = () => {
  // Calculate stats from mock data
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalCustomers = adminUsers.filter((u) => u.role === "customer").length;
  const totalProviders = providers.length;
  const pendingOrders = orders.filter((o) => o.status === "placed" || o.status === "preparing").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Providers",
      value: totalProviders.toString(),
      change: "+2",
      trend: "up",
      icon: Store,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700";
      case "preparing":
        return "bg-amber-100 text-amber-700";
      case "placed":
        return "bg-blue-100 text-blue-700";
      case "ready":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container py-8 mx-auto">
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back! Here's an overview of your platform.
      </p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-emerald-600 text-sm" : "text-red-600 text-sm"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground text-sm">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Order Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Pending</span>
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
              {pendingOrders} orders
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Delivered</span>
            <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
              {deliveredOrders} orders
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Meals</span>
            <Badge variant="outline">{meals.length} items</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ChefHat className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{order.userName}</p>
                    <p className="text-sm text-muted-foreground">{order.providerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${order.total.toFixed(2)}</p>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Quick Links */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Link to="/admin/users">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Manage Users</p>
              <p className="text-sm text-muted-foreground">View and manage all users</p>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link to="/admin/orders">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">All Orders</p>
              <p className="text-sm text-muted-foreground">Track and manage orders</p>
            </div>
          </CardContent>
        </Card>
      </Link>
      <Link to="/admin/categories">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Categories</p>
              <p className="text-sm text-muted-foreground">Manage food categories</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  </div>
  );
};

export default AdminDashboard;
