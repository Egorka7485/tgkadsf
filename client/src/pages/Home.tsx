import { useState } from "react";
import { useChannels } from "@/hooks/use-channels";
import { Navigation } from "@/components/Navigation";
import { ChannelCard } from "@/components/ChannelCard";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "Tech", "Crypto", "Business", "News", "Entertainment", "Lifestyle"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const { data: channels, isLoading, error } = useChannels({
    search: search || undefined,
    category: selectedCategory !== "All" ? selectedCategory : undefined,
  });

  return (
    <div className="min-h-screen bg-[#1c1c1e] pb-20">
      <Navigation onSearch={setSearch} searchValue={search} />

      {/* Filter Bar */}
      <div className="container max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${selectedCategory === cat 
                  ? "bg-primary text-white shadow-lg shadow-primary/25" 
                  : "bg-[#2c2c2e] text-zinc-400 hover:bg-[#3a3a3c] hover:text-zinc-200"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-5xl mx-auto px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-zinc-500 animate-pulse">Loading market data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white">Something went wrong</h3>
            <p className="text-zinc-500 max-w-md">Failed to load channels. Please check your connection and try again.</p>
            <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
          </div>
        ) : channels?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
              <SearchX className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold text-white">No channels found</h3>
            <p className="text-zinc-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels?.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchX(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
}
