"use client"

import { useEffect, useState } from "react";
import { Search, Star, Flame, Leaf, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Meal {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  category: string;
  categoryId: string;
  providerId: string;
  providerName: string;
  rating: number;
  reviewCount: number;
  calories: number;
  prepTime: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  available: boolean;
  ingredients: string[];
  createdAt: string;
}

const AdminMeals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setIsLoading(true);
      const result = await api.get("/api/admin/meals");
      
      if (result.success) {
        setMeals(result.data as any);
      } else {
        toast.error("Failed to load meals");
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast.error("An error occurred while loading meals");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meal.providerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: meals.length,
    available: meals.filter((m) => m.available).length,
    popular: meals.filter((m) => m.isPopular).length,
    vegetarian: meals.filter((m) => m.isVegetarian).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 animate-pulse text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Meal Management</h1>
        <p className="text-muted-foreground">View all meals across the platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Meals</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.available}</p>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.popular}</p>
            <p className="text-sm text-muted-foreground">Popular</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.vegetarian}</p>
            <p className="text-sm text-muted-foreground">Vegetarian</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by meal name, category, or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMeals.map((meal) => (
          <Card key={meal.id} className="overflow-hidden group hover:shadow-lg transition-shadow pt-0">
            <div className="relative aspect-video">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {meal.isPopular && (
                  <Badge className="bg-amber-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
                {meal.isSpicy && (
                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                    <Flame className="h-3 w-3 mr-1" />
                    Spicy
                  </Badge>
                )}
                {meal.isVegetarian && (
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    <Leaf className="h-3 w-3 mr-1" />
                    Veg
                  </Badge>
                )}
              </div>
              {!meal.available && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge variant="destructive">Unavailable</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground line-clamp-1">{meal.name}</h3>
                <span className="font-bold text-primary">${meal.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {meal.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{meal.category}</Badge>
                  <Badge variant="outline" className="text-xs">{meal.providerName}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{meal.calories} cal</span>
                  <span>{meal.prepTime}</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {meal.rating} ({meal.reviewCount})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeals.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No meals found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminMeals;