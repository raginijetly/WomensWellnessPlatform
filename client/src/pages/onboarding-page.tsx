import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import HealthConditionCheckbox from "@/components/health-condition-checkbox";
import { HEALTH_CONDITIONS, HEALTH_GOALS } from "@shared/schema";

// Validation schema for onboarding data
const onboardingSchema = z.object({
  lastPeriodDate: z.string().min(1, { message: "Please select a date" }),
  age: z.string().min(1, "Age is required").refine(
    (val) => {
      const age = parseInt(val);
      return !isNaN(age) && age >= 18 && age <= 100;
    },
    { message: "Age must be between 18 and 100" }
  ),
  healthGoal: z.string().min(1, { message: "Please select a health goal" }),
  healthConditions: z.array(z.string()).optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();

  // If user has already completed onboarding, redirect to home
  useEffect(() => {
    if (user?.completedOnboarding) {
      navigate("/");
    }
  }, [user, navigate]);

  // Form setup
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      lastPeriodDate: "",
      age: "",
      healthGoal: "",
      healthConditions: [],
    },
  });

  // Onboarding submission
  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormValues) => {
      const res = await apiRequest("POST", "/api/onboarding", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Onboarding complete!",
        description: "Your profile has been set up successfully.",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Onboarding failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: OnboardingFormValues) => {
    onboardingMutation.mutate(values);
  };

  // Go to next onboarding step
  const nextStep = () => {
    if (currentStep === 1) {
      const lastPeriodDate = form.getValues("lastPeriodDate");
      if (!lastPeriodDate) {
        form.setError("lastPeriodDate", {
          type: "manual",
          message: "Please select a date",
        });
        return;
      }
      form.clearErrors("lastPeriodDate");
    } else if (currentStep === 2) {
      const age = form.getValues("age");
      if (!age || isNaN(parseInt(age)) || parseInt(age) < 18 || parseInt(age) > 100) {
        form.setError("age", {
          type: "manual",
          message: "Age must be between 18 and 100",
        });
        return;
      }
      form.clearErrors("age");
      
      // Also check health goal
      const healthGoal = form.getValues("healthGoal");
      if (!healthGoal) {
        form.setError("healthGoal", {
          type: "manual",
          message: "Please select a health goal",
        });
        return;
      }
      form.clearErrors("healthGoal");
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  // Go to previous onboarding step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="auth-container min-h-screen flex items-center justify-center px-4 py-12 gradient-primary">
      <div className="dotted-grid w-full h-full absolute top-0 left-0 opacity-10"></div>
      
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-medium text-2xl text-gradient-primary">
            Let's personalize your experience
          </h1>
          <p className="text-gray-600 mt-2">
            This helps us create a fitness plan tailored to your needs
          </p>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2 w-full">
            <div className={`h-1 flex-1 rounded-full ${currentStep >= 1 ? "bg-purple-500" : "bg-gray-200"}`}></div>
            <div className={`h-1 flex-1 rounded-full ${currentStep >= 2 ? "bg-purple-500" : "bg-gray-200"}`}></div>
            <div className={`h-1 flex-1 rounded-full ${currentStep >= 3 ? "bg-purple-500" : "bg-gray-200"}`}></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-600">Step {currentStep}/3</span>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Period Date */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="lastPeriodDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-600 mb-2">
                        Date of your last period
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="custom-date-input w-full px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white transition-colors"
                        />
                      </FormControl>
                      <p className="mt-2 text-sm text-gray-600">
                        This helps us track your cycle and optimize workouts
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-6 gradient-primary text-white font-medium rounded-lg hover:opacity-95 transition-opacity shadow-md"
                >
                  Continue
                </Button>
              </div>
            )}
            
            {/* Step 2: Age and Health Goal */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-600 mb-2">
                        Your age
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="18"
                          max="100"
                          placeholder="e.g. 29"
                          className="w-full px-4 py-3 rounded-lg border bg-gray-100 focus:bg-white transition-colors"
                        />
                      </FormControl>
                      <p className="mt-2 text-sm text-gray-600">
                        Your age helps us recommend appropriate fitness routines
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="healthGoal"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="block text-sm font-medium text-gray-600 mb-2">
                        Your primary health goal
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          {HEALTH_GOALS.map((goal) => (
                            <div
                              key={goal}
                              className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg"
                            >
                              <RadioGroupItem 
                                value={goal} 
                                id={`goal-${goal}`} 
                                className="text-purple-500"
                              />
                              <label
                                htmlFor={`goal-${goal}`}
                                className="text-base font-medium cursor-pointer flex-1"
                              >
                                {goal}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <p className="mt-2 text-sm text-gray-600">
                        This helps us customize your fitness and nutrition program
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 py-6 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-6 gradient-primary text-white font-medium rounded-lg hover:opacity-95 transition-opacity shadow-md"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Health Conditions */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="healthConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-600 mb-3">
                        Select any health conditions (optional)
                      </FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {HEALTH_CONDITIONS.map((condition) => (
                          <HealthConditionCheckbox
                            key={condition}
                            condition={condition}
                            checked={field.value?.includes(condition) || false}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...(field.value || []), condition]);
                              } else {
                                field.onChange(
                                  field.value?.filter((value) => value !== condition) || []
                                );
                              }
                            }}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        These help us customize workouts and nutrition advice
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 py-6 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 py-6 gradient-primary text-white font-medium rounded-lg hover:opacity-95 transition-opacity shadow-md"
                    disabled={onboardingMutation.isPending}
                  >
                    {onboardingMutation.isPending ? "Finishing..." : "Finish Setup"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default OnboardingPage;
