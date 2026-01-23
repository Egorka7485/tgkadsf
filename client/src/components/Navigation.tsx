
import { Home, Calendar, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Главная", path: "/" },
  { icon: Calendar, label: "Календарь", path: "/calendar" },
  { icon: MessageCircle, label: "Чат", path: "/chat" },
  { icon: User, label: "Профиль", path: "/profile" },
];

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
      <div className="flex items-center gap-1 p-1.5 rounded-full bg-[#2c2c2e]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-500 ease-out",
                  isActive 
                    ? "bg-white/10 text-white ring-1 ring-white/20" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive && "text-[#0088cc] scale-110")} />
                {isActive && (
                  <span className="text-sm font-medium animate-in fade-in slide-in-from-left-3 zoom-in-95 duration-500">
                    {item.label}
                  </span>
                )}
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navigation;
