import MealCard from "@/components/card/MealCard";
import { Button } from "@/components/ui/button";
import { useData } from "@/hooks/useData";
import { ArrowRight } from "lucide-react";
import Link from "next/link";



const PopularMealSection = () => {


  const {meal} = useData()
  const popularMeals = meal.slice(0 , 3)

  if(!meal.length){
    return null
  }

  return (
     <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="heading-section text-foreground mb-2">Popular Right Now</h2>
              <p className="text-muted-foreground">Most ordered meals this week</p>
            </div>
            <Link href="/meals">
              <Button variant="ghost" className="group">
                View All Meals
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularMeals.map((item, index) => (
              <MealCard
                key={item.id}
                meal={item}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </section>
  )
}

export default PopularMealSection
