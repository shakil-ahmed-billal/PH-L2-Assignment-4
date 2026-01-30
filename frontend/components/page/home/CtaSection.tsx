import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CtaSection = () => {
  return (
    <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-12 lg:p-16 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
                Ready to Order?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
                Download our app or order online. Get exclusive deals and track
                your delivery in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/meals">
                  <Button
                    size="xl"
                    className="bg-background text-primary hover:bg-background/90"
                  >
                    Browse Meals
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    size="xl"
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-background/10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-background/10" />
          </div>
        </div>
      </section>
  )
}

export default CtaSection
