import { useRoute, Link } from "wouter";
import { useChannel } from "@/hooks/use-channels";
import { useAddToCart, useRemoveFromCart, useCart } from "@/hooks/use-cart";
import { Loader2, ArrowLeft, CheckCircle2, Globe, Users, BarChart3, TrendingUp, Share2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChannelDetails() {
  const [, params] = useRoute("/channels/:id");
  const id = parseInt(params?.id || "0");
  const { data: channel, isLoading, error } = useChannel(id);
  
  const { data: cartItems } = useCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();

  const cartItem = cartItems?.find(item => item.channelId === id);
  const isInCart = !!cartItem;
  const isPending = addToCart.isPending || removeFromCart.isPending;

  const handleCartAction = () => {
    if (!channel) return;
    if (isInCart) {
      removeFromCart.mutate(cartItem.id);
    } else {
      addToCart.mutate(channel.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500">Channel not found</p>
        <Link href="/">
          <Button variant="secondary">Go Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#1c1c1e]/80 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <span className="font-semibold text-lg">{channel.username}</span>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Hero Section */}
      <div className="p-6 flex flex-col items-center text-center border-b border-zinc-800/50">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-zinc-800 p-1">
             {/* Descriptive comment for Unsplash: Abstract gradient for channel avatar */}
            <img 
              src={channel.avatarUrl || "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=200&h=200&fit=crop"} 
              alt={channel.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {channel.verified && (
            <div className="absolute bottom-1 right-1 bg-[#1c1c1e] rounded-full p-1">
              <CheckCircle2 className="w-6 h-6 text-primary fill-current" />
            </div>
          )}
        </div>
        
        <h1 className="text-2xl font-bold mb-1">{channel.name}</h1>
        <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">{channel.description}</p>
        
        <div className="flex gap-3">
          <Button 
            className={`
              min-w-[140px] h-12 rounded-xl text-base font-semibold shadow-lg transition-all
              ${isInCart 
                ? "bg-zinc-800 hover:bg-zinc-700 text-red-400" 
                : "bg-primary hover:bg-primary/90 text-white shadow-primary/25"
              }
            `}
            onClick={handleCartAction}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isInCart ? (
              "Remove"
            ) : (
              `Buy for $${channel.price}`
            )}
          </Button>
          <Button variant="secondary" className="h-12 w-12 rounded-xl bg-zinc-800 hover:bg-zinc-700">
            <Globe className="w-5 h-5 text-zinc-400" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <StatCard 
          icon={<Users className="w-5 h-5 text-blue-400" />}
          label="Subscribers"
          value={(channel.subscribers / 1000).toFixed(1) + "K"}
          subtext="Total audience"
        />
        <StatCard 
          icon={<BarChart3 className="w-5 h-5 text-green-400" />}
          label="Avg Views"
          value={(channel.views / 1000).toFixed(1) + "K"}
          subtext="Per post (24h)"
        />
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-orange-400" />}
          label="ERR"
          value={channel.err + "%"}
          subtext="Engagement rate"
        />
        <StatCard 
          icon={<Wallet className="w-5 h-5 text-purple-400" />}
          label="CPP"
          value={"$" + (channel.price / (channel.views / 1000)).toFixed(2)}
          subtext="Cost per 1k views"
        />
      </div>

      {/* Additional Info */}
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-lg text-zinc-200">About this channel</h3>
        <div className="bg-[#2c2c2e] rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-zinc-700/50">
            <span className="text-zinc-400">Category</span>
            <span className="font-medium">{channel.category}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-zinc-700/50">
            <span className="text-zinc-400">Created</span>
            <span className="font-medium">
              {new Date(channel.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-zinc-400">Format</span>
            <span className="font-medium">1/24, 2/48, Native</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext }: any) {
  return (
    <div className="bg-[#2c2c2e] p-4 rounded-2xl border border-transparent hover:border-zinc-700 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-zinc-800 rounded-lg">
          {icon}
        </div>
        <span className="text-zinc-400 text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs text-zinc-500">{subtext}</div>
    </div>
  );
}
