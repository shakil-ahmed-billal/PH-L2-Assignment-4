"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, X, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import MealCard from "@/components/card/MealCard";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Category, Meal } from "@/types";

type SortOption = "popular" | "price-low" | "price-high" | "rating" | "newest";

const ITEMS_PER_PAGE = 12;

function MealsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalMeals, setTotalMeals] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category")!] : []
  );
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sort") as SortOption) || "popular");
  const [showVegetarian, setShowVegetarian] = useState(searchParams.get("vegetarian") === "true");
  const [showSpicy, setShowSpicy] = useState(searchParams.get("spicy") === "true");
  const [minPrice, setMinPrice] = useState<number>(parseFloat(searchParams.get("minPrice") || "0"));
  const [maxPrice, setMaxPrice] = useState<number>(parseFloat(searchParams.get("maxPrice") || "1000"));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch meals when filters change
  useEffect(() => {
    fetchMeals();
  }, [currentPage, searchQuery, selectedCategories, sortBy, showVegetarian, showSpicy, minPrice, maxPrice]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategories.length > 0) params.set("category", selectedCategories[0]);
    if (sortBy !== "popular") params.set("sort", sortBy);
    if (showVegetarian) params.set("vegetarian", "true");
    if (showSpicy) params.set("spicy", "true");
    if (minPrice > 0) params.set("minPrice", minPrice.toString());
    if (maxPrice < 1000) params.set("maxPrice", maxPrice.toString());
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = params.toString() ? `/meals?${params.toString()}` : "/meals";
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedCategories, sortBy, showVegetarian, showSpicy, minPrice, maxPrice, currentPage, router]);

  const fetchCategories = async () => {
    try {
      const result = await api.get<Category[]>("/api/cat/categorys");
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const fetchMeals = async () => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("limit", ITEMS_PER_PAGE.toString());
      
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(cat => params.append("categoryId", cat));
      }
      if (sortBy) params.set("sort", sortBy);
      if (showVegetarian) params.set("isVegetarian", "true");
      if (showSpicy) params.set("isSpicy", "true");
      if (minPrice > 0) params.set("minPrice", minPrice.toString());
      if (maxPrice < 1000) params.set("maxPrice", maxPrice.toString());

      const result = await api.get<{ meals: Meal[]; total: number }>(`/api/meals?${params.toString()}`);

      if (result.success && result.data) {
        setMeals(result.data.meals);
        setTotalMeals(result.data.total);
      } else {
        toast.error("Failed to load meals");
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast.error("Failed to load meals");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSortBy("popular");
    setShowVegetarian(false);
    setShowSpicy(false);
    setMinPrice(0);
    setMaxPrice(1000);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    showVegetarian ||
    showSpicy ||
    sortBy !== "popular" ||
    minPrice > 0 ||
    maxPrice < 1000;

  const activeFiltersCount =
    selectedCategories.length +
    (showVegetarian ? 1 : 0) +
    (showSpicy ? 1 : 0) +
    (sortBy !== "popular" ? 1 : 0) +
    (minPrice > 0 ? 1 : 0) +
    (maxPrice < 1000 ? 1 : 0);

  const totalPages = Math.ceil(totalMeals / ITEMS_PER_PAGE);

  const getCategoryMealCount = (categoryId: string): number => {
    const category = categories.find(c => c.id === categoryId);
    return category?.mealCount || 0;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-lg">🍽️</span>
          Categories
        </h3>
        <div className="space-y-2.5">
          {categories.length > 0 ? (
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
            <p className="text-sm text-muted-foreground">Loading categories...</p>
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
            onClick={() => {
              setShowVegetarian(!showVegetarian);
              setCurrentPage(1);
            }}
          >
            <Checkbox
              id="vegetarian"
              checked={showVegetarian}
              onCheckedChange={(checked) => {
                setShowVegetarian(checked === true);
                setCurrentPage(1);
              }}
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
            onClick={() => {
              setShowSpicy(!showSpicy);
              setCurrentPage(1);
            }}
          >
            <Checkbox
              id="spicy"
              checked={showSpicy}
              onCheckedChange={(checked) => {
                setShowSpicy(checked === true);
                setCurrentPage(1);
              }}
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

      {/* Price Range */}
      <div className="space-y-3 pt-4 border-t border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-lg">💰</span>
          Price Range
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="minPrice" className="text-xs text-muted-foreground mb-1 block">
                Min Price
              </Label>
              <Input
                id="minPrice"
                type="number"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(parseFloat(e.target.value) || 0);
                  setCurrentPage(1);
                }}
                className="h-9"
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground mb-1 block">
                Max Price
              </Label>
              <Input
                id="maxPrice"
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(parseFloat(e.target.value) || 1000);
                  setCurrentPage(1);
                }}
                className="h-9"
                min="0"
                step="0.5"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
          </p>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-1.5 bg-gradient-to-b from-primary to-accent rounded-full shadow-lg shadow-primary/20" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Browse Meals
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="font-semibold text-primary">{totalMeals}</span>{" "}
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-12 pr-4 h-12 bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value as SortOption);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px] h-12 bg-card border-border rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <span>🔥</span>
                    <span>Most Popular</span>
                  </div>
                </SelectItem>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <span>✨</span>
                    <span>Newest</span>
                  </div>
                </SelectItem>
                <SelectItem value="rating">
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <span>Highest Rated</span>
                  </div>
                </SelectItem>
                <SelectItem value="price-low">
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span>Price: Low to High</span>
                  </div>
                </SelectItem>
                <SelectItem value="price-high">
                  <div className="flex items-center gap-2">
                    <span>💎</span>
                    <span>Price: High to Low</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden h-12 relative border-border rounded-xl hover:bg-accent/50 transition-all duration-200"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="default" className="ml-2 h-5 min-w-5 px-1.5 bg-primary">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 sm:w-96 overflow-y-auto">
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
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              {selectedCategories.map((catId) => {
                const cat = categories.find((c) => c.id === catId);
                return cat ? (
                  <Badge
                    key={catId}
                    variant="secondary"
                    className="gap-1.5 pl-2.5 pr-1.5 py-1.5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 border border-transparent rounded-lg"
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
                  className="gap-1.5 pl-2.5 pr-1.5 py-1.5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
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
                  className="gap-1.5 pl-2.5 pr-1.5 py-1.5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
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
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-2xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : meals.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {meals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-lg"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        // Show first, last, current, and adjacent pages
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="w-10 rounded-lg"
                            >
                              {page}
                            </Button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="px-2">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-lg"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No meals found</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  We couldn't find any meals matching your criteria. Try adjusting your filters.
                </p>
                <Button onClick={clearFilters} size="lg" className="rounded-xl">
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

export default function MealsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      </div>
    }>
      <MealsPageContent />
    </Suspense>
  );
}