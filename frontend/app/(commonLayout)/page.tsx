"use client";

import CategorySection from "@/components/page/home/CategorySection";
import CtaSection from "@/components/page/home/CtaSection";
import FeaturedRestaurantsSection from "@/components/page/home/FeaturedRestaurantsSection";
import HeroSection from "@/components/page/home/HeroSection";
import HowWorkSection from "@/components/page/home/HowWorkSection";
import PopularMealSection from "@/components/page/home/PopularMealSection";
import TestimonialsSection from "@/components/page/home/TestimonialsSection";
import { useData } from "@/hooks/useData";

const HomePage = () => {
  const { category } = useData();
  console.log(category);

  return (
    <div className=" my-8 md:my-12 lg:my-16 space-y-20 ">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <CategorySection />

      {/* Popular Meals Section */}
      <PopularMealSection />

      {/* How It Works Section */}
      <HowWorkSection />

      {/* Featured Restaurants Section */}
      <FeaturedRestaurantsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CtaSection />
    </div>
  );
};

export default HomePage;
