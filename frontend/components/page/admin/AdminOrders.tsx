"use client"

import { useState } from "react";
import { Search, Eye, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orders, Order } from "@/lib/mockData";

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "preparing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "placed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "ready":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const ordersByStatus = {
    placed: orders.filter((o) => o.status === "placed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="container py-8 mx-auto">
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Order Management</h1>
      <p className="text-muted-foreground">Track and manage all orders on the platform.</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{orders.length}</p>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{ordersByStatus.placed}</p>
          <p className="text-sm text-muted-foreground">Placed</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{ordersByStatus.preparing}</p>
          <p className="text-sm text-muted-foreground">Preparing</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{ordersByStatus.ready}</p>
          <p className="text-sm text-muted-foreground">Ready</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{ordersByStatus.delivered}</p>
          <p className="text-sm text-muted-foreground">Delivered</p>
        </CardContent>
      </Card>
    </div>

    {/* Filters */}
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer, or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="placed">Placed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    {/* Orders Table */}
    <Card>
      <CardHeader>
        <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Provider
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-foreground">#{order.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-foreground">{order.userName}</p>
                    <p className="text-sm text-muted-foreground">{order.userEmail}</p>
                  </td>
                  <td className="py-4 px-4 text-foreground">{order.providerName}</td>
                  <td className="py-4 px-4 font-medium text-foreground">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground text-sm">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Order #{order.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Customer Info */}
                          <div className="p-4 rounded-lg bg-muted/50">
                            <h4 className="font-medium text-foreground mb-2">
                              Customer Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {order.userEmail}
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                {order.userPhone}
                              </p>
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {order.deliveryAddress}
                              </p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Order Items</h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span>
                                    {item.quantity}x {item.mealName}
                                  </span>
                                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Totals */}
                          <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Delivery Fee</span>
                              <span>${order.deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant="outline" className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
  );
};

export default AdminOrders;
