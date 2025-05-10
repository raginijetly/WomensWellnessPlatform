import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertHealthConditionSchema, onboardingSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // User onboarding route
  app.post("/api/onboarding", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      // Validate onboarding data
      const onboardingData = onboardingSchema.parse({
        ...req.body,
        completedOnboarding: true
      });

      // Get health conditions array from request
      const healthConditions = z.array(z.string()).parse(req.body.healthConditions || []);

      // Update user with onboarding data
      const updatedUser = await storage.updateUserOnboarding(
        req.user!.id, 
        onboardingData.lastPeriodDate || null, 
        onboardingData.age ? parseInt(onboardingData.age) : null,
        onboardingData.healthGoal || null
      );

      // Clear any existing health conditions and add new ones
      await storage.clearUserHealthConditions(req.user!.id);
      
      for (const condition of healthConditions) {
        await storage.addHealthCondition(req.user!.id, { condition });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Get health conditions for a user
  app.get("/api/health-conditions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const conditions = await storage.getUserHealthConditions(req.user!.id);
      res.status(200).json(conditions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get health conditions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
