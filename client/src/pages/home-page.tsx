import { FC, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  User,
  Calendar,
  Sun,
  Moon,
  Activity,
  ArrowRight,
  Dumbbell,
  Heart,
  Home,
  BarChart3,
  Utensils,
  BookOpen
} from "lucide-react";
import { differenceInDays } from "date-fns";
import { generateRecommendations, type UserProfile } from "@shared/recommendations";

const HomePage: FC = () => {
  const { user, logoutMutation, isLoading } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Cycle tracking state
  const [cycleDay, setCycleDay] = useState<number>(16);
  const [cyclePhase, setCyclePhase] = useState<string>("Ovulation");
  const [nextPhaseIn, setNextPhaseIn] = useState<number>(1);
  const [cyclePercentage, setCyclePercentage] = useState<number>(57);
  
  // State for personalized recommendations
  const [recommendations, setRecommendations] = useState<any>(null);

  // Calculate cycle information and generate recommendations when user data is available
  useEffect(() => {
    if (user?.lastPeriodDate && user?.completedOnboarding) {
      // Parse the date from ISO string
      const periodDate = new Date(user.lastPeriodDate);
      const today = new Date();
      const daysSincePeriod = differenceInDays(today, periodDate);
      
      // Assume a 28-day cycle
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
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
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

  // Get phase icon
  const getPhaseIcon = () => {
    const phase = recommendations?.phase || cyclePhase;
    switch (phase) {
      case "Menstruation":
      case "Menstrual": return <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>;
      case "Follicular": return <Activity className="h-6 w-6 text-green-500" />;
      case "Ovulation":
      case "Ovulatory": return <Sun className="h-6 w-6 text-yellow-500" />;
      case "Luteal": return <Moon className="h-6 w-6 text-blue-500" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  // Get phase description
  const getPhaseDescription = () => {
    const phase = recommendations?.phase || cyclePhase;
    if (recommendations?.insight) {
      return recommendations.insight;
    }
    
    switch (phase) {
      case "Menstruation":
      case "Menstrual": return "Your body is shedding uterine lining. Focus on rest and gentle movement.";
      case "Follicular": return "Your body is preparing for ovulation. Energy levels start to increase.";
      case "Ovulation":
      case "Ovulatory": return "Your body is releasing an egg. Peak energy and confidence levels.";
      case "Luteal": return "Your body is preparing for possible pregnancy. Energy may start to decrease.";
      default: return "Your body is releasing an egg. Peak energy and confidence levels.";
    }
  };

  // Get workout recommendations - use personalized if available
  const getWorkoutRecommendations = () => {
    if (recommendations?.workout?.activities) {
      return recommendations.workout.activities.slice(0, 3);
    }
    
    const phase = cyclePhase;
    switch (phase) {
      case "Menstruation": return ["Gentle yoga", "Walking", "Stretching"];
      case "Follicular": return ["HIIT training", "Strength training", "Cardio classes"];
      case "Ovulation": return ["Circuit training", "Endurance workouts", "Group fitness classes"];
      case "Luteal": return ["Moderate strength training", "Pilates", "Swimming"];
      default: return ["Circuit training", "Endurance workouts", "Group fitness classes"];
    }
  };
  
  // Get nutrition recommendations - use personalized if available
  const getNutritionRecommendations = () => {
    if (recommendations?.nutrition?.focusFoods) {
      return recommendations.nutrition.focusFoods.slice(0, 3);
    }
    
    const phase = cyclePhase;
    switch (phase) {
      case "Menstruation": return ["Iron-rich foods (leafy greens, lentils)", "Anti-inflammatory foods (berries, nuts)", "Stay hydrated with water and herbal teas"];
      case "Follicular": return ["Complex carbs for energy (oats, brown rice)", "Lean proteins (chicken, fish, tofu)", "Vitamin B-rich foods (whole grains, eggs)"];
      case "Ovulation": return ["Magnesium-rich foods (dark chocolate, avocados)", "Antioxidant-rich foods (colorful fruits and vegetables)", "Healthy fats (olive oil, nuts, seeds)"];
      case "Luteal": return ["Calcium-rich foods (dairy or fortified plant milks)", "Fiber-rich foods to reduce bloating (beans, vegetables)", "Limit caffeine, salt, and sugar"];
      default: return ["Magnesium-rich foods (dark chocolate, avocados)", "Antioxidant-rich foods (colorful fruits and vegetables)", "Healthy fats (olive oil, nuts, seeds)"];
    }
  };

  const workoutRecommendations = getWorkoutRecommendations();
  const nutritionRecommendations = getNutritionRecommendations();
  const currentPhase = recommendations?.phase || cyclePhase;
  const currentDay = recommendations?.day || cycleDay;

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">FemFit</h1>
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
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-4 pb-24">
        {/* Welcome section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Welcome, {user.name || user.username}!
              </h2>
              <p className="text-white/80 text-sm">Your personalized wellness journey is here.</p>
            </div>
          </div>
        </div>
        
        {/* Daily Insight Card */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Your Daily Insight</h3>
            </div>
            <Button variant="ghost" className="text-purple-600 hover:bg-purple-50 text-sm font-medium p-0 h-auto">
              Update <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Current phase</p>
              <div className="flex items-center gap-2 mb-2">
                {getPhaseIcon()}
                <span className="text-xl font-semibold text-gray-900">{currentPhase}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                {getPhaseDescription()}
              </p>
            </div>
            
            <div className="flex flex-col items-center mx-8">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-purple-600">{currentDay}</span>
              </div>
              <span className="text-xs text-gray-500">Day of cycle</span>
            </div>
            
            <div className="flex-1 text-right">
              <p className="text-sm text-gray-500 mb-1">Next phase in</p>
              <p className="text-xl font-semibold text-gray-900">{nextPhaseIn} days</p>
            </div>
          </div>
          
          {/* Cycle Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Day 1</span>
              <span>Day 28</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${cyclePercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Hormone Levels Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">HORMONE LEVELS</h4>
            <div className="grid grid-cols-3 gap-6">
              {/* Estrogen */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-pink-500">Estrogen</span>
                  <span className="text-xs text-pink-400">rising</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-pink-400 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-500">Peaks during ovulation, boosting energy</p>
              </div>
              
              {/* Progesterone */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-500">Progesterone</span>
                  <span className="text-xs text-blue-400">stable</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <p className="text-xs text-gray-500">Low during ovulation, rises in luteal phase</p>
              </div>
              
              {/* Testosterone */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-yellow-600">Testosterone</span>
                  <span className="text-xs text-yellow-500">rising</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-gray-500">Increases during ovulation, boosts libido</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Workout Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Workout Recommendations</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {recommendations?.workout ? 
                `Based on your ${user.fitnessLevel || 'current'} fitness level and ${currentPhase.toLowerCase()} phase:` :
                `During ${currentPhase}, your energy is at its peak, making it ideal for high-intensity workouts and setting new personal records.`
              }
            </p>
            
            <p className="text-sm font-medium text-gray-700 mb-3">
              Based on your {currentPhase.toLowerCase()} phase, focus on:
            </p>
            
            <ol className="space-y-2 mb-6">
              {workoutRecommendations.map((activity, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  {activity}
                </li>
              ))}
            </ol>
            
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              View Workouts
            </Button>
          </div>

          {/* Nutrition Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Nutrition Recommendations</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {recommendations?.nutrition?.reason ||
                `During ovulation, your body benefits from antioxidant-rich foods that support hormone balance and cellular health.`
              }
            </p>
            
            <p className="text-sm font-medium text-gray-700 mb-3">
              Foods to focus on during your {currentPhase.toLowerCase()} phase:
            </p>
            
            <ol className="space-y-2 mb-6">
              {nutritionRecommendations.map((food, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  {food}
                </li>
              ))}
            </ol>
            
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              View Recipes
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/">
            <button className="flex flex-col items-center gap-1 p-2">
              <Home className="h-5 w-5 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">Home</span>
            </button>
          </Link>
          
          <Link href="/symptoms">
            <button className="flex flex-col items-center gap-1 p-2">
              <Heart className="h-5 w-5 text-gray-400" />
              <span className="text-xs text-gray-400">Log</span>
            </button>
          </Link>
          
          <Link href="/workout">
            <button className="flex flex-col items-center gap-1 p-2">
              <Dumbbell className="h-5 w-5 text-gray-400" />
              <span className="text-xs text-gray-400">Workout</span>
            </button>
          </Link>
          
          <Link href="/nutrition">
            <button className="flex flex-col items-center gap-1 p-2">
              <Utensils className="h-5 w-5 text-gray-400" />
              <span className="text-xs text-gray-400">Nutrition</span>
            </button>
          </Link>
          
          <Link href="/info-hub">
            <button className="flex flex-col items-center gap-1 p-2">
              <BookOpen className="h-5 w-5 text-gray-400" />
              <span className="text-xs text-gray-400">Info</span>
            </button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default HomePage;