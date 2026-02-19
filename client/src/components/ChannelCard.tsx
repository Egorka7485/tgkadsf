import { useState } from "react";
import { Link } from "wouter";
import { User as UserIcon, Eye, BarChart2, CheckCircle2, ShoppingCart, Loader2 } from "lucide-react";
import { type Channel } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useAddToCart, useRemoveFromCart, useCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";

interface ChannelCardProps {
  channel: Channel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
  const { data: cartItems } = useCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();
  
  // Find if this channel is in cart
  const cartItem = cartItems?.find(item => item.channelId === channel.id);
  const isInCart = !!cartItem;
  const isPending = addToCart.isPending || removeFromCart.isPending;

  const handleCartAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      removeFromCart.mutate(cartItem.id);
    } else {
      addToCart.mutate(channel.id);
    }
  };

  return (
    <Link href={`/channels/${channel.id}`}>
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="group relative flex items-center gap-4 p-4 rounded-2xl bg-[#2c2c2e] hover:bg-[#3a3a3c] transition-all cursor-pointer border border-transparent hover:border-zinc-700/50"
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full bg-zinc-800 overflow-hidden">
            {/* Descriptive comment for Unsplash: Abstract gradient for channel avatar */}
            <img
              src={channel.avatarUrl || "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=200&h=200&fit=crop"}
              alt={channel.name}
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-white truncate text-base pr-2 group-hover:text-primary transition-colors">
              {channel.name}
            </h3>
            <span className="font-bold text-white whitespace-nowrap bg-zinc-800/50 px-2 py-0.5 rounded-md text-sm">
              {(channel.price * 300).toLocaleString()} ₽
            </span>
          </div>
          
          <p className="text-zinc-500 text-sm truncate mb-3">
            {channel.category} • {channel.username}
          </p>

          {/* Stats Grid */}
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 bg-zinc-800/40 px-2 py-1 rounded-md">
              <UserIcon className="w-3.5 h-3.5" />
              <span>{(channel.subscribers / 1000).toFixed(1)}K</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-800/40 px-2 py-1 rounded-md">
              <Eye className="w-3.5 h-3.5" />
              <span>{(channel.views / 1000).toFixed(1)}K</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-800/40 px-2 py-1 rounded-md">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>{channel.err}% ERR</span>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div className="shrink-0 ml-2">
          <Button
            size="icon"
            variant={isInCart ? "secondary" : "default"}
            className={`w-10 h-10 rounded-full transition-all ${
              isInCart 
                ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-red-400" 
                : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            }`}
            onClick={handleCartAction}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isInCart ? (
              <X className="w-5 h-5" />
            ) : (
              <Plus className="w-6 h-6" />
            )}
          </Button>
        </div>
      </motion.div>
    </Link>
  );
}

// Helper icons for dynamic import
function Plus(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}

function X(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
}
