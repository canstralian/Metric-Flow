import { db } from "./db";
import {
  users, metrics, alerts,
  type User, type InsertUser,
  type Metric, type InsertMetric,
  type Alert, type InsertAlert,
  type UpdateAlertRequest
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;

  createMetric(metric: InsertMetric): Promise<Metric>;
  getMetrics(limit?: number): Promise<Metric[]>;
  getLatestMetrics(): Promise<Record<string, Metric>>;

  createAlert(alert: InsertAlert): Promise<Alert>;
  getAlerts(userId: string): Promise<Alert[]>; // Changed to string
  updateAlert(id: number, updates: UpdateAlertRequest): Promise<Alert>;
  deleteAlert(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email, // Use email as unique constraint since id is auto-generated in some flows
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const [metric] = await db.insert(metrics).values(insertMetric).returning();
    return metric;
  }

  async getMetrics(limit = 100): Promise<Metric[]> {
    return await db.select().from(metrics).orderBy(desc(metrics.timestamp)).limit(limit);
  }

  async getLatestMetrics(): Promise<Record<string, Metric>> {
    const recent = await db.select().from(metrics).orderBy(desc(metrics.timestamp)).limit(100);
    const latest: Record<string, Metric> = {};
    for (const m of recent) {
      if (!latest[m.symbol]) {
        latest[m.symbol] = m;
      }
    }
    return latest;
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts).values(insertAlert).returning();
    return alert;
  }

  async getAlerts(userId: string): Promise<Alert[]> {
    return await db.select().from(alerts).where(eq(alerts.userId, userId));
  }

  async updateAlert(id: number, updates: UpdateAlertRequest): Promise<Alert> {
    const [alert] = await db.update(alerts).set(updates).where(eq(alerts.id, id)).returning();
    return alert;
  }

  async deleteAlert(id: number): Promise<void> {
    await db.delete(alerts).where(eq(alerts.id, id));
  }
}

export const storage = new DatabaseStorage();
