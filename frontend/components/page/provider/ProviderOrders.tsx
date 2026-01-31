"use client"

import { useEffect, useState } from "react";
import { Search, Eye, MapPin, Phone, Clock, ChefHat, PackageCheck, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Order } from "@/lib/mockData";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const ProviderOrders = () => {
  const { user } = useAuth();
  const [orderProvider, setProviderOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch provider orders
  useEffect(() => {
    if (user) {
      const GetProviderOrders = async () => {
        try {
          setIsLoading(true);
          const result = await api.get(`/api/provider/orders/${user.id}`);
          console.log(result);
          if (result.success) {
            setProviderOrders(result.data as Order[]);
          } else {
            toast.error("Failed to load orders");
          }
        } catch (error) {
          console.error("Error fetching provider orders:", error);
          toast.error("An error occurred while loading orders");
        } finally {
          setIsLoading(false);
        }
      };
      GetProviderOrders();
    }
  }, [user]);

  const filteredOrders = orderProvider.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Update order status via API
  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const result = await api.put(`/api/provider/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (result.success) {
        setProviderOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        );
        toast.success(`Order #${orderId} status changed to ${newStatus}.`);
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("An error occurred while updating the order");
    }
  };

  // Cancel order via API
  const cancelOrder = async (orderId: string) => {
    try {
      const result = await api.put(`/api/provider/orders/${orderId}/cancel`);

      if (result.success) {
        setProviderOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, status: "cancelled", updatedAt: new Date().toISOString() }
              : order
          )
        );
        toast.success(`Order #${orderId} has been cancelled.`);
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("An error occurred while cancelling the order");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PREPARING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "PLACED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "READY":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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

  const getNextStatus = (currentStatus: Order["status"]): Order["status"] | null => {
    switch (currentStatus) {
      case "PLACED":
        return "PREPARING";
      case "PREPARING":
        return "READY";
      case "READY":
        return "DELIVERED";
      default:
        return null;
    }
  };

  const getStatusActionLabel = (status: Order["status"]): string => {
    switch (status) {
      case "PLACED":
        return "Start Preparing";
      case "PREPARING":
        return "Mark Ready";
      case "READY":
        return "Mark Delivered";
      default:
        return "";
    }
  };

  // Stats
  const ordersByStatus = {
    placed: orderProvider.filter((o) => o.status === "PLACED").length,
    preparing: orderProvider.filter((o) => o.status === "PREPARING").length,
    ready: orderProvider.filter((o) => o.status === "READY").length,
    delivered: orderProvider.filter((o) => o.status === "DELIVERED").length,
  };

  if (isLoading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <PackageCheck className="h-12 w-12 animate-pulse text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Order Management</h1>
        <p className="text-muted-foreground">View and manage incoming orders.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ordersByStatus.placed}</p>
                <p className="text-sm text-muted-foreground">New Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <ChefHat className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ordersByStatus.preparing}</p>
                <p className="text-sm text-muted-foreground">Preparing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <PackageCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ordersByStatus.ready}</p>
                <p className="text-sm text-muted-foreground">Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <PackageCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ordersByStatus.delivered}</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>
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
                placeholder="Search by order ID or customer name..."
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
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="PLACED">Placed</SelectItem>
                <SelectItem value="PREPARING">Preparing</SelectItem>
                <SelectItem value="READY">Ready</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-semibold text-foreground">
                      #{order.id}
                    </span>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                  <p className="font-medium text-foreground">{order.userName}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {order.userPhone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {order.items.length} item(s)
                  </p>
                  <p className="text-sm line-clamp-2">
                    {order.items.map((item) => `${item.quantity}x ${item.mealName}`).join(", ")}
                  </p>
                </div>

                {/* Total & Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-foreground">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Details */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
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
                              Delivery Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="font-medium">{order.userName}</p>
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
                                  className="flex items-center justify-between text-sm p-2 rounded bg-muted/30"
                                >
                                  <span>
                                    {item.quantity}x {item.mealName}
                                  </span>
                                  <span className="font-medium">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
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
                            <div className="flex justify-between font-medium text-lg">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Order Status */}
                          <div className="pt-2">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm font-medium">Status:</span>
                              <Badge variant="outline" className={getStatusColor(order.status)}>
                                {formatStatus(order.status)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Update Status */}
                    {getNextStatus(order.status) && order.status !== "CANCELLED" && (
                      <Button
                        onClick={() =>
                          updateOrderStatus(order.id, getNextStatus(order.status)!)
                        }
                        size="default"
                      >
                        {getStatusActionLabel(order.status)}
                      </Button>
                    )}

                    {/* Cancel Order */}
                    {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => cancelOrder(order.id)}
                        title="Cancel Order"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <PackageCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg mb-2">No orders found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "New orders will appear here"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProviderOrders;