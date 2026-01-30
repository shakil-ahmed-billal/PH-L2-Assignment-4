

import ProviderCard from "@/components/card/ProviderCard";
import { providers } from "@/lib/mockData";

const ProvidersPage = () => {
  return (

      <div className="container py-8 mx-auto px-4">
        <div className="mb-8">
          <h1 className="heading-section text-foreground mb-2">Restaurants</h1>
          <p className="text-muted-foreground">
            {providers.length} amazing restaurants to choose from
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider, index) => (
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
