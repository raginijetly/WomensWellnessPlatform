import { FC, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
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
  Utensils,
  Clock
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type DailyRecommendation } from "@shared/recommendations";

const HomePage: FC = () => {
  const { user, logoutMutation, isLoading } = useAuth();
  const [_, setLocation] = useLocation();
  
  // State for mood popup
  const [showMoodPopup, setShowMoodPopup] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  // Fetch personalized recommendations
  const { data: recommendations, isLoading: recommendationsLoading, error: recommendationsError } = useQuery({
    queryKey: ['/api/user/recommendations'],
    enabled: !!user?.completedOnboarding,
  });

  // Show the mood popup after 5 seconds on the home page
  useEffect(() => {
    if (user && user.completedOnboarding && recommendations) {
      const timer = setTimeout(() => {
        setShowMoodPopup(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [user, recommendations]);
  
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

  // Helper functions for UI theming based on cycle phase
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "Menstrual": return "text-red-600";
      case "Follicular": return "text-green-600";
      case "Ovulatory": return "text-yellow-600";
      case "Luteal": return "text-blue-600";
      default: return "text-purple-600";
    }
  };
  
  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "Menstrual": return <Moon className={`h-6 w-6 ${getPhaseColor(phase)}`} />;
      case "Follicular": return <Activity className={`h-6 w-6 ${getPhaseColor(phase)}`} />;
      case "Ovulatory": return <Sun className={`h-6 w-6 ${getPhaseColor(phase)}`} />;
      case "Luteal": return <Moon className={`h-6 w-6 ${getPhaseColor(phase)}`} />;
      default: return <Calendar className="h-6 w-6 text-purple-600" />;
    }
  };
  
  const getPhaseBackgroundColor = (phase: string) => {
    switch (phase) {
      case "Menstrual": return "bg-red-50";
      case "Follicular": return "bg-green-50";
      case "Ovulatory": return "bg-yellow-50";
      case "Luteal": return "bg-blue-50";
      default: return "bg-purple-50";
    }
  };

  // Function to handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodPopup(false);
  };

  // Show loading state for recommendations
  if (recommendationsLoading) {
    return (
      <div className="min-h-screen gradient-primary">
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
        
        <main className="container mx-auto px-4 py-8 pb-20 sm:pb-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
              <p className="text-white">Loading your personalized recommendations...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state if recommendations failed to load
  if (recommendationsError) {
    return (
      <div className="min-h-screen gradient-primary">
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
        
        <main className="container mx-auto px-4 py-8 pb-20 sm:pb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to load recommendations</h3>
              <p className="text-gray-600 mb-4">Please ensure you have completed your onboarding and entered your period date.</p>
              <Button onClick={() => setLocation("/onboarding")} className="gradient-primary text-white">
                Complete Onboarding
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                onClick={() => handleMoodSelect('energetic')}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-purple-100 hover:bg-purple-200 transition-colors"
              >
                <span className="text-4xl">😄</span>
                <span className="font-medium text-gray-700">Energetic</span>
              </button>
              
              <button 
                onClick={() => handleMoodSelect('balanced')}
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
        {recommendations && (
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
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <span className="text-sm text-gray-500">Current phase</span>
                  <div className="flex items-center">
                    {getPhaseIcon(recommendations.phase)}
                    <span className="ml-2 text-lg font-medium text-gray-800">{recommendations.phase}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600 max-w-xs">
                    {recommendations.insight}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {recommendations.hormoneStatus}
                  </div>
                </div>
                
                {/* Cycle day display */}
                <div className="flex flex-col items-center mb-4 sm:mb-0 order-first sm:order-none">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center border-4 border-purple-200">
                      <span className="text-4xl font-bold text-purple-600">{recommendations.day}</span>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">Day of cycle</span>
                  </div>
                </div>
                
                <div className="mb-4 sm:mb-0">
                  <span className="text-sm text-gray-500">Energy level</span>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-800 capitalize">{recommendations.energyLevel}</span>
                  </div>
                  {recommendations.dailyMessage && (
                    <div className="mt-1 text-sm text-purple-600 font-medium max-w-xs">
                      {recommendations.dailyMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Workout Recommendations */}
        {recommendations && (
          <section className="mb-8 bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center text-gray-800">
                <Dumbbell className="mr-2 h-5 w-5 text-purple-600" />
                Today's Workout
              </h3>
              <Button variant="ghost" className="text-purple-600 hover:bg-purple-50 py-1 px-2 h-auto text-sm">
                Start <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            
            <div className={`${getPhaseBackgroundColor(recommendations.phase)} rounded-lg p-4 mb-4`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{recommendations.workout.type}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{recommendations.workout.duration} mins</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 capitalize">
                Intensity: {recommendations.workout.intensity}
              </p>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Focus Areas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendations.workout.focus.map((focus, index) => (
                      <span key={index} className="text-xs bg-white/70 text-gray-700 px-2 py-1 rounded-full">
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Recommended Activities:</span>
                  <ul className="mt-1 text-sm text-gray-600 space-y-1">
                    {recommendations.workout.activities.slice(0, 3).map((activity, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
                {recommendations.workout.specialNotes && recommendations.workout.specialNotes.length > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <span className="text-sm font-medium text-yellow-800">Special Notes:</span>
                    <ul className="mt-1 text-sm text-yellow-700 space-y-1">
                      {recommendations.workout.specialNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Nutrition Recommendations */}
        {recommendations && (
          <section className="mb-8 bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center text-gray-800">
                <Utensils className="mr-2 h-5 w-5 text-purple-600" />
                Nutrition Focus
              </h3>
              <Button variant="ghost" className="text-purple-600 hover:bg-purple-50 py-1 px-2 h-auto text-sm">
                Meal Plan <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            
            <div className={`${getPhaseBackgroundColor(recommendations.phase)} rounded-lg p-4 mb-4`}>
              <p className="text-sm text-gray-600 mb-4">{recommendations.nutrition.reason}</p>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Key Nutrients:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendations.nutrition.keyNutrients.map((nutrient, index) => (
                      <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {nutrient}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Foods to Focus On:</span>
                  <ul className="mt-1 text-sm text-gray-600 space-y-1">
                    {recommendations.nutrition.focusFoods.slice(0, 4).map((food, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {recommendations.nutrition.avoidFoods.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Foods to Limit:</span>
                    <ul className="mt-1 text-sm text-gray-600 space-y-1">
                      {recommendations.nutrition.avoidFoods.slice(0, 3).map((food, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                          {food}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {recommendations.nutrition.specialNotes && recommendations.nutrition.specialNotes.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                    <span className="text-sm font-medium text-blue-800">Special Notes:</span>
                    <ul className="mt-1 text-sm text-blue-700 space-y-1">
                      {recommendations.nutrition.specialNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

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
            <Calendar className="h-6 w-6 text-purple-600" />
            <span className="text-sm">Info Hub</span>
          </Button>
        </section>
      </main>
    </div>
  );
};

export default HomePage;