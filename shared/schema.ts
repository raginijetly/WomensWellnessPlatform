import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Available health goals
export const HEALTH_GOALS = [
  "General Fitness",
  "Weight Management",
  "Energy Boost",
  "Mood Improvement"
] as const;

// Available health conditions
export const HEALTH_CONDITIONS = [
  "PCOS",
  "Prenatal",
  "New Mom",
  "Menopause",
  "Thyroid",
  "Diabetes"
] as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  lastPeriodDate: date("last_period_date"),
  age: integer("age"),
  healthGoal: text("health_goal"),
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

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const onboardingSchema = z.object({
  lastPeriodDate: z.string().nullable().optional(),
  age: z.number().nullable().optional(),
  healthGoal: z.string().nullable().optional(),
  completedOnboarding: z.boolean().optional(),
  healthConditions: z.array(z.string()).optional(),
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
