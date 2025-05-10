import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Simplified placeholder login
  const handleLogin = () => {
    setIsLoading(true);
    loginMutation.mutate({ 
      username: "user@example.com", 
      password: "password123" 
    });
  };

  // Simplified placeholder signup
  const handleSignup = () => {
    setIsLoading(true);
    registerMutation.mutate({ 
      name: "Demo User", 
      username: "user@example.com", 
      password: "password123" 
    });
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
        
        {/* Login Placeholder */}
        {activeTab === "login" && (
          <div className="space-y-6">
            <div className="text-center p-8">
              <h2 className="text-xl font-medium text-gray-800 mb-3">Welcome Back</h2>
              <p className="text-gray-600">
                Click the button below to login and continue to your personalized fitness journey
              </p>
            </div>
            
            <Button 
              onClick={handleLogin} 
              className="w-full py-6 gradient-primary text-white font-medium rounded-lg hover:opacity-95 transition-opacity shadow-md"
              disabled={isLoading || loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Continue to HerFitness"}
            </Button>
          </div>
        )}
        
        {/* Sign Up Placeholder */}
        {activeTab === "signup" && (
          <div className="space-y-6">
            <div className="text-center p-8">
              <h2 className="text-xl font-medium text-gray-800 mb-3">Join HerFitness</h2>
              <p className="text-gray-600">
                Click the button below to create your account and begin your personalized fitness journey
              </p>
            </div>
            
            <Button 
              onClick={handleSignup} 
              className="w-full py-6 gradient-primary text-white font-medium rounded-lg hover:opacity-95 transition-opacity shadow-md"
              disabled={isLoading || registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating Account..." : "Get Started with HerFitness"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
