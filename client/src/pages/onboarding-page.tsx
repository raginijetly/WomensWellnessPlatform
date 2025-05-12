import { FC, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { HEALTH_GOALS, HEALTH_CONDITIONS } from "@shared/schema";
import { format } from "date-fns";

// Define the different onboarding steps
type OnboardingStep = 'period' | 'age' | 'goals' | 'conditions';

// Number of total onboarding steps
const TOTAL_STEPS = 4;

const OnboardingPage: FC = () => {
  const { user, isLoading, updateOnboarding } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Form state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  
  // Current step in the onboarding process
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('period');
  
  // Helper function to get step number
  const getStepNumber = (step: OnboardingStep): number => {
    switch (step) {
      case 'period': return 1;
      case 'age': return 2;
      case 'goals': return 3;
      case 'conditions': return 4;
      default: return 1;
    }
  };
  
  // Helper function to get completion percentage
  const getCompletionPercentage = (): number => {
    return (getStepNumber(currentStep) - 1) * (100 / TOTAL_STEPS);
  };
  
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
  
  // Move to the next step
  const goToNextStep = () => {
    switch (currentStep) {
      case 'period':
        setCurrentStep('age');
        break;
      case 'age':
        setCurrentStep('goals');
        break;
      case 'goals':
        setCurrentStep('conditions');
        break;
      case 'conditions':
        handleSubmit();
        break;
    }
  };
  
  // Check if the current step is valid
  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 'period': return !!date;
      case 'age': return !!age;
      case 'goals': return healthGoals.length > 0;
      case 'conditions': return true; // Conditions are optional
      default: return false;
    }
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
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }
  
  // Navigation effects
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setLocation("/auth");
      } else if (user.completedOnboarding) {
        setLocation("/");
      }
    }
  }, [user, isLoading, setLocation]);
  
  // Exit early if not authenticated or already completed onboarding
  if (!user || user.completedOnboarding) {
    return null;
  }
  
  // Current progress percentage
  const progressPercentage = getCompletionPercentage();
  
  return (
    <div className="min-h-screen gradient-primary flex flex-col p-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="text-purple-900 font-medium">
            Step {getStepNumber(currentStep)} of {TOTAL_STEPS}
          </div>
          <div className="text-purple-900 font-medium">
            {progressPercentage}%
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-purple-200" />
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Period Step */}
        {currentStep === 'period' && (
          <div className="flex flex-col h-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">When was your last period?</h2>
              <p className="text-purple-800/80">
                This helps us personalize your fitness plan based on your cycle
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 w-full max-w-md">
                <div className="flex items-center mb-2">
                  <CalendarIcon className="mr-2 h-5 w-5 text-purple-500" />
                  <span className="text-gray-700">Date of last period</span>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="mx-auto"
                  disabled={(date) => date > new Date()}
                />
                {date && (
                  <p className="text-sm text-center text-gray-600 mt-2">
                    Selected: {format(date, "MMMM d, yyyy")}
                  </p>
                )}
              </div>
            </div>
            
            <Button
              className="w-full py-2.5 mt-6 gradient-primary hover:opacity-90"
              onClick={goToNextStep}
              disabled={!isCurrentStepValid()}
            >
              Continue
            </Button>
          </div>
        )}
        
        {/* Age Step */}
        {currentStep === 'age' && (
          <div className="flex flex-col h-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">What's your age?</h2>
              <p className="text-purple-800/80">
                We'll tailor recommendations specific to your life stage
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
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
                    variant="outline"
                    className={`py-3 text-base h-auto border-2 ${
                      age === ageOption.value 
                        ? "border-purple-500 bg-purple-100 text-purple-900" 
                        : "border-white bg-white text-gray-700"
                    }`}
                    onClick={() => setAge(ageOption.value)}
                  >
                    {ageOption.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button
              className="w-full py-2.5 mt-6 gradient-primary hover:opacity-90"
              onClick={goToNextStep}
              disabled={!isCurrentStepValid()}
            >
              Continue
            </Button>
          </div>
        )}
        
        {/* Health Goals Step */}
        {currentStep === 'goals' && (
          <div className="flex flex-col h-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">What are your health goals?</h2>
              <p className="text-purple-800/80">
                Select all that apply to personalize your journey
              </p>
            </div>
            
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
                {HEALTH_GOALS.map((goal) => (
                  <div 
                    key={goal}
                    className={`flex items-center space-x-2 rounded-md py-3 px-4 cursor-pointer transition-colors ${
                      healthGoals.includes(goal) 
                        ? "bg-purple-100 border-2 border-purple-500" 
                        : "bg-white border-2 border-white"
                    }`}
                    onClick={() => toggleHealthGoal(goal)}
                  >
                    <Checkbox 
                      id={`goal-${goal}`} 
                      checked={healthGoals.includes(goal)} 
                      onCheckedChange={() => toggleHealthGoal(goal)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                    <Label 
                      htmlFor={`goal-${goal}`} 
                      className="cursor-pointer w-full text-gray-700"
                    >
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              className="w-full py-2.5 mt-6 gradient-primary hover:opacity-90"
              onClick={goToNextStep}
              disabled={!isCurrentStepValid()}
            >
              Continue
            </Button>
          </div>
        )}
        
        {/* Health Conditions Step */}
        {currentStep === 'conditions' && (
          <div className="flex flex-col h-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Any health conditions?</h2>
              <p className="text-purple-800/80">
                This is optional but helps us provide safer recommendations
              </p>
            </div>
            
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
                {HEALTH_CONDITIONS.map((condition) => (
                  <div 
                    key={condition}
                    className={`flex items-center space-x-2 rounded-md py-3 px-4 cursor-pointer transition-colors ${
                      healthConditions.includes(condition) 
                        ? "bg-purple-100 border-2 border-purple-500" 
                        : "bg-white border-2 border-white"
                    }`}
                    onClick={() => toggleHealthCondition(condition)}
                  >
                    <Checkbox 
                      id={`condition-${condition}`} 
                      checked={healthConditions.includes(condition)} 
                      onCheckedChange={() => toggleHealthCondition(condition)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                    <Label 
                      htmlFor={`condition-${condition}`} 
                      className="cursor-pointer w-full text-gray-700"
                    >
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              className="w-full py-2.5 mt-6 gradient-primary hover:opacity-90"
              onClick={goToNextStep}
              disabled={isPending}
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
            <p className="text-xs text-white/80 text-center px-2 mt-2">
              Your information is private and secure. We only use it to personalize your experience.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;