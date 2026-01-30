"use client"

import { ArrowRight, Clock, Star, Truck, ShieldCheck, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import MealCard from "@/components/card/MealCard";
import { categories, providers, getPopularMeals, reviews } from "@/lib/mockData";
import ProviderCard from "@/provider/ProviderCard";
import CategoryCard from "@/components/card/CategoryCard";
import Link from "next/link";
import { useData } from "@/hooks/useData";


const HomePage = () => {
  const popularMeals = getPopularMeals().slice(0, 8);
  const featuredProviders = providers.slice(0, 3);
  const featuredReviews = reviews.slice(0, 3);

  const {category} = useData() ;
  console.log(category)

  return (
    <div className=" my-8 md:my-12 lg:my-16 space-y-20 ">
       {/* Hero Section */}
      <section className="relative overflow-hidden gradient-warm">
        <div className="container py-16 md:py-24 lg:py-32 mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="animate-pulse-slow">🔥</span>
                <span>Fastest delivery in town</span>
              </div>
              
              <h1 className="heading-display text-foreground">
                Delicious Food,
                <span className="block text-primary">Delivered Fast</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Discover amazing meals from the best local restaurants. 
                Fresh ingredients, expert chefs, and lightning-fast delivery right to your door.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/meals">
                  <Button variant="hero" size="xl" className="group ">
                    Order Now
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/providers">
                  <Button variant="outline" size="xl">
                    View Restaurants
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-background overflow-hidden"
                      >
                        <img
                          src={`https://images.unsplash.com/photo-${
                            ["1494790108377-be9c29b29330", "1507003211169-0a1dd7228f2d", "1438761681033-6461ffad8d80", "1500648767791-00dcc994a43e"][i - 1]
                          }?w=100&h=100&fit=crop`}
                          alt="Customer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">50k+</span>
                    <span className="text-muted-foreground"> happy customers</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block -z-100">
              <div className="relative -z-10 animate-float">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop"
                  alt="Delicious burger"
                  className="w-full max-w-md mx-auto rounded-3xl shadow-elevated"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-10 -left-4 bg-card rounded-2xl p-4 shadow-elevated animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery in</p>
                    <p className="font-bold text-foreground">15-30 min</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 -right-4 bg-card rounded-2xl p-4 shadow-elevated animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Star className="h-6 w-6 text-accent fill-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-bold text-foreground">4.9/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-section text-foreground mb-2">Browse by Category</h2>
              <p className="text-muted-foreground">Explore your favorite cuisines</p>
            </div>
            <Link href="/meals">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Meals Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-section text-foreground mb-2">Popular Right Now</h2>
              <p className="text-muted-foreground">Most ordered meals this week</p>
            </div>
            <Link href="/meals">
              <Button variant="ghost" className="group">
                View All Meals
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularMeals.map((meal, index) => (
              <MealCard
                key={meal.id}
                meal={meal}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Order your favorite meals in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ChefHat,
                title: "Browse Meals",
                description: "Explore hundreds of delicious options from top-rated local restaurants.",
                step: "01",
              },
              {
                icon: ShieldCheck,
                title: "Place Your Order",
                description: "Add items to cart, customize your meal, and checkout securely.",
                step: "02",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Track your order in real-time and get it delivered fresh to your door.",
                step: "03",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="relative text-center p-8 rounded-2xl bg-card shadow-soft hover:shadow-elevated transition-shadow group"
              >
                <span className="absolute top-4 right-4 text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {item.step}
                </span>
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-section text-foreground mb-2">Featured Restaurants</h2>
              <p className="text-muted-foreground">Top-rated establishments near you</p>
            </div>
            <Link href="/providers">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-3">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who love ordering with FoodHub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? "fill-accent text-accent"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {review.comment}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{review.userName}</p>
                    <p className="text-sm text-muted-foreground">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-12 lg:p-16 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
                Ready to Order?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
                Download our app or order online. Get exclusive deals and track your delivery in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/meals">
                  <Button size="xl" className="bg-background text-primary hover:bg-background/90">
                    Browse Meals
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    size="xl"
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-background/10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-background/10" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
