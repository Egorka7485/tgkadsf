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
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { user, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/channels/:id" component={ChannelDetails} />
      <Route path="/cart" component={Cart} />
      {/* Protected Admin Route - simplified for demo */}
      <Route path="/admin">
        {() => (
          isLoading ? null : (user?.isAdmin ? <Admin /> : <NotFound />)
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
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
