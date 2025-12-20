import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Metrics Routes
  app.get(api.metrics.list.path, async (req, res) => {
    const limit = Number(req.query.limit) || 50;
    const metrics = await storage.getMetrics(limit);
    res.json(metrics);
  });

  app.get(api.metrics.latest.path, async (req, res) => {
    const latest = await storage.getLatestMetrics();
    res.json(latest);
  });

  // Alerts Routes
  app.get(api.alerts.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    // Note: User ID from Replit Auth is a string (UUID), but our schema uses integer for userId.
    // This is a schema conflict we need to address. 
    // For this MVP, we'll assume we need to fix the schema to match Replit Auth's string IDs.
    // Casting to any for now to avoid TS errors while we fix the schema in the next step.
    const userId = (req.user as any).id; 
    const alerts = await storage.getAlerts(userId); 
    res.json(alerts);
  });

  app.post(api.alerts.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.alerts.create.input.parse(req.body);
      const userId = (req.user as any).id;
      const alert = await storage.createAlert({ ...input, userId });
      res.status(201).json(alert);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.alerts.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteAlert(Number(req.params.id));
    res.status(204).send();
  });

  // Seeding Function
  async function seedDatabase() {
    const metrics = await storage.getMetrics(1);
    if (metrics.length === 0) {
      console.log("Seeding metrics...");
      await storage.createMetric({
        type: 'price',
        value: "65000.50",
        symbol: 'BTC-USD',
        source: 'simulated-oracle',
        metadata: { confidence: 0.99 }
      });
      await storage.createMetric({
        type: 'volatility',
        value: "45.2",
        symbol: 'BTC-USD',
        source: 'volatility-sensor',
        metadata: { window: '24h' }
      });
    }
  }

  // Run seed
  seedDatabase().catch(console.error);

  return httpServer;
}
