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
      const getMeal = await api.get("/api/meal");

      if (getMeal.success) {
        setMeal(getMeal.data as Meal[]);
      }
      if (getCategory.success) {
        setCategory(getCategory.data as Category[]);
      }
    };

    getAllData();
  }, []);


  const getMealById = async (id: string) =>{
    try{
      if(!id){
        return []
      }
      const result = await api.get(`/api/meal/${id}`)
      return result.data
    }catch(err){
      console.log(err)
    }
  }

  return {
    category,
    meal,
    getMealById
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
