import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { User, emailRegisterSchema } from "@shared/schema";
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

// Type definitions
type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof emailRegisterSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [_, setLocation] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Redirect to home if user is already logged in
    if (!isLoading && user) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);
  
  // If still loading or user is already logged in, return early
  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

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
    resolver: zodResolver(emailRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      username: "", // Will be auto-filled from email before submission
    },
  });

  // Handle login form submission
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have been logged in successfully",
        });
        setLocation("/");
      },
      onError: (error: Error) => {
        toast({
          title: "Login failed",
          description: error.message || "Invalid username or password",
          variant: "destructive",
        });
      },
    });
  };

  // Handle registration form submission
  const onRegisterSubmit = (values: RegisterFormValues) => {
    // Set username to email for compatibility with backend
    const submitData = {
      ...values,
      username: values.email // Use email as username
    };
    
    registerMutation.mutate(submitData, {
      onSuccess: () => {
        toast({
          title: "Account created",
          description: "Your account has been created successfully",
        });
        setLocation("/");
      },
      onError: (error: Error) => {
        toast({
          title: "Registration failed",
          description: error.message || "Email may already be registered",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Auth form container */}
      <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-10 flex items-center justify-center">
        <div className="w-full max-w-md px-4 py-6 sm:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              HerFitness
            </h1>
            <p className="text-white text-base sm:text-lg opacity-90 mb-1">
              Cycle-Smart Fitness for Every Stage of Womanhood
            </p>
            <p className="text-white text-sm sm:text-base opacity-80">
              Built by Women for Women
            </p>
          </div>

          {isLogin ? (
            // Login Form
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
                className="w-full bg-white text-purple-700 hover:bg-purple-50 transition-colors border-2 border-white shadow-md font-bold"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-purple-700" />
                ) : null}
                Log In
              </Button>

              <p className="text-center text-sm text-white mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-white font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            // Registration Form
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-white">Full Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your name"
                    className="pl-10 h-11 text-base w-full"
                    {...registerForm.register("name")}
                  />
                </div>
                {registerForm.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-white">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-11 text-base w-full"
                    {...registerForm.register("email")}
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {registerForm.formState.errors.email.message}
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
                    placeholder="Password (min. 6 characters)"
                    className="pl-10 h-11 text-base w-full"
                    {...registerForm.register("password")}
                  />
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-purple-700 hover:bg-purple-50 transition-colors border-2 border-white shadow-md font-bold"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2 text-purple-700" />
                ) : null}
                Sign Up
              </Button>

              <p className="text-center text-sm text-white mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-white font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Hero section - clean and minimal */}
      <div className="hidden md:flex md:w-1/2 gradient-primary items-center justify-center">
        {/* Empty as per request for a minimal design */}
      </div>
    </div>
  );
}