"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { api } from "@/lib/api";
import { categories } from "@/lib/mockData";
import { Check, Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface MealFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  calories: number;
  prepTime: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  ingredients: string[];
}

const MenuCreateForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const { user } = useAuth();

  const [formData, setFormData] = useState<MealFormData>({
    name: "",
    slug: "",
    description: "",
    image: "",
    price: 0,
    originalPrice: undefined,
    categoryId: "",
    calories: 0,
    prepTime: "",
    isVegetarian: false,
    isSpicy: false,
    isPopular: false,
    ingredients: [],
  });

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Auto-generate slug when name changes
      ...(name === "name" ? { slug: generateSlug(value) } : {}),
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : parseFloat(value),
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle image URL change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, image: value }));
    setImagePreview(value);
  };

  // Add ingredient
  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()],
      }));
      setCurrentIngredient("");
    }
  };

  // Remove ingredient
  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.name || !formData.description || !formData.categoryId) {
        toast("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }

      if (formData.price <= 0) {
        toast("Price must be greater than 0.");
        setIsLoading(false);
        return;
      }

      if (!user) {
        toast.error("Please sign in to add a meal.");
        setIsLoading(false);
        return;
      }

      // Get category and provider names
      const category = categories.find((c) => c.id === formData.categoryId);
      const provider = user.providerId ?? user.id;

      // Prepare data for API
      const mealData = {
        ...formData,
        providerId: provider,
      };

      // Submit to API

      const response = await api.post(`/api/meals` , mealData)
      console.log(response);

        if (response.data) {
          toast('Meal has been created successfully.');

          // Reset form
          setFormData({
            name: '',
            slug: '',
            description: '',
            image: '',
            price: 0,
            originalPrice: undefined,
            categoryId: '',
            calories: 0,
            prepTime: '',
            isVegetarian: false,
            isSpicy: false,
            isPopular: false,
            ingredients: [],
          });
          setImagePreview('');

          // Redirect to menu page or stay on form
          // router.push('/provider/menu');

        }
    } catch (error: any) {
      console.error("Error creating meal:", error);
      toast("Failed to create meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create New Meal
        </h1>
        <p className="text-muted-foreground">Add a new meal to your menu</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of your meal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Meal Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Classic Smash Burger"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug{" "}
                <span className="text-muted-foreground text-sm">
                  (Auto-generated)
                </span>
              </Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="classic-smash-burger"
                className="font-mono text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your meal in detail..."
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length} characters
              </p>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
              {imagePreview && (
                <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview("")}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category & Provider */}
        <Card>
          <CardHeader>
            <CardTitle>Category & Provider</CardTitle>
            <CardDescription>
              Select the category and restaurant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="categoryId">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  handleSelectChange("categoryId", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Provider */}
            {/* <div className="space-y-2">
              <Label htmlFor="providerId">
                Restaurant <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.providerId}
                onValueChange={(value) => handleSelectChange('providerId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex items-center gap-2">
                        <img
                          src={provider.image}
                          alt={provider.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{provider.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Set the price for your meal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ""}
                  onChange={handleNumberChange}
                  placeholder="12.99"
                  required
                />
              </div>

              {/* Original Price */}
              <div className="space-y-2">
                <Label htmlFor="originalPrice">
                  Original Price ($){" "}
                  <span className="text-muted-foreground text-sm">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice || ""}
                  onChange={handleNumberChange}
                  placeholder="15.99"
                />
              </div>
            </div>

            {formData.originalPrice &&
              formData.originalPrice > formData.price && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <Check className="inline-block h-4 w-4 mr-1" />
                    Discount: $
                    {(formData.originalPrice - formData.price).toFixed(2)} (
                    {Math.round(
                      ((formData.originalPrice - formData.price) /
                        formData.originalPrice) *
                        100,
                    )}
                    % off)
                  </p>
                </div>
              )}
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>
              Additional information about the meal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Calories */}
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  min="0"
                  value={formData.calories || ""}
                  onChange={handleNumberChange}
                  placeholder="750"
                />
              </div>

              {/* Prep Time */}
              <div className="space-y-2">
                <Label htmlFor="prepTime">Preparation Time</Label>
                <Input
                  id="prepTime"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  placeholder="12-15 min"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
            <CardDescription>Add ingredients for this meal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Ingredient */}
            <div className="flex gap-2">
              <Input
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                placeholder="e.g., Beef Patty"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIngredient();
                  }
                }}
              />
              <Button type="button" onClick={addIngredient} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Ingredients List */}
            {formData.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.ingredients.map((ingredient, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-3 pr-1 py-1.5"
                  >
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="ml-2 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
            <CardDescription>Set meal properties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vegetarian */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isVegetarian">Vegetarian</Label>
                <p className="text-sm text-muted-foreground">
                  This meal is vegetarian-friendly
                </p>
              </div>
              <Switch
                id="isVegetarian"
                checked={formData.isVegetarian}
                onCheckedChange={(checked) =>
                  handleSwitchChange("isVegetarian", checked)
                }
              />
            </div>

            {/* Spicy */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isSpicy">Spicy</Label>
                <p className="text-sm text-muted-foreground">
                  This meal contains spicy ingredients
                </p>
              </div>
              <Switch
                id="isSpicy"
                checked={formData.isSpicy}
                onCheckedChange={(checked) =>
                  handleSwitchChange("isSpicy", checked)
                }
              />
            </div>

            {/* Popular */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isPopular">Popular</Label>
                <p className="text-sm text-muted-foreground">
                  Mark this as a popular meal
                </p>
              </div>
              <Switch
                id="isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) =>
                  handleSwitchChange("isPopular", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-32">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Meal
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MenuCreateForm;
