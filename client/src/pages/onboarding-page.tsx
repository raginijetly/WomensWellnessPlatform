import { FC, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { HEALTH_GOALS, HEALTH_CONDITIONS } from "@shared/schema";
import { format } from "date-fns";

import HealthConditionCheckbox from "@/components/health-condition-checkbox";

const OnboardingPage: FC = () => {
  const { user, isLoading, updateOnboarding } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Form state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  
  // Helper function to toggle health condition
  const toggleHealthCondition = (condition: string) => {
    setHealthConditions(prev => 
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };
  
  // Helper function to toggle health goal
  const toggleHealthGoal = (goal: string) => {
    setHealthGoals(prev => 
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };
  
  // Handle onboarding submission
  const handleSubmit = () => {
    if (!user) return;
    
    setIsPending(true);
    
    // Format date as ISO string if it exists
    const dateString = date ? date.toISOString() : null;
    
    // Create onboarding data
    const onboardingData = {
      lastPeriodDate: dateString,
      age: age || null,
      healthGoals: healthGoals,
      healthConditions,
      completedOnboarding: true,
    };
    
    // Simulate a delay for API request
    setTimeout(() => {
      updateOnboarding(onboardingData);
      setIsPending(false);
      setLocation("/");
    }, 800);
  };
  
  // Calculate if form is valid
  const isValid = !!date && !!age && healthGoals.length > 0;
  
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
  
  // If user has already completed onboarding, redirect to home
  if (user.completedOnboarding) {
    setLocation("/");
    return null;
  }
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white/95 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-purple-800">
              Personalize Your Fitness Journey
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Let us customize your experience based on your unique needs
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Date of last period */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-purple-700">
                When was the first day of your last period?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                This helps us calculate your current cycle phase and provide relevant recommendations.
              </p>
              <div className="border rounded-md mx-auto max-w-sm">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="mx-auto"
                  disabled={(date) => date > new Date()}
                />
              </div>
              {date && (
                <p className="text-sm text-center text-gray-600 mt-2">
                  Selected: {format(date, "PPP")}
                </p>
              )}
            </div>
            
            {/* Age selection */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-purple-700">
                What is your age?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                We'll use this to tailor advice appropriate for your life stage.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Under 18", value: 16 },
                  { label: "18-29", value: 24 },
                  { label: "30-39", value: 35 },
                  { label: "40-49", value: 45 },
                  { label: "50-59", value: 55 },
                  { label: "60+", value: 65 },
                ].map((ageOption) => (
                  <Button
                    key={ageOption.label}
                    type="button"
                    variant={age === ageOption.value ? "default" : "outline"}
                    className={age === ageOption.value ? "gradient-primary" : ""}
                    onClick={() => setAge(ageOption.value)}
                  >
                    {ageOption.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Health Goals */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-purple-700">
                What are your health goals?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Select all that apply. This will help us prioritize content that aligns with your objectives.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HEALTH_GOALS.map((goal) => (
                  <div 
                    key={goal}
                    className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer transition-colors ${
                      healthGoals.includes(goal) ? "border-purple-500 bg-purple-50" : "border-gray-200"
                    }`}
                    onClick={() => toggleHealthGoal(goal)}
                  >
                    <Checkbox 
                      id={`goal-${goal}`} 
                      checked={healthGoals.includes(goal)} 
                      onCheckedChange={() => toggleHealthGoal(goal)}
                    />
                    <Label htmlFor={`goal-${goal}`} className="cursor-pointer w-full">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Health Conditions */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-purple-700">
                Do you have any specific health conditions?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Select all that apply. This is optional but helps us provide more relevant guidance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HEALTH_CONDITIONS.map((condition) => (
                  <HealthConditionCheckbox
                    key={condition}
                    condition={condition}
                    checked={healthConditions.includes(condition)}
                    onCheckedChange={() => toggleHealthCondition(condition)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full gradient-primary hover:opacity-90"
              onClick={handleSubmit}
              disabled={!isValid || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete & Continue"
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Your information is private and secure. We only use it to personalize your experience.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;