import { useState } from "react";
import { useChannels } from "@/hooks/use-channels";
import { Navigation } from "@/components/Navigation";
import { ChannelCard } from "@/components/ChannelCard";
import { Loader2, AlertCircle, Megaphone, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLATFORMS = ["Telegram", "TikTok", "Реклама"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("Telegram");
  const [tiktokFilter, setTiktokFilter] = useState("Реклама");

  // Filter dialog states
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);
  const [tiktokDialogOpen, setTiktokDialogOpen] = useState(false);
  const [adsDialogOpen, setAdsDialogOpen] = useState(false);

  // Filter values
  const [telegramFilters, setTelegramFilters] = useState({
    priceMin: "",
    priceMax: "",
    subsMin: "",
    subsMax: "",
    viewsMin: "",
    viewsMax: "",
    category: "",
  });

  const [tiktokFilters, setTiktokFilters] = useState({
    priceMin: "",
    priceMax: "",
    subsMin: "",
    subsMax: "",
    viewsMin: "",
    viewsMax: "",
  });

  const [adsFilters, setAdsFilters] = useState({
    platform: "",
    subsMin: "",
    subsMax: "",
    priceMin: "",
    priceMax: "",
    errMin: "",
    errMax: "",
  });

  const { data: allChannels, isLoading, error } = useChannels({
    search: search || undefined,
    platform: selectedPlatform.toLowerCase(),
  });

  // Group channels by platform for "All" view
  const telegramChannels = allChannels?.filter(channel => channel.platform === 'telegram') || [];
  const tiktokChannels = allChannels?.filter(channel => channel.platform === 'tiktok') || [];

  return (
    <div className="min-h-screen bg-[#1c1c1e] pb-20">
      <Navigation />

      {/* Platform Tabs */}
      <div className="container max-w-5xl mx-auto px-4 py-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all min-w-fit
                ${selectedPlatform === platform
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-[#2c2c2e] text-zinc-400 hover:bg-[#3a3a3c] hover:text-zinc-200"
                }
              `}
            >
              {platform === "Telegram" && (
                <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">T</span>
              )}
              {platform === "TikTok" && (
                <span className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">T</span>
              )}
              {platform === "Реклама" && (
                <Megaphone className="w-5 h-5 text-orange-500" />
              )}
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Platform-specific Filter Bar */}
      <div className="container max-w-5xl mx-auto px-4 py-2">
        {selectedPlatform === "Telegram" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <Dialog open={telegramDialogOpen} onOpenChange={setTelegramDialogOpen}>
              <DialogTrigger asChild>
                <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-[#2c2c2e] text-zinc-400 hover:bg-[#3a3a3c] hover:text-zinc-200">
                  Фильтр
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#1c1c1e] border-zinc-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Фильтры Telegram</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telegram-price-min" className="text-zinc-300">Цена от</Label>
                      <Input
                        id="telegram-price-min"
                        type="number"
                        placeholder="0"
                        value={telegramFilters.priceMin}
                        onChange={(e) => setTelegramFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telegram-price-max" className="text-zinc-300">Цена до</Label>
                      <Input
                        id="telegram-price-max"
                        type="number"
                        placeholder="1000000"
                        value={telegramFilters.priceMax}
                        onChange={(e) => setTelegramFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telegram-subs-min" className="text-zinc-300">Подписчики от</Label>
                      <Input
                        id="telegram-subs-min"
                        type="number"
                        placeholder="0"
                        value={telegramFilters.subsMin}
                        onChange={(e) => setTelegramFilters(prev => ({ ...prev, subsMin: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telegram-subs-max" className="text-zinc-300">Подписчики до</Label>
                      <Input
                        id="telegram-subs-max"
                        type="number"
                        placeholder="1000000"
                        value={telegramFilters.subsMax}
                        onChange={(e) => setTelegramFilters(prev => ({ ...prev, subsMax: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telegram-views-min" className="text-zinc-300">Просмотры от</Label>
                      <Input
                        id="telegram-views-min"
                        type="number"
                        placeholder="0"
                        value={telegramFilters.viewsMin}
                        onChange={(e) => setTelegramFilters(prev => ({ ...prev, viewsMin: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telegram-views-max" className="text-zinc-300">Просмотры до</Label>
                      <Input
                        id="telegram-views-max"
                        type="number"
                        placeholder="10000000"
                        value={telegramFilters.viewsMax}
                        onChange={(e) => setTelegramFilters(prev => ({ ...prev, viewsMax: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telegram-category" className="text-zinc-300">Категория</Label>
                    <Select value={telegramFilters.category} onValueChange={(value) => setTelegramFilters(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="bg-[#2c2c2e] border-zinc-600 text-white">
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2c2c2e] border-zinc-600">
                        <SelectItem value="криптовалюта">Криптовалюта</SelectItem>
                        <SelectItem value="спорт">Спорт</SelectItem>
                        <SelectItem value="личный влог">Личный влог</SelectItem>
                        <SelectItem value="новости">Новости</SelectItem>
                        <SelectItem value="бизнес">Бизнес</SelectItem>
                        <SelectItem value="образование">Образование</SelectItem>
                        <SelectItem value="наука">Наука</SelectItem>
                        <SelectItem value="семья">Семья</SelectItem>
                        <SelectItem value="работа">Работа</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setTelegramDialogOpen(false)} className="bg-primary hover:bg-primary/90">
                    Применить
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {selectedPlatform === "TikTok" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <Dialog open={tiktokDialogOpen} onOpenChange={setTiktokDialogOpen}>
              <DialogTrigger asChild>
                <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-[#2c2c2e] text-zinc-400 hover:bg-[#3a3a3c] hover:text-zinc-200">
                  Фильтр
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#1c1c1e] border-zinc-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Фильтры TikTok</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tiktok-price-min" className="text-zinc-300">Цена от</Label>
                      <Input
                        id="tiktok-price-min"
                        type="number"
                        placeholder="0"
                        value={tiktokFilters.priceMin}
                        onChange={(e) => setTiktokFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tiktok-price-max" className="text-zinc-300">Цена до</Label>
                      <Input
                        id="tiktok-price-max"
                        type="number"
                        placeholder="1000000"
                        value={tiktokFilters.priceMax}
                        onChange={(e) => setTiktokFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tiktok-subs-min" className="text-zinc-300">Подписчики от</Label>
                      <Input
                        id="tiktok-subs-min"
                        type="number"
                        placeholder="0"
                        value={tiktokFilters.subsMin}
                        onChange={(e) => setTiktokFilters(prev => ({ ...prev, subsMin: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tiktok-subs-max" className="text-zinc-300">Подписчики до</Label>
                      <Input
                        id="tiktok-subs-max"
                        type="number"
                        placeholder="1000000"
                        value={tiktokFilters.subsMax}
                        onChange={(e) => setTiktokFilters(prev => ({ ...prev, subsMax: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tiktok-views-min" className="text-zinc-300">Просмотры от</Label>
                      <Input
                        id="tiktok-views-min"
                        type="number"
                        placeholder="0"
                        value={tiktokFilters.viewsMin}
                        onChange={(e) => setTiktokFilters(prev => ({ ...prev, viewsMin: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tiktok-views-max" className="text-zinc-300">Просмотры до</Label>
                      <Input
                        id="tiktok-views-max"
                        type="number"
                        placeholder="10000000"
                        value={tiktokFilters.viewsMax}
                        onChange={(e) => setTiktokFilters(prev => ({ ...prev, viewsMax: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setTiktokDialogOpen(false)} className="bg-primary hover:bg-primary/90">
                    Применить
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <button
              onClick={() => setTiktokFilter("Реклама")}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${tiktokFilter === "Реклама"
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-[#2c2c2e] text-zinc-400 hover:bg-[#3a3a3c] hover:text-zinc-200"
                }
              `}
            >
              Реклама
            </button>
            <button
              onClick={() => setTiktokFilter("Звук")}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${tiktokFilter === "Звук"
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-[#2c2c2e] text-zinc-400 hover:bg-[#3a3a3c] hover:text-zinc-200"
                }
              `}
            >
              Звук
            </button>
          </div>
        )}

        {selectedPlatform === "Реклама" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <Dialog open={adsDialogOpen} onOpenChange={setAdsDialogOpen}>
              <DialogTrigger asChild>
                <button className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-[#2c2c2e] text-zinc-400 hover:bg-[#3a3a3c] hover:text-zinc-200">
                  Фильтр
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#1c1c1e] border-zinc-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Фильтры Реклама</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="ads-platform" className="text-zinc-300">Платформа</Label>
                    <Select value={adsFilters.platform} onValueChange={(value) => setAdsFilters(prev => ({ ...prev, platform: value }))}>
                      <SelectTrigger className="bg-[#2c2c2e] border-zinc-600 text-white">
                        <SelectValue placeholder="Выберите платформу" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2c2c2e] border-zinc-600">
                        <SelectItem value="telegram">Telegram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ads-subs-min" className="text-zinc-300">Подписчики от</Label>
                      <Input
                        id="ads-subs-min"
                        type="number"
                        placeholder="0"
                        value={adsFilters.subsMin}
                        onChange={(e) => setAdsFilters(prev => ({ ...prev, subsMin: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ads-subs-max" className="text-zinc-300">Подписчики до</Label>
                      <Input
                        id="ads-subs-max"
                        type="number"
                        placeholder="1000000"
                        value={adsFilters.subsMax}
                        onChange={(e) => setAdsFilters(prev => ({ ...prev, subsMax: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ads-price-min" className="text-zinc-300">Цена от</Label>
                      <Input
                        id="ads-price-min"
                        type="number"
                        placeholder="0"
                        value={adsFilters.priceMin}
                        onChange={(e) => setAdsFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ads-price-max" className="text-zinc-300">Цена до</Label>
                      <Input
                        id="ads-price-max"
                        type="number"
                        placeholder="1000000"
                        value={adsFilters.priceMax}
                        onChange={(e) => setAdsFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ads-err-min" className="text-zinc-300">СРМ от</Label>
                      <Input
                        id="ads-err-min"
                        type="number"
                        placeholder="0"
                        value={adsFilters.errMin}
                        onChange={(e) => setAdsFilters(prev => ({ ...prev, errMin: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ads-err-max" className="text-zinc-300">СРМ до</Label>
                      <Input
                        id="ads-err-max"
                        type="number"
                        placeholder="100"
                        value={adsFilters.errMax}
                        onChange={(e) => setAdsFilters(prev => ({ ...prev, errMax: e.target.value }))}
                        className="bg-[#2c2c2e] border-zinc-600 text-white"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setAdsDialogOpen(false)} className="bg-primary hover:bg-primary/90">
                    Применить
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
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
        ) : allChannels?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
              <SearchX className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold text-white">No channels found</h3>
            <p className="text-zinc-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Show content based on selected platform */}
            {selectedPlatform === "Telegram" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {telegramChannels.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            )}

            {selectedPlatform === "TikTok" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {tiktokChannels.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            )}

            {selectedPlatform === "Реклама" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {allChannels?.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
