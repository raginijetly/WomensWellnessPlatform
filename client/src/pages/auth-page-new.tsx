import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User as UserIcon, Lock } from "lucide-react";

// Schema for login form validation
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Schema for registration form validation
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

// Loading component to avoid duplication
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center gradient-primary">
    <Loader2 className="h-8 w-8 animate-spin text-white" />
  </div>
);

const AuthPage = () => {
  // State for toggling between login and register forms
  const [isLogin, setIsLogin] = useState(true);
  
  // Navigation
  const [_, setLocation] = useLocation();
  
  // Auth context and toast
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  
  // Login form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form setup
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      email: "",
    },
  });
  
  // Handle redirect when authenticated
  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);
  
  // Form submission handlers
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Registration successful",
          description: "Welcome to HerFitness!",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };
  
  // Show loading state
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Redirect if already logged in
  if (user) {
    return <LoadingScreen />;
  }

  // Main render
  return (
    <div className="min-h-screen gradient-primary flex flex-col">
      <div className="w-full p-6 flex-1 flex flex-col">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">HerFitness</h1>
          
          {/* Tab navigation */}
          <div className="flex border-b border-white/30 mb-6">
            <button
              className={`py-2 px-4 font-medium ${isLogin ? 'text-white border-b-2 border-white' : 'text-white/70'}`}
              onClick={() => setIsLogin(true)}
              type="button"
            >
              Login
            </button>
            <button
              className={`py-2 px-4 font-medium ${!isLogin ? 'text-white border-b-2 border-white' : 'text-white/70'}`}
              onClick={() => setIsLogin(false)}
              type="button"
            >
              Register
            </button>
          </div>
          
          {/* Login form */}
          {isLogin ? (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    className="pl-10 h-11 text-base"
                    {...loginForm.register("username")}
                  />
                </div>
                {loginForm.formState.errors.username && (
                  <p className="text-sm text-red-500">
                    {loginForm.formState.errors.username.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="pl-10 h-11 text-base"
                    {...loginForm.register("password")}
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-white text-purple-700 hover:bg-gray-100"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-username" className="text-white">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="Username"
                    className="pl-10 h-11 text-base"
                    {...registerForm.register("username")}
                  />
                </div>
                {registerForm.formState.errors.username && (
                  <p className="text-sm text-red-500">
                    {registerForm.formState.errors.username.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-white">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Password"
                    className="pl-10 h-11 text-base"
                    {...registerForm.register("password")}
                  />
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Name (optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="h-11 text-base"
                  {...registerForm.register("name")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  className="h-11 text-base"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-white text-purple-700 hover:bg-gray-100"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
      
      {/* Hero/Marketing section - now at the bottom for mobile */}
      <div className="w-full p-6 pt-0 pb-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-3">Your personalized wellness journey starts here</h2>
          <p className="text-white/80 mb-4 text-sm">
            HerFitness is designed specifically for women, with personalized fitness recommendations 
            that adapt to your unique health needs, including your menstrual cycle.
          </p>
          <ul className="space-y-2 text-white/90 text-sm">
            <li className="flex items-start">
              <div className="bg-white/20 rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Personalized workouts based on your cycle phase</span>
            </li>
            <li className="flex items-start">
              <div className="bg-white/20 rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Nutrition guidance adapting to your body's needs</span>
            </li>
            <li className="flex items-start">
              <div className="bg-white/20 rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Supportive community of women on similar journeys</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;