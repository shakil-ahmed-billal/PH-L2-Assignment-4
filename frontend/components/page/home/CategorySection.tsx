"use client";

import CategoryCard from "@/components/card/CategoryCard";
import { Button } from "@/components/ui/button";
import { useData } from "@/hooks/useData";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const CategorySection = () => {
  const { category } = useData();

  if (!category.length) {
    return null;
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="heading-section text-foreground mb-2">
              Browse by Category
            </h2>
            <p className="text-muted-foreground">
              Explore your favorite cuisines
            </p>
          </div>

          <Link href="/meals">
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {category.map((item, index) => (
            <CategoryCard
              key={item.id}
              category={item}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;