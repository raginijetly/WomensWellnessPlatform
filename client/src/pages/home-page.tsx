import { FC } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, User } from "lucide-react";

const HomePage: FC = () => {
  const { user, logoutMutation, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }
  
  // If user is not logged in, redirect to auth page
  if (!user) {
    setLocation("/auth");
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen">

      {/* Header */}
      <header className="bg-white/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">HerFitness</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto bg-white/90 rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Welcome, {user.name || user.username}!
              </h2>
              <p className="text-gray-600">Your fitness journey awaits.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
          <p className="mb-6">
            This is a placeholder home page for the HerFitness app. In a complete implementation, 
            this page would display personalized workout recommendations, progress tracking, 
            and other features tailored to women's fitness needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <h3 className="font-semibold text-lg mb-2">Personalized Workouts</h3>
              <p className="text-gray-700 mb-4">
                Workouts designed specifically for your body's needs and goals.
              </p>
              <Button className="gradient-primary hover:opacity-90 w-full">
                Explore Workouts
              </Button>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-lg border border-pink-100">
              <h3 className="font-semibold text-lg mb-2">Cycle Tracking</h3>
              <p className="text-gray-700 mb-4">
                Track your menstrual cycle to optimize your fitness routine.
              </p>
              <Button className="gradient-primary hover:opacity-90 w-full">
                Update Cycle Information
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4 text-center text-white">
          <p>&copy; {new Date().getFullYear()} HerFitness. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;