import { createContext, ReactNode, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User as SelectUser, InsertUser, LoginData } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

// Define the auth context type
type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
};

// Create the context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  loginMutation: {},
  logoutMutation: {},
  registerMutation: {},
});

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SelectUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Simple login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      setIsLoading(true);
      try {
        const res = await apiRequest("POST", "/api/login", credentials);
        const userData = await res.json();
        setUser(userData);
        setIsLoading(false);
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name || userData.username}!`,
        });
        return userData;
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
        toast({
          title: "Login failed",
          description: err.message,
          variant: "destructive",
        });
        throw err;
      }
    }
  });

  // Simple register mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      setIsLoading(true);
      try {
        const res = await apiRequest("POST", "/api/register", credentials);
        const userData = await res.json();
        setUser(userData);
        setIsLoading(false);
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully.",
        });
        return userData;
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
        toast({
          title: "Registration failed",
          description: err.message,
          variant: "destructive",
        });
        throw err;
      }
    }
  });

  // Simple logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      try {
        await apiRequest("POST", "/api/logout");
        setUser(null);
        setIsLoading(false);
        toast({
          title: "Logged out",
          description: "You have been logged out successfully.",
        });
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
        toast({
          title: "Logout failed",
          description: err.message,
          variant: "destructive",
        });
        throw err;
      }
    }
  });

  // Provide the context value
  const value = {
    user,
    isLoading,
    error,
    loginMutation,
    logoutMutation,
    registerMutation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
