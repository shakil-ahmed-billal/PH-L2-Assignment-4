"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Phone,
  Globe,
  DollarSign,
  Users,
  Loader2,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import MealCard from "@/components/card/MealCard";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Meal, Restaurant, Review } from "@/types";



const ProviderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu");

  useEffect(() => {
    if (id) {
      fetchRestaurantData();
    }
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setIsLoading(true);

      // Fetch restaurant details
      const restaurantResult = await api.get(`/api/restaurant/${id}`);

      if (restaurantResult.success) {
        setRestaurant(restaurantResult.data as Restaurant);

        // Fetch meals for this restaurant
        const mealsResult = await api.get(`/api/restaurant/${id}/meals`);
        if (mealsResult.success) {
          setMeals(mealsResult.data as Meal[]);
        }

        // Fetch reviews for this restaurant
        const reviewsResult = await api.get(`/api/restaurant/${id}/reviews`);
        if (reviewsResult.success) {
          setReviews(reviewsResult.data as Review[]);
        }
      } else {
        toast.error("Restaurant not found");
        router.push("/providers");
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      toast.error("Failed to load restaurant details");
      router.push("/providers");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Cover Skeleton */}
        <Skeleton className="w-full h-48 md:h-64 lg:h-80" />

        <div className="container px-4 mx-auto">
          {/* Info Card Skeleton */}
          <div className="relative -mt-16 mb-8">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="h-24 w-24 rounded-2xl" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-full max-w-2xl" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container py-16 text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Restaurant Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The restaurant you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/providers">
          <Button size="lg">Browse All Restaurants</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
        <img
          src={restaurant.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />

        {/* Back Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-md hover:bg-background shadow-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Status Badge */}
        <Badge
          variant={restaurant.isOpen ? "default" : "secondary"}
          className="absolute top-4 right-4 shadow-lg text-sm px-4 py-1.5"
        >
          <div className={`h-2 w-2 rounded-full mr-2 ${restaurant.isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          {restaurant.isOpen ? "Open Now" : "Closed"}
        </Badge>
      </div>

      <div className="container px-4 mx-auto">
        {/* Restaurant Info Card */}
        <div className="relative -mt-20 mb-8">
          <Card className="shadow-2xl border-2">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Restaurant Avatar */}
                <div className="relative group">
                  <div className="h-28 w-28 rounded-2xl border-4 border-background overflow-hidden shadow-xl ring-4 ring-primary/10">
                    <img
                      src={restaurant.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop"}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {restaurant.isOpen && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      OPEN
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        {restaurant.name}
                      </h1>

                      {/* Cuisine Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {restaurant.cuisine.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
                          <span className="text-2xl font-bold text-foreground">{restaurant.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {restaurant.reviewCount} reviews
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {restaurant.description || "Delicious food prepared with love and care."}
                  </p>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery</p>
                        <p className="font-semibold text-foreground">{restaurant.deliveryTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600 dark:text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Min. Order</p>
                        <p className="font-semibold text-foreground">${restaurant.minOrder}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery Fee</p>
                        <p className="font-semibold text-foreground">${restaurant.deliveryFee.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-semibold text-foreground truncate">{restaurant.address?.split(',')[0] || 'City'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="menu" className="gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Menu ({meals.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="h-4 w-4" />
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="info" className="gap-2">
              <MapPin className="h-4 w-4" />
              Info
            </TabsTrigger>
          </TabsList>

          {/* Menu Tab */}
          <TabsContent value="menu">
            {meals.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No meals available</h3>
                  <p className="text-muted-foreground">This restaurant hasn't added any meals yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            {reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={review.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId}`}
                          alt={review.user.name}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">{review.user.name}</h4>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-amber-500 text-amber-500" : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">Be the first to review this restaurant!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info">
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Address</p>
                      <p className="text-muted-foreground">{restaurant.address || "Address not available"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-green-600 dark:text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Delivery Time</p>
                      <p className="text-muted-foreground">{restaurant.deliveryTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Phone</p>
                      <p className="text-muted-foreground">{restaurant.phone || "+1 (234) 567-890"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Website</p>
                      <p className="text-primary hover:underline cursor-pointer">
                        www.{restaurant.slug || "restaurant"}.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderDetailsPage;