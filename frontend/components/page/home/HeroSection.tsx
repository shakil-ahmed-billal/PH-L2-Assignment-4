import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, Star } from 'lucide-react'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-warm">
        <div className="container py-16 md:py-24 lg:py-32 mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="animate-pulse-slow">🔥</span>
                <span>Fastest delivery in town</span>
              </div>
              
              <h1 className="heading-display text-foreground">
                Delicious Food,
                <span className="block text-primary">Delivered Fast</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Discover amazing meals from the best local restaurants. 
                Fresh ingredients, expert chefs, and lightning-fast delivery right to your door.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/meals">
                  <Button variant="hero" size="xl" className="group ">
                    Order Now
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/providers">
                  <Button variant="outline" size="xl">
                    View Restaurants
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-background overflow-hidden"
                      >
                        <img
                          src={`https://images.unsplash.com/photo-${
                            ["1494790108377-be9c29b29330", "1507003211169-0a1dd7228f2d", "1438761681033-6461ffad8d80", "1500648767791-00dcc994a43e"][i - 1]
                          }?w=100&h=100&fit=crop`}
                          alt="Customer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">50k+</span>
                    <span className="text-muted-foreground"> happy customers</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block -z-100">
              <div className="relative -z-10 animate-float">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop"
                  alt="Delicious burger"
                  className="w-full max-w-md mx-auto rounded-3xl shadow-elevated"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-10 -left-4 bg-card rounded-2xl p-4 shadow-elevated animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery in</p>
                    <p className="font-bold text-foreground">15-30 min</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 -right-4 bg-card rounded-2xl p-4 shadow-elevated animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Star className="h-6 w-6 text-accent fill-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-bold text-foreground">4.9/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </section>
  )
}

export default HeroSection
