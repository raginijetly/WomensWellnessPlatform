import { FC } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FitnessCard from "@/components/fitness-card";
import { Link } from "wouter";

const HomePage: FC = () => {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) return null;

  const userName = user.name || user.username;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="font-medium text-xl text-transparent bg-clip-text bg-gradient-primary">
              Her<span className="font-light">Fitness</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="font-medium text-purple-500">Home</Link>
            <Link href="/" className="font-medium text-gray-600 hover:text-purple-500 transition-colors">My Plan</Link>
            <Link href="/" className="font-medium text-gray-600 hover:text-purple-500 transition-colors">Workouts</Link>
            <Link href="/" className="font-medium text-gray-600 hover:text-purple-500 transition-colors">Nutrition</Link>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="sr-only">Profile</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="hidden md:inline-flex"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden gradient-primary py-16 md:py-24">
          <div className="dotted-grid w-full h-full absolute top-0 left-0 opacity-20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-medium text-white text-3xl md:text-4xl leading-tight animate-fadeIn">
                Welcome to the first women's fitness app that's catered to your daily changing body needs.
              </h2>
              <p className="mt-4 text-white opacity-90 text-lg animate-fadeIn delay-100">
                Personalized workouts and nutrition advice that adapts to your unique cycle and needs.
              </p>
              <Button 
                size="lg" 
                className="mt-8 py-6 px-8 bg-white text-purple-600 rounded-full shadow-lg font-medium hover:bg-gray-100 transition-colors animate-fadeIn delay-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 md:py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="font-medium text-2xl md:text-3xl text-gray-800">Your personalized fitness journey</h3>
              <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                Our platform adjusts to your unique needs, providing the right support at the right time.
              </p>
            </div>
            
            {/* Features Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FitnessCard
                title="Diet Tips"
                description="Nutrition advice that adapts to your cycle, hormonal changes, and specific health needs."
                imageUrl="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                buttonText="Explore Diet Tips"
              />
              
              <FitnessCard
                title="Workout Library"
                description="Discover exercises tailored to your energy levels and designed for your body's current state."
                imageUrl="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                buttonText="Browse Workouts"
              />
              
              <FitnessCard
                title="Education Hub"
                description="Learn about women's health, hormones, and how to optimize your fitness for your body."
                imageUrl="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                buttonText="Start Learning"
              />
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="font-medium text-lg text-transparent bg-clip-text bg-gradient-primary">
                Her<span className="font-light">Fitness</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">The fitness app designed for women</p>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
              <a href="#" className="text-sm text-gray-600 hover:text-purple-500">About</a>
              <a href="#" className="text-sm text-gray-600 hover:text-purple-500">Contact</a>
              <a href="#" className="text-sm text-gray-600 hover:text-purple-500">Privacy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-purple-500">Terms</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
