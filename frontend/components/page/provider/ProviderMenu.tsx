"use client"

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Star, Flame, Leaf, TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Meal } from "@/lib/mockData";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const ProviderMenu = () => {
  const [mealProvider, setProviderMeal] = useState<Meal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    calories: "",
    prepTime: "",
    isVegetarian: false,
    isSpicy: false,
    isPopular: false,
  });

  const { user } = useAuth();

  // Fetch provider meals
  useEffect(() => {
    if (user) {
      const GetProviderStats = async () => {
        try {
          setIsLoading(true);
          const result = await api.get(`/api/provider/stats/${user.id}`);
          
          console.log(result);
          if (result.success) {
            setProviderMeal(result.data as Meal[]);
          } else {
            toast.error("Failed to load menu items");
          }
        } catch (error) {
          console.error("Error fetching provider stats:", error);
          toast.error("An error occurred while loading menu items");
        } finally {
          setIsLoading(false);
        }
      };
      GetProviderStats();
    }
  }, [user]);

  const filteredItems = mealProvider.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      calories: "",
      prepTime: "",
      isVegetarian: false,
      isSpicy: false,
      isPopular: false,
    });
  };

  // Add new meal
  const handleAddMeal = async () => {
    if (!formData.name.trim() || !formData.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const newMealData = {
        name: formData.name,
        description: formData.description,
        image: formData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
        price: parseFloat(formData.price),
        calories: parseInt(formData.calories) || 0,
        prepTime: formData.prepTime || "15-20 min",
        isVegetarian: formData.isVegetarian,
        isSpicy: formData.isSpicy,
        isPopular: formData.isPopular,
        providerId: user?.id,
      };

      const result = await api.post(`/api/provider/meals`, newMealData);

      if (result.success) {
        setProviderMeal((prev) => [...prev, result.data as Meal]);
        resetForm();
        setIsAddDialogOpen(false);
        toast.success(`${formData.name} has been added to your menu.`);
      } else {
        toast.error("Failed to add meal");
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      toast.error("An error occurred while adding the meal");
    }
  };

  // Edit meal
  const handleEditMeal = async () => {
    if (!editingMeal || !formData.name.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const updatedMealData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
        calories: parseInt(formData.calories),
        prepTime: formData.prepTime,
        isVegetarian: formData.isVegetarian,
        isSpicy: formData.isSpicy,
        isPopular: formData.isPopular,
      };

      const result = await api.put(`/api/provider/meals/${editingMeal.id}`, updatedMealData);

      if (result.success) {
        setProviderMeal((prev) =>
          prev.map((meal) =>
            meal.id === editingMeal.id ? { ...meal, ...updatedMealData } : meal
          )
        );
        setEditingMeal(null);
        resetForm();
        toast.success("The meal has been updated successfully.");
      } else {
        toast.error("Failed to update meal");
      }
    } catch (error) {
      console.error("Error updating meal:", error);
      toast.error("An error occurred while updating the meal");
    }
  };

  // Delete meal
  const handleDeleteMeal = async (mealId: string) => {
    try {
      const result = await api.delete(`/api/provider/meals/${mealId}`);

      if (result.success) {
        setProviderMeal((prev) => prev.filter((meal) => meal.id !== mealId));
        toast.success("The meal has been removed from your menu.");
      } else {
        toast.error("Failed to delete meal");
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast.error("An error occurred while deleting the meal");
    }
  };

  const openEditDialog = (meal: Meal) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      description: meal.description,
      price: meal.price.toString(),
      image: meal.image,
      calories: meal.calories.toString(),
      prepTime: meal.prepTime,
      isVegetarian: meal.isVegetarian,
      isSpicy: meal.isSpicy,
      isPopular: meal.isPopular,
    });
  };

  const MealForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Meal Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Double Cheeseburger"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your meal..."
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="12.99"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="calories">Calories</Label>
          <Input
            id="calories"
            type="number"
            value={formData.calories}
            onChange={(e) => setFormData((prev) => ({ ...prev, calories: e.target.value }))}
            placeholder="500"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="prepTime">Prep Time</Label>
        <Input
          id="prepTime"
          value={formData.prepTime}
          onChange={(e) => setFormData((prev) => ({ ...prev, prepTime: e.target.value }))}
          placeholder="15-20 min"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="isVegetarian" className="cursor-pointer">Vegetarian</Label>
          <Switch
            id="isVegetarian"
            checked={formData.isVegetarian}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isVegetarian: checked }))
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="isSpicy" className="cursor-pointer">Spicy</Label>
          <Switch
            id="isSpicy"
            checked={formData.isSpicy}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isSpicy: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="isPopular" className="cursor-pointer">Mark as Popular</Label>
          <Switch
            id="isPopular"
            checked={formData.isPopular}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isPopular: checked }))
            }
          />
        </div>
      </div>
      <DialogFooter className="pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsAddDialogOpen(false);
            setEditingMeal(null);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </DialogFooter>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-12 w-12 animate-pulse text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Menu Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage your menu items.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Meal</DialogTitle>
            </DialogHeader>
            <MealForm onSubmit={handleAddMeal} submitLabel="Add Meal" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="h-5 w-5 text-primary" />
              <p className="text-2xl font-bold text-foreground">{mealProvider.length}</p>
            </div>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <p className="text-2xl font-bold text-emerald-600">
                {mealProvider.filter((m) => m.isPopular).length}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Popular Items</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((meal) => (
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
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(meal)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Meal</DialogTitle>
                    </DialogHeader>
                    <MealForm onSubmit={handleEditMeal} submitLabel="Save Changes" />
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="destructive" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Meal?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{meal.name}"? This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteMeal(meal.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground">{meal.name}</h3>
                <span className="font-bold text-primary">${meal.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {meal.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{meal.calories} cal</span>
                <span>{meal.prepTime}</span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {meal.rating || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg mb-2">No menu items found</p>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search query"
              : "Get started by adding your first meal"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProviderMenu;