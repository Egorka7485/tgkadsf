
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="container max-w-2xl mx-auto p-4 pt-8">
      <h1 className="text-2xl font-bold mb-6">Календарь рекламы</h1>
      <Card className="bg-[#2c2c2e] border-white/5">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarIcon className="w-12 h-12 text-white/20 mb-4" />
          <p className="text-white/60">Здесь будет отображаться график ваших рекламных постов</p>
        </CardContent>
      </Card>
    </div>
  );
}
