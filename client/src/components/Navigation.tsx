import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, ShoppingCart, User, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationProps {
  onSearch: (query: string) => void;
  searchValue: string;
}

export function Navigation({ onSearch, searchValue }: NavigationProps) {
  const { user, isLoading } = useAuth();
  const { data: cartItems } = useCart();
  const [location] = useLocation();
  const cartCount = cartItems?.length || 0;

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between gap-4">
        {/* Mobile Menu / Logo */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-white hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#1c1c1e] border-r border-zinc-800 text-white p-0">
              <div className="p-6 bg-zinc-800/50">
                <div className="flex items-center gap-3 mb-6">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarImage src={user?.profileImageUrl || ""} />
                    <AvatarFallback className="bg-primary text-white text-lg">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{user?.username || "Guest"}</p>
                    <p className="text-sm text-zinc-400">{user?.email || "Sign in to continue"}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col p-4 gap-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                  <span className="font-medium">Marketplace</span>
                </Link>
                {user?.isAdmin && (
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                    <span className="font-medium">Admin Dashboard</span>
                  </Link>
                )}
                {!isLoading && !user && (
                  <Link href="/api/login" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors mt-4">
                    <span className="font-medium">Sign In</span>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="text-xl font-bold tracking-tight hidden md:block">
            TG<span className="text-primary">Ads</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search channels..."
              className="w-full bg-[#1c1c1e] md:bg-black/20 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {user?.isAdmin && (
             <Link href="/admin">
               <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/10 hidden md:flex">
                 <Plus className="w-5 h-5" />
               </Button>
             </Link>
          )}

          <Link href="/cart">
            <Button size="icon" variant="ghost" className="relative text-zinc-400 hover:text-white hover:bg-white/10">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-[#1c1c1e]">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {!isLoading && user ? (
             <Link href="/api/logout">
               <Avatar className="w-8 h-8 ml-2 border border-zinc-700 cursor-pointer hover:border-zinc-500 transition-colors hidden md:block">
                 <AvatarImage src={user.profileImageUrl || ""} />
                 <AvatarFallback className="bg-primary/20 text-primary text-xs">
                   {user.username?.[0]?.toUpperCase()}
                 </AvatarFallback>
               </Avatar>
             </Link>
          ) : (
             <Link href="/api/login">
               <Button size="sm" className="hidden md:flex ml-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-full px-5">
                 Login
               </Button>
             </Link>
          )}
        </div>
      </div>
    </header>
  );
}
