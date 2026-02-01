"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const CheckoutPage = () => {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryFee, getTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { user } = useAuth();
  const { createNewOrder } = useData();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to place an order");
      return;
    }
    const providerId = items[0]?.meal.providerId;
    if (!providerId) {
      toast.error("Cart is invalid: missing provider information.");
      return;
    }
    setIsSubmitting(true);

    const orderData = {
      customerId: user.id,
      providerId,
      totalPrice: items.reduce(
        (total, item) => total + item.quantity * item.meal.price,
        0
      ),
      deliveryAddress: formData.address,
      status: "PLACED",
      items: items.map((item) => ({
        mealId: item.meal.id,
        quantity: item.quantity,
        price: item.meal.price,
      })),
    };

    const result: any = await createNewOrder(orderData);
    console.log(result);

    if (result.success) {
      setIsSubmitting(false);
      setOrderPlaced(true);
      clearCart();
      toast(" Order Placed Successfully! 🎉 You will receive a confirmation email shortly.");



    if (items.length === 0 && !orderPlaced) {
      router.push("/cart");
      return null;
    }

    }
  };



  return (
    (orderPlaced ? <>

<div className="container py-16 text-center mx-auto">
            <div className="max-w-md mx-auto">
              <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-secondary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground mb-2">
                Thank you for your order. Your delicious food is being prepared!
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                {/* Order #FH-{Math.random().toString(36).substring(2, 8).toUpperCase()} */}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/orders">
                  <Button>Track Order</Button>
                </Link>
                <Link href="/meals">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          </div>
    </> : <>
    <div className="container py-8 mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.push("/cart")}
        className="mb-6 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cart
      </Button>

      <h1 className="heading-section text-foreground mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Delivery Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <h2 className="font-semibold text-lg text-foreground mb-4">
                Delivery Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+1 (234) 567-890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="New York"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ring the doorbell, leave at the door, etc."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <h2 className="font-semibold text-lg text-foreground mb-4">
                Payment Method
              </h2>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                  💵
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Cash on Delivery
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pay when your order arrives
                  </p>
                </div>
                <Check className="h-5 w-5 text-secondary-foreground ml-auto" />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24">
              <h2 className="font-semibold text-lg text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.meal.id} className="flex gap-3">
                    <img
src={item.meal.image ?? ""}
                       alt={item.meal.name}
                       className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {item.meal.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(item.meal.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    ${getSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">
                    ${getDeliveryFee().toFixed(2)}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-primary">${getTotal().toFixed(2)}</span>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By placing this order, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
    </>)
  );
};

export default CheckoutPage;
