import { reviews } from '@/lib/mockData';
import { Star } from 'lucide-react'
import React from 'react'

const TestimonialsSection = () => {

  const featuredReviews = reviews.slice(0, 3);

  return (
     <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-3">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who love ordering with
              FoodHub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? "fill-accent text-accent"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {review.comment}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {review.userName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Verified Customer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default TestimonialsSection
