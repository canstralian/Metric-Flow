import { z } from 'zod';
import { insertAlertSchema, metrics, alerts, users } from './schema';

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
  auth: {
    // Replit Auth handles the actual login/logout routes (/login, /logout)
    // We just need a way to get the current user
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.null(), // Not logged in
      },
    },
  },
  metrics: {
    list: {
      method: 'GET' as const,
      path: '/api/metrics',
      input: z.object({
        type: z.enum(['price', 'volatility', 'funding']).optional(),
        symbol: z.string().optional(),
        limit: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof metrics.$inferSelect>()),
      },
    },
    latest: {
      method: 'GET' as const,
      path: '/api/metrics/latest',
      responses: {
        200: z.record(z.string(), z.custom<typeof metrics.$inferSelect>()), 
        // Returns { "BTC-USD": { ...metric } }
      }
    }
  },
  alerts: {
    list: {
      method: 'GET' as const,
      path: '/api/alerts',
      responses: {
        200: z.array(z.custom<typeof alerts.$inferSelect>()),
        401: errorSchemas.notFound, // reuse for unauthorized
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/alerts',
      input: insertAlertSchema,
      responses: {
        201: z.custom<typeof alerts.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/alerts/:id',
      input: insertAlertSchema.partial(),
      responses: {
        200: z.custom<typeof alerts.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/alerts/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.notFound,
      },
    },
  },
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
