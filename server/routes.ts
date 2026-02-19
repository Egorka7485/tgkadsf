
import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth only if REPL_ID is set (for Replit environment)
  if (process.env.REPL_ID) {
    await setupAuth(app);
    registerAuthRoutes(app);
  }

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
    await storage.removeFromCart(parseInt(req.params.id));
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

  return httpServer;
}
