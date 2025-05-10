import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  lastPeriodDate: date("last_period_date"),
  age: integer("age"),
  completedOnboarding: boolean("completed_onboarding").default(false).notNull(),
});

export const healthConditions = pgTable("health_conditions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  condition: text("condition").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

export const loginSchema = insertUserSchema.pick({
  username: true,
  password: true,
});

export const onboardingSchema = createInsertSchema(users).pick({
  lastPeriodDate: true,
  age: true,
  completedOnboarding: true,
});

export const insertHealthConditionSchema = createInsertSchema(healthConditions).pick({
  condition: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type Onboarding = z.infer<typeof onboardingSchema>;
export type HealthCondition = typeof healthConditions.$inferSelect;
export type InsertHealthCondition = z.infer<typeof insertHealthConditionSchema>;
