
import { db } from "./db";
import { eq, like, and, gte, lte, desc, inArray } from "drizzle-orm";
import {
  users, channels, cartItems, orders, orderItems,
  type User, type InsertUser,
  type Channel, type InsertChannel,
  type CartItem, type InsertCartItem,
  type Order, type InsertOrder,
  type ChannelFilter
} from "@shared/schema";

export interface IStorage {
  // Users (Auth handled by Replit Auth, but we might need helpers)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Channels
  getChannels(filter?: ChannelFilter & { search?: string }): Promise<Channel[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;

  // Cart
  getCartItems(userId: number): Promise<(CartItem & { channel: Channel })[]>;
  addToCart(userId: number, channelId: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: number): Promise<void>;

  // Orders
  createOrder(userId: number, totalAmount: number, items: { channelId: number, price: number }[]): Promise<Order>;
  getOrders(userId: number): Promise<Order[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getChannels(filter?: ChannelFilter & { search?: string }): Promise<Channel[]> {
    const conditions = [];

    if (filter?.search) {
      conditions.push(like(channels.name, `%${filter.search}%`));
    }
    if (filter?.category) {
      conditions.push(eq(channels.category, filter.category));
    }
    if (filter?.platform) {
      conditions.push(eq(channels.platform, filter.platform));
    }
    if (filter?.minPrice) {
      conditions.push(gte(channels.price, filter.minPrice));
    }
    if (filter?.maxPrice) {
      conditions.push(lte(channels.price, filter.maxPrice));
    }
    if (filter?.minSubs) {
      conditions.push(gte(channels.subscribers, filter.minSubs));
    }

    return await db.select().from(channels)
      .where(and(...conditions))
      .orderBy(desc(channels.subscribers));
  }

  async getChannel(id: number): Promise<Channel | undefined> {
    const [channel] = await db.select().from(channels).where(eq(channels.id, id));
    return channel;
  }

  async createChannel(channel: InsertChannel): Promise<Channel> {
    const [newChannel] = await db.insert(channels).values(channel).returning();
    return newChannel;
  }

  async deleteAllChannels(): Promise<void> {
    await db.delete(channels);
  }

  async getCartItems(userId: number): Promise<(CartItem & { channel: Channel })[]> {
    const items = await db.select({
      cartItem: cartItems,
      channel: channels,
    })
      .from(cartItems)
      .innerJoin(channels, eq(cartItems.channelId, channels.id))
      .where(eq(cartItems.userId, userId));

    return items.map(({ cartItem, channel }) => ({ ...cartItem, channel }));
  }

  async addToCart(userId: number, channelId: number): Promise<CartItem> {
    const [item] = await db.insert(cartItems).values({ userId, channelId }).returning();
    return item;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  async createOrder(userId: number, totalAmount: number, items: { channelId: number, price: number }[]): Promise<Order> {
    return await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values({
        userId,
        totalAmount,
        status: "completed", // Simplified
      }).returning();

      if (items.length > 0) {
        await tx.insert(orderItems).values(
          items.map(item => ({
            orderId: order.id,
            channelId: item.channelId,
            price: item.price
          }))
        );
      }

      return order;
    });
  }

  async getOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }
}

export const storage = new DatabaseStorage();
