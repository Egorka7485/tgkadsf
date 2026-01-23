
import { z } from 'zod';
import { insertChannelSchema, insertCartItemSchema, channels, cartItems, orders } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  channels: {
    list: {
      method: 'GET' as const,
      path: '/api/channels',
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        minPrice: z.coerce.number().optional(),
        maxPrice: z.coerce.number().optional(),
        minSubs: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof channels.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/channels/:id',
      responses: {
        200: z.custom<typeof channels.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    // Admin only in real app, simplified here
    create: {
      method: 'POST' as const,
      path: '/api/channels',
      input: insertChannelSchema,
      responses: {
        201: z.custom<typeof channels.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  cart: {
    list: {
      method: 'GET' as const,
      path: '/api/cart',
      responses: {
        200: z.array(z.object({
          id: z.number(),
          channelId: z.number(),
          channel: z.custom<typeof channels.$inferSelect>(),
        })),
      },
    },
    add: {
      method: 'POST' as const,
      path: '/api/cart',
      input: z.object({ channelId: z.number() }),
      responses: {
        201: z.custom<typeof cartItems.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    remove: {
      method: 'DELETE' as const,
      path: '/api/cart/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    checkout: {
      method: 'POST' as const,
      path: '/api/cart/checkout',
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  auth: {
    // Replit Auth handles the endpoints, we just provide user info
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof import('./schema').User>().nullable(),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
