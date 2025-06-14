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
  ArrowRight,
  Droplet,
  Egg,
  HelpCircle,
  Utensils,
  BookOpen
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { differenceInDays, addDays, format } from "date-fns";
import { CYCLE_PHASES } from "@shared/schema";

const HomePage: FC = () => {
  const { user, logoutMutation, isLoading } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Cycle tracking state - initialize with default values
  const [cycleDay, setCycleDay] = useState<number>(1);
  const [cyclePhase, setCyclePhase] = useState<string>("Unknown");
  const [nextPhaseIn, setNextPhaseIn] = useState<number | null>(null);
  const [cyclePercentage, setCyclePercentage] = useState<number>(0);
  
  // We now initialize states with default values, so no need for a separate initialization effect
  
  // State for mood popup
  const [showMoodPopup, setShowMoodPopup] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Show the mood popup after 5 seconds on the home page
  useEffect(() => {
    if (user && user.completedOnboarding) {
      const timer = setTimeout(() => {
        setShowMoodPopup(true);
      }, 5000); // 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Calculate cycle information when user data is available
  useEffect(() => {
    console.log("User data in useEffect:", user);
    
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
      
      console.log("Setting cycle phase to:", phase);
      setCyclePhase(phase);
      setNextPhaseIn(daysUntilNextPhase);
    } else {
      // Default values if no date is selected
      setCycleDay(1);
      console.log("No period date, setting default phase to: Unknown");
      setCyclePhase("Unknown");
      setNextPhaseIn(null);
      setCyclePercentage(0);
    }
    
    // Log the state after setting
    console.log("After state update in useEffect, cyclePhase is:", cyclePhase);
  }, [user]);

  // Log whenever cyclePhase changes
  useEffect(() => {
    console.log("cyclePhase changed to:", cyclePhase);
  }, [cyclePhase]);
  
  // Ensure we always have a default phase
  useEffect(() => {
    // Add a small delay to let other state updates complete
    const timer = setTimeout(() => {
      if (cyclePhase === null) {
        console.log("Setting default phase in fallback useEffect");
        setCyclePhase("Unknown");
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [cyclePhase]);
  
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

  // Function to handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodPopup(false);
    // You could send this data to your API/backend here
  };

  return (
    <div className="min-h-screen gradient-primary">
      {/* Mood Popup */}
      {showMoodPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in relative">
            <button 
              onClick={() => setShowMoodPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <h3 className="text-2xl font-semibold text-purple-800 text-center mb-8">How are you feeling today?</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => handleMoodSelect('high-energy')}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-purple-100 hover:bg-purple-200 transition-colors"
              >
                <span className="text-4xl">😄</span>
                <span className="font-medium text-gray-700">Energetic</span>
              </button>
              
              <button 
                onClick={() => handleMoodSelect('average')}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <span className="text-4xl">😊</span>
                <span className="font-medium text-gray-700">Balanced</span>
              </button>
              
              <button 
                onClick={() => handleMoodSelect('tired')}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <span className="text-4xl">😴</span>
                <span className="font-medium text-gray-700">Tired</span>
              </button>
              
              <button 
                onClick={() => handleMoodSelect('stressed')}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-red-100 hover:bg-red-200 transition-colors"
              >
                <span className="text-4xl">😓</span>
                <span className="font-medium text-gray-700">Stressed</span>
              </button>
            </div>
            
            <p className="text-md text-purple-700 text-center">
              This helps us personalize your workout and nutrition recommendations based on how you feel.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">FemFit</h1>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 p-2 bg-white/10 rounded-full border border-white/20"
              >
                <User className="h-6 w-6" />
              </Button>
              
              {/* Profile dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-top-right">
                <div className="py-2">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800 flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 pb-20 sm:pb-8">
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
        <section className="mb-8 bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center text-gray-800">
              <Calendar className="mr-2 h-5 w-5 text-purple-600" />
              Your Daily Insight
            </h3>
            <Button variant="ghost" className="text-purple-600 hover:bg-purple-50 py-1 px-2 h-auto text-sm">
              Update <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex flex-col space-y-4">
            {user.lastPeriodDate ? (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <span className="text-sm text-gray-500">Current phase</span>
                    <div className="flex items-center">
                      {getPhaseIcon()}
                      <span className="ml-2 text-lg font-medium text-gray-800">{cyclePhase}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 max-w-xs">
                      {cyclePhase === "Menstruation" && "Your body is shedding uterine lining. Focus on rest and gentle movement."}
                      {cyclePhase === "Follicular" && "Your body is preparing for ovulation. Energy levels start to increase."}
                      {cyclePhase === "Ovulation" && "Your body is releasing an egg. Peak energy and confidence levels."}
                      {cyclePhase === "Luteal" && "Your body is preparing for possible pregnancy. Energy may start to decrease."}
                      {cyclePhase === "Unknown" && "Complete your profile to get personalized cycle insights."}
                    </div>
                  </div>
                  
                  {/* Clean and sleek cycle day */}
                  <div className="flex flex-col items-center mb-4 sm:mb-0 order-first sm:order-none">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center border-4 border-purple-200">
                        <span className="text-4xl font-bold text-purple-600">{cycleDay}</span>
                      </div>
                      <span className="text-xs text-gray-600 mt-2">Day of cycle</span>
                    </div>
                  </div>
                  
                  <div className="mb-4 sm:mb-0">
                    <span className="text-sm text-gray-500">Next phase in</span>
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-800">{nextPhaseIn} days</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1 text-gray-500">
                    <span>Day 1</span>
                    <span>Day 28</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-50 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-200 to-purple-400" 
                      style={{ width: `${cyclePercentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Hormone Levels Section */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">HORMONE LEVELS</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Estrogen */}
                      <div className="max-h-28 min-h-[5rem]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-pink-500">Estrogen</span>
                          <span className="text-xs text-pink-400">rising</span>
                        </div>
                        <div className="w-full bg-pink-50 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-pink-100 to-pink-300 h-full rounded-full" 
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Peaks during ovulation, boosting energy</p>
                      </div>
                      
                      {/* Progesterone */}
                      <div className="max-h-28 min-h-[5rem]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-blue-400">Progesterone</span>
                          <span className="text-xs text-gray-500">stable</span>
                        </div>
                        <div className="w-full bg-blue-50 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-100 to-blue-200 h-full rounded-full" 
                            style={{ width: '40%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Low during ovulation, rises in luteal phase</p>
                      </div>
                      
                      {/* Testosterone */}
                      <div className="max-h-28 min-h-[5rem]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-amber-500">Testosterone</span>
                          <span className="text-xs text-amber-400">rising</span>
                        </div>
                        <div className="w-full bg-amber-50 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-100 to-amber-200 h-full rounded-full" 
                            style={{ width: '70%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Increases during ovulation, boosts libido</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <p className="text-gray-700">Track your cycle to get personalized recommendations</p>
                <Button variant="outline" className="mt-2 text-purple-600 border-purple-200 hover:bg-purple-50">
                  Add Period Date
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Workout recommendations */}
          <section className="p-6 rounded-xl border bg-white shadow-md">
            <div className="flex items-center mb-4">
              <Dumbbell className="h-5 w-5 mr-2 text-purple-600" />
              <h3 className="font-semibold text-gray-800">Workout Recommendations</h3>
            </div>
            
            <div className="space-y-3">
              {/* Debug log: {console.log("Debug cyclePhase value:", cyclePhase)} */}
              <div className="text-sm text-gray-600 mb-3">
                {cyclePhase === "Follicular" && (
                  <p>The Follicular phase is a great time to build muscle as your energy increases. Your body naturally has more stamina now.</p>
                )}
                {cyclePhase === "Ovulation" && (
                  <p>During Ovulation, your energy is at its peak, making it ideal for high-intensity workouts and setting new personal records.</p>
                )}
                {cyclePhase === "Luteal" && (
                  <p>In the Luteal phase, your body is winding down. Focus on moderate activity and active recovery to support this transition.</p>
                )}
                {cyclePhase === "Menstruation" && (
                  <p>During Menstruation, your energy is lower. Gentle movement supports your body's natural recovery process.</p>
                )}
                {cyclePhase === "Unknown" && (
                  <p>Matching your workouts to your cycle phase can optimize results and make exercise feel more natural and enjoyable.</p>
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Based on your {cyclePhase ? cyclePhase.toLowerCase() : 'current'} phase, focus on:
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
          <section className="p-6 rounded-xl border bg-white shadow-md">
            <div className="flex items-center mb-4">
              <Heart className="h-5 w-5 mr-2 text-purple-600" />
              <h3 className="font-semibold text-gray-800">Nutrition Recommendations</h3>
            </div>
            
            <div className="space-y-3">
              {/* Debug log: {console.log("Debug cyclePhase value (nutrition):", cyclePhase)} */}
              <div className="text-sm text-gray-600 mb-3">
                {cyclePhase === "Follicular" && (
                  <p>During your follicular phase, focus on foods that support rising estrogen levels. Your metabolism is increasing and your body needs more nutrients.</p>
                )}
                {cyclePhase === "Ovulation" && (
                  <p>During ovulation, your body benefits from antioxidant-rich foods that support hormone balance and cellular health.</p>
                )}
                {cyclePhase === "Luteal" && (
                  <p>In the luteal phase, your body needs foods that help balance mood and reduce bloating as progesterone rises.</p>
                )}
                {cyclePhase === "Menstruation" && (
                  <p>During menstruation, your body needs extra iron and anti-inflammatory foods to replenish what's lost and reduce discomfort.</p>
                )}
                {cyclePhase === "Unknown" && (
                  <p>Eating according to your cycle phase can help manage symptoms and provide your body with exactly what it needs when it needs it.</p>
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Foods to focus on during your {cyclePhase ? cyclePhase.toLowerCase() : 'current'} phase:
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
      <footer className="bg-white/10 backdrop-blur-sm py-6 pb-16 sm:pb-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-white/80">
          <p>&copy; {new Date().getFullYear()} FemFit. All rights reserved.</p>
          <p className="text-sm mt-1">Built by Women for Women</p>
          <Button
            variant="outline"
            className="text-white bg-white/10 hover:bg-white/30 mx-auto mt-4 mb-6 flex items-center gap-2 border border-purple-200 font-medium shadow-sm px-5 py-2"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
            Logout
          </Button>
        </div>
      </footer>
      

    </div>
  );
};

export default HomePage;