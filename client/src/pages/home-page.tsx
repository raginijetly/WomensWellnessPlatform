import { FC, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  LogOut, 
  User, 
  Calendar, 
  Activity, 
  Dumbbell, 
  Heart,
  Moon, 
  Sun, 
  ArrowRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { differenceInDays, addDays, format } from "date-fns";
import { CYCLE_PHASES } from "@shared/schema";

const HomePage: FC = () => {
  const { user, logoutMutation, isLoading } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Cycle tracking state
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [cyclePhase, setCyclePhase] = useState<string | null>(null);
  const [nextPhaseIn, setNextPhaseIn] = useState<number | null>(null);
  const [cyclePercentage, setCyclePercentage] = useState<number>(0);
  
  // Calculate cycle information when user data is available
  useEffect(() => {
    if (user?.lastPeriodDate) {
      // Parse the date from ISO string
      const periodDate = new Date(user.lastPeriodDate);
      const today = new Date();
      const daysSincePeriod = differenceInDays(today, periodDate);
      
      // Assume a 28-day cycle for demo purposes
      const cycleDayNum = (daysSincePeriod % 28) + 1;
      setCycleDay(cycleDayNum);
      setCyclePercentage((cycleDayNum / 28) * 100);
      
      // Determine cycle phase
      let phase = "";
      let daysUntilNextPhase = 0;
      
      if (cycleDayNum <= 5) {
        phase = "Menstruation";
        daysUntilNextPhase = 6 - cycleDayNum;
      } else if (cycleDayNum <= 13) {
        phase = "Follicular";
        daysUntilNextPhase = 14 - cycleDayNum;
      } else if (cycleDayNum <= 16) {
        phase = "Ovulation";
        daysUntilNextPhase = 17 - cycleDayNum;
      } else {
        phase = "Luteal";
        daysUntilNextPhase = 29 - cycleDayNum;
      }
      
      setCyclePhase(phase);
      setNextPhaseIn(daysUntilNextPhase);
    } else {
      // Default values if no date is selected
      setCycleDay(1);
      setCyclePhase("Unknown");
      setNextPhaseIn(null);
      setCyclePercentage(0);
    }
  }, [user]);

  // Handle navigation effects based on auth state
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setLocation("/auth");
      } else if (!user.completedOnboarding) {
        setLocation("/onboarding");
      }
    }
  }, [user, isLoading, setLocation]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }
  
  // Exit early if user is not authenticated or hasn't completed onboarding
  if (!user || !user.completedOnboarding) {
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Get workout recommendations based on cycle phase
  const getWorkoutRecommendations = () => {
    switch (cyclePhase) {
      case "Menstruation":
        return [
          "Gentle yoga or stretching",
          "Walking or light cardio",
          "Restorative exercises"
        ];
      case "Follicular":
        return [
          "High-intensity interval training",
          "Strength training",
          "Cardio classes"
        ];
      case "Ovulation":
        return [
          "Circuit training",
          "Endurance workouts",
          "Group fitness classes"
        ];
      case "Luteal":
        return [
          "Moderate strength training",
          "Pilates or barre",
          "Swimming or cycling"
        ];
      default:
        return [
          "Balanced strength and cardio",
          "Flexibility exercises",
          "Rest and recovery as needed"
        ];
    }
  };
  
  // Get nutrition recommendations based on cycle phase
  const getNutritionRecommendations = () => {
    switch (cyclePhase) {
      case "Menstruation":
        return [
          "Iron-rich foods (leafy greens, lentils)",
          "Anti-inflammatory foods (berries, nuts)",
          "Stay hydrated with water and herbal teas"
        ];
      case "Follicular":
        return [
          "Complex carbs for energy (oats, brown rice)",
          "Lean proteins (chicken, fish, tofu)",
          "Vitamin B-rich foods (whole grains, eggs)"
        ];
      case "Ovulation":
        return [
          "Magnesium-rich foods (dark chocolate, avocados)",
          "Antioxidant-rich foods (colorful fruits and vegetables)",
          "Healthy fats (olive oil, nuts, seeds)"
        ];
      case "Luteal":
        return [
          "Calcium-rich foods (dairy or fortified plant milks)",
          "Fiber-rich foods to reduce bloating (beans, vegetables)",
          "Limit caffeine, salt, and sugar"
        ];
      default:
        return [
          "Balanced meals with protein, healthy fats, and complex carbs",
          "Colorful fruits and vegetables",
          "Stay hydrated throughout the day"
        ];
    }
  };
  
  const workoutRecommendations = getWorkoutRecommendations();
  const nutritionRecommendations = getNutritionRecommendations();

  // Choose color theme based on phase
  const getPhaseColor = () => {
    switch (cyclePhase) {
      case "Menstruation": return "text-red-600";
      case "Follicular": return "text-green-600";
      case "Ovulation": return "text-yellow-600";
      case "Luteal": return "text-blue-600";
      default: return "text-purple-600";
    }
  };
  
  const getPhaseIcon = () => {
    switch (cyclePhase) {
      case "Menstruation": return <Moon className={`h-6 w-6 ${getPhaseColor()}`} />;
      case "Follicular": return <Activity className={`h-6 w-6 ${getPhaseColor()}`} />;
      case "Ovulation": return <Sun className={`h-6 w-6 ${getPhaseColor()}`} />;
      case "Luteal": return <Moon className={`h-6 w-6 ${getPhaseColor()}`} />;
      default: return <Calendar className="h-6 w-6 text-purple-600" />;
    }
  };
  
  const getPhaseBackgroundColor = () => {
    switch (cyclePhase) {
      case "Menstruation": return "bg-red-50";
      case "Follicular": return "bg-green-50";
      case "Ovulation": return "bg-yellow-50";
      case "Luteal": return "bg-blue-50";
      default: return "bg-purple-50";
    }
  };
  
  const getPhaseBorderColor = () => {
    switch (cyclePhase) {
      case "Menstruation": return "border-red-100";
      case "Follicular": return "border-green-100";
      case "Ovulation": return "border-yellow-100";
      case "Luteal": return "border-blue-100";
      default: return "border-purple-100";
    }
  };

  return (
    <div className="min-h-screen gradient-primary">

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm">
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
        {/* User greeting */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Welcome, {user.name || user.username}!
              </h2>
              <p className="text-white/80">Your personalized wellness journey is here.</p>
            </div>
          </div>
        </div>
        
        {/* Cycle information */}
        <section className="mb-8 bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Cycle Tracking
            </h3>
            <Button variant="ghost" className="text-white hover:bg-white/20 py-1 px-2 h-auto text-sm">
              Update <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex flex-col space-y-4">
            {user.lastPeriodDate ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm opacity-80">Current phase</span>
                    <div className="flex items-center">
                      {getPhaseIcon()}
                      <span className="ml-2 text-lg font-medium">{cyclePhase}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm opacity-80">Cycle day</span>
                    <div className="text-lg font-medium text-center">{cycleDay}</div>
                  </div>
                  <div>
                    <span className="text-sm opacity-80">Next phase in</span>
                    <div className="text-lg font-medium text-center">{nextPhaseIn} days</div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Day 1</span>
                    <span>Day 28</span>
                  </div>
                  <Progress value={cyclePercentage} className="h-2 bg-white/20" indicatorClassName="bg-white" />
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <p>Track your cycle to get personalized recommendations</p>
                <Button variant="outline" className="mt-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
                  Add Period Date
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Workout recommendations */}
          <section className={`p-6 rounded-xl border ${getPhaseBackgroundColor()} ${getPhaseBorderColor()}`}>
            <div className="flex items-center mb-4">
              <Dumbbell className="h-5 w-5 mr-2 text-purple-600" />
              <h3 className="font-semibold text-gray-800">Workout Recommendations</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Based on your {cyclePhase.toLowerCase()} phase, focus on:
              </p>
              <ul className="space-y-2">
                {workoutRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-purple-600 font-medium">{i+1}</span>
                    </div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full mt-2 gradient-primary hover:opacity-90">
                View Workouts
              </Button>
            </div>
          </section>
          
          {/* Nutrition recommendations */}
          <section className={`p-6 rounded-xl border ${getPhaseBackgroundColor()} ${getPhaseBorderColor()}`}>
            <div className="flex items-center mb-4">
              <Heart className="h-5 w-5 mr-2 text-purple-600" />
              <h3 className="font-semibold text-gray-800">Nutrition Recommendations</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Foods to focus on during your {cyclePhase.toLowerCase()} phase:
              </p>
              <ul className="space-y-2">
                {nutritionRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs text-purple-600 font-medium">{i+1}</span>
                    </div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full mt-2 gradient-primary hover:opacity-90">
                View Recipes
              </Button>
            </div>
          </section>
        </div>
        
        {/* Quick access */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-white">Quick Access</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { title: "Log Symptoms", icon: <Activity className="h-5 w-5" /> },
              { title: "View Insights", icon: <Activity className="h-5 w-5" /> },
              { title: "My Account", icon: <User className="h-5 w-5" /> },
            ].map((item, i) => (
              <Button 
                key={i}
                variant="outline" 
                className="h-auto py-4 bg-white/10 text-white border-white/20 hover:bg-white/20 flex flex-col items-center"
              >
                {item.icon}
                <span className="mt-2">{item.title}</span>
              </Button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-sm py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-white/80">
          <p>&copy; {new Date().getFullYear()} HerFitness. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;