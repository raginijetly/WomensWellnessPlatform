import { pgTable, text, serial, integer, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Available health goals
export const HEALTH_GOALS = [
  "Weight management",
  "Get stronger",
  "Reduce stress/Manage my mood better",
  "Improve sleep quality",
  "Balance my hormones"
] as const;

// Available health conditions
export const HEALTH_CONDITIONS = [
  "PCOS",
  "Thyroid disorder",
  "Diabetes",
  "Fibroids",
  "Endometriosis"
] as const;

// Life stages
export const LIFE_STAGES = [
  "None",
  "Prenatal",
  "Postpartum",
  "Menopause"
] as const;

// Symptoms
export const SYMPTOMS = [
  "Acne",
  "Hair loss",
  "Excessive Hair growth",
  "Low libido",
  "Fatigue"
] as const;

// Period regularity options
export const PERIOD_REGULARITY = [
  "Yes",
  "No",
  "I'm unsure"
] as const;

// Menstrual cycle phases
export const CYCLE_PHASES = [
  "Menstruation",
  "Follicular",
  "Ovulation",
  "Luteal"
] as const;

// Define the user table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  // Onboarding fields
  lastPeriodDate: date("last_period_date"),
  dontKnowPeriodDate: boolean("dont_know_period_date").default(false),
  age: integer("age"),
  periodsRegular: text("periods_regular"),
  fitnessLevel: text("fitness_level"),
  dietaryPreferences: text("dietary_preferences"),
  healthGoals: text("health_goals").array(),
  healthConditions: text("health_conditions").array(),
  lifeStage: text("life_stage"),
  completedOnboarding: boolean("completed_onboarding").default(false).notNull(),
});

// Health conditions (separate table for many-to-many relationship)
export const healthConditions = pgTable("health_conditions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  condition: text("condition").notNull(),
});

// Create insert schema for the user table
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

// Alternate schema for email-based registration
export const emailRegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  username: z.string().optional(), // We'll derive this from email
});

// Create login schema
export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Onboarding schema
export const onboardingSchema = z.object({
  lastPeriodDate: z.date().nullable().optional(),
  dontKnowPeriodDate: z.boolean().optional(),
  age: z.number().min(13).max(100).nullable().optional(),
  periodsRegular: z.string().optional(),
  fitnessLevel: z.string().optional(),
  dietaryPreferences: z.string().optional(),
  healthGoals: z.array(z.string()).optional(),
  healthConditions: z.array(z.string()).optional(),
  lifeStage: z.string().optional(),
  completedOnboarding: z.boolean().optional(),
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type EmailRegisterData = z.infer<typeof emailRegisterSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type Onboarding = z.infer<typeof onboardingSchema>;
export type HealthCondition = typeof healthConditions.$inferSelect;