import ProviderCard from "@/components/card/ProviderCard";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Provider } from "@/lib/mockData";
// import { providers } from "@/lib/mockData";
import { ArrowRight, Slice } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FeaturedRestaurantsSection = () => {
    
  const [allRestaurant, setAllRestaurant] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(allRestaurant)
  const restaurant = allRestaurant.slice(0, 6)

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
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="heading-section text-foreground mb-2">
              Featured Restaurants
            </h2>
            <p className="text-muted-foreground">
              Top-rated establishments near you
            </p>
          </div>
          <Link href="/providers">
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurant.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurantsSection;
