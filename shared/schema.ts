
import { pgTable, text, integer, real, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  balance: real("balance").default(0),
  isAdmin: integer("is_admin").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  username: text("channel_username").notNull(), // e.g. @channel
  avatarUrl: text("avatar_url").notNull(),
  category: text("category").notNull(),
  platform: text("platform").notNull().default("telegram"), // telegram or tiktok
  subscribers: integer("subscribers").notNull(),
  views: integer("views").notNull(), // Average views
  err: real("err").notNull(), // Engagement rate
  price: integer("price").notNull(), // Price in TON
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  channelId: integer("channel_id").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // In a real app with session auth, could be null for guest but we'll assume auth
  channelId: integer("channel_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  channelId: integer("channel_id").notNull(),
  price: integer("price").notNull(), // Snapshot of price
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertChannelSchema = createInsertSchema(channels).omit({ id: true, createdAt: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertAdSchema = createInsertSchema(ads).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Channel = typeof channels.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Ad = typeof ads.$inferSelect;

// Request/Response Types
export type ChannelFilter = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minSubs?: number;
  platform?: string;
};
