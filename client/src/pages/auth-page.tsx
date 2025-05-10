import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginData } from "@shared/schema";

// Extended schemas with additional validation
const loginSchema = z.object({
  username: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  remember: z.boolean().optional(),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  username: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    const { username, password } = values;
    loginMutation.mutate({ username, password });
  };

  const onSignupSubmit = (values: SignupFormValues) => {
    const { name, username, password } = values;
    registerMutation.mutate({ name, username, password });
  };

  return (
    <div className="auth-container min-h-screen flex items-center justify-center px-4 py-12 gradient-primary">
      <div className="dotted-grid w-full h-full absolute top-0 left-0 opacity-10"></div>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-medium text-3xl text-gradient-primary">
            Her<span className="font-light">Fitness</span>
          </h1>
          <p className="text-gray-600 mt-2 text-sm">The fitness app designed for women</p>
        </div>
        
        {/* Auth Tabs */}
        <div className="flex mb-8">
          <button 
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 px-4 font-medium text-center border-b-2 ${
              activeTab === "login" 
                ? "border-purple-500 text-purple-500" 
                : "border-gray-200 text-gray-500"
            }`}
          >
            Login
          </button>
          <button 
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 px-4 font-medium text-center border-b-2 ${
              activeTab === "signup" 
                ? "border-purple-500 text-purple-500" 
                : "border-gray-200 text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>
        
        {/* Login Form */}
        {activeTab === "login" && (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="youremail@example.com"
                        className="px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••••"
                        className="px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between text-sm">
                <FormField
                  control={loginForm.control}
                  name="remember"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label 
                        htmlFor="remember" 
                        className="text-gray-600 text-sm cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                  )}
                />
                <a href="#" className="font-medium text-purple-500 hover:text-purple-600">
                  Forgot password?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 gradient-primary text-white font-medium rounded-lg hover:opacity-95 transition-opacity shadow-md"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        )}
        
        {/* Sign Up Form */}
        {activeTab === "signup" && (
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
              <FormField
                control={signupForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your name"
                        className="px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="youremail@example.com"
                        className="px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••••"
                        className="px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••••"
                        className="px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full py-6 gradient-primary text-white font-medium rounded-lg hover:opacity-95 transition-opacity shadow-md"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
