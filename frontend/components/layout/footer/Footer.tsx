import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background/80 mt-auto">
      <div className="container py-12 md:py-16 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍱</span>
              <span className="font-display text-xl font-bold text-background">
                Food<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-background/60 leading-relaxed">
              Discover delicious meals from the best local restaurants. 
              Fast delivery, fresh ingredients, and amazing flavors.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-background mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/meals" className="hover:text-primary transition-colors">Browse Meals</Link>
              </li>
              <li>
                <Link href="/providers" className="hover:text-primary transition-colors">Restaurants</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary transition-colors">My Cart</Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-primary transition-colors">Track Order</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-background mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-background mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:support@foodhub.com" className="hover:text-primary transition-colors">
                  support@foodhub.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>123 Foodie Street, Culinary City, FC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-background/60">
            © {currentYear} FoodHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
