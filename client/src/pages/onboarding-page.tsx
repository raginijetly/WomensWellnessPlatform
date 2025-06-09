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
  PERIOD_REGULARITY
} from "@shared/schema";
import { format } from "date-fns";

// Define the different onboarding steps in the new order
type OnboardingStep = 'age' | 'period' | 'regularity' | 'fitness' | 'dietary' | 'goals' | 'conditions' | 'lifestage' | 'completion';

// Number of total onboarding steps
const TOTAL_STEPS = 8;

// Fitness level options
const FITNESS_LEVELS = [
  "Just starting out",
  "Getting back into fitness", 
  "Already active",
  "Very experienced"
];

// Dietary preference options
const DIETARY_PREFERENCES = [
  "No restrictions",
  "Vegetarian",
  "Vegan", 
  "Gluten-free",
  "Other allergies/restrictions"
];

const OnboardingPage: FC = () => {
  const { user, isLoading, updateOnboarding } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Form state
  const [dateInput, setDateInput] = useState<Date | undefined>(undefined);
  const [dontKnowDate, setDontKnowDate] = useState(false);
  const [ageInput, setAgeInput] = useState("");
  const [periodsRegular, setPeriodsRegular] = useState<string | null>(null);
  const [fitnessLevel, setFitnessLevel] = useState<string | null>(null);
  const [dietaryPreferences, setDietaryPreferences] = useState<string | null>(null);
  const [otherDietaryText, setOtherDietaryText] = useState("");
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
  
  // Toggle functions for multi-selects
  const toggleHealthGoal = (goal: string) => {
    setHealthGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
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
        break;
    }
  };
  
  // Go back to the previous step
  const goToPreviousStep = () => {
    switch (currentStep) {
      case 'period':
        setCurrentStep('age');
        break;
      case 'regularity':
        setCurrentStep('period');
        break;
      case 'fitness':
        setCurrentStep('regularity');
        break;
      case 'dietary':
        setCurrentStep('fitness');
        break;
      case 'goals':
        setCurrentStep('dietary');
        break;
      case 'conditions':
        setCurrentStep('goals');
        break;
      case 'lifestage':
        setCurrentStep('conditions');
        break;
      case 'completion':
        setCurrentStep('lifestage');
        break;
    }
  };
  
  // Submit the onboarding data
  const submitOnboardingData = async () => {
    setIsPending(true);
    try {
      const finalDietaryPreference = dietaryPreferences === "Other allergies/restrictions" 
        ? otherDietaryText 
        : dietaryPreferences;

      updateOnboarding({
        age: parseInt(ageInput),
        lastPeriodDate: dontKnowDate ? null : dateInput,
        dontKnowPeriodDate: dontKnowDate,
        periodsRegular: periodsRegular || "Unknown",
        fitnessLevel: fitnessLevel || "",
        dietaryPreferences: finalDietaryPreference || "",
        healthGoals: healthGoals,
        healthConditions: noneHealthCondition ? [] : healthConditions,
        lifeStage: lifeStage || "None"
      });
      
      // Navigate to home after completion
      setLocation('/');
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
    } finally {
      setIsPending(false);
    }
  };

  // Redirect if user has already completed onboarding
  useEffect(() => {
    if (user?.completedOnboarding) {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Show loading if user data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // Helper function to check if current step is valid
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 'age':
        return ageInput.trim() !== '' && parseInt(ageInput) > 0;
      case 'period':
        return dontKnowDate || dateInput !== undefined;
      case 'regularity':
        return periodsRegular !== null;
      case 'fitness':
        return fitnessLevel !== null;
      case 'dietary':
        return dietaryPreferences !== null && 
               (dietaryPreferences !== "Other allergies/restrictions" || otherDietaryText.trim() !== '');
      case 'goals':
        return healthGoals.length > 0;
      case 'conditions':
        return noneHealthCondition || healthConditions.length > 0;
      case 'lifestage':
        return lifeStage !== null;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen gradient-primary">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">FemFit</h1>
        </div>
      </header>

      {/* Main onboarding content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Progress header */}
          <div className="bg-purple-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-900">Let's personalize your experience</h2>
              <span className="text-sm text-purple-700">
                Step {getStepNumber(currentStep)} of {TOTAL_STEPS}
              </span>
            </div>
            <Progress 
              value={getCompletionPercentage()} 
              className="h-2"
            />
          </div>

          {/* Step content */}
          <div className="p-6">
            {/* Age Step */}
            {currentStep === 'age' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">How old are you?</h2>
                  <p className="text-gray-600">This helps us provide age-appropriate recommendations</p>
                </div>
                <div className="max-w-md mx-auto">
                  <Label htmlFor="age-input" className="text-lg font-medium">Age</Label>
                  <Input
                    id="age-input"
                    type="number"
                    min="13"
                    max="100"
                    placeholder="Enter your age"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    className="mt-2 text-center text-lg"
                  />
                </div>
              </div>
            )}

            {/* Period Date Step */}
            {currentStep === 'period' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">When was your last period?</h2>
                  <p className="text-gray-600">This helps us track your cycle phase</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dont-know-date"
                      checked={dontKnowDate}
                      onCheckedChange={(checked) => {
                        setDontKnowDate(checked === true);
                        if (checked) setDateInput(undefined);
                      }}
                    />
                    <Label htmlFor="dont-know-date" className="text-sm">
                      I don't remember / I'd rather not say
                    </Label>
                  </div>
                  
                  {!dontKnowDate && (
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={dateInput}
                        onSelect={setDateInput}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        className="rounded-md border"
                      />
                    </div>
                  )}
                  
                  {dateInput && (
                    <div className="text-center text-sm text-gray-600">
                      Selected: {format(dateInput, 'PPP')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Period Regularity Step */}
            {currentStep === 'regularity' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">Are your periods regular?</h2>
                  <p className="text-gray-600">This helps us predict your cycle phases</p>
                </div>
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  {PERIOD_REGULARITY.map((option) => (
                    <Button
                      key={option}
                      variant={periodsRegular === option ? "default" : "outline"}
                      className={`p-4 h-auto text-left justify-start ${
                        periodsRegular === option ? 'bg-purple-600 text-white' : ''
                      }`}
                      onClick={() => setPeriodsRegular(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Fitness Level Step */}
            {currentStep === 'fitness' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">What's your current fitness level?</h2>
                  <p className="text-gray-600">This helps us customize your workout recommendations</p>
                </div>
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  {FITNESS_LEVELS.map((level) => (
                    <Button
                      key={level}
                      variant={fitnessLevel === level ? "default" : "outline"}
                      className={`p-4 h-auto text-left justify-start ${
                        fitnessLevel === level ? 'bg-purple-600 text-white' : ''
                      }`}
                      onClick={() => setFitnessLevel(level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Dietary Preferences Step */}
            {currentStep === 'dietary' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">Do you have any dietary preferences/restrictions?</h2>
                  <p className="text-gray-600">This helps us tailor nutrition advice for you</p>
                </div>
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  {DIETARY_PREFERENCES.map((preference) => (
                    <Button
                      key={preference}
                      variant={dietaryPreferences === preference ? "default" : "outline"}
                      className={`p-4 h-auto text-left justify-start ${
                        dietaryPreferences === preference ? 'bg-purple-600 text-white' : ''
                      }`}
                      onClick={() => setDietaryPreferences(preference)}
                    >
                      {preference}
                    </Button>
                  ))}
                </div>
                
                {/* Show text input for "Other" option */}
                {dietaryPreferences === "Other allergies/restrictions" && (
                  <div className="max-w-md mx-auto mt-4">
                    <Label htmlFor="other-dietary" className="text-sm font-medium">
                      Please specify your dietary restrictions:
                    </Label>
                    <Input
                      id="other-dietary"
                      type="text"
                      placeholder="e.g., dairy-free, nut allergy, etc."
                      value={otherDietaryText}
                      onChange={(e) => setOtherDietaryText(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Health Goals Step */}
            {currentStep === 'goals' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">What are your primary health goals?</h2>
                  <p className="text-gray-600">Select all that apply to personalize your experience</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {HEALTH_GOALS.map((goal) => (
                    <div 
                      key={goal}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        healthGoals.includes(goal) 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => toggleHealthGoal(goal)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={healthGoals.includes(goal)}
                          onCheckedChange={() => toggleHealthGoal(goal)}
                        />
                        <span className="font-medium">{goal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Health Conditions Step */}
            {currentStep === 'conditions' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">Do you have any health conditions?</h2>
                  <p className="text-gray-600">This helps us provide safe and appropriate recommendations</p>
                </div>
                
                <div className="space-y-4">
                  {/* None option */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      noneHealthCondition 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => {
                      setNoneHealthCondition(!noneHealthCondition);
                      if (!noneHealthCondition) {
                        setHealthConditions([]);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={noneHealthCondition}
                        onCheckedChange={(checked) => {
                          setNoneHealthCondition(checked === true);
                          if (checked) {
                            setHealthConditions([]);
                          }
                        }}
                      />
                      <span className="font-medium">None of the above</span>
                    </div>
                  </div>
                  
                  {/* Condition options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {HEALTH_CONDITIONS.map((condition) => (
                      <div 
                        key={condition}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          healthConditions.includes(condition) 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => toggleHealthCondition(condition)}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={healthConditions.includes(condition)}
                            onCheckedChange={() => toggleHealthCondition(condition)}
                          />
                          <span className="font-medium">{condition}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Life Stage Step */}
            {currentStep === 'lifestage' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">Are you in any of these life stages?</h2>
                  <p className="text-gray-600">This helps us provide stage-appropriate guidance</p>
                </div>
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  {LIFE_STAGES.map((stage) => (
                    <Button
                      key={stage}
                      variant={lifeStage === stage ? "default" : "outline"}
                      className={`p-4 h-auto text-left justify-start ${
                        lifeStage === stage ? 'bg-purple-600 text-white' : ''
                      }`}
                      onClick={() => setLifeStage(stage)}
                    >
                      {stage}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Step */}
            {currentStep === 'completion' && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-purple-900">You're all set!</h2>
                <p className="text-gray-600">
                  Thank you for completing your profile. We'll use this information to provide 
                  personalized recommendations just for you.
                </p>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="p-6 bg-gray-50 border-t flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 'age'}
            >
              Back
            </Button>
            
            {currentStep === 'completion' ? (
              <Button
                onClick={submitOnboardingData}
                disabled={isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            ) : (
              <Button
                onClick={goToNextStep}
                disabled={!canProceed()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;