import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { emailRegisterSchema, loginSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User as UserIcon, Lock, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof emailRegisterSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [_, setLocation] = useLocation();
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

  // Sign Up form setup
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(emailRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      username: "", // Will be auto-filled from email before submission
    },
  });
  
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

  // Handle sign up form submission
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
          title: "Sign Up failed",
          description: error.message || "Email may already be registered",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen gradient-primary">
      {/* Auth form container */}
      <div className="w-full h-full max-w-md mx-auto p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center">
        <div className="w-full px-6 py-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              FemFit
            </h1>
            <div className="text-white text-sm sm:text-base opacity-90 space-y-1">
              <p>Your personalized fitness journey for every stage of womenhood</p>
              <p>Built by Women For Women</p>
            </div>
          </div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex mb-8 bg-transparent p-0 overflow-visible border-0 w-full justify-center gap-4 px-2">
              <TabsTrigger 
                value="login" 
                className={`transition-all text-white hover:text-white hover:bg-white/10
                  border-2 border-white/30 rounded-full py-2 px-8
                  ${activeTab === 'login' 
                    ? 'font-bold bg-white/10' 
                    : 'font-normal bg-transparent'
                  }`}
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className={`transition-all text-white hover:text-white hover:bg-white/10
                  border-2 border-white/30 rounded-full py-2 px-8
                  ${activeTab === 'signup' 
                    ? 'font-bold bg-white/10' 
                    : 'font-normal bg-transparent'
                  }`}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-1 mb-6">
                  <Label htmlFor="username" className="text-white font-normal mb-2">Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      placeholder="Username"
                      className="pl-10 h-12 text-base w-full rounded-xl bg-white text-gray-700"
                      {...loginForm.register("username")}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {loginForm.formState.errors.username && (
                    <p className="text-sm text-red-300">
                      {loginForm.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1 mb-6">
                  <Label htmlFor="password" className="text-white font-normal mb-2">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      className="pl-10 h-12 text-base w-full rounded-xl bg-white text-gray-700"
                      {...loginForm.register("password")}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-300">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 mt-3 bg-white text-purple-600 hover:bg-gray-50 transition-colors border-0 font-medium rounded-xl"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-purple-600" />
                  ) : null}
                  Log In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="space-y-1 mb-6">
                  <Label htmlFor="register-name" className="text-white font-normal mb-2">Full Name</Label>
                  <div className="relative">
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Enter your name"
                      className="pl-10 h-12 text-base w-full rounded-xl bg-white text-gray-700"
                      {...registerForm.register("name")}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-red-300">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-1 mb-6">
                  <Label htmlFor="register-email" className="text-white font-normal mb-2">Email</Label>
                  <div className="relative">
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12 text-base w-full rounded-xl bg-white text-gray-700"
                      {...registerForm.register("email")}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-red-300">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1 mb-6">
                  <Label htmlFor="register-password" className="text-white font-normal mb-2">Password</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Password (min. 6 characters)"
                      className="pl-10 h-12 text-base w-full rounded-xl bg-white text-gray-700"
                      {...registerForm.register("password")}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-300">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 mt-3 bg-white text-purple-600 hover:bg-gray-50 transition-colors border-0 font-medium rounded-xl"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-purple-600" />
                  ) : null}
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}