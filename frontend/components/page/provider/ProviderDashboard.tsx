"use client"

import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  ChefHat,
  ArrowUpRight,
  UtensilsCrossed,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProviderOrders, getProviderMeals, orders } from "@/lib/mockData";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Order } from "@/types";
import { api } from "@/lib/api";


const ProviderDashboard = () => {

  
  // For demo, use prov-1 (Burger Palace) as the provider
  const providerId = "prov-1";
  const providerOrders = getProviderOrders(providerId);
  const providerMeals = getProviderMeals(providerId);
  const { user } = useAuth();

  // Calculate stats
  const totalOrders = providerOrders.length;
  const totalRevenue = providerOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = providerOrders.filter((o) => o.status === "placed" || o.status === "preparing").length;
  const completedOrders = providerOrders.filter((o) => o.status === "delivered").length;

  const stats = [
    {
      title: "Today's Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      change: "+18.2%",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: "+12 today",
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      change: "Action needed",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Menu Items",
      value: providerMeals.length.toString(),
      change: "Active items",
      icon: UtensilsCrossed,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];


  const [providerSats, setProviderStats] = useState<any[]>([])
  const [orderProvider, setProviderOrders] = useState<Order[]>([]);
  

  useEffect(() => {
    // Check if user exists before making API call
    if (user) {
      const GetProviderStats = async () => {
        const result = await api.get(`/api/provider/stats/${user.id}`);
        
        console.log(result);
        if (result.success) {
          setProviderStats(result.data as any[]);
        }
        
      };

      GetProviderStats();
      
    }
  }, [user]); 


  useEffect(() => {
    // Check if user exists before making API call
    if (user) {
      const GetProviderOrders = async () => {
        const result = await api.get(`/api/provider/orders/${user.id}`);
        console.log(result);
        if (result.success) {
          setProviderOrders(result.data as Order[]);
        }
      };
      GetProviderOrders();
    }
  }, [user]);


  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          You must be logged in to see your orders
        </h2>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  console.log(providerSats , orderProvider);

  const recentOrders = providerOrders.slice(0, 5);

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
      <div className="flex items-center gap-3 mb-2">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ChefHat className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Provider Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.restaurantName || "Burger Palace"}!
          </p>
        </div>
      </div>
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
                  <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-600 text-sm">{stat.change}</span>
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

    {/* Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Orders */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <Link href="/provider/orders">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-foreground">#{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.userName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${order.total.toFixed(2)}</p>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No orders yet. Orders will appear here.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/provider/menu" className="block">
            <Button variant="outline" className="w-full justify-start">
              <UtensilsCrossed className="h-4 w-4 mr-2" />
              Manage Menu
            </Button>
          </Link>
          <Link href="/provider/orders" className="block">
            <Button variant="outline" className="w-full justify-start">
              <ShoppingBag className="h-4 w-4 mr-2" />
              View Orders
            </Button>
          </Link>
          <Link href="/provider/menu" className="block">
            <Button className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Add New Meal
            </Button>
          </Link>
        </CardContent>

        {/* Top Selling Items */}
        <CardHeader className="pt-6">
          <CardTitle className="text-lg">Top Selling Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {providerMeals.slice(0, 3).map((meal, index) => (
              <div key={meal.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-muted-foreground">
                  #{index + 1}
                </span>
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{meal.name}</p>
                  <p className="text-sm text-muted-foreground">${meal.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  );
};

export default ProviderDashboard;
