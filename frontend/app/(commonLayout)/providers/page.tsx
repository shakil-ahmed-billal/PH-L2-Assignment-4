"use client"

import ProviderCard from "@/components/card/ProviderCard";
import { api } from "@/lib/api";
import { Provider } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProvidersPage = () => {

  const [allRestaurant, setAllRestaurant] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(allRestaurant)

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      setIsLoading(true);
      const result = await api.get("/api/restaurant");
      
      if (result.success) {
        setAllRestaurant(result.data as Provider[]);
      } else {
        toast.error("Failed to load meals");
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast.error("An error occurred while loading meals");
    } finally {
      setIsLoading(false);
    }
  };

  return (

      <div className="container py-8 mx-auto px-4">
        <div className="mb-8">
          <h1 className="heading-section text-foreground mb-2">Restaurants</h1>
          <p className="text-muted-foreground">
            {allRestaurant.length} amazing restaurants to choose from
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allRestaurant.map((provider, index) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

  );
};

export default ProvidersPage;
