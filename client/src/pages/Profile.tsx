
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Wallet } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="container max-w-2xl mx-auto p-4 pt-8">
      <h1 className="text-2xl font-bold mb-6">Профиль</h1>
      
      <Card className="bg-[#2c2c2e] border-white/5 mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.avatarUrl || ""} />
              <AvatarFallback className="bg-[#0088cc] text-white text-xl">
                {user?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-white/60">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-2">
        <Button variant="ghost" className="w-full justify-start gap-3 bg-[#2c2c2e] hover:bg-white/5 h-14 rounded-xl border-white/5">
          <Wallet className="w-5 h-5 text-[#0088cc]" />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">Баланс</div>
            <div className="text-xs text-white/60">{user?.balance || "0.00"} ₽</div>
          </div>
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-3 bg-[#2c2c2e] hover:bg-white/5 h-14 rounded-xl border-white/5">
          <Settings className="w-5 h-5 text-white/60" />
          <span>Настройки</span>
        </Button>

        <Button 
          variant="ghost" 
          onClick={() => logout()}
          className="w-full justify-start gap-3 bg-[#2c2c2e] hover:bg-red-500/10 text-red-400 h-14 rounded-xl border-white/5"
        >
          <LogOut className="w-5 h-5" />
          <span>Выйти</span>
        </Button>
      </div>
    </div>
  );
}
