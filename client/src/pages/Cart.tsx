import { Link } from "wouter";
import { useCart, useRemoveFromCart, useCheckout } from "@/hooks/use-cart";
import { Navigation } from "@/components/Navigation";
import { Loader2, Trash2, ArrowRight, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const { data: items, isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();
  const checkout = useCheckout();

  const total = items?.reduce((sum, item) => sum + item.channel.price, 0) || 0;
  const count = items?.length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] pb-32">
      <Navigation onSearch={() => {}} searchValue="" />
      
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          Your Cart 
          <span className="text-lg font-normal text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">
            {count} items
          </span>
        </h1>

        {items?.length === 0 ? (
          <div className="text-center py-20 bg-[#2c2c2e] rounded-3xl border border-dashed border-zinc-700">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-zinc-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Cart is empty</h2>
            <p className="text-zinc-500 mb-8 max-w-xs mx-auto">
              Start adding channels from the marketplace to launch your campaign.
            </p>
            <Link href="/">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                Browse Channels
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items?.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 p-4 bg-[#2c2c2e] rounded-2xl group border border-transparent hover:border-zinc-700 transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                  <img 
                    src={item.channel.avatarUrl} 
                    alt={item.channel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-lg">{item.channel.name}</h3>
                  <p className="text-zinc-500 text-sm">@{item.channel.username}</p>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-white text-lg">${item.channel.price}</div>
                  <button 
                    onClick={() => removeFromCart.mutate(item.id)}
                    className="text-red-400 text-sm hover:underline flex items-center justify-end gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={removeFromCart.isPending}
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Checkout Bar */}
      {count > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#2c2c2e]/90 backdrop-blur-lg border-t border-zinc-800 p-4 md:p-6 z-40">
          <div className="container max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-zinc-400 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-white">${total.toFixed(2)}</p>
            </div>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 shadow-lg shadow-primary/20"
              onClick={() => checkout.mutate()}
              disabled={checkout.isPending}
            >
              {checkout.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <span className="flex items-center gap-2">
                  Checkout <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
