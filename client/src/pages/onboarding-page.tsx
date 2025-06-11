import { FC, useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Loader2, CalendarDays, User, Heart, Activity, Apple, Target, Shield, Baby } from "lucide-react";
import { 
  HEALTH_GOALS, 
  HEALTH_CONDITIONS, 
  LIFE_STAGES, 
  PERIOD_REGULARITY, 
  CYCLE_PHASES 
} from "@shared/schema";
import { format, differenceInDays, addDays } from "date-fns";

// Define the different onboarding steps
type OnboardingStep = 'age' | 'period' | 'regularity' | 'fitness' | 'dietary' | 'goals' | 'conditions' | 'lifestage' | 'completion';

// Number of total onboarding steps
const TOTAL_STEPS = 8;

const OnboardingPage: FC = () => {
  const { user, isLoading, updateOnboarding } = useAuth();
  const [_, setLocation] = useLocation();
  
  // State for all form fields
  const [ageInput, setAgeInput] = useState<string>("");
  const [dateInput, setDateInput] = useState<Date | undefined>(undefined);
  const [dontKnowDate, setDontKnowDate] = useState<boolean>(false);
  const [periodsRegular, setPeriodsRegular] = useState<string | null>(null);
  const [fitnessLevel, setFitnessLevel] = useState<string | null>(null);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [otherDietaryRestriction, setOtherDietaryRestriction] = useState<string>("");
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [noneHealthCondition, setNoneHealthCondition] = useState<boolean>(false);
  const [lifeStage, setLifeStage] = useState<string | null>(null);

  const [isPending, setIsPending] = useState(false);
  
  // Current step in the onboarding process
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('age');
  
  // Helper function to get step number
  const getStepNumber = (step: OnboardingStep): number => {
    switch (step) {
      case 'age': return 1;
      case 'period': return 2;
      case 'regularity': return 3;
      case 'fitness': return 4;
      case 'dietary': return 5;
      case 'goals': return 6;
      case 'conditions': return 7;
      case 'lifestage': return 8;
      case 'completion': return 9;
      default: return 1;
    }
  };
  
  // Helper function to get completion percentage
  const getCompletionPercentage = (): number => {
    return Math.min(((getStepNumber(currentStep) - 1) * (100 / TOTAL_STEPS)), 100);
  };
  
  // Calculate cycle information
  const calculateCycleInfo = () => {
    if (!dateInput) return null;
    
    const today = new Date();
    const daysSinceLastPeriod = differenceInDays(today, dateInput);
    const cycleDay = (daysSinceLastPeriod % 28) + 1;
    
    // Determine cycle phase
    let phase = 'Unknown';
    if (cycleDay >= 1 && cycleDay <= 7) {
      phase = 'Menstrual';
    } else if (cycleDay >= 8 && cycleDay <= 14) {
      phase = 'Follicular';
    } else if (cycleDay >= 15 && cycleDay <= 21) {
      phase = 'Ovulation';
    } else if (cycleDay >= 22 && cycleDay <= 28) {
      phase = 'Luteal';
    }
    
    return { cycleDay, phase };
  };

  const toggleHealthGoal = (goal: string) => {
    setHealthGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };
  
  const toggleDietaryPreference = (preference: string) => {
    setDietaryPreferences(prev => {
      const newPreferences = prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference];
      
      // If user selects any preference, clear "other" input unless it's the "Other" option
      if (preference !== "Other allergies/restrictions" && newPreferences.length > 0) {
        // Keep the other restriction if "Other" is still selected
        if (!newPreferences.includes("Other allergies/restrictions")) {
          setOtherDietaryRestriction("");
        }
      }
      
      return newPreferences;
    });
  };

  const toggleHealthCondition = (condition: string) => {
    setHealthConditions(prev => {
      const newConditions = prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition];
      
      // If user selects any condition, uncheck "None" option
      if (newConditions.length > 0) {
        setNoneHealthCondition(false);
      }
      
      return newConditions;
    });
  };

  // Navigation functions
  const goToNextStep = () => {
    switch (currentStep) {
      case 'age':
        setCurrentStep('period');
        break;
      case 'period':
        setCurrentStep('regularity');
        break;
      case 'regularity':
        setCurrentStep('fitness');
        break;
      case 'fitness':
        setCurrentStep('dietary');
        break;
      case 'dietary':
        setCurrentStep('goals');
        break;
      case 'goals':
        setCurrentStep('conditions');
        break;
      case 'conditions':
        setCurrentStep('lifestage');
        break;
      case 'lifestage':
        setCurrentStep('completion');
        calculateCycleInfo();
        break;
      case 'completion':
        handleSubmit();
        break;
    }
  };

  const skipStep = () => {
    goToNextStep();
  };

  const handleSubmit = async () => {
    setIsPending(true);
    
    // Parse age to number
    const age = ageInput ? parseInt(ageInput, 10) : null;
    
    // Create onboarding data
    const onboardingData = {
      lastPeriodDate: dateInput ? dateInput.toISOString() : null,
      dontKnowPeriodDate: dontKnowDate,
      age: age || null,
      periodsRegular: periodsRegular || undefined,
      fitnessLevel: fitnessLevel || undefined,
      dietaryPreferences: dietaryPreferences.length > 0 ? dietaryPreferences.join(", ") + (otherDietaryRestriction ? `, ${otherDietaryRestriction}` : "") : undefined,
      healthGoals: healthGoals,
      healthConditions: healthConditions,
      lifeStage: lifeStage || undefined,
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

  return (
    <div className="min-h-screen gradient-primary">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to FemFit</h1>
          <p className="text-purple-200">Let's personalize your fitness journey</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-200">
              Step {getStepNumber(currentStep)} of {TOTAL_STEPS}
            </span>
            <span className="text-sm font-medium text-purple-200">
              {Math.round(getCompletionPercentage())}%
            </span>
          </div>
          <Progress value={getCompletionPercentage()} className="w-full h-2 bg-purple-300" />
        </div>

        {/* Main content area */}
        <div className="bg-white rounded-2xl shadow-xl p-6 min-h-[500px] flex flex-col">
          
          {/* Age Step */}
          {currentStep === 'age' && (
            <div className="flex flex-col h-full">
              <div className="mb-6 text-center">
                <User className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-purple-900 mb-2">What's your age?</h2>
                <p className="text-purple-800/80">This helps us provide age-appropriate recommendations</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    className="text-lg py-3"
                    min="13"
                    max="100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Period Date Step */}
          {currentStep === 'period' && (
            <div className="flex flex-col h-full">
              <div className="mb-6 text-center">
                <CalendarDays className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-purple-900 mb-2">When was your last period?</h2>
                <p className="text-purple-800/80">This helps us sync your workouts with your cycle</p>
              </div>
              
              <div className="flex-1 flex flex-col">
                {!dontKnowDate ? (
                  <div className="flex-1 flex flex-col justify-center">
                    <Calendar
                      mode="single"
                      selected={dateInput}
                      onSelect={setDateInput}
                      className="rounded-md border mx-auto"
                      disabled={(date) => date > new Date() || date < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">That's okay! We'll help you track it moving forward.</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="dont-know-date" 
                      checked={dontKnowDate} 
                      onCheckedChange={(checked) => {
                        setDontKnowDate(checked === true);
                        if (checked) {
                          setDateInput(undefined);
                        }
                      }}
                      className="data-[state=checked]:bg-purple-600"
                    />
                    <Label htmlFor="dont-know-date" className="text-sm text-gray-700">
                      I don't know / Can't remember
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Period Regularity Step */}
          {currentStep === 'regularity' && (
            <div className="flex flex-col h-full">
              <div className="mb-6 text-center">
                <Activity className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-purple-900 mb-2">Are your periods regular?</h2>
                <p className="text-purple-800/80">This helps us better understand your cycle patterns</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-3">
                  {PERIOD_REGULARITY.map((option) => (
                    <button
                      key={option}
                      onClick={() => setPeriodsRegular(option)}
                      className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                        periodsRegular === option
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fitness Level Step */}
          {currentStep === 'fitness' && (
            <div className="flex flex-col h-full">
              <div className="mb-6 text-center">
                <Activity className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-purple-900 mb-2">What's your current fitness level?</h2>
                <p className="text-purple-800/80">This helps us recommend appropriate workouts</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-3">
                  {["Beginner", "Intermediate", "Advanced", "Getting back into fitness"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFitnessLevel(level)}
                      className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                        fitnessLevel === level
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dietary Preferences Step */}
          {currentStep === 'dietary' && (
            <div className="flex flex-col h-full">
              <div className="mb-6 text-center">
                <Apple className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-purple-900 mb-2">Do you have any dietary preferences/restrictions?</h2>
                <p className="text-purple-800/80">Select all that apply</p>
              </div>
              
              <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
                  {["Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Keto", "Paleo", "Low-carb", "Mediterranean", "Halal", "Kosher", "Other allergies/restrictions"].map((preference) => (
                    <div 
                      key={preference}
                      className={`flex items-center space-x-2 rounded-md py-2 sm:py-3 px-3 sm:px-4 cursor-pointer transition-colors ${
                        dietaryPreferences.includes(preference) 
                          ? "bg-purple-100 border-2 border-purple-500" 
                          : "bg-white border-2 border-white"
                      }`}
                      onClick={() => toggleDietaryPreference(preference)}
                    >
                      <Checkbox 
                        id={`dietary-${preference}`} 
                        checked={dietaryPreferences.includes(preference)} 
                        onCheckedChange={() => toggleDietaryPreference(preference)}
                        className="data-[state=checked]:bg-purple-600 h-4 w-4 sm:h-5 sm:w-5"
                      />
                      <Label 
                        htmlFor={`dietary-${preference}`} 
                        className="cursor-pointer w-full text-gray-700"
                      >
                        {preference}
                      </Label>
                    </div>
                  ))}
                </div>
                
                {/* Text input for other restrictions */}
                {dietaryPreferences.includes("Other allergies/restrictions") && (
                  <div className="mt-4 w-full max-w-md mx-auto">
                    <Input
                      placeholder="Please specify..."
                      value={otherDietaryRestriction}
                      onChange={(e) => setOtherDietaryRestriction(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Health Goals Step */}
          {currentStep === 'goals' && (
            <div className="flex flex-col h-full">
              <div className="mb-6 text-center">
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-purple-900 mb-2">What are your health goals?</h2>
                <p className="text-purple-800/80">Select all that apply</p>
              </div>
              
              <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
                  {HEALTH_GOALS.map((goal) => (
                    <div 
                      key={goal}
                      className={`flex items-center space-x-2 rounded-md py-2 sm:py-3 px-3 sm:px-4 cursor-pointer transition-colors ${
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
                        className="data-[state=checked]:bg-purple-600 h-4 w-4 sm:h-5 sm:w-5"
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
            </div>
          )}

          {/* Health Conditions Step */}
          {currentStep === 'conditions' && (
            <div className="flex flex-col h-full">
              <div className="mb-6 text-center">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-purple-900 mb-2">Do you have any health conditions?</h2>
                <p className="text-purple-800/80">This helps us provide safer recommendations</p>
              </div>
              
              <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
                  {HEALTH_CONDITIONS.map((condition) => (
                    <div 
                      key={condition}
                      className={`flex items-center space-x-2 rounded-md py-2 sm:py-3 px-3 sm:px-4 cursor-pointer transition-colors ${
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
                        className="data-[state=checked]:bg-purple-600 h-4 w-4 sm:h-5 sm:w-5"
                      />
                      <Label 
                        htmlFor={`condition-${condition}`} 
                        className="cursor-pointer w-full text-gray-700"
                      >
                        {condition}
                      </Label>
                    </div>
                  ))}
                  
                  {/* None of these apply option */}
                  <div 
                    className={`flex items-center space-x-2 rounded-md py-2 sm:py-3 px-3 sm:px-4 cursor-pointer transition-colors ${
                      noneHealthCondition
                        ? "bg-purple-100 border-2 border-purple-500" 
                        : "bg-white border-2 border-white"
                    }`}
                    onClick={() => {
                      setNoneHealthCondition(!noneHealthCondition);
                      if (!noneHealthCondition) {
                        setHealthConditions([]);
                      }
                    }}
                  >
                    <Checkbox 
                      id="condition-none" 
                      checked={noneHealthCondition} 
                      onCheckedChange={(checked) => {
                        setNoneHealthCondition(checked === true);
                        if (checked) {
                          setHealthConditions([]);
                        }
                      }}
                      className="data-[state=checked]:bg-purple-600 h-4 w-4 sm:h-5 sm:w-5"
                    />
                    <Label 
                      htmlFor="condition-none" 
                      className="cursor-pointer w-full text-gray-700"
                    >
                      None of these apply to me
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Life Stage Step */}
          {currentStep === 'lifestage' && (
            <div className="flex flex-col h-full">
              <div className="mb-6 text-center">
                <Baby className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-purple-900 mb-2">What life stage are you in?</h2>
                <p className="text-purple-800/80">This helps us provide relevant recommendations</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-3">
                  {LIFE_STAGES.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setLifeStage(stage)}
                      className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                        lifeStage === stage
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Completion Step */}
          {currentStep === 'completion' && (
            <div className="flex flex-col h-full justify-center items-center text-center">
              <div className="mb-6">
                <Heart className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-purple-900 mb-2">You're all set!</h2>
                <p className="text-purple-800/80">
                  We're creating your personalized fitness journey based on your preferences.
                </p>
              </div>
              
              <div className="w-full max-w-md">
                {isPending && (
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    <span className="text-purple-600">Setting up your profile...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          {currentStep !== 'completion' && (
            <div className="mt-auto pt-6 space-y-3">
              <Button
                className="w-full py-3 gradient-primary hover:opacity-90 shadow-lg text-lg font-medium border border-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={goToNextStep}
                disabled={
                  // Add validation for each step
                  (currentStep === 'age' && (!ageInput || isNaN(parseInt(ageInput)))) ||
                  (currentStep === 'period' && !dateInput && !dontKnowDate) ||
                  (currentStep === 'regularity' && !periodsRegular) ||
                  (currentStep === 'fitness' && !fitnessLevel) ||
                  (currentStep === 'dietary' && dietaryPreferences.length === 0 && !otherDietaryRestriction) ||
                  (currentStep === 'goals' && healthGoals.length === 0) ||
                  (currentStep === 'conditions' && healthConditions.length === 0 && !noneHealthCondition) ||
                  (currentStep === 'lifestage' && !lifeStage)
                }
              >
                Continue
              </Button>
              {/* Skip button shown only if not on the period date selection screen or if on period screen but NOT in "don't know" mode */}
              {(currentStep !== 'period' || (currentStep === 'period' && !dontKnowDate)) && (
                <Button
                  variant="ghost"
                  className="w-full py-2.5 text-purple-800 hover:text-purple-900 hover:bg-purple-50/50"
                  onClick={skipStep}
                >
                  Skip for now
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;