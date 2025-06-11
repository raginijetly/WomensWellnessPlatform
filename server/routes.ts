import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { storage } from "./storage";
import { generateRecommendations, type UserProfile } from "@shared/recommendations";
import { onboardingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Update user onboarding data
  app.post("/api/user/onboarding", async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const validatedData = onboardingSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(req.user.id, {
        ...validatedData,
        completedOnboarding: true
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      next(error);
    }
  });

  // Get user recommendations
  app.get("/api/user/recommendations", async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.user.id);
      if (!user || !user.completedOnboarding) {
        return res.status(400).json({ message: "Please complete onboarding first" });
      }

      const userProfile: UserProfile = {
        age: user.age || undefined,
        fitnessLevel: user.fitnessLevel || undefined,
        healthGoals: user.healthGoals || [],
        healthConditions: user.healthConditions || [],
        lastPeriodDate: user.lastPeriodDate || undefined,
        periodsRegular: user.periodsRegular || undefined,
        dietaryPreferences: user.dietaryPreferences || undefined,
        symptoms: user.symptoms || [],
        lifeStage: user.lifeStage || undefined,
      };

      const recommendations = generateRecommendations(userProfile);
      
      if (!recommendations) {
        return res.status(400).json({ message: "Unable to generate recommendations. Please ensure your period date is set." });
      }

      res.json(recommendations);
    } catch (error) {
      next(error);
    }
  });

  // Get current user data
  app.get("/api/user", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  const httpServer = createServer(app);
  return httpServer;
}
