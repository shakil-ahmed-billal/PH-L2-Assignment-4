'use client';

import { Menu, ShoppingCart, User, LogOut, Settings, Package, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ModeToggle } from './ModeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const logo = {
    url: '/',
    src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg',
    alt: 'FoodHub',
    title: 'FoodHub',
  };

  // Get normalized user role (convert CUSTOMER -> customer, PROVIDER -> provider, ADMIN -> admin)
  const userRole = user?.role?.toLowerCase() || 'public';

  // Navigation items based on role
  const getNavigationItems = () => {
    const publicItems = [
      { title: 'Home', url: '/' },
      { title: 'Browse Meals', url: '/meals' },
      { title: 'Restaurants', url: '/providers' },
    ];

    const roleSpecificItems: Record<string, Array<{ title: string; url: string }>> = {
      customer: [
        { title: 'My Orders', url: '/orders' },
        { title: 'Profile', url: '/profile' },
      ],
      provider: [
        { title: 'Dashboard', url: '/provider/dashboard' },
        { title: 'Menu', url: '/provider/dashboard/menu' },
        { title: 'Orders', url: '/provider/dashboard/orders' },
      ],
      admin: [
        { title: 'Dashboard', url: '/admin' },
        { title: 'Users', url: '/admin/users' },
        { title: 'Orders', url: '/admin/orders' },
        { title: 'Categories', url: '/admin/categories' },
      ],
    };

    return userRole === 'public'
      ? publicItems
      : [...publicItems, ...(roleSpecificItems[userRole] || [])];
  };

  const navigationItems = getNavigationItems();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  // Get user initials from name
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  };

  // Get role display name
  const getRoleDisplayName = () => {
    if (!user?.role) return '';
    return user.role.charAt(0) + user.role.slice(1).toLowerCase();
  };

  // Show cart only for customers and public users
  const showCart = userRole === 'customer' || userRole === 'public';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg shadow-md'
          : 'bg-background/95 backdrop-blur-sm',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={logo.url}
            className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <img
              src={logo.src}
              className="h-8 w-8 dark:invert"
              alt={logo.alt}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {logo.title}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(item.url)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            {showCart && (
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-muted/50 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center shadow-lg animate-in zoom-in-50">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Theme Toggle */}
            <ModeToggle />

            {/* User Menu or Auth Buttons */}
            {user ? (
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover:bg-muted/50"
                    >
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={user.image || undefined} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2">
                        <p className="text-sm font-semibold leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        {user.role && (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                              {getRoleDisplayName()}
                            </span>
                            {user.status && (
                              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                                {user.status.toLowerCase()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Customer Menu Items */}
                    {userRole === 'customer' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/orders" className="cursor-pointer">
                            <Package className="mr-2 h-4 w-4" />
                            <span>My Orders</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Provider Menu Items */}
                    {userRole === 'provider' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/provider/dashboard" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/provider/menu" className="cursor-pointer">
                            <Menu className="mr-2 h-4 w-4" />
                            <span>Manage Menu</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/provider/orders" className="cursor-pointer">
                            <Package className="mr-2 h-4 w-4" />
                            <span>Orders</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Admin Menu Items */}
                    {userRole === 'admin' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/users" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Manage Users</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="shadow-sm">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <img
                        src={logo.src}
                        className="h-8 w-8 dark:invert"
                        alt={logo.alt}
                      />
                      <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {logo.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 mt-8">
                  {/* User Info - Mobile */}
                  {user && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={user.image || undefined} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {getRoleDisplayName()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col gap-1">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.url}
                        href={item.url}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                          isActive(item.url)
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Auth Section */}
                  <div className="flex flex-col gap-2 pt-4 border-t">
                    {user ? (
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-600 hover:text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/10"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    ) : (
                      <>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full shadow-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link href="/register">Register</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Navbar };