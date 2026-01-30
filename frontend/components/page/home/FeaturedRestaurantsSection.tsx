import ProviderCard from "@/components/card/ProviderCard";
import { Button } from "@/components/ui/button";
import { providers } from "@/lib/mockData";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const FeaturedRestaurantsSection = () => {
    
  const featuredProviders = providers.slice(0, 3);

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
          {featuredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurantsSection;
