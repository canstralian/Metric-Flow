import { z } from 'zod';
import { insertAlertSchema } from './schema';
export var errorSchemas = {
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
export var api = {
    auth: {
        // Replit Auth handles the actual login/logout routes (/login, /logout)
        // We just need a way to get the current user
        me: {
            method: 'GET',
            path: '/api/user',
            responses: {
                200: z.custom(),
                401: z.null(), // Not logged in
            },
        },
    },
    metrics: {
        list: {
            method: 'GET',
            path: '/api/metrics',
            input: z.object({
                type: z.enum(['price', 'volatility', 'funding']).optional(),
                symbol: z.string().optional(),
                limit: z.coerce.number().optional(),
            }).optional(),
            responses: {
                200: z.array(z.custom()),
            },
        },
        latest: {
            method: 'GET',
            path: '/api/metrics/latest',
            responses: {
                200: z.record(z.string(), z.custom()),
                // Returns { "BTC-USD": { ...metric } }
            }
        }
    },
    alerts: {
        list: {
            method: 'GET',
            path: '/api/alerts',
            responses: {
                200: z.array(z.custom()),
                401: errorSchemas.notFound, // reuse for unauthorized
            },
        },
        create: {
            method: 'POST',
            path: '/api/alerts',
            input: insertAlertSchema,
            responses: {
                201: z.custom(),
                400: errorSchemas.validation,
                401: errorSchemas.notFound,
            },
        },
        update: {
            method: 'PATCH',
            path: '/api/alerts/:id',
            input: insertAlertSchema.partial(),
            responses: {
                200: z.custom(),
                404: errorSchemas.notFound,
                401: errorSchemas.notFound,
            },
        },
        delete: {
            method: 'DELETE',
            path: '/api/alerts/:id',
            responses: {
                204: z.void(),
                404: errorSchemas.notFound,
                401: errorSchemas.notFound,
            },
        },
    },
};
export function buildUrl(path, params) {
    var url = path;
    if (params) {
        Object.entries(params).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (url.includes(":".concat(key))) {
                url = url.replace(":".concat(key), String(value));
            }
        });
    }
    return url;
}
