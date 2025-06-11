import { FITNESS_DATABASE } from './fitness-database';

// Types for recommendations
export interface UserProfile {
  age?: number;
  fitnessLevel?: string;
  healthGoals?: string[];
  healthConditions?: string[];
  lastPeriodDate?: string;
  periodsRegular?: string;
  dietaryPreferences?: string;
  symptoms?: string[];
  lifeStage?: string;
}

export interface WorkoutRecommendation {
  type: string;
  intensity: string;
  duration: number;
  focus: string[];
  activities: string[];
  specialNotes?: string[];
}

export interface NutritionRecommendation {
  keyNutrients: string[];
  focusFoods: string[];
  avoidFoods: string[];
  reason: string;
  specialNotes?: string[];
}

export interface DailyRecommendation {
  phase: string;
  day: number;
  insight: string;
  hormoneStatus: string;
  energyLevel: string;
  workout: WorkoutRecommendation;
  nutrition: NutritionRecommendation;
  dailyMessage: string;
}

// Determine cycle phase based on day of cycle
function determineCyclePhase(dayOfCycle: number): number {
  const phases = FITNESS_DATABASE.cyclePhases;
  for (const phase of phases) {
    if (dayOfCycle >= phase.start_day && dayOfCycle <= phase.end_day) {
      return phase.phase_id;
    }
  }
  // Default to luteal if beyond typical cycle
  return 4;
}

// Calculate current day of cycle
function calculateDayOfCycle(lastPeriodDate: string): number {
  const lastPeriod = new Date(lastPeriodDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastPeriod.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // If more than 28 days, assume new cycle started
  return diffDays > 28 ? ((diffDays - 1) % 28) + 1 : diffDays;
}

// Apply health goal modifiers to recommendations
function applyHealthGoalModifiers(
  workout: WorkoutRecommendation,
  nutrition: NutritionRecommendation,
  healthGoals: string[]
): { workout: WorkoutRecommendation; nutrition: NutritionRecommendation } {
  let modifiedWorkout = { ...workout };
  let modifiedNutrition = { ...nutrition };

  healthGoals.forEach(goalName => {
    const goal = FITNESS_DATABASE.healthGoals.find(g => g.goal_name === goalName);
    if (goal) {
      // Apply workout modifications
      modifiedWorkout.focus = [...modifiedWorkout.focus, ...goal.workout_focus_add];
      modifiedWorkout.activities = [...modifiedWorkout.activities, ...goal.workout_activities_add];
      
      // Apply nutrition modifications
      modifiedNutrition.keyNutrients = [...modifiedNutrition.keyNutrients, ...goal.nutrition_nutrients_add];
      modifiedNutrition.focusFoods = [...modifiedNutrition.focusFoods, ...goal.nutrition_foods_add];
      
      if (goal.special_notes) {
        modifiedWorkout.specialNotes = modifiedWorkout.specialNotes || [];
        modifiedWorkout.specialNotes.push(goal.special_notes);
      }
    }
  });

  return { workout: modifiedWorkout, nutrition: modifiedNutrition };
}

// Apply health condition modifiers
function applyHealthConditionModifiers(
  workout: WorkoutRecommendation,
  nutrition: NutritionRecommendation,
  healthConditions: string[]
): { workout: WorkoutRecommendation; nutrition: NutritionRecommendation } {
  let modifiedWorkout = { ...workout };
  let modifiedNutrition = { ...nutrition };

  healthConditions.forEach(conditionName => {
    const condition = FITNESS_DATABASE.healthConditions.find(c => c.condition_name === conditionName);
    if (condition) {
      // Apply workout modifications
      modifiedWorkout.focus = [...modifiedWorkout.focus, ...condition.workout_focus_add];
      modifiedWorkout.activities = [...modifiedWorkout.activities, ...condition.workout_activities_add];
      
      // Apply nutrition modifications
      modifiedNutrition.keyNutrients = [...modifiedNutrition.keyNutrients, ...condition.nutrition_nutrients_add];
      modifiedNutrition.focusFoods = [...modifiedNutrition.focusFoods, ...condition.nutrition_foods_add];
      modifiedNutrition.avoidFoods = [...modifiedNutrition.avoidFoods, ...condition.nutrition_foods_avoid];
      
      if (condition.special_instructions) {
        modifiedNutrition.specialNotes = modifiedNutrition.specialNotes || [];
        modifiedNutrition.specialNotes.push(condition.special_instructions);
      }
    }
  });

  return { workout: modifiedWorkout, nutrition: modifiedNutrition };
}

// Apply fitness level modifiers
function applyFitnessLevelModifiers(
  workout: WorkoutRecommendation,
  fitnessLevel: string
): WorkoutRecommendation {
  const level = FITNESS_DATABASE.fitnessLevels.find(l => l.fitness_level === fitnessLevel);
  if (!level) return workout;

  return {
    ...workout,
    duration: Math.round(workout.duration * level.duration_multiplier),
    focus: [...workout.focus, ...level.focus_areas_add],
    specialNotes: workout.specialNotes || [],
  };
}

// Generate daily energy message based on cycle phase
function generateDailyMessage(phase: any, energyLevel: string): string {
  const messages = {
    low: [
      "Take it easy today - gentle movement will help you feel better.",
      "Your body needs rest. Focus on nurturing activities.",
      "Low energy is normal. Be kind to yourself."
    ],
    rising: [
      "Your energy is building! Great time to start new activities.",
      "Feeling more energetic? Perfect for moderate workouts.",
      "Your body is preparing for action!"
    ],
    peak: [
      "Peak energy time! Go for that challenging workout.",
      "You're unstoppable today - make the most of it!",
      "Perfect day for your most intense activities."
    ],
    declining: [
      "Steady and sustainable is the way to go today.",
      "Focus on consistent, manageable activities.",
      "Your body is preparing for rest - honor that."
    ]
  };

  const levelMessages = messages[energyLevel as keyof typeof messages] || messages.rising;
  return levelMessages[Math.floor(Math.random() * levelMessages.length)];
}

// Main recommendation generation function
export function generateRecommendations(userProfile: UserProfile): DailyRecommendation | null {
  // If no period date, return null
  if (!userProfile.lastPeriodDate) {
    return null;
  }

  // Calculate current cycle day
  const dayOfCycle = calculateDayOfCycle(userProfile.lastPeriodDate);
  const phaseId = determineCyclePhase(dayOfCycle);
  
  // Get base phase data
  const phase = FITNESS_DATABASE.cyclePhases.find(p => p.phase_id === phaseId);
  const baseWorkout = FITNESS_DATABASE.baseWorkouts.find(w => w.phase_id === phaseId);
  const baseNutrition = FITNESS_DATABASE.baseNutrition.find(n => n.phase_id === phaseId);
  
  if (!phase || !baseWorkout || !baseNutrition) {
    return null;
  }

  // Create base recommendations
  let workout: WorkoutRecommendation = {
    type: baseWorkout.workout_type,
    intensity: baseWorkout.intensity,
    duration: baseWorkout.duration_min,
    focus: [...baseWorkout.focus_areas],
    activities: [...baseWorkout.recommended_activities]
  };

  let nutrition: NutritionRecommendation = {
    keyNutrients: [...baseNutrition.key_nutrients],
    focusFoods: [...baseNutrition.focus_foods],
    avoidFoods: [...baseNutrition.avoid_foods],
    reason: baseNutrition.reason
  };

  // Apply modifiers
  if (userProfile.healthGoals) {
    const modified = applyHealthGoalModifiers(workout, nutrition, userProfile.healthGoals);
    workout = modified.workout;
    nutrition = modified.nutrition;
  }

  if (userProfile.healthConditions) {
    const modified = applyHealthConditionModifiers(workout, nutrition, userProfile.healthConditions);
    workout = modified.workout;
    nutrition = modified.nutrition;
  }

  if (userProfile.fitnessLevel) {
    workout = applyFitnessLevelModifiers(workout, userProfile.fitnessLevel);
  }

  // Generate daily message
  const dailyMessage = generateDailyMessage(phase, phase.energy_level);

  return {
    phase: phase.phase_name,
    day: dayOfCycle,
    insight: phase.description,
    hormoneStatus: phase.hormone_status,
    energyLevel: phase.energy_level,
    workout,
    nutrition,
    dailyMessage
  };
}