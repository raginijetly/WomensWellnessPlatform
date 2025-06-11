// WOMEN'S FITNESS APP - RECOMMENDATION DATABASE
// This structure feeds personalized recommendations based on user inputs

const RECOMMENDATION_DATABASE = {
  
  // CYCLE PHASES - Core foundation for all recommendations
  cyclePhases: {
    menstrual: {
      name: "Menstrual",
      days: [1, 2, 3, 4, 5],
      hormoneStatus: "All hormones at lowest levels",
      energyLevel: "low",
      description: "Your body is shedding the uterine lining. Energy is typically lower, so gentle movement is key.",
      
      baseWorkout: {
        type: "Gentle Movement",
        intensity: "low",
        duration: "20-30 mins",
        focus: ["flexibility", "circulation", "pain relief"],
        activities: ["gentle yoga", "walking", "light stretching", "meditation"]
      },
      
      baseNutrition: {
        keyNutrients: ["iron", "vitamin C", "omega-3"],
        focusFoods: ["leafy greens", "dark chocolate", "salmon", "lentils", "citrus fruits"],
        avoidFoods: ["excess caffeine", "high sodium"],
        reason: "Replenish iron lost during menstruation and reduce inflammation"
      }
    },

    follicular: {
      name: "Follicular", 
      days: [6, 7, 8, 9, 10, 11, 12, 13, 14],
      hormoneStatus: "Estrogen rising steadily",
      energyLevel: "rising",
      description: "Your body is preparing for ovulation. Energy levels start to increase.",
      
      baseWorkout: {
        type: "Strength & Cardio",
        intensity: "medium-high", 
        duration: "30-45 mins",
        focus: ["muscle building", "stamina", "strength"],
        activities: ["strength training", "HIIT", "cardio classes", "challenging yoga"]
      },
      
      baseNutrition: {
        keyNutrients: ["complex carbs", "lean protein", "B vitamins"],
        focusFoods: ["oats", "quinoa", "chicken", "fish", "eggs", "whole grains"],
        avoidFoods: ["refined sugars", "processed foods"],
        reason: "Support rising energy and metabolism with steady fuel"
      }
    },

    ovulatory: {
      name: "Ovulatory",
      days: [15, 16, 17],
      hormoneStatus: "Estrogen peaks, testosterone rises",
      energyLevel: "peak",
      description: "Peak energy time! Your body is primed for challenging activities.",
      
      baseWorkout: {
        type: "High Intensity",
        intensity: "high",
        duration: "45-60 mins", 
        focus: ["peak performance", "power", "coordination"],
        activities: ["HIIT", "dance fitness", "competitive sports", "heavy strength training"]
      },
      
      baseNutrition: {
        keyNutrients: ["antioxidants", "fiber", "healthy fats"],
        focusFoods: ["berries", "avocado", "nuts", "colorful vegetables", "olive oil"],
        avoidFoods: ["heavy meals before workouts"],
        reason: "Support detoxification and provide clean energy for peak performance"
      }
    },

    luteal: {
      name: "Luteal",
      days: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      hormoneStatus: "Progesterone dominant, energy declining",
      energyLevel: "declining",
      description: "Energy starts declining. Focus on steady, sustainable activities.",
      
      baseWorkout: {
        type: "Moderate & Mindful",
        intensity: "medium",
        duration: "30-40 mins",
        focus: ["stability", "balance", "mood support"],
        activities: ["pilates", "moderate strength", "yoga", "swimming"]
      },
      
      baseNutrition: {
        keyNutrients: ["magnesium", "B6", "complex carbs"],
        focusFoods: ["dark leafy greens", "bananas", "sweet potatoes", "almonds", "pumpkin seeds"],
        avoidFoods: ["excess caffeine", "alcohol", "high sugar"],
        reason: "Support stable blood sugar and reduce PMS symptoms"
      }
    }
  },

  // HEALTH GOAL MODIFIERS
  healthGoalModifiers: {
    "weight_management": {
      workoutAdjustment: {
        addFocus: ["fat burning", "metabolic boost"],
        increaseIntensity: 0.1,
        addActivities: ["circuit training", "interval walking"]
      },
      nutritionAdjustment: {
        addNutrients: ["protein", "fiber"],
        addFoods: ["lean proteins", "vegetables", "legumes"],
        portion: "Focus on portion control and eating regularly"
      }
    },
    
    "get_stronger": {
      workoutAdjustment: {
        addFocus: ["progressive overload", "compound movements"],
        addActivities: ["weight lifting", "resistance training", "bodyweight strength"]
      },
      nutritionAdjustment: {
        addNutrients: ["protein", "creatine-rich foods"],
        addFoods: ["lean meats", "Greek yogurt", "protein-rich legumes"],
        timing: "Eat protein within 30 mins post-workout"
      }
    },
    
    "reduce_stress": {
      workoutAdjustment: {
        reduceIntensity: 0.2,
        addFocus: ["mindfulness", "relaxation"],
        addActivities: ["yoga", "tai chi", "nature walks", "meditation"]
      },
      nutritionAdjustment: {
        addNutrients: ["magnesium", "adaptogens", "omega-3"],
        addFoods: ["chamomile tea", "dark chocolate", "fatty fish", "herbal teas"],
        avoid: ["excess caffeine", "sugar crashes"]
      }
    },
    
    "improve_sleep": {
      workoutAdjustment: {
        timing: "Avoid intense workouts 3 hours before bed",
        addActivities: ["evening yoga", "gentle stretching"]
      },
      nutritionAdjustment: {
        addNutrients: ["magnesium", "tryptophan", "melatonin precursors"],
        addFoods: ["cherries", "almonds", "turkey", "warm milk"],
        timing: "Light dinner 2-3 hours before bed"
      }
    },
    
    "balance_hormones": {
      workoutAdjustment: {
        addFocus: ["stress reduction", "consistent routine"],
        avoidActivities: ["excessive cardio", "over-training"]
      },
      nutritionAdjustment: {
        addNutrients: ["healthy fats", "zinc", "vitamin D"],
        addFoods: ["avocado", "seeds", "fatty fish", "cruciferous vegetables"],
        avoid: ["processed foods", "excess sugar", "trans fats"]
      }
    }
  },

  // HEALTH CONDITION MODIFIERS  
  healthConditionModifiers: {
    "pcos": {
      workoutAdjustment: {
        addFocus: ["insulin sensitivity", "strength training"],
        addActivities: ["weight lifting", "moderate cardio"],
        avoidActivities: ["excessive cardio"]
      },
      nutritionAdjustment: {
        addNutrients: ["fiber", "protein", "chromium"],
        addFoods: ["low glycemic foods", "cinnamon", "green tea"],
        avoid: ["refined carbs", "sugary foods", "processed foods"],
        special: "Focus on stable blood sugar"
      }
    },
    
    "thyroid_disorder": {
      workoutAdjustment: {
        addFocus: ["gentle progression", "avoid overtraining"],
        addActivities: ["swimming", "yoga", "walking"]
      },
      nutritionAdjustment: {
        addNutrients: ["iodine", "selenium", "zinc"],
        addFoods: ["sea vegetables", "Brazil nuts", "lean proteins"],
        avoid: ["goitrogenic foods in excess", "soy if hypothyroid"],
        special: "Support thyroid function"
      }
    },
    
    "diabetes": {
      workoutAdjustment: {
        addFocus: ["blood sugar management", "consistent timing"],
        timing: "Exercise post-meals when possible"
      },
      nutritionAdjustment: {
        addNutrients: ["fiber", "protein", "complex carbs"],
        addFoods: ["whole grains", "vegetables", "lean proteins"],
        avoid: ["simple sugars", "refined carbs"],
        special: "Monitor blood sugar before/after exercise"
      }
    },
    
    "endometriosis": {
      workoutAdjustment: {
        addFocus: ["anti-inflammatory movement", "pain management"],
        addActivities: ["gentle yoga", "swimming", "walking"],
        avoidActivities: ["high impact during flares"]
      },
      nutritionAdjustment: {
        addNutrients: ["omega-3", "antioxidants", "anti-inflammatory"],
        addFoods: ["fatty fish", "berries", "turmeric", "ginger"],
        avoid: ["inflammatory foods", "excess red meat", "trans fats"],
        special: "Focus on reducing inflammation"
      }
    }
  },

  // FITNESS LEVEL MODIFIERS
  fitnessLevelModifiers: {
    "just_starting": {
      workoutAdjustment: {
        reduceDuration: 0.5, // 50% of base duration
        reduceIntensity: 0.3,
        addFocus: ["form", "consistency", "habit building"],
        progression: "Start with 2-3 days per week"
      }
    },
    
    "getting_back": {
      workoutAdjustment: {
        reduceDuration: 0.7, // 70% of base duration  
        reduceIntensity: 0.2,
        addFocus: ["rebuilding stamina", "injury prevention"],
        progression: "Gradually increase intensity weekly"
      }
    },
    
    "already_active": {
      workoutAdjustment: {
        // No major adjustments needed
        addFocus: ["consistency", "cycle optimization"]
      }
    },
    
    "very_experienced": {
      workoutAdjustment: {
        increaseDuration: 0.2, // 120% of base duration
        increaseIntensity: 0.1,
        addFocus: ["advanced techniques", "peak performance"],
        addActivities: ["complex movements", "sport-specific training"]
      }
    }
  },

  // DAILY ENERGY MODIFIERS
  dailyEnergyModifiers: {
    "energetic": {
      workoutAdjustment: {
        increaseIntensity: 0.1,
        message: "Great energy today! Perfect time for a challenging workout."
      }
    },
    
    "balanced": {
      workoutAdjustment: {
        // Use base recommendation as-is
        message: "You're feeling balanced - stick to your planned workout."
      }
    },
    
    "tired": {
      workoutAdjustment: {
        reduceIntensity: 0.3,
        reduceDuration: 0.3,
        addFocus: ["gentle movement", "energy restoration"],
        message: "Low energy today - gentle movement will help you feel better."
      }
    },
    
    "stressed": {
      workoutAdjustment: {
        reduceIntensity: 0.2,
        addFocus: ["stress relief", "mindfulness"],
        addActivities: ["yoga", "meditation", "nature walks"],
        message: "Feeling stressed? Let's focus on calming movement today."
      }
    }
  },

  // SAMPLE DETAILED WORKOUTS
  detailedWorkouts: {
    "gentle_yoga": {
      warmup: ["Cat-cow stretches", "Gentle neck rolls", "Shoulder shrugs"],
      main: ["Child's pose", "Gentle twists", "Legs up wall", "Restorative poses"],
      cooldown: ["Savasana", "Deep breathing", "Gentle meditation"],
      duration: "20-30 mins",
      equipment: "Yoga mat, pillow"
    },
    
    "strength_training": {
      warmup: ["Dynamic stretching", "Arm circles", "Leg swings", "Light cardio"],
      main: ["Squats", "Push-ups", "Lunges", "Planks", "Rows", "Overhead press"],
      cooldown: ["Static stretching", "Foam rolling"],
      duration: "30-45 mins", 
      equipment: "Weights or resistance bands"
    },
    
    "hiit": {
      warmup: ["Light jogging", "Dynamic stretches", "Activation exercises"],
      main: ["Burpees", "Mountain climbers", "Jump squats", "High knees"],
      cooldown: ["Walking", "Full body stretching"],
      duration: "20-30 mins",
      equipment: "None needed"
    }
  },

  // MEAL SUGGESTIONS
  mealSuggestions: {
    "iron_rich_breakfast": {
      meal: "Spinach and mushroom omelet with whole grain toast",
      nutrients: ["iron", "protein", "B vitamins"],
      reason: "Perfect for menstrual phase iron replenishment"
    },
    
    "energy_boosting_lunch": {
      meal: "Quinoa bowl with grilled chicken and roasted vegetables", 
      nutrients: ["complex carbs", "lean protein", "fiber"],
      reason: "Sustained energy for follicular phase workouts"
    },
    
    "hormone_balancing_dinner": {
      meal: "Baked salmon with sweet potato and steamed broccoli",
      nutrients: ["omega-3", "beta carotene", "fiber"],
      reason: "Supports hormone production and balance"
    }
  }
};

// RECOMMENDATION ENGINE FUNCTION
function generateRecommendations(userProfile, currentDay, dailyEnergy) {
  // 1. Determine cycle phase
  const phase = determineCyclePhase(currentDay);
  const baseRecs = RECOMMENDATION_DATABASE.cyclePhases[phase];
  
  // 2. Apply modifiers based on user profile
  let workoutRec = { ...baseRecs.baseWorkout };
  let nutritionRec = { ...baseRecs.baseNutrition };
  
  // Apply health goal modifiers
  if (userProfile.healthGoals) {
    userProfile.healthGoals.forEach(goal => {
      const modifier = RECOMMENDATION_DATABASE.healthGoalModifiers[goal];
      if (modifier) {
        workoutRec = applyWorkoutModifier(workoutRec, modifier.workoutAdjustment);
        nutritionRec = applyNutritionModifier(nutritionRec, modifier.nutritionAdjustment);
      }
    });
  }
  
  // Apply health condition modifiers
  if (userProfile.healthConditions) {
    userProfile.healthConditions.forEach(condition => {
      const modifier = RECOMMENDATION_DATABASE.healthConditionModifiers[condition];
      if (modifier) {
        workoutRec = applyWorkoutModifier(workoutRec, modifier.workoutAdjustment);
        nutritionRec = applyNutritionModifier(nutritionRec, modifier.nutritionAdjustment);
      }
    });
  }
  
  // Apply fitness level modifier
  const fitnessModifier = RECOMMENDATION_DATABASE.fitnessLevelModifiers[userProfile.fitnessLevel];
  if (fitnessModifier) {
    workoutRec = applyWorkoutModifier(workoutRec, fitnessModifier.workoutAdjustment);
  }
  
  // Apply daily energy modifier
  const energyModifier = RECOMMENDATION_DATABASE.dailyEnergyModifiers[dailyEnergy];
  if (energyModifier) {
    workoutRec = applyWorkoutModifier(workoutRec, energyModifier.workoutAdjustment);
  }
  
  return {
    phase: baseRecs.name,
    day: currentDay,
    insight: baseRecs.description,
    hormoneStatus: baseRecs.hormoneStatus,
    workout: workoutRec,
    nutrition: nutritionRec,
    dailyMessage: energyModifier?.workoutAdjustment?.message || ""
  };
}

// Helper functions (simplified for structure)
function determineCyclePhase(day) {
  if (day <= 5) return 'menstrual';
  if (day <= 14) return 'follicular'; 
  if (day <= 17) return 'ovulatory';
  return 'luteal';
}

function applyWorkoutModifier(base, modifier) {
  // Logic to merge modifiers with base workout
  return { ...base, ...modifier };
}

function applyNutritionModifier(base, modifier) {
  // Logic to merge modifiers with base nutrition
  return { ...base, ...modifier };
}

// EXPORT FOR USE
export { RECOMMENDATION_DATABASE, generateRecommendations };