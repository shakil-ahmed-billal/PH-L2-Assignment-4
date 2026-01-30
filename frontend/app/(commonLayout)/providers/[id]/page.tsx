"use client";


import { ArrowLeft, Star, Clock, MapPin, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getProviderById, getMealsByProvider, reviews } from "@/lib/mockData";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MealCard from "@/components/card/MealCard";

const ProviderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const provider = getProviderById(id || "");
  const providerMeals = provider ? getMealsByProvider(provider.id) : [];

  if (!provider) {
    return (

        <div className="container py-16 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Restaurant Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The restaurant you're looking for doesn't exist.
          </p>
          <Link href="/providers">
            <Button>Browse All Restaurants</Button>
          </Link>
        </div>
    
    );
  }

  return (
   <div className=" container px-4 mx-auto">
    {/* Cover Image */}
      <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
        <img
          src={provider.coverImage}
          alt={provider.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        
        {/* Back Button */}
        <Link href="/providers">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 bg-background/50 backdrop-blur-sm hover:bg-background/70"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="container">
        {/* Provider Info */}
        <div className="relative -mt-16 mb-8">
          <div className="bg-card rounded-2xl p-6 shadow-elevated">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="h-24 w-24 rounded-2xl border-4 border-card overflow-hidden shadow-soft flex-shrink-0 -mt-16 md:-mt-20">
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                        {provider.name}
                      </h1>
                      <Badge variant={provider.isOpen ? "default" : "secondary"}>
                        {provider.isOpen ? "Open Now" : "Closed"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {provider.cuisine.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-muted text-muted-foreground text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:ml-auto flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-accent text-accent" />
                        <span className="text-xl font-bold">{provider.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {provider.reviewCount} reviews
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">
                  {provider.description}
                </p>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{provider.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>Min. order: ${provider.minOrder}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>Delivery: ${provider.deliveryFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="menu" className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="menu">Menu ({providerMeals.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            {providerMeals.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {providerMeals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No meals available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.slice(0, 4).map((review) => (
                <div key={review.id} className="bg-card rounded-xl p-5 shadow-soft">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground">
                          {review.userName}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-accent text-accent"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info">
            <div className="bg-card rounded-2xl p-6 shadow-soft max-w-lg">
              <h3 className="font-semibold text-foreground mb-4">
                Restaurant Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="text-muted-foreground">{provider.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Delivery Time</p>
                    <p className="text-muted-foreground">{provider.deliveryTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground">+1 (234) 567-890</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Website</p>
                    <p className="text-primary">www.{provider.slug}.com</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
   </div>
  );
};

export default ProviderDetailsPage;
