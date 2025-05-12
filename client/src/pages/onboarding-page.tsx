import { FC, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon, CheckCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  HEALTH_GOALS, 
  HEALTH_CONDITIONS, 
  LIFE_STAGES, 
  SYMPTOMS, 
  PERIOD_REGULARITY,
  CYCLE_PHASES 
} from "@shared/schema";
import { format, differenceInDays, addDays } from "date-fns";

// Define the different onboarding steps
type OnboardingStep = 'age' | 'period' | 'regularity' | 'goals' | 'conditions' | 'lifestage' | 'symptoms' | 'completion';

// Number of total onboarding steps
const TOTAL_STEPS = 7;

const OnboardingPage: FC = () => {
  const { user, isLoading, updateOnboarding } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Form state
  const [dateInput, setDateInput] = useState<Date | undefined>(undefined);
  const [dontKnowDate, setDontKnowDate] = useState(false);
  const [ageInput, setAgeInput] = useState("");
  const [periodsRegular, setPeriodsRegular] = useState<string | null>(null);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [lifeStage, setLifeStage] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  
  // Current step in the onboarding process
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('age');
  
  // Helper function to get step number
  const getStepNumber = (step: OnboardingStep): number => {
    switch (step) {
      case 'age': return 1;
      case 'period': return 2;
      case 'regularity': return 3;
      case 'goals': return 4;
      case 'conditions': return 5;
      case 'lifestage': return 6;
      case 'symptoms': return 7;
      case 'completion': return 8;
      default: return 1;
    }
  };
  
  // Helper function to get completion percentage
  const getCompletionPercentage = (): number => {
    return Math.min(((getStepNumber(currentStep) - 1) * (100 / TOTAL_STEPS)), 100);
  };
  
  // Toggle functions for multi-selects
  const toggleHealthCondition = (condition: string) => {
    setHealthConditions(prev => 
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };
  
  const toggleHealthGoal = (goal: string) => {
    setHealthGoals(prev => 
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };
  
  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };
  
  // Move to the next step
  const goToNextStep = () => {
    switch (currentStep) {
      case 'age':
        setCurrentStep('period');
        break;
      case 'period':
        setCurrentStep('regularity');
        break;
      case 'regularity':
        setCurrentStep('goals');
        break;
      case 'goals':
        setCurrentStep('conditions');
        break;
      case 'conditions':
        setCurrentStep('lifestage');
        break;
      case 'lifestage':
        setCurrentStep('symptoms');
        break;
      case 'symptoms':
        setCurrentStep('completion');
        calculateCycleInfo();
        break;
      case 'completion':
        handleSubmit();
        break;
    }
  };
  
  // Skip the current step
  const skipStep = () => {
    goToNextStep();
  };
  
  // Calculate cycle information for the completion screen
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [cyclePhase, setCyclePhase] = useState<string | null>(null);
  
  const calculateCycleInfo = () => {
    if (dateInput) {
      // Calculate days since period started
      const today = new Date();
      const daysSincePeriod = differenceInDays(today, dateInput);
      
      // Assume a 28-day cycle for demo purposes
      const cycleDayNum = (daysSincePeriod % 28) + 1;
      setCycleDay(cycleDayNum);
      
      // Determine cycle phase
      if (cycleDayNum <= 5) {
        setCyclePhase("Menstruation");
      } else if (cycleDayNum <= 13) {
        setCyclePhase("Follicular");
      } else if (cycleDayNum <= 16) {
        setCyclePhase("Ovulation");
      } else {
        setCyclePhase("Luteal");
      }
    } else {
      // Default values if no date is selected
      setCycleDay(1);
      setCyclePhase("Menstruation");
    }
  };
  
  // Handle onboarding submission
  const handleSubmit = () => {
    if (!user) return;
    
    setIsPending(true);
    
    // Format date as ISO string if it exists
    const dateString = dateInput ? dateInput.toISOString() : null;
    
    // Parse age to number
    const age = ageInput ? parseInt(ageInput, 10) : null;
    
    // Create onboarding data
    const onboardingData = {
      lastPeriodDate: dateString,
      dontKnowPeriodDate: dontKnowDate,
      age: age || null,
      periodsRegular: periodsRegular || undefined,
      healthGoals: healthGoals,
      healthConditions: healthConditions,
      lifeStage: lifeStage || undefined,
      symptoms: symptoms,
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
      {currentStep !== 'completion' && (
        /* Progress indicator */
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
      )}
      
      <div className="flex-1 flex flex-col">
        {/* Age Step */}
        {currentStep === 'age' && (
          <div className="flex flex-col h-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">How old are you?</h2>
              <p className="text-purple-800/80">
                We'll tailor recommendations specific to your life stage
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md">
                <Input
                  type="number"
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  placeholder="Enter your age"
                  className="text-lg py-6 bg-white border-2 border-white text-center"
                  min="13"
                  max="100"
                />
              </div>
            </div>
            
            <div className="mt-auto pt-6 space-y-3">
              <Button
                className="w-full py-2.5 gradient-primary hover:opacity-90"
                onClick={goToNextStep}
                disabled={!ageInput}
              >
                Continue
              </Button>
              <Button
                variant="ghost"
                className="w-full py-2.5 text-purple-800 hover:text-purple-900 hover:bg-purple-50/50"
                onClick={skipStep}
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}
        
        {/* Period Date Step */}
        {currentStep === 'period' && (
          <div className="flex flex-col h-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">When was your last period?</h2>
              <p className="text-purple-800/80">
                This helps us personalize your fitness plan based on your cycle
              </p>
            </div>
            
            {!dontKnowDate ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 w-full max-w-md">
                  <div className="flex items-center mb-2">
                    <CalendarIcon className="mr-2 h-5 w-5 text-purple-500" />
                    <span className="text-gray-700">First day of last period</span>
                  </div>
                  <Calendar
                    mode="single"
                    selected={dateInput}
                    onSelect={setDateInput}
                    className="mx-auto"
                    disabled={(date) => date > new Date()}
                  />
                  {dateInput && (
                    <p className="text-sm text-center text-gray-600 mt-2">
                      Selected: {format(dateInput, "MMMM d, yyyy")}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-purple-600"
                    onClick={() => setDontKnowDate(true)}
                  >
                    I don't know
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
                  <p className="text-gray-700 mb-4">
                    You can log the first day of your last period later or log the beginning of your new one later.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setDontKnowDate(false)}
                  >
                    Back to calendar
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-auto pt-6 space-y-3">
              <Button
                className="w-full py-2.5 gradient-primary hover:opacity-90"
                onClick={goToNextStep}
              >
                Continue
              </Button>
              <Button
                variant="ghost"
                className="w-full py-2.5 text-purple-800 hover:text-purple-900 hover:bg-purple-50/50"
                onClick={skipStep}
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}
        
        {/* Period Regularity Step */}
        {currentStep === 'regularity' && (
          <div className="flex flex-col h-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Are your periods regular?</h2>
              <p className="text-purple-800/80">
                This helps us better understand your cycle patterns
              </p>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-1 gap-4 w-full max-w-md mx-auto">
                {PERIOD_REGULARITY.map((option) => (
                  <div key={option} className="space-y-2">
                    <button
                      className={`w-full py-3 px-4 text-left border-2 rounded-lg ${
                        periodsRegular === option 
                          ? "border-purple-500 bg-purple-100" 
                          : "border-white bg-white"
                      }`}
                      onClick={() => setPeriodsRegular(option)}
                    >
                      <span className="text-gray-800 font-medium">{option}</span>
                    </button>
                    
                    {periodsRegular === option && (
                      <div className="text-sm text-purple-700 p-2 bg-purple-50/70 rounded border border-purple-100">
                        {option === "Yes" && "Great! We can provide insights to help you optimize your lifestyle and habits to better align with your cycle."}
                        {option === "No" && "Okay, we can help you track your periods and better understand your body's signals, even if they're irregular."}
                        {option === "I'm unsure" && "No problem. We'll help you learn more about your cycle and provide personalized insights."}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-auto pt-6 space-y-3">
              <Button
                className="w-full py-2.5 gradient-primary hover:opacity-90"
                onClick={goToNextStep}
                disabled={!periodsRegular}
              >
                Continue
              </Button>
              <Button
                variant="ghost"
                className="w-full py-2.5 text-purple-800 hover:text-purple-900 hover:bg-purple-50/50"
                onClick={skipStep}
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}
        
        {/* Health Goals Step */}
        {currentStep === 'goals' && (
          <div className="flex flex-col h-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">What are your primary health goals?</h2>
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
            
            <div className="mt-auto pt-6 space-y-3">
              <Button
                className="w-full py-2.5 gradient-primary hover:opacity-90"
                onClick={goToNextStep}
                disabled={healthGoals.length === 0}
              >
                Continue
              </Button>
              <Button
                variant="ghost"
                className="w-full py-2.5 text-purple-800 hover:text-purple-900 hover:bg-purple-50/50"
                onClick={skipStep}
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}
        
        {/* Health Conditions Step */}
        {currentStep === 'conditions' && (
          <div className="flex flex-col h-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Do you have any health conditions?</h2>
              <p className="text-purple-800/80">
                Select all that apply to help us provide safer recommendations
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
            
            <div className="mt-auto pt-6 space-y-3">
              <Button
                className="w-full py-2.5 gradient-primary hover:opacity-90"
                onClick={goToNextStep}
              >
                Continue
              </Button>
              <Button
                variant="ghost"
                className="w-full py-2.5 text-purple-800 hover:text-purple-900 hover:bg-purple-50/50"
                onClick={skipStep}
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}
        
        {/* Life Stage Step */}
        {currentStep === 'lifestage' && (
          <div className="flex flex-col h-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Are you in any of these life stages?</h2>
              <p className="text-purple-800/80">
                Select one option that applies to you
              </p>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-1 gap-4 w-full max-w-md mx-auto">
                {LIFE_STAGES.slice(1).map((stage) => (
                  <div key={stage} className="space-y-2">
                    <button
                      className={`w-full py-3 px-4 text-left border-2 rounded-lg ${
                        lifeStage === stage 
                          ? "border-purple-500 bg-purple-100" 
                          : "border-white bg-white"
                      }`}
                      onClick={() => setLifeStage(stage)}
                    >
                      <span className="text-gray-800 font-medium">{stage}</span>
                    </button>
                    
                    {lifeStage === stage && (
                      <div className="text-sm text-purple-700 p-2 bg-purple-50/70 rounded border border-purple-100">
                        {stage === "Prenatal" && "Congratulations! We're here to support you and your changing needs during this journey."}
                        {stage === "Postpartum" && "Congratulations! We're here to support your recovery and wellness after childbirth."}
                        {stage === "Menopause" && "Changing bodies are hard. We are here to guide you through these changes and help adapt your lifestyle better."}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-auto pt-6 space-y-3">
              <Button
                className="w-full py-2.5 gradient-primary hover:opacity-90"
                onClick={goToNextStep}
              >
                Continue
              </Button>
              <Button
                variant="ghost"
                className="w-full py-2.5 text-purple-800 hover:text-purple-900 hover:bg-purple-50/50"
                onClick={() => {
                  setLifeStage("None");
                  skipStep();
                }}
              >
                None of these apply to me
              </Button>
            </div>
          </div>
        )}
        
        {/* Symptoms Step */}
        {currentStep === 'symptoms' && (
          <div className="flex flex-col h-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Have you experienced any of these symptoms?</h2>
              <p className="text-purple-800/80">
                In the past few months, select all that apply
              </p>
            </div>
            
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
                {SYMPTOMS.map((symptom) => (
                  <div 
                    key={symptom}
                    className={`flex items-center space-x-2 rounded-md py-3 px-4 cursor-pointer transition-colors ${
                      symptoms.includes(symptom) 
                        ? "bg-purple-100 border-2 border-purple-500" 
                        : "bg-white border-2 border-white"
                    }`}
                    onClick={() => toggleSymptom(symptom)}
                  >
                    <Checkbox 
                      id={`symptom-${symptom}`} 
                      checked={symptoms.includes(symptom)} 
                      onCheckedChange={() => toggleSymptom(symptom)}
                      className="data-[state=checked]:bg-purple-600"
                    />
                    <Label 
                      htmlFor={`symptom-${symptom}`} 
                      className="cursor-pointer w-full text-gray-700"
                    >
                      {symptom}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-auto pt-6 space-y-3">
              <Button
                className="w-full py-2.5 gradient-primary hover:opacity-90"
                onClick={goToNextStep}
              >
                Continue
              </Button>
              <Button
                variant="ghost"
                className="w-full py-2.5 text-purple-800 hover:text-purple-900 hover:bg-purple-50/50"
                onClick={skipStep}
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}
        
        {/* Completion Step */}
        {currentStep === 'completion' && (
          <div className="flex flex-col h-full justify-center items-center space-y-8 py-6">
            <div className="bg-purple-100 rounded-full p-6">
              <CheckCircle className="h-16 w-16 text-purple-600" />
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-purple-900 mb-3">You're all set!</h1>
              <p className="text-purple-800/80 mb-8 max-w-md">
                We've personalized your fitness journey based on your information
              </p>
            </div>
            
            <div className="bg-purple-50 w-full max-w-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-purple-900 mb-4">Your Cycle Information</h2>
              
              <div className="flex justify-between py-2 border-b border-purple-100">
                <span className="text-gray-700">Current Cycle Day:</span>
                <span className="text-purple-900 font-semibold">{cycleDay || "N/A"}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Current Phase:</span>
                <span className="text-purple-900 font-semibold">{cyclePhase || "Unknown"}</span>
              </div>
            </div>
            
            <Button
              className="w-full max-w-md py-3 mt-6 gradient-primary hover:opacity-90 text-lg"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Start Your Journey"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;