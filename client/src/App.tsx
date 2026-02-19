import { Router, Route, Switch } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Selection from "@/pages/Selection";
import ChannelDetails from "@/pages/ChannelDetails";
import Cart from "@/pages/Cart";
import Admin from "@/pages/Admin";
import CalendarPage from "@/pages/Calendar";
import ChatPage from "@/pages/Chat";
import ProfilePage from "@/pages/Profile";
import { useAuth } from "@/hooks/use-auth";

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/selection" component={Selection} />
        <Route path="/channels/:id" component={ChannelDetails} />
        <Route path="/cart" component={Cart} />
        <Route path="/admin" component={Admin} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
