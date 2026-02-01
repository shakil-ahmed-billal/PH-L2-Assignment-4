"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  Flame,
  Heart,
  Leaf,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  TrendingUp,
  Award,
  ChefHat,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import MealCard from "@/components/card/MealCard";
import ReviewCard from "@/components/card/ReviewCard";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  available: boolean;
  slug: string;
  calories: number;
  prepTime: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  ingredients: string[];
  providerId: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  provider: {
    id: string;
    name: string;
    image: string;
    rating: number;
    address: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

const MealDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedMeals, setRelatedMeals] = useState<Meal[]>([]);

  useEffect(() => {
    if (id) {
      fetchMealData();
    }
  }, [id]);

  useEffect(() => {
    if (meal) {
      const wishlist = localStorage.getItem("wishlist");
      if (wishlist) {
        const wishlistItems = JSON.parse(wishlist);
        setIsWishlisted(wishlistItems.includes(meal.id));
      }
    }
  }, [meal]);

  const fetchMealData = async () => {
    try {
      setIsLoading(true);

      // Fetch meal details
      const mealResult = await api.get(`/api/meals/${id}`);

      if (mealResult.success) {
        setMeal(mealResult.data as Meal);

        // Fetch reviews for this meal
        const reviewsResult = await api.get(`/api/meals/${id}/reviews`);
        if (reviewsResult.success) {
          setReviews(reviewsResult.data as Review[]);
        }

        // Fetch related meals from same provider
        const relatedResult = await api.get(
          `/api/meals/${id}/related`
        );
        if (relatedResult.success) {
          setRelatedMeals(relatedResult.data as Meal[]);
        }
      } else {
        toast.error("Meal not found");
        router.push("/meals");
      }
    } catch (error) {
      console.error("Error fetching meal data:", error);
      toast.error("Failed to load meal details");
      router.push("/meals");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!meal) return;
    
    try {
      addToCart(meal as any, quantity);
      toast.success(`Added ${quantity}x ${meal.name} to cart! 🛒`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  const handleToggleWishlist = () => {
    if (!meal) return;

    try {
      const wishlist = localStorage.getItem("wishlist");
      let wishlistItems: string[] = wishlist ? JSON.parse(wishlist) : [];

      if (isWishlisted) {
        wishlistItems = wishlistItems.filter((itemId) => itemId !== meal.id);
        toast.success("Removed from wishlist");
      } else {
        wishlistItems.push(meal.id);
        toast.success("Added to wishlist! ❤️");
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const incrementQuantity = () => {
    if (quantity < 99) setQuantity((q) => q + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 mx-auto">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Meal Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This meal doesn't exist or has been removed.
            </p>
            <Link href="/meals">
              <Button size="lg">Browse All Meals</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPrice = meal.price * quantity;
  const savings = meal.originalPrice ? (meal.originalPrice - meal.price) * quantity : 0;
  const discount = meal.originalPrice
    ? Math.round(((meal.originalPrice - meal.price) / meal.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container py-8 mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-2 hover:bg-muted/80 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Section */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-muted ring-1 ring-border">
                <Image
                  src={meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop"}
                  alt={meal.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  priority
                  quality={95}
                />
              </div>

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {meal.isPopular && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl backdrop-blur-sm border-0">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Popular Choice
                  </Badge>
                )}
                {discount > 0 && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl backdrop-blur-sm border-0">
                    <Award className="h-3 w-3 mr-1" />
                    {discount}% Off
                  </Badge>
                )}
              </div>

              {/* Property Badges */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                {meal.isVegetarian && (
                  <Badge
                    variant="secondary"
                    className="shadow-lg backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border-green-200 dark:border-green-800"
                  >
                    <Leaf className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300">Vegetarian</span>
                  </Badge>
                )}
                {meal.isSpicy && (
                  <Badge
                    variant="secondary"
                    className="shadow-lg backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border-red-200 dark:border-red-800"
                  >
                    <Flame className="h-3 w-3 mr-1 text-red-600 dark:text-red-400" />
                    <span className="text-red-700 dark:text-red-300">Spicy</span>
                  </Badge>
                )}
              </div>

              {/* Wishlist Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 h-12 w-12 rounded-full backdrop-blur-md shadow-xl transition-all duration-300 border-2 ${
                  isWishlisted
                    ? "bg-red-500 text-white border-red-500 hover:bg-red-600 scale-110"
                    : "bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 hover:scale-110"
                }`}
              >
                <Heart
                  className={`h-5 w-5 transition-all ${
                    isWishlisted ? "fill-current" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Provider Link */}
            {meal.provider && (
              <Link
                href={`/providers/${meal.provider.id}`}
                className="inline-flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all group"
              >
                <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-2 ring-border group-hover:ring-primary transition-all">
                  <Image
                    src={meal.provider.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop"}
                    alt={meal.provider.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {meal.provider.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{meal.provider.rating}</span>
                    {meal.provider.address && (
                      <>
                        <span>•</span>
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">{meal.provider.address}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            )}

            <Separator />

            {/* Title and Category */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                  {meal.name}
                </h1>
                {meal.category && (
                  <Badge variant="outline" className="text-lg px-4 py-1.5 whitespace-nowrap">
                    {meal.category.icon} {meal.category.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            {/* <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                <CardContent className="text-center">
                  <Star className="h-6 w-6 fill-amber-500 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {meal.provider?.rating || "4.5"}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
                <CardContent className=" text-center">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{meal.prepTime}</p>
                  <p className="text-xs text-muted-foreground">Prep Time</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
                <CardContent className="text-center">
                  <ChefHat className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{meal.calories}</p>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </CardContent>
              </Card>
            </div> */}

            {/* Description */}
            <div className="">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {meal.description || "Delicious meal prepared with fresh ingredients and care."}
                </p>
            </div>

            {/* Ingredients */}
            {meal.ingredients && meal.ingredients.length > 0 && (
              <div className="">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-xl">🥗</span>
                    Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.map((ingredient, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                      >
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
              </div>
            )}

            {/* Price & Add to Cart */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-xl">
              <CardContent className=" space-y-6">
                {/* Price Display */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Price</p>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        ${meal.price}
                      </span>
                      {meal.originalPrice && meal.originalPrice > meal.price && (
                        <div className="flex flex-col">
                          <span className="text-lg text-muted-foreground line-through">
                            ${meal.originalPrice}
                          </span>
                          <Badge className="bg-green-500 text-white text-xs">
                            Save ${savings}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3 bg-background rounded-xl p-2 shadow-inner">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10 rounded-lg hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center tabular-nums">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= 99}
                      className="h-10 w-10 rounded-lg hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group"
                  disabled={!meal.available}
                >
                  <ShoppingCart className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                  {meal.available ? (
                    <>Add to Cart — ${totalPrice}</>
                  ) : (
                    "Currently Unavailable"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <span className="text-4xl">⭐</span>
                Customer Reviews
              </h2>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}

        {/* Related Meals */}
        {relatedMeals && relatedMeals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <span className="text-4xl">🍽️</span>
                More from {meal.provider?.name}
              </h2>
              <Link href={`/providers/${meal.provider?.id}`}>
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedMeals.map((relatedMeal) => (
                <MealCard key={relatedMeal.id} meal={relatedMeal} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MealDetailsPage;