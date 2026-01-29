"use client";

import { Button } from "@/components/ui/button";
import { Meal } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Clock, Plus, Star } from "lucide-react";
import Link from "next/link";

interface MealCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  meal: Meal;
}

const MealCard = ({ meal, className, ...props }: MealCardProps) => {
  //   const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    // e.preventDefault();
    // e.stopPropagation();
    // addToCart(meal, 1);
    // toast.success({
    //   title: "Added to cart! 🛒",
    //   description: `${meal.name} has been added to your cart.`,
    // });
  };

  return (
    <Link
      href={`/meals/${meal.id}`}
      className={cn(
        "group block bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1",
        className,
      )}
      {...props}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {meal.isPopular && (
            <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              Popular
            </span>
          )}
          {meal.isVegetarian && (
            <span className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
              🌱 Veg
            </span>
          )}
          {meal.isSpicy && (
            <span className="px-2.5 py-1 bg-destructive/90 text-destructive-foreground text-xs font-semibold rounded-full">
              🌶️ Spicy
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {meal.originalPrice && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
            {Math.round((1 - meal.price / meal.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* Quick Add Button */}
        <Button
          variant="default"
          size="icon"
          className="absolute bottom-3 right-3 h-10 w-10 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          onClick={handleAddToCart}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {meal.name}
            </h3>
            <p className="text-sm text-muted-foreground">{meal.providerName}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {meal.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium text-foreground">{meal.rating}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {meal.prepTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {meal.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${meal.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-bold text-primary text-lg">
              ${meal.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MealCard;
