'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Clock, Flame, Leaf, Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { getMealById, getMealsByProvider, getReviewsByMealId, getProviderById } from '@/lib/mockData';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import MealCard from '@/components/card/MealCard';
import ReviewCard from '@/components/card/ReviewCard';


interface MealDetailsPageProps {
  params?: {
    id: string;
  };
}

const MealDetailsPage = ({ params }: MealDetailsPageProps) => {
  const router = useRouter();
  const urlParams = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

 
  const id = params?.id || (urlParams?.id as string);

  const meal = getMealById(id || '');
  const provider = meal ? getProviderById(meal.providerId) : undefined;
  const reviews = meal ? getReviewsByMealId(meal.id) : [];
  const relatedMeals = meal
    ? getMealsByProvider(meal.providerId).filter((m) => m.id !== meal.id).slice(0, 4)
    : [];

  useEffect(() => {

    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {

    const wishlist = localStorage.getItem('wishlist');
    if (wishlist && meal) {
      const wishlistItems = JSON.parse(wishlist);
      setIsWishlisted(wishlistItems.includes(meal.id));
    }
  }, [meal]);

  if (isLoading) {
    return (

        <div className="container py-16 mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-3xl"></div>
              <div className="space-y-6">
                <div className="h-10 w-3/4 bg-muted rounded"></div>
                <div className="h-6 w-1/2 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>

    );
  }

  if (!meal) {
    return (

        <div className="container py-16 text-center mx-auto">
          <div className="text-6xl mb-4" role="img" aria-label="Meal not found">
            🍽️
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Meal Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The meal you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/meals">
            <Button size="lg">Browse All Meals</Button>
          </Link>
        </div>

    );
  }

  const handleAddToCart = () => {
    try {
      addToCart(meal, quantity);
      toast(`Added to cart! 🛒${meal.name} has been added to your cart.`);
    } catch (error) {
      toast("Failed to add item to cart. Please try again.");
    }
  };

  const handleToggleWishlist = () => {
    try {
      const wishlist = localStorage.getItem('wishlist');
      let wishlistItems: string[] = wishlist ? JSON.parse(wishlist) : [];

      if (isWishlisted) {
        wishlistItems = wishlistItems.filter((itemId) => itemId !== meal.id);
        toast(`${meal.name} has been removed from your wishlist.`);
      } else {
        wishlistItems.push(meal.id);
        toast(`${meal.name} has been added to your wishlist.`);
      }

      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      toast("Failed to update wishlist. Please try again.");
    }
  };

  const incrementQuantity = () => {
    if (quantity < 99) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const averageRating = meal.rating || 0;
  const totalPrice = meal.price * quantity;
  const savings = meal.originalPrice ? (meal.originalPrice - meal.price) * quantity : 0;

  return (

      <div className="container py-8 mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-2 hover:bg-muted/80 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-elevated bg-muted">
              <Image
                src={meal.image}
                alt={meal.name}
                width={800}
                height={800}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                priority
                quality={90}
              />
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {meal.isPopular && (
                <Badge className="bg-primary text-primary-foreground shadow-lg backdrop-blur-sm bg-primary/90">
                  🔥 Popular
                </Badge>
              )}
              {meal.isVegetarian && (
                <Badge variant="secondary" className="shadow-lg backdrop-blur-sm bg-secondary/90">
                  <Leaf className="h-3 w-3 mr-1" />
                  Vegetarian
                </Badge>
              )}
              {meal.isSpicy && (
                <Badge variant="destructive" className="shadow-lg backdrop-blur-sm bg-destructive/90">
                  <Flame className="h-3 w-3 mr-1" />
                  Spicy
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleWishlist}
              className={`absolute top-4 right-4 h-12 w-12 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 ${
                isWishlisted
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-background/80 hover:bg-background'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`h-5 w-5 transition-transform ${isWishlisted ? 'fill-current scale-110' : ''}`} />
            </Button>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Provider Link */}
            {provider && (
              <Link
                href={`/providers/${provider.id}`}
                className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity group"
              >
                <div className="relative h-10 w-10 rounded-lg overflow-hidden ring-2 ring-border group-hover:ring-primary transition-all">
                  <Image
                    src={provider.image}
                    alt={provider.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {provider.name}
                </span>
              </Link>
            )}

            {/* Title and Category */}
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2 leading-tight">
                {meal.name}
              </h1>
              <p className="text-lg text-muted-foreground capitalize">{meal.category}</p>
            </div>

            {/* Rating, Time & Calories */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="font-semibold text-foreground">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({meal.reviewCount} {meal.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>{meal.prepTime}</span>
              </div>
              <div className="text-muted-foreground font-medium">
                {meal.calories} cal
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed text-base">
                {meal.description}
              </p>
            </div>

            {/* Ingredients */}
            {meal.ingredients && meal.ingredients.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-lg">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {meal.ingredients.map((ingredient) => (
                    <Badge
                      key={ingredient}
                      variant="outline"
                      className="text-sm py-1 px-3 hover:bg-muted transition-colors"
                    >
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Price & Add to Cart Section */}
            <div className="bg-muted/50 rounded-2xl p-6 space-y-4 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground font-medium">Price</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl font-bold text-primary">
                      ${meal.price.toFixed(2)}
                    </span>
                    {meal.originalPrice && meal.originalPrice > meal.price && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          ${meal.originalPrice.toFixed(2)}
                        </span>
                        <Badge variant="destructive" className="ml-2">
                          Save ${savings.toFixed(2)}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold w-8 text-center tabular-nums">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= 99}
                    className="h-10 w-10 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                variant="hero"
                size="xl"
                className="w-full font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart — ${totalPrice.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-section text-foreground">
                Customer Reviews
              </h2>
              <span className="text-sm text-muted-foreground">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}

        {/* Related Meals */}
        {relatedMeals && relatedMeals.length > 0 && (
          <section className="mt-16">
            <h2 className="heading-section text-foreground mb-6">
              More from {meal.providerName || provider?.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedMeals.map((relatedMeal) => (
                <MealCard key={relatedMeal.id} meal={relatedMeal} />
              ))}
            </div>
          </section>
        )}
      </div>

  );
};

export default MealDetailsPage;