
import { Home, Calendar, MessageCircle, User, ShoppingCart, Target, Filter } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { icon: Home, label: "Главная", path: "/" },
  { icon: Target, label: "Подбор", path: "/selection" },
  { icon: ShoppingCart, label: "Корзина", path: "/cart" },
  { icon: Calendar, label: "Календарь", path: "/calendar" },
  { icon: MessageCircle, label: "Чат", path: "/chat" },
  { icon: User, label: "Профиль", path: "/profile" },
];

export function Navigation() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[calc(100vw-2rem)] px-2 sm:bottom-8 sm:px-4">
      <div className="flex items-center gap-1 p-1.5 rounded-full bg-[#2c2c2e]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const isProfile = item.path === "/profile";
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2.5 rounded-full transition-all duration-500 ease-out flex-shrink-0",
                  isActive
                    ? "bg-white/10 text-white ring-1 ring-white/20"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                {isProfile ? (
                  <div className="w-5 h-5 rounded-full overflow-hidden">
                    <img
                      src={user?.profileImageUrl || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive && "text-[#0088cc] scale-110")} />
                )}
                <span className={cn(
                  "text-xs sm:text-sm font-medium transition-all duration-500",
                  isActive
                    ? "opacity-100 animate-in fade-in slide-in-from-left-3 zoom-in-95"
                    : "opacity-0 w-0 overflow-hidden sm:opacity-100 sm:w-auto"
                )}>
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navigation;
