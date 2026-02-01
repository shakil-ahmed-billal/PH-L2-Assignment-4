"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  mealCount: number;
  createdAt: Date;
}

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
  rating?: number;
  reviewCount?: number;
  category?: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  provider?: {
    id: string;
    name: string;
    image: string;
    rating: number;
  };
}

export function useData() {
  const [category, setCategory] = useState<Category[]>([]);
  const [meal, setMeal] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    try {
      setIsLoading(true);

      // Fetch categories
      const categoryResult = await api.get("/api/categories");
      if (categoryResult.success) {
        setCategory(categoryResult.data as Category[]);
      }

      // Fetch meals (get popular meals for homepage)
      const mealResult = await api.get("/api/meals?limit=20&sort=popular");
      if (mealResult.success) {
        // The API returns { meals, total, page, limit, totalPages }
        const mealsData = mealResult.data.meals || mealResult.data;
        setMeal(mealsData as Meal[]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMealById = async (id: string) => {
    try {
      if (!id) {
        return null;
      }
      const result = await api.get(`/api/meals/${id}`);
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching meal:", err);
      return null;
    }
  };

  const createNewOrder = async (data: {
    customerId: string;
    providerId: string;
    items: Array<{ mealId: string; quantity: number; price: number }>;
    totalPrice: number;
    deliveryAddress: string;
  }) => {
    if (!data) {
      return null;
    }

    try {
      const result = await api.post(`/api/order`, data);
      if (result.success) {
        return result;
      }
      return null;
    } catch (err) {
      console.error("Error creating order:", err);
      return null;
    }
  };

  const refreshData = () => {
    getAllData();
  };

  return {
    category,
    meal,
    isLoading,
    getMealById,
    createNewOrder,
    refreshData,
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}