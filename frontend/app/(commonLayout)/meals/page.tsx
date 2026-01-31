"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import MealCard from "@/components/card/MealCard";
import { useData } from "@/hooks/useData";

type SortOption = "popular" | "price-low" | "price-high" | "rating";

// Prisma schema types
interface Meal {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number;
  image: string | null;
  available: boolean;
  slug: string;
  calories: number | null;
  prepTime: string | null;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  ingredients: string[];
  providerId: string;
  categoryId: string;
  createdAt: Date;
  rating?: number; // Optional if you calculate it from reviews
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  mealCount: number;
  createdAt: Date;
}

// FilterContent component - render er baire declare korchi
const FilterContent = ({
  categories,
  selectedCategories,
  toggleCategory,
  getCategoryMealCount,
  showVegetarian,
  setShowVegetarian,
  showSpicy,
  setShowSpicy,
  hasActiveFilters,
  clearFilters,
}: {
  categories: Category[];
  selectedCategories: string[];
  toggleCategory: (categoryId: string) => void;
  getCategoryMealCount: (categoryId: string) => number;
  showVegetarian: boolean;
  setShowVegetarian: (value: boolean) => void;
  showSpicy: boolean;
  setShowSpicy: (value: boolean) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}) => (
  <div className="space-y-6">
    {/* Categories */}
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <span className="text-lg">🍽️</span>
        Categories
      </h3>
      <div className="space-y-2.5">
        {categories && categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/30 transition-all duration-200 cursor-pointer group border border-transparent hover:border-primary/20"
              onClick={() => toggleCategory(cat.id)}
            >
              <Checkbox
                id={`category-${cat.id}`}
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`category-${cat.id}`}
                className="flex items-center gap-2.5 cursor-pointer flex-1"
              >
                <span className="text-xl">{cat.icon || "🍴"}</span>
                <span className="font-medium text-sm group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
                <Badge
                  variant="secondary"
                  className="ml-auto text-xs font-normal bg-accent/50"
                >
                  {getCategoryMealCount(cat.id)}
                </Badge>
              </Label>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No categories available</p>
        )}
      </div>
    </div>

    {/* Dietary Preferences */}
    <div className="space-y-3 pt-4 border-t border-border/50">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <span className="text-lg">🥗</span>
        Dietary Preferences
      </h3>
      <div className="space-y-2.5">
        <div
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/30 transition-all duration-200 cursor-pointer group border border-transparent hover:border-primary/20"
          onClick={() => setShowVegetarian(!showVegetarian)}
        >
          <Checkbox
            id="vegetarian"
            checked={showVegetarian}
            onCheckedChange={(checked) => setShowVegetarian(checked === true)}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor="vegetarian"
            className="cursor-pointer flex items-center gap-2.5 flex-1"
          >
            <span className="text-xl">🌱</span>
            <span className="font-medium text-sm group-hover:text-primary transition-colors">
              Vegetarian
            </span>
          </Label>
        </div>
        <div
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/30 transition-all duration-200 cursor-pointer group border border-transparent hover:border-primary/20"
          onClick={() => setShowSpicy(!showSpicy)}
        >
          <Checkbox
            id="spicy"
            checked={showSpicy}
            onCheckedChange={(checked) => setShowSpicy(checked === true)}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor="spicy"
            className="cursor-pointer flex items-center gap-2.5 flex-1"
          >
            <span className="text-xl">🌶️</span>
            <span className="font-medium text-sm group-hover:text-primary transition-colors">
              Spicy
            </span>
          </Label>
        </div>
      </div>
    </div>

    {/* Clear Filters */}
    {hasActiveFilters && (
      <div className="pt-4">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      </div>
    )}
  </div>
);

export default function MealsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // Backend data theke data newa - type assertion kore nilam
  const { category: categories = [], meal: meals = [] } = useData()as{
    category: Category[];
    meal: Meal[];
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showVegetarian, setShowVegetarian] = useState(false);
  const [showSpicy, setShowSpicy] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Search function - useCallback use kore memoize korchi
  const searchMeals = useCallback(
    (query: string): Meal[] => {
      const lowerQuery = query.toLowerCase();
      return meals.filter(
        (meal) =>
          meal.name?.toLowerCase().includes(lowerQuery) ||
          meal.description?.toLowerCase().includes(lowerQuery) ||
          meal.slug?.toLowerCase().includes(lowerQuery)
      );
    },
    [meals]
  );

  const filteredMeals = useMemo(() => {
    if (!meals || meals.length === 0) return [];

    let result: Meal[] = searchQuery ? searchMeals(searchQuery) : [...meals];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((meal) =>
        selectedCategories.includes(meal.categoryId)
      );
    }

    // Vegetarian filter
    if (showVegetarian) {
      result = result.filter((meal) => meal.isVegetarian);
    }

    // Spicy filter
    if (showSpicy) {
      result = result.filter((meal) => meal.isSpicy);
    }

    // Price range filter
    result = result.filter(
      (meal) => meal.price >= priceRange[0] && meal.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
      default:
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return result;
  }, [
    meals,
    searchQuery,
    selectedCategories,
    sortBy,
    showVegetarian,
    showSpicy,
    priceRange,
    searchMeals,
  ]);

  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSortBy("popular");
    setShowVegetarian(false);
    setShowSpicy(false);
    setPriceRange([0, 50]);
    router.push("/meals");
  }, [router]);

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    showVegetarian ||
    showSpicy ||
    sortBy !== "popular";

  const activeFiltersCount =
    selectedCategories.length +
    (showVegetarian ? 1 : 0) +
    (showSpicy ? 1 : 0) +
    (sortBy !== "popular" ? 1 : 0);

  // Category er meal count calculate kora
  const getCategoryMealCount = useCallback(
    (categoryId: string): number => {
      return meals?.filter((meal) => meal.categoryId === categoryId).length || 0;
    },
    [meals]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-1.5 bg-gradient-to-b from-primary to-accent rounded-full shadow-lg shadow-primary/20" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Browse Meals
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="font-semibold text-primary">
                  {filteredMeals.length}
                </span>{" "}
                delicious options available
              </p>
            </div>
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search meals, restaurants, cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-full sm:w-[200px] h-12 bg-card border-border rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <span>Most Popular</span>
                  </div>
                </SelectItem>
                <SelectItem value="rating">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <span>Highest Rated</span>
                  </div>
                </SelectItem>
                <SelectItem value="price-low">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <span>Price: Low to High</span>
                  </div>
                </SelectItem>
                <SelectItem value="price-high">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💎</span>
                    <span>Price: High to Low</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet
              open={mobileFiltersOpen}
              onOpenChange={setMobileFiltersOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden h-12 relative border-border rounded-xl hover:bg-accent/50 transition-all duration-200"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="default"
                      className="ml-2 h-5 min-w-5 px-1.5 bg-primary"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 sm:w-96">
                <SheetHeader className="mb-6">
                  <SheetTitle className="flex items-center gap-2 text-xl">
                    <Filter className="h-5 w-5 text-primary" />
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <FilterContent
                  categories={categories}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  getCategoryMealCount={getCategoryMealCount}
                  showVegetarian={showVegetarian}
                  setShowVegetarian={setShowVegetarian}
                  showSpicy={showSpicy}
                  setShowSpicy={setShowSpicy}
                  hasActiveFilters={hasActiveFilters}
                  clearFilters={clearFilters}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Active filters:
              </span>
              {selectedCategories.map((catId) => {
                const cat = categories?.find((c) => c.id === catId);
                return cat ? (
                  <Badge
                    key={catId}
                    variant="secondary"
                    className="gap-1.5 pl-2.5 pr-1.5 py-1.5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 border border-transparent rounded-lg"
                    onClick={() => toggleCategory(catId)}
                  >
                    <span>{cat.icon || "🍴"}</span>
                    <span>{cat.name}</span>
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ) : null;
              })}
              {showVegetarian && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 pl-2.5 pr-1.5 py-1.5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 border border-transparent rounded-lg"
                  onClick={() => setShowVegetarian(false)}
                >
                  <span>🌱</span>
                  <span>Vegetarian</span>
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {showSpicy && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 pl-2.5 pr-1.5 py-1.5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 border border-transparent rounded-lg"
                  onClick={() => setShowSpicy(false)}
                >
                  <span>🌶️</span>
                  <span>Spicy</span>
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl p-6 shadow-lg border border-border/50 backdrop-blur-sm">
              <h2 className="font-bold text-lg text-foreground mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="ml-auto bg-primary">
                    {activeFiltersCount}
                  </Badge>
                )}
              </h2>
              <FilterContent
                categories={categories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                getCategoryMealCount={getCategoryMealCount}
                showVegetarian={showVegetarian}
                setShowVegetarian={setShowVegetarian}
                showSpicy={showSpicy}
                setShowSpicy={setShowSpicy}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Meals Grid */}
          <div className="flex-1 min-w-0">
            {filteredMeals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMeals.map((mealDetails, index) => (
                  <div
                    key={mealDetails.id}
                    className="animate-fade-in"
                    style={
                      {
                        animationDelay: `${index * 0.05}s`,
                        animationFillMode: "both",
                      } as React.CSSProperties
                    }
                  >
                    <MealCard meal={mealDetails} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="relative mb-6">
                  <div className="text-8xl opacity-20">🍽️</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  No meals found
                </h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  We couldn&apos;t find any meals matching your criteria. Try
                  adjusting your filters or search query.
                </p>
                <Button
                  onClick={clearFilters}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 rounded-xl transition-all duration-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}