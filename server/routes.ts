
import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingChannels = await storage.getChannels();
  if (existingChannels.length === 0) {
    const mockChannels = [
      {
        name: "Tech Insider",
        description: "Latest technology news, reviews, and leaks. Daily updates from the tech world.",
        username: "@techinsider",
        avatarUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3",
        category: "Technology",
        subscribers: 154000,
        views: 45000,
        err: 29.2,
        price: 15000,
        verified: true,
      },
      {
        name: "Crypto Signals VIP",
        description: "Best crypto trading signals and market analysis. Join our premium community.",
        username: "@cryptovip",
        avatarUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3",
        category: "Finance",
        subscribers: 89000,
        views: 32000,
        err: 35.9,
        price: 25000,
        verified: true,
      },
      {
        name: "Funny Memes 24/7",
        description: "Your daily dose of laughter. Best memes from around the internet.",
        username: "@funnymemes",
        avatarUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3",
        category: "Entertainment",
        subscribers: 450000,
        views: 120000,
        err: 26.6,
        price: 8000,
        verified: false,
      },
      {
        name: "World News Daily",
        description: "Unbiased news coverage from around the globe. Stay informed.",
        username: "@worldnews",
        avatarUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3",
        category: "News",
        subscribers: 210000,
        views: 85000,
        err: 40.5,
        price: 18000,
        verified: true,
      },
      {
        name: "Healthy Living",
        description: "Tips for a healthier lifestyle, diet plans, and workout routines.",
        username: "@healthylife",
        avatarUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3",
        category: "Health",
        subscribers: 65000,
        views: 15000,
        err: 23.1,
        price: 5000,
        verified: false,
      },
      {
        name: "Startup Ideas",
        description: "Daily startup ideas and business inspiration for entrepreneurs.",
        username: "@startupideas",
        avatarUrl: "https://images.unsplash.com/photo-1559136555-930b7a4754a4?ixlib=rb-4.0.3",
        category: "Business",
        subscribers: 112000,
        views: 28000,
        err: 25.0,
        price: 12000,
        verified: true,
      }
    ];

    for (const channel of mockChannels) {
      await storage.createChannel(channel);
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Helper to get userId (simulated or real)
  // In a real app with Replit Auth, we would look up the numeric ID from the postgres users table
  // For this MVP, we'll assume a fixed user ID = 1 for cart operations if auth fails, 
  // or implement a quick lookup if the user is authenticated.
  const getUserId = async (req: any) => {
    // Basic fallback for development if auth isn't fully working yet
    // In production, we should map req.user.claims.sub to our internal numeric user ID
    return 1; 
  };

  app.get(api.channels.list.path, async (req, res) => {
    try {
      const input = api.channels.list.input?.parse(req.query) || {};
      const channels = await storage.getChannels(input);
      res.json(channels);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.channels.get.path, async (req, res) => {
    const channel = await storage.getChannel(Number(req.params.id));
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.json(channel);
  });

  app.get(api.cart.list.path, async (req, res) => {
    const userId = await getUserId(req);
    const items = await storage.getCartItems(userId);
    res.json(items);
  });

  app.post(api.cart.add.path, async (req, res) => {
    try {
      const { channelId } = api.cart.add.input.parse(req.body);
      const userId = await getUserId(req);
      const item = await storage.addToCart(userId, channelId);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.delete(api.cart.remove.path, async (req, res) => {
    await storage.removeFromCart(Number(req.params.id));
    res.status(204).send();
  });

  app.post(api.cart.checkout.path, async (req, res) => {
    const userId = await getUserId(req);
    const cartItems = await storage.getCartItems(userId);
    
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.channel.price, 0);
    const orderItems = cartItems.map(item => ({
      channelId: item.channel.id,
      price: item.channel.price
    }));

    const order = await storage.createOrder(userId, totalAmount, orderItems);
    await storage.clearCart(userId);
    
    res.status(201).json(order);
  });

  // Seed data on startup
  seedDatabase().catch(console.error);

  return httpServer;
}
