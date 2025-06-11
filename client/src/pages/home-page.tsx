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
import { generateRecommendations, type UserProfile } from "@shared/recommendations";

const HomePage: FC = () => {
  const { user, logoutMutation, isLoading } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Cycle tracking state - initialize with default values
  const [cycleDay, setCycleDay] = useState<number>(1);
  const [cyclePhase, setCyclePhase] = useState<string>("Unknown");
  const [nextPhaseIn, setNextPhaseIn] = useState<number | null>(null);
  const [cyclePercentage, setCyclePercentage] = useState<number>(0);
  
  // State for mood popup
  const [showMoodPopup, setShowMoodPopup] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // State for personalized recommendations
  const [recommendations, setRecommendations] = useState<any>(null);

  // Show the mood popup after 5 seconds on the home page
  useEffect(() => {
    if (user && user.completedOnboarding) {
      const timer = setTimeout(() => {
        setShowMoodPopup(true);
      }, 5000); // 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Calculate cycle information and generate recommendations when user data is available
  useEffect(() => {
    if (user?.lastPeriodDate && user?.completedOnboarding) {
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

      // Generate personalized recommendations
      const userProfile: UserProfile = {
        age: user.age || undefined,
        fitnessLevel: user.fitnessLevel || undefined,
        healthGoals: user.healthGoals || [],
        healthConditions: user.healthConditions || [],
        lastPeriodDate: user.lastPeriodDate || undefined,
        periodsRegular: user.periodsRegular || undefined,
        dietaryPreferences: user.dietaryPreferences || undefined,
        symptoms: user.symptoms || [],
        lifeStage: user.lifeStage || undefined,
      };

      const personalizedRecs = generateRecommendations(userProfile);
      setRecommendations(personalizedRecs);
    } else {
      // Default values if no date is selected
      setCycleDay(1);
      setCyclePhase("Unknown");
      setNextPhaseIn(null);
      setCyclePercentage(0);
      setRecommendations(null);
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
  
  // Get workout recommendations - use personalized if available, fallback to cycle-based
  const getWorkoutRecommendations = () => {
    if (recommendations?.workout?.activities) {
      return recommendations.workout.activities.slice(0, 3);
    }
    
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
  
  // Get nutrition recommendations - use personalized if available, fallback to cycle-based
  const getNutritionRecommendations = () => {
    if (recommendations?.nutrition?.focusFoods) {
      return recommendations.nutrition.focusFoods.slice(0, 3);
    }
    
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
    const phase = recommendations?.phase || cyclePhase;
    switch (phase) {
      case "Menstruation":
      case "Menstrual": return "text-red-600";
      case "Follicular": return "text-green-600";
      case "Ovulation":
      case "Ovulatory": return "text-yellow-600";
      case "Luteal": return "text-blue-600";
      default: return "text-purple-600";
    }
  };
  
  const getPhaseIcon = () => {
    const phase = recommendations?.phase || cyclePhase;
    switch (phase) {
      case "Menstruation":
      case "Menstrual": return <Moon className={`h-6 w-6 ${getPhaseColor()}`} />;
      case "Follicular": return <Activity className={`h-6 w-6 ${getPhaseColor()}`} />;
      case "Ovulation":
      case "Ovulatory": return <Sun className={`h-6 w-6 ${getPhaseColor()}`} />;
      case "Luteal": return <Moon className={`h-6 w-6 ${getPhaseColor()}`} />;
      default: return <Calendar className="h-6 w-6 text-purple-600" />;
    }
  };
  
  const getPhaseBackgroundColor = () => {
    const phase = recommendations?.phase || cyclePhase;
    switch (phase) {
      case "Menstruation":
      case "Menstrual": return "bg-red-50";
      case "Follicular": return "bg-green-50";
      case "Ovulation":
      case "Ovulatory": return "bg-yellow-50";
      case "Luteal": return "bg-blue-50";
      default: return "bg-purple-50";
    }
  };
  
  const getPhaseBorderColor = () => {
    const phase = recommendations?.phase || cyclePhase;
    switch (phase) {
      case "Menstruation":
      case "Menstrual": return "border-red-100";
      case "Follicular": return "border-green-100";
      case "Ovulation":
      case "Ovulatory": return "border-yellow-100";
      case "Luteal": return "border-blue-100";
      default: return "border-purple-100";
    }
  };

  // Function to handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodPopup(false);
  };

  const currentPhase = recommendations?.phase || cyclePhase;
  const currentDay = recommendations?.day || cycleDay;

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
                      <span className="ml-2 text-lg font-medium text-gray-800">{currentPhase}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 max-w-xs">
                      {recommendations?.insight || 
                        (currentPhase === "Menstruation" && "Your body is shedding uterine lining. Focus on rest and gentle movement.") ||
                        (currentPhase === "Follicular" && "Your body is preparing for ovulation. Energy levels start to increase.") ||
                        (currentPhase === "Ovulation" && "Your body is releasing an egg. Peak energy and confidence levels.") ||
                        (currentPhase === "Luteal" && "Your body is preparing for possible pregnancy. Energy may start to decrease.") ||
                        "Complete your profile to get personalized cycle insights."
                      }
                    </div>
                    {recommendations?.dailyMessage && (
                      <div className="mt-2 text-sm text-purple-600 font-medium">
                        {recommendations.dailyMessage}
                      </div>
                    )}
                  </div>
                  
                  {/* Clean and sleek cycle day */}
                  <div className="flex flex-col items-center mb-4 sm:mb-0 order-first sm:order-none">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center border-4 border-purple-200">
                        <span className="text-4xl font-bold text-purple-600">{currentDay}</span>
                      </div>
                      <span className="text-xs text-gray-600 mt-2">Day of cycle</span>
                    </div>
                  </div>
                  
                  <div className="mb-4 sm:mb-0">
                    <span className="text-sm text-gray-500">Next phase in</span>
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-800">{nextPhaseIn || "—"} days</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Cycle Progress</span>
                    <span>{Math.round(cyclePercentage)}%</span>
                  </div>
                  <Progress value={cyclePercentage} className="h-2" />
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-800 mb-2">Track Your Cycle</h4>
                <p className="text-gray-600 mb-4">Add your last period date to get personalized insights</p>
                <Button onClick={() => setLocation("/onboarding")} className="gradient-primary text-white">
                  Add Period Date
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Workout Recommendations */}
        <section className="mb-8 bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center text-gray-800">
              <Dumbbell className="mr-2 h-5 w-5 text-purple-600" />
              {recommendations ? "Personalized Workout" : "Today's Workout"}
            </h3>
            <Button variant="ghost" className="text-purple-600 hover:bg-purple-50 py-1 px-2 h-auto text-sm">
              Start <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          
          <div className={`${getPhaseBackgroundColor()} rounded-lg p-4 mb-4`}>
            {recommendations && (
              <div className="mb-3">
                <h4 className="font-semibold text-gray-800">{recommendations.workout.type}</h4>
                <p className="text-sm text-gray-600">
                  {recommendations.workout.duration} mins • {recommendations.workout.intensity} intensity
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Recommended Activities:</span>
              <ul className="space-y-1">
                {workoutRecommendations.map((activity: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Nutrition Recommendations */}
        <section className="mb-8 bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center text-gray-800">
              <Utensils className="mr-2 h-5 w-5 text-purple-600" />
              {recommendations ? "Personalized Nutrition" : "Nutrition Focus"}
            </h3>
            <Button variant="ghost" className="text-purple-600 hover:bg-purple-50 py-1 px-2 h-auto text-sm">
              Meal Plan <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          
          <div className={`${getPhaseBackgroundColor()} rounded-lg p-4`}>
            {recommendations?.nutrition?.reason && (
              <p className="text-sm text-gray-600 mb-3">{recommendations.nutrition.reason}</p>
            )}
            
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Focus Foods:</span>
              <ul className="space-y-1">
                {nutritionRecommendations.map((food: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                    {food}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-purple-200 hover:bg-purple-50"
            onClick={() => setLocation("/symptoms")}
          >
            <Heart className="h-6 w-6 text-purple-600" />
            <span className="text-sm">Log Symptoms</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-purple-200 hover:bg-purple-50"
            onClick={() => setLocation("/workout")}
          >
            <Dumbbell className="h-6 w-6 text-purple-600" />
            <span className="text-sm">Workouts</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-purple-200 hover:bg-purple-50"
            onClick={() => setLocation("/nutrition")}
          >
            <Utensils className="h-6 w-6 text-purple-600" />
            <span className="text-sm">Nutrition</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-purple-200 hover:bg-purple-50"
            onClick={() => setLocation("/info-hub")}
          >
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="text-sm">Info Hub</span>
          </Button>
        </section>
      </main>
    </div>
  );
};

export default HomePage;