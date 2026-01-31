"use client"

import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

import { categories, Category } from "@/lib/mockData";
import { toast } from "sonner";


const AdminCategories = () => {
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    image: "",
  });

  const filteredCategories = categoryList.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = () => {
    if (!formData.name.trim()) {
      toast("Please enter a category name.");
      return;
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      icon: formData.icon || "🍽️",
      image: formData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      mealCount: 0,
    };

    setCategoryList((prev) => [...prev, newCategory]);
    setFormData({ name: "", icon: "", image: "" });
    setIsAddDialogOpen(false);
    toast(`${newCategory.name} has been added successfully.`);
  };

  const handleEditCategory = () => {
    if (!editingCategory || !formData.name.trim()) return;

    setCategoryList((prev) =>
      prev.map((cat) =>
        cat.id === editingCategory.id
          ? {
              ...cat,
              name: formData.name,
              slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
              icon: formData.icon || cat.icon,
              image: formData.image || cat.image,
            }
          : cat
      )
    );

    setEditingCategory(null);
    setFormData({ name: "", icon: "", image: "" });
    toast("The category has been updated successfully.");
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryList((prev) => prev.filter((cat) => cat.id !== categoryId));
    toast("The category has been removed.");
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      image: category.image,
    });
  };

  return (
    <div className="container py-8 mx-auto">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Category Management</h1>
        <p className="text-muted-foreground">Manage food categories on the platform.</p>
      </div>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Indian"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="e.g., 🍛"
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    {/* Search */}
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>

    {/* Categories Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredCategories.map((category) => (
        <Card key={category.id} className="overflow-hidden group">
          <div className="relative aspect-video">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="text-3xl">{category.icon}</span>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Category Name</Label>
                      <Input
                        id="edit-name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-icon">Icon (Emoji)</Label>
                      <Input
                        id="edit-icon"
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, icon: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-image">Image URL</Label>
                      <Input
                        id="edit-image"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, image: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingCategory(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleEditCategory}>Save Changes</Button>
                  </DialogFooter>
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
                    <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{category.name}"? This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
            <Badge variant="outline">{category.mealCount} meals</Badge>
          </CardContent>
        </Card>
      ))}
    </div>

    {filteredCategories.length === 0 && (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No categories found.</p>
      </div>
    )}
  </div>
  );
};

export default AdminCategories;
