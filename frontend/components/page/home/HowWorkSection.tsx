import { ChefHat, ShieldCheck, Truck } from 'lucide-react'


const HowWorkSection = () => {
  return (
    <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Order your favorite meals in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ChefHat,
                title: "Browse Meals",
                description: "Explore hundreds of delicious options from top-rated local restaurants.",
                step: "01",
              },
              {
                icon: ShieldCheck,
                title: "Place Your Order",
                description: "Add items to cart, customize your meal, and checkout securely.",
                step: "02",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Track your order in real-time and get it delivered fresh to your door.",
                step: "03",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="relative text-center p-8 rounded-2xl bg-card shadow-soft hover:shadow-elevated transition-shadow group"
              >
                <span className="absolute top-4 right-4 text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {item.step}
                </span>
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
    </section>
  )
}

export default HowWorkSection
