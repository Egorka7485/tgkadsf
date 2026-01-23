
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ChannelDetails from "@/pages/ChannelDetails";
import Cart from "@/pages/Cart";
import Admin from "@/pages/Admin";
import CalendarPage from "@/pages/Calendar";
import ChatPage from "@/pages/Chat";
import ProfilePage from "@/pages/Profile";
import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/Navigation";

function Router() {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/channels/:id" component={ChannelDetails} />
        <Route path="/cart" component={Cart} />
        <Route path="/admin">
          {() => (
            isLoading ? null : (user?.isAdmin ? <Admin /> : <NotFound />)
          )}
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Navigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
