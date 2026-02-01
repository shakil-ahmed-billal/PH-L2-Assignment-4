"use client";

import { api } from "@/lib/api";
import { Category, Meal } from "@/lib/mockData";
import { useEffect, useState } from "react";

export function useData() {
  const [category, setCategory] = useState<Category[]>([]);
  const [meal, setMeal] = useState<Meal[]>([]);

  useEffect(() => {
    const getAllData = async () => {
      const getCategory = await api.get("/api/cat/category");
      const getMeal = await api.get("/api/meals");
      if (getMeal.success) {
        setMeal(getMeal.data as Meal[]);
      }
      if (getCategory.success) {
        setCategory(getCategory.data as Category[]);
      }
    };

    getAllData();
  }, []);

  const getMealById = async (id: string) => {
    try {
      if (!id) {
        return [];
      }
      const result = await api.get(`/api/meals/${id}`);
      return result.data;
    } catch (err) {
      console.log(err);
    }
  };

  const createNewOrder = async (data: any) => {
    if (!data) {
      return [];
    }

    try {
      const result = await api.post(`/api/order`, data);
      if (result.success) {
        return result;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return {
    category,
    meal,
    getMealById,
    createNewOrder,
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
