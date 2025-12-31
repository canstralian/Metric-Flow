var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
// Fix schema to be compatible with Replit Auth
import { pgTable, text, serial, boolean, timestamp, jsonb, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
// === TABLE DEFINITIONS ===
// Replit Auth compatible users table
export var users = pgTable("users", {
    id: varchar("id").primaryKey().default(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))), // Matches Replit Auth
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
export var sessions = pgTable("sessions", {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
});
// Mock Data Points
export var metrics = pgTable("metrics", {
    id: serial("id").primaryKey(),
    type: text("type").notNull(),
    value: decimal("value").notNull(),
    symbol: text("symbol").notNull(),
    source: text("source").notNull(),
    timestamp: timestamp("timestamp").defaultNow(),
    metadata: jsonb("metadata"),
});
// Alerts configuration
export var alerts = pgTable("alerts", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id").references(function () { return users.id; }).notNull(), // Changed to varchar to match users.id
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
export var insertUserSchema = createInsertSchema(users).omit({ createdAt: true, updatedAt: true });
export var insertMetricSchema = createInsertSchema(metrics).omit({ id: true, timestamp: true });
export var insertAlertSchema = createInsertSchema(alerts).omit({ id: true, lastTriggeredAt: true, createdAt: true });
export var WS_EVENTS = {
    METRIC_UPDATE: 'metric-update',
    ALERT_TRIGGERED: 'alert-triggered',
};
var templateObject_1;
