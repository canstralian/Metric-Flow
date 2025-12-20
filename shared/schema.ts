// Fix schema to be compatible with Replit Auth
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// === TABLE DEFINITIONS ===

// Replit Auth compatible users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Matches Replit Auth
  username: text("username"), // Replit Auth provides email/names, not always username
  email: text("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isAdmin: boolean("is_admin").default(false),
});

// Sessions table for Replit Auth
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Mock Data Points
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), 
  value: decimal("value").notNull(),
  symbol: text("symbol").notNull(), 
  source: text("source").notNull(), 
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"), 
});

// Alerts configuration
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(), // Changed to varchar to match users.id
  name: text("name").notNull(),
  metricType: text("metric_type").notNull(), 
  condition: text("condition").notNull(), 
  threshold: decimal("threshold").notNull(),
  symbol: text("symbol").notNull(),
  isActive: boolean("is_active").default(true),
  lastTriggeredAt: timestamp("last_triggered_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertUserSchema = createInsertSchema(users).omit({ createdAt: true, updatedAt: true });
export const insertMetricSchema = createInsertSchema(metrics).omit({ id: true, timestamp: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, lastTriggeredAt: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type CreateAlertRequest = InsertAlert;
export type UpdateAlertRequest = Partial<InsertAlert>;

export type AlertResponse = Alert;

export const WS_EVENTS = {
  METRIC_UPDATE: 'metric-update',
  ALERT_TRIGGERED: 'alert-triggered',
} as const;
