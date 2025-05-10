import { users, type User, type InsertUser, type HealthCondition, type InsertHealthCondition } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Modify the interface with CRUD methods
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnboarding(
    id: number, 
    lastPeriodDate: Date | null, 
    age: number | null
  ): Promise<User>;
  getUserHealthConditions(userId: number): Promise<HealthCondition[]>;
  addHealthCondition(userId: number, condition: InsertHealthCondition): Promise<HealthCondition>;
  clearUserHealthConditions(userId: number): Promise<void>;
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private healthConditions: Map<number, HealthCondition[]>;
  currentId: number;
  healthConditionId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.healthConditions = new Map();
    this.currentId = 1;
    this.healthConditionId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      lastPeriodDate: null,
      age: null,
      completedOnboarding: false
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserOnboarding(
    id: number, 
    lastPeriodDate: Date | null, 
    age: number | null
  ): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      lastPeriodDate,
      age,
      completedOnboarding: true
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserHealthConditions(userId: number): Promise<HealthCondition[]> {
    return this.healthConditions.get(userId) || [];
  }

  async addHealthCondition(userId: number, insertCondition: InsertHealthCondition): Promise<HealthCondition> {
    const id = this.healthConditionId++;
    const condition: HealthCondition = { 
      ...insertCondition, 
      id, 
      userId 
    };

    if (!this.healthConditions.has(userId)) {
      this.healthConditions.set(userId, []);
    }

    const conditions = this.healthConditions.get(userId)!;
    conditions.push(condition);

    return condition;
  }

  async clearUserHealthConditions(userId: number): Promise<void> {
    this.healthConditions.set(userId, []);
  }
}

export const storage = new MemStorage();
