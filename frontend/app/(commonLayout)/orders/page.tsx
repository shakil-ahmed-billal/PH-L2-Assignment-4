"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Star,
  MessageSquare,
  Edit2,
  Trash2,
  ChefHat,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  mealId: string;
  image?: string;
}

interface Order {
  id: string;
  customerId: string;
  providerId: string;
  totalPrice: number;
  deliveryAddress: string;
  status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  provider: {
    id: string;
    name: string;
    image: string;
  };
  items: OrderItem[];
  review?: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
  };
}

const statusConfig = {
  PLACED: {
    label: "Order Placed",
    icon: Package,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    progress: 25,
  },
  PREPARING: {
    label: "Preparing",
    icon: ChefHat,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    progress: 50,
  },
  READY: {
    label: "Ready for Pickup",
    icon: CheckCircle,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    progress: 75,
  },
  DELIVERED: {
    label: "Delivered",
    icon: Truck,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    progress: 100,
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    progress: 0,
  },
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const result = await api.get(`/api/review/${user.id}`);

      if (result.success) {
        setOrders(result.data as Order[]);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenReviewDialog = (order: Order) => {
    setSelectedOrder(order);
    if (order.review) {
      setRating(order.review.rating);
      setComment(order.review.comment);
    } else {
      setRating(0);
      setComment("");
    }
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedOrder || !user) return;

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setIsSubmittingReview(true);

      const reviewData = {
        orderId: selectedOrder.id,
        userId: user.id,
        rating,
        comment,
      };

      let result;
      if (selectedOrder.review) {
        // Update existing review
        result = await api.patch(
          `/api/review/${selectedOrder.id}/review/${selectedOrder.review.id}`,
          reviewData
        );
      } else {
        // Create new review
        result = await api.post(`/api/review/${selectedOrder.id}/review`, reviewData);
      }

      if (result.success) {
        toast.success(
          selectedOrder.review
            ? "Review updated successfully! 🎉"
            : "Review submitted successfully! 🎉"
        );
        setReviewDialogOpen(false);
        fetchOrders(); // Refresh orders to show new review
      } else {
        toast.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (orderId: string, reviewId: string) => {
    try {
      const result = await api.delete(`/api/review/${orderId}/review/${reviewId}`);

      if (result.success) {
        toast.success("Review deleted successfully");
        fetchOrders();
        setReviewDialogOpen(false);
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="container py-8 mx-auto">
        <Skeleton className="h-12 w-64 mb-2" />
        <Skeleton className="h-6 w-96 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to view your order history
            </p>
            <Link href="/login">
              <Button size="lg">Login to Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <span className="text-5xl">📦</span>
            My Orders
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your orders and leave reviews
          </p>
        </div>

        {/* Stats Cards */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className=" bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-foreground">{orders.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Delivered</p>
                <p className="text-3xl font-bold text-foreground">
                  {orders.filter((o) => o.status === "DELIVERED").length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                <p className="text-3xl font-bold text-foreground">
                  {
                    orders.filter(
                      (o) => o.status === "PLACED" || o.status === "PREPARING" || o.status === "READY"
                    ).length
                  }
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-foreground">
                  ${orders.reduce((sum, o) => sum + o.totalPrice, 0).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              const canReview = order.status === "DELIVERED";

              return (
                <Card
                  key={order.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 pt-0"
                >
                  <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">Order #{order.id.slice(0, 8)}</CardTitle>
                          <Badge className={`${status.color} text-sm px-3 py-1`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {order.deliveryAddress}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center justify-end gap-1">
                          <DollarSign className="h-6 w-6 text-primary" />
                          {order.totalPrice}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {/* Progress Bar */}
                    {order.status !== "CANCELLED" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Order Progress</span>
                          <span>{status.progress}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                            style={{ width: `${status.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Restaurant Info */}
                    {order.provider && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                        <div className="relative h-16 w-16 rounded-xl overflow-hidden ring-2 ring-border">
                          <Image
                            src={
                              order.provider.image ||
                              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop"
                            }
                            alt={order.provider.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">From</p>
                          <p className="font-semibold text-foreground text-lg">
                            {order.provider.name}
                          </p>
                        </div>
                        <Link href={`/providers/${order.provider.id}`}>
                          <Button variant="outline" size="sm">
                            View Restaurant
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* Order Items */}
                    <div>
                      <p className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Items ({order.items.length})
                      </p>
                      <div className="grid gap-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-foreground">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-foreground">
                              ${(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Review Section */}
                    <div>
                      {order.review ? (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-amber-600" />
                                Your Review
                              </p>
                              <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-5 w-5 ${
                                      star <= order.review!.rating
                                        ? "fill-amber-500 text-amber-500"
                                        : "fill-muted text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenReviewDialog(order)}
                                className="hover:bg-amber-100 dark:hover:bg-amber-900/20"
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteReview(order.id, order.review!.id)
                                }
                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                          {order.review.comment && (
                            <p className="text-sm text-muted-foreground italic">
                              "{order.review.comment}"
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Reviewed on{" "}
                            {new Date(order.review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ) : canReview ? (
                        <Button
                          onClick={() => handleOpenReviewDialog(order)}
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                        >
                          <Star className="h-5 w-5 mr-2" />
                          Leave a Review
                        </Button>
                      ) : (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                          Reviews are available after delivery
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <div className="text-6xl mb-4">🍽️</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start ordering delicious meals from our restaurants!
              </p>
              <Link href="/meals">
                <Button size="lg">Browse Meals</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-amber-500" />
              {selectedOrder?.review ? "Edit Your Review" : "Leave a Review"}
            </DialogTitle>
            <DialogDescription>
              Share your experience with {selectedOrder?.provider.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Rating */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Rating</label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      className={`h-10 w-10 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-amber-500 text-amber-500"
                          : "fill-muted text-muted"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Comment (Optional)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={isSubmittingReview}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || rating === 0}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {isSubmittingReview ? (
                "Submitting..."
              ) : selectedOrder?.review ? (
                "Update Review"
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;