"use client";

import { useState, useEffect } from "react";
import MealCard from "@/components/card/MealCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Meal } from "@/types";



const PopularMealSection = () => {
  const [popularMeals, setPopularMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPopularMeals();
  }, []);

  const fetchPopularMeals = async () => {
    try {
      setIsLoading(true);
      
      // Fetch popular meals from API
      const result = await api.get("/api/meals?limit=8&sort=popular&isPopular=true");
      
      if (result.success) {
        const mealsData = result.data.meals || result.data;
        setPopularMeals(mealsData as Meal[]);
      }
    } catch (error) {
      console.error("Error fetching popular meals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if no meals and not loading
  if (!isLoading && popularMeals.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Popular Right Now
            </h2>
            <p className="text-muted-foreground">Most ordered meals this week</p>
          </div>
          <Link href="/meals">
            <Button variant="ghost" className="group hidden sm:flex">
              View All Meals
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Meals Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularMeals.map((meal, index) => (
              <div
                key={meal.id}
                className="animate-fade-in"
                style={
                  {
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: "both",
                  } as React.CSSProperties
                }
              >
                <MealCard meal={meal} />
              </div>
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        {!isLoading && popularMeals.length > 0 && (
          <div className="mt-8 text-center sm:hidden">
            <Link href="/meals">
              <Button variant="outline" className="w-full max-w-xs group">
                View All Meals
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularMealSection;