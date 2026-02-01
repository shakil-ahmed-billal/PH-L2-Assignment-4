
import { Star, Clock, MapPin } from "lucide-react";
import { Provider } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProviderCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  provider: Provider;
}

const ProviderCard = ({ provider, className, ...props }: ProviderCardProps) => {
  return (
    <Link
      href={`/providers/${provider.id}`}
      className={cn(
        "group block bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {/* Cover Image */}
      <div className="relative h-32 md:h-40 overflow-hidden">
        <img
          src={provider.coverImage}
          alt={provider.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Status Badge */}
        <Badge
          variant={provider.isOpen ? "default" : "secondary"}
          className="absolute top-3 right-3"
        >
          {provider.isOpen ? "Open Now" : "Closed"}
        </Badge>

        {/* Provider Avatar */}
        <div className="absolute -bottom-6 left-4">
          <div className="h-14 w-14 rounded-xl border-4 border-card overflow-hidden shadow-elevated">
            <img
              src={provider.image}
              alt={provider.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-8">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {provider.name}
          </h3>
          <span className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-medium">{provider.rating}</span>
            <span className="text-muted-foreground">({provider.reviewCount})</span>
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {provider.description}
        </p>

        {/* <div className="flex flex-wrap gap-1.5 mb-3">
          {provider.cuisine.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div> */}

        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {provider.deliveryTime}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            ${provider.deliveryFee} delivery
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProviderCard;
