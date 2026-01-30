
"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";


export function useData() {
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    const getCategory = async () => {
      const result = await api.get("/api/cat/category");
      setCategory(result.data);
    };

    getCategory();
  }, []);

  return { category };
}


export function DataProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
