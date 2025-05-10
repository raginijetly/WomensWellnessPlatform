import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@shared/schema";
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

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [_, setLocation] = useLocation();
  const auth = useAuth();
  const { toast } = useToast();
  
  // While auth is being initialized, show nothing
  if (!auth) return null;
  
  const { loginMutation, registerMutation, user } = auth;

  // If user is already logged in, redirect to home page
  if (user) {
    setLocation("/");
    return null;
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
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      email: "",
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
    registerMutation.mutate(values, {
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
          description: error.message || "Username may already be taken",
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
            <p className="text-white text-base sm:text-lg">
              {isLogin ? "Sign in to your account" : "Create a new account"}
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

      {/* Mobile Hero section (shown at bottom on mobile) */}
      <div className="md:hidden w-full px-4 pt-4 pb-8 mt-4 border-t border-white/20">
        <div className="text-white text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Your fitness journey starts here
          </h2>
          <p className="text-base mb-6">
            Personalized workouts designed for women's unique needs
          </p>
          <div className="flex flex-col space-y-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
              <h3 className="font-semibold mb-1">Personalized Plans</h3>
              <p className="text-sm">Workouts tailored to your body's unique cycles</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop Hero section */}
      <div className="hidden md:flex md:w-1/2 p-10 items-center justify-center">
        <div className="text-white max-w-lg">
          <h1 className="text-5xl font-bold mb-6">
            Your personal fitness journey starts here
          </h1>
          <p className="text-xl mb-8">
            HerFitness helps you achieve your health and fitness goals with personalized workouts
            designed specifically for women's needs.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-1">Personalized Plans</h3>
              <p>Workouts tailored to your body's unique cycles</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-1">Expert Guidance</h3>
              <p>Created by trainers who understand women's health</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}