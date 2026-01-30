"use client";

import { useState, useMemo } from "react";
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
import { categories , Meal, meals, searchMeals } from "@/lib/mockData";
import MealCard from "@/components/card/MealCard";

type SortOption = "popular" | "price-low" | "price-high" | "rating";

export default function MealsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showVegetarian, setShowVegetarian] = useState(false);
  const [showSpicy, setShowSpicy] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredMeals = useMemo(() => {
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
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
      default:
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return result;
  }, [
    searchQuery,
    selectedCategories,
    sortBy,
    showVegetarian,
    showSpicy,
    priceRange,
  ]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSortBy("popular");
    setShowVegetarian(false);
    setShowSpicy(false);
    setPriceRange([0, 50]);
    router.push("/meals");
  };

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

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-lg">🍽️</span>
          Categories
        </h3>
        <div className="space-y-2.5">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => toggleCategory(category.id)}
            >
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="flex items-center gap-2 cursor-pointer flex-1"
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium text-sm group-hover:text-primary transition-colors">
                  {category.name}
                </span>
                <Badge
                  variant="secondary"
                  className="ml-auto text-xs font-normal"
                >
                  {category.mealCount}
                </Badge>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Dietary Preferences */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-lg">🥗</span>
          Dietary Preferences
        </h3>
        <div className="space-y-2.5">
          <div
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
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
              className="cursor-pointer flex items-center gap-2 flex-1"
            >
              <span className="text-xl">🌱</span>
              <span className="font-medium text-sm group-hover:text-primary transition-colors">
                Vegetarian
              </span>
            </Label>
          </div>
          <div
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
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
              className="cursor-pointer flex items-center gap-2 flex-1"
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
            className="w-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-1 bg-primary rounded-full" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Browse Meals
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
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
                className="pl-12 pr-4 h-12 bg-background border-border focus:border-primary transition-colors"
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
              <SelectTrigger className="w-full sm:w-[200px] h-12 bg-background border-border">
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
                  className="lg:hidden h-12 relative border-border"
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
                <FilterContent />
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
                const cat = categories.find((c) => c.id === catId);
                return cat ? (
                  <Badge
                    key={catId}
                    variant="secondary"
                    className="gap-1.5 pl-2 pr-1 py-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => toggleCategory(catId)}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ) : null;
              })}
              {showVegetarian && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 pl-2 pr-1 py-1 cursor-pointer hover:bg-secondary/80 transition-colors"
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
                  className="gap-1.5 pl-2 pr-1 py-1 cursor-pointer hover:bg-secondary/80 transition-colors"
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
            <div className="sticky top-24 bg-card rounded-2xl p-6 shadow-lg border border-border/50">
              <h2 className="font-bold text-lg text-foreground mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="ml-auto bg-primary">
                    {activeFiltersCount}
                  </Badge>
                )}
              </h2>
              <FilterContent />
            </div>
          </aside>

          {/* Meals Grid */}
          <div className="flex-1 min-w-0">
            {filteredMeals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMeals.map((meal, index) => (
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
                  className="bg-primary hover:bg-primary/90"
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