import { FC, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('age');
  const [dateInput, setDateInput] = useState<Date | undefined>(undefined);
  const [dontKnowDate, setDontKnowDate] = useState(false);
  const [ageInput, setAgeInput] = useState("");
  const [periodsRegular, setPeriodsRegular] = useState<string | null>(null);
  const [fitnessLevel, setFitnessLevel] = useState<string | null>(null);
  const [dietaryPreferences, setDietaryPreferences] = useState<string | null>(null);
  const [otherDietaryText, setOtherDietaryText] = useState("");
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [noneHealthCondition, setNoneHealthCondition] = useState(false);
  const [lifeStage, setLifeStage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Handle health goal selection
  const toggleHealthGoal = (goal: string) => {
    setHealthGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  // Handle health condition selection
  const toggleHealthCondition = (condition: string) => {
    if (condition === "None of these apply to me") {
      setNoneHealthCondition(!noneHealthCondition);
      if (!noneHealthCondition) {
        setHealthConditions([]);
      }
    } else {
      setHealthConditions(prev => {
        const newConditions = prev.includes(condition) 
          ? prev.filter(c => c !== condition)
          : [...prev, condition];
        
        if (newConditions.length > 0) {
          setNoneHealthCondition(false);
        }
        
        return newConditions;
      });
    }
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
  }, [user]);

  // Helper function to get step number
  const getStepNumber = (step: OnboardingStep): number => {
    const stepOrder = ['age', 'period', 'regularity', 'fitness', 'dietary', 'goals', 'conditions', 'lifestage'];
    return stepOrder.indexOf(step) + 1;
  };

  // Helper function to get completion percentage
  const getCompletionPercentage = (): number => {
    return (getStepNumber(currentStep) / 8) * 100;
  };

  // Helper function to check if current step is complete
  const isStepComplete = (): boolean => {
    switch (currentStep) {
      case 'age':
        return ageInput !== '' && parseInt(ageInput) >= 13;
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 relative">
      {/* Main onboarding content */}
      <div className="flex flex-col min-h-screen">
        {/* Progress header */}
        <div className="pt-12 pb-6 px-6">
          <div className="text-white text-sm font-medium mb-4">
            Step {getStepNumber(currentStep)} of 8
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${getCompletionPercentage()}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 px-6 pb-6">
          {/* Age Step */}
          {currentStep === 'age' && (
            <div className="space-y-8">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">How old are you?</h2>
                <p className="text-lg opacity-90">We'll tailor recommendations specific to your life stage</p>
              </div>
              <div className="max-w-md mx-auto">
                <Input
                  type="number"
                  min="13"
                  max="100"
                  placeholder="Enter your age"
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  className="text-center text-xl py-6 rounded-2xl border-0 bg-white/95 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Period Date Step */}
          {currentStep === 'period' && (
            <div className="space-y-8">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">When was your last period?</h2>
                <p className="text-lg opacity-90">This helps us personalize your fitness plan based on your cycle</p>
              </div>
              
              <div className="bg-white/95 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CalendarIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">First day of last period</span>
                </div>
                
                <div className="flex justify-center mb-6">
                  <Calendar
                    mode="single"
                    selected={dateInput}
                    onSelect={setDateInput}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    className="rounded-lg"
                  />
                </div>
                
                {dateInput && (
                  <div className="text-center text-gray-700 mb-4">
                    Selected: {format(dateInput, "MMMM d, yyyy")}
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setDontKnowDate(!dontKnowDate);
                    if (!dontKnowDate) setDateInput(undefined);
                  }}
                  className="w-full text-purple-600 font-medium py-3 text-center hover:bg-purple-50 rounded-lg transition-colors"
                >
                  I don't know my last period date
                </button>
              </div>
            </div>
          )}

          {/* Regularity Step */}
          {currentStep === 'regularity' && (
            <div className="space-y-8">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Are your periods regular?</h2>
                <p className="text-lg opacity-90">This helps us better understand your cycle patterns</p>
              </div>
              
              <div className="space-y-4">
                {PERIOD_REGULARITY.map((option) => (
                  <button
                    key={option}
                    onClick={() => setPeriodsRegular(option)}
                    className={`w-full text-left p-6 rounded-2xl transition-all ${
                      periodsRegular === option
                        ? 'bg-white text-gray-800 ring-4 ring-white/50'
                        : 'bg-white/90 text-gray-800 hover:bg-white'
                    }`}
                  >
                    <div className="font-medium text-lg">{option}</div>
                    {periodsRegular === "Yes" && option === "Yes" && (
                      <div className="mt-2 text-purple-600 text-sm">
                        Great! We can provide insights to help you optimize your lifestyle and habits to better align with your cycle.
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fitness Level Step */}
          {currentStep === 'fitness' && (
            <div className="space-y-8">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">What's your current fitness level?</h2>
                <p className="text-lg opacity-90">This helps us customize workouts for your experience</p>
              </div>
              
              <div className="space-y-4">
                {FITNESS_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setFitnessLevel(level)}
                    className={`w-full text-left p-6 rounded-2xl transition-all ${
                      fitnessLevel === level
                        ? 'bg-white text-gray-800 ring-4 ring-white/50'
                        : 'bg-white/90 text-gray-800 hover:bg-white'
                    }`}
                  >
                    <div className="font-medium text-lg">{level}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dietary Preferences Step */}
          {currentStep === 'dietary' && (
            <div className="space-y-8">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Do you have any dietary preferences/restrictions?</h2>
                <p className="text-lg opacity-90">This helps us provide suitable nutrition recommendations</p>
              </div>
              
              <div className="space-y-4">
                {DIETARY_PREFERENCES.map((preference) => (
                  <button
                    key={preference}
                    onClick={() => setDietaryPreferences(preference)}
                    className={`w-full text-left p-6 rounded-2xl transition-all ${
                      dietaryPreferences === preference
                        ? 'bg-white text-gray-800 ring-4 ring-white/50'
                        : 'bg-white/90 text-gray-800 hover:bg-white'
                    }`}
                  >
                    <div className="font-medium text-lg">{preference}</div>
                  </button>
                ))}
                
                {dietaryPreferences === "Other allergies/restrictions" && (
                  <div className="mt-4">
                    <Input
                      placeholder="Please specify your dietary restrictions..."
                      value={otherDietaryText}
                      onChange={(e) => setOtherDietaryText(e.target.value)}
                      className="w-full p-4 rounded-2xl border-0 bg-white/95 placeholder:text-gray-400"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Health Goals Step */}
          {currentStep === 'goals' && (
            <div className="space-y-8">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">What are your primary health goals?</h2>
                <p className="text-lg opacity-90">Select all that apply to personalize your journey</p>
              </div>
              
              <div className="space-y-4">
                {HEALTH_GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleHealthGoal(goal)}
                    className={`w-full text-left p-6 rounded-2xl transition-all flex items-center gap-4 ${
                      healthGoals.includes(goal)
                        ? 'bg-white text-gray-800 ring-4 ring-white/50'
                        : 'bg-white/90 text-gray-800 hover:bg-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      healthGoals.includes(goal) 
                        ? 'bg-purple-600 border-purple-600' 
                        : 'border-gray-300'
                    }`}>
                      {healthGoals.includes(goal) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="font-medium text-lg">{goal}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Health Conditions Step */}
          {currentStep === 'conditions' && (
            <div className="space-y-8">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Do you have any health conditions?</h2>
                <p className="text-lg opacity-90">Select all that apply to help us provide safer recommendations</p>
              </div>
              
              <div className="space-y-4">
                {HEALTH_CONDITIONS.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => toggleHealthCondition(condition)}
                    className={`w-full text-left p-6 rounded-2xl transition-all flex items-center gap-4 ${
                      (condition === "None of these apply to me" && noneHealthCondition) ||
                      (condition !== "None of these apply to me" && healthConditions.includes(condition))
                        ? 'bg-white text-gray-800 ring-4 ring-white/50'
                        : 'bg-white/90 text-gray-800 hover:bg-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      ((condition === "None of these apply to me" && noneHealthCondition) ||
                       (condition !== "None of these apply to me" && healthConditions.includes(condition)))
                        ? 'bg-purple-600 border-purple-600' 
                        : 'border-gray-300'
                    }`}>
                      {((condition === "None of these apply to me" && noneHealthCondition) ||
                        (condition !== "None of these apply to me" && healthConditions.includes(condition))) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="font-medium text-lg">{condition}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Life Stage Step */}
          {currentStep === 'lifestage' && (
            <div className="space-y-8">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Are you in any of these life stages?</h2>
                <p className="text-lg opacity-90">Select one option that applies to you</p>
              </div>
              
              <div className="space-y-4">
                {LIFE_STAGES.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setLifeStage(stage)}
                    className={`w-full text-left p-6 rounded-2xl transition-all ${
                      lifeStage === stage
                        ? 'bg-white text-gray-800 ring-4 ring-white/50'
                        : 'bg-white/90 text-gray-800 hover:bg-white'
                    }`}
                  >
                    <div className="font-medium text-lg">{stage}</div>
                    {lifeStage === "Prenatal" && stage === "Prenatal" && (
                      <div className="mt-2 text-purple-600 text-sm">
                        Congratulations! We're here to support you and your changing needs during this journey.
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Completion Step */}
          {currentStep === 'completion' && (
            <div className="space-y-8 text-center text-white">
              <div>
                <h2 className="text-3xl font-bold mb-4">Perfect! You're all set!</h2>
                <p className="text-lg opacity-90">Your personalized wellness journey is ready to begin</p>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Your Profile Summary:</h3>
                <div className="space-y-2 text-left">
                  <p>• Age: {ageInput}</p>
                  <p>• Fitness Level: {fitnessLevel}</p>
                  <p>• Dietary Preferences: {dietaryPreferences === "Other allergies/restrictions" ? otherDietaryText : dietaryPreferences}</p>
                  <p>• Health Goals: {healthGoals.join(", ")}</p>
                  <p>• Life Stage: {lifeStage}</p>
                </div>
              </div>
              
              <Button
                onClick={submitOnboardingData}
                disabled={isPending}
                className="w-full py-6 rounded-2xl text-lg font-semibold bg-white text-purple-600 hover:bg-white/90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Setting up your profile...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {currentStep !== 'completion' && (
          <div className="px-6 pb-8 space-y-4">
            <Button
              onClick={goToNextStep}
              disabled={!isStepComplete()}
              className="w-full py-6 rounded-2xl text-lg font-semibold bg-white text-purple-600 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
            
            <button
              onClick={() => setLocation('/')}
              className="w-full text-white/80 hover:text-white text-center py-4 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;