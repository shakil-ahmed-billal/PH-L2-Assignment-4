"use client"

import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Order } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

// Demo order data
const demoOrders = [
  {
    id: "FH-ABC123",
    date: "2024-01-28",
    status: "delivered",
    total: 45.97,
    items: [
      { name: "Classic Smash Burger", quantity: 2, price: 12.99 },
      { name: "Rainbow Dragon Roll", quantity: 1, price: 18.99 },
    ],
    provider: "Burger Palace",
  },
  {
    id: "FH-DEF456",
    date: "2024-01-27",
    status: "preparing",
    total: 32.48,
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 16.99 },
      { name: "Buddha Bowl", quantity: 1, price: 13.99 },
    ],
    provider: "Pizza Napoli",
  },
  {
    id: "FH-GHI789",
    date: "2024-01-25",
    status: "cancelled",
    total: 24.99,
    items: [{ name: "Salmon Sashimi Platter", quantity: 1, price: 22.99 }],
    provider: "Sakura Sushi",
  },
];

const statusConfig = {
  placed: { label: "Placed", icon: Package, color: "bg-muted text-muted-foreground" },
  preparing: { label: "Preparing", icon: Clock, color: "bg-accent/20 text-accent-foreground" },
  ready: { label: "Ready", icon: CheckCircle, color: "bg-primary/20 text-primary" },
  delivered: { label: "Delivered", icon: Truck, color: "bg-secondary text-secondary-foreground" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-destructive/20 text-destructive" },
};

const OrdersPage = () => {
  const [myOrder, setMyOrder] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user exists before making API call
    if (user) {
      const getMyOrder = async () => {
        const result = await api.get(`/api/order/${user.id}`);
        console.log(result);
        if (result.success) {
          setMyOrder(result.data as Order[]);
        }
      };

      getMyOrder();
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

  console.log(myOrder);

  return (
    <div className="container py-8 mx-auto">
      <div className="mb-8">
        <h1 className="heading-section text-foreground mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {myOrder.length > 0 ? (
        <div className="space-y-4">
          {myOrder.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <div key={order.id} className="bg-card rounded-2xl p-6 shadow-soft">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-bold text-foreground">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    From <span className="font-medium text-foreground">{order.provider}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 bg-muted rounded-full text-sm">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                </div>

                {order.status === "preparing" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-primary rounded-full animate-pulse" />
                      </div>
                      <span className="text-sm text-muted-foreground">Estimated: 15-20 min</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Start ordering to see your order history here
          </p>
          <Link href="/meals">
            <Button>Browse Meals</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
