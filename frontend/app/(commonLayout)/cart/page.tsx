"use client";


import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import Link from "next/link";


const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getTotal,
  } = useCart();

  const handleRemove = (mealId: string, mealName: string) => {
    removeFromCart(mealId);
    toast(`Removed from cart ${mealName} has been removed from your cart.`);
  };

  if (items.length === 0) {
    return (
      <div className="">
         <div className="container py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any delicious meals yet. 
              Browse our menu and find something you'll love!
            </p>
            <Link href="/meals">
              <Button variant="hero" size="lg">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Browse Meals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
        <div className="container py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-section text-foreground mb-1">Your Cart</h1>
            <p className="text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.meal.id}
                className="bg-card rounded-2xl p-4 md:p-6 shadow-soft flex gap-4"
              >
                {/* Image */}
                <Link href={`/meals/${item.meal.id}`} className="flex-shrink-0">
                  <img
                    src={item.meal.image}
                    alt={item.meal.name}
                    className="h-24 w-24 md:h-32 md:w-32 rounded-xl object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/meals/${item.meal.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.meal.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.meal.providerName}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.meal.id, item.meal.name)}
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.meal.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.meal.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        ${(item.meal.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-muted-foreground">
                          ${item.meal.price.toFixed(2)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24 right-0 bottom-0 left-0">
              <h2 className="font-semibold text-lg text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">${getDeliveryFee().toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-primary">${getTotal().toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <Button variant="hero" size="lg" className="w-full">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Cash on Delivery only. No payment required now.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
