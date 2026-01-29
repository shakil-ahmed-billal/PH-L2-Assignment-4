
import { Category } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CategoryCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  category: Category;
}

const CategoryCard = ({ category, className, ...props }: CategoryCardProps) => {
  return (
    <Link
      href={`/meals?category=${category.id}`}
      className={cn(
        "group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-card shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <img
          src={category.image}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Icon */}
      <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
        {category.icon}
      </span>

      {/* Name */}
      <h3 className="font-semibold text-foreground text-center relative z-10">
        {category.name}
      </h3>

      {/* Meal Count */}
      <span className="text-sm text-muted-foreground relative z-10">
        {category.mealCount} items
      </span>
    </Link>
  );
};

export default CategoryCard;
