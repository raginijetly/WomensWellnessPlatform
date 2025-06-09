import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { InsertUser, User, LoginData, Onboarding } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Dummy type for mutations to simulate real functionality
type MutationResult<TData, TVariables> = {
  mutate: (variables: TVariables, options?: any) => void;
  isPending: boolean;
  isSuccess: boolean;
  data: TData | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: MutationResult<User, LoginData>;
  logoutMutation: MutationResult<void, void>;
  registerMutation: MutationResult<User, InsertUser>;
  updateOnboarding: (data: Onboarding) => void;
};

// Create auth context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  loginMutation: {
    mutate: () => {},
    isPending: false,
    isSuccess: false,
    data: null,
  },
  logoutMutation: {
    mutate: () => {},
    isPending: false,
    isSuccess: false,
    data: null,
  },
  registerMutation: {
    mutate: () => {},
    isPending: false,
    isSuccess: false,
    data: null,
  },
  updateOnboarding: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if there's a saved user in local storage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    
    // Simulate initial loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Login mutation
  const [loginPending, setLoginPending] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginData, setLoginData] = useState<User | null>(null);

  const loginMutation: MutationResult<User, LoginData> = {
    mutate: (credentials, options) => {
      setLoginPending(true);
      
      // Simulate API request with timeout
      setTimeout(() => {
        setLoginPending(false);
        
        // Simulate successful login for demo purposes
        const newUser: User = {
          id: 1,
          name: null,
          username: credentials.username,
          password: "********", // Don't store real password
          email: null,
          lastPeriodDate: null,
          dontKnowPeriodDate: false,
          age: null,
          periodsRegular: null,
          fitnessLevel: null,
          dietaryPreferences: null,
          healthGoals: [],
          healthConditions: [],
          lifeStage: null,
          completedOnboarding: false,
        };
        
        setUser(newUser);
        setLoginData(newUser);
        setLoginSuccess(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        if (options?.onSuccess) {
          options.onSuccess(newUser);
        }
      }, 800);
    },
    isPending: loginPending,
    isSuccess: loginSuccess,
    data: loginData,
  };

  // Register mutation
  const [registerPending, setRegisterPending] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerData, setRegisterData] = useState<User | null>(null);

  const registerMutation: MutationResult<User, InsertUser> = {
    mutate: (userData, options) => {
      setRegisterPending(true);
      
      // Simulate API request with timeout
      setTimeout(() => {
        setRegisterPending(false);
        
        const newUser: User = {
          id: 1,
          username: userData.username,
          password: "********", // Don't store actual password
          name: userData.name || null,
          email: userData.email || null,
          lastPeriodDate: null,
          dontKnowPeriodDate: false,
          age: null,
          periodsRegular: null,
          fitnessLevel: null,
          dietaryPreferences: null,
          healthGoals: [],
          healthConditions: [],
          lifeStage: null,
          completedOnboarding: false,
        };
        
        setUser(newUser);
        setRegisterData(newUser);
        setRegisterSuccess(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        if (options?.onSuccess) {
          options.onSuccess(newUser);
        }
      }, 800);
    },
    isPending: registerPending,
    isSuccess: registerSuccess,
    data: registerData,
  };

  // Logout mutation
  const [logoutPending, setLogoutPending] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  const logoutMutation: MutationResult<void, void> = {
    mutate: (_, options) => {
      setLogoutPending(true);
      
      // Simulate API request with timeout
      setTimeout(() => {
        setLogoutPending(false);
        setUser(null);
        setLogoutSuccess(true);
        localStorage.removeItem('user');
        
        if (options?.onSuccess) {
          options.onSuccess();
        }
      }, 500);
    },
    isPending: logoutPending,
    isSuccess: logoutSuccess,
    data: null,
  };

  // Function to update onboarding information
  const updateOnboarding = (onboardingData: Onboarding) => {
    if (!user) return;
    
    // Create updated user with onboarding data
    const updatedUser = {
      ...user,
      lastPeriodDate: onboardingData.lastPeriodDate || null,
      dontKnowPeriodDate: onboardingData.dontKnowPeriodDate || false,
      age: onboardingData.age || null,
      periodsRegular: onboardingData.periodsRegular || null,
      fitnessLevel: onboardingData.fitnessLevel || null,
      dietaryPreferences: onboardingData.dietaryPreferences || null,
      healthGoals: onboardingData.healthGoals || [],
      healthConditions: onboardingData.healthConditions || [],
      lifeStage: onboardingData.lifeStage || null,
      completedOnboarding: true,
    };
    
    // Update user state and localStorage
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Show success toast
    toast({
      title: "Profile updated",
      description: "Your information has been saved successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        updateOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}