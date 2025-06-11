// WOMEN'S FITNESS APP - DATABASE IN JSON FORMAT
// Ready to import into Replit

const FITNESS_DATABASE = {
  
  cyclePhases: [
    {
      phase_id: 1,
      phase_name: "Menstrual",
      start_day: 1,
      end_day: 5,
      hormone_status: "All hormones at lowest levels",
      energy_level: "low",
      description: "Your body is shedding the uterine lining. Energy is typically lower, so gentle movement is key."
    },
    {
      phase_id: 2,
      phase_name: "Follicular",
      start_day: 6,
      end_day: 14,
      hormone_status: "Estrogen rising steadily",
      energy_level: "rising",
      description: "Your body is preparing for ovulation. Energy levels start to increase."
    },
    {
      phase_id: 3,
      phase_name: "Ovulatory",
      start_day: 15,
      end_day: 17,
      hormone_status: "Estrogen peaks, testosterone rises",
      energy_level: "peak",
      description: "Peak energy time! Your body is primed for challenging activities."
    },
    {
      phase_id: 4,
      phase_name: "Luteal",
      start_day: 18,
      end_day: 28,
      hormone_status: "Progesterone dominant, energy declining",
      energy_level: "declining",
      description: "Energy starts declining. Focus on steady, sustainable activities."
    }
  ],

  baseWorkouts: [
    {
      phase_id: 1,
      workout_type: "Gentle Movement",
      intensity: "low",
      duration_min: 25,
      focus_areas: ["flexibility", "circulation", "pain relief"],
      recommended_activities: ["gentle yoga", "walking", "light stretching", "meditation"]
    },
    {
      phase_id: 2,
      workout_type: "Strength & Cardio",
      intensity: "medium-high",
      duration_min: 40,
      focus_areas: ["muscle building", "stamina", "strength"],
      recommended_activities: ["strength training", "HIIT", "cardio classes", "challenging yoga"]
    },
    {
      phase_id: 3,
      workout_type: "High Intensity",
      intensity: "high",
      duration_min: 50,
      focus_areas: ["peak performance", "power", "coordination"],
      recommended_activities: ["HIIT", "dance fitness", "competitive sports", "heavy strength training"]
    },
    {
      phase_id: 4,
      workout_type: "Moderate & Mindful",
      intensity: "medium",
      duration_min: 35,
      focus_areas: ["stability", "balance", "mood support"],
      recommended_activities: ["pilates", "moderate strength", "yoga", "swimming"]
    }
  ],

  baseNutrition: [
    {
      phase_id: 1,
      key_nutrients: ["iron", "vitamin C", "omega-3"],
      focus_foods: ["leafy greens", "dark chocolate", "salmon", "lentils", "citrus fruits"],
      avoid_foods: ["excess caffeine", "high sodium"],
      reason: "Replenish iron lost during menstruation and reduce inflammation"
    },
    {
      phase_id: 2,
      key_nutrients: ["complex carbs", "lean protein", "B vitamins"],
      focus_foods: ["oats", "quinoa", "chicken", "fish", "eggs", "whole grains"],
      avoid_foods: ["refined sugars", "processed foods"],
      reason: "Support rising energy and metabolism with steady fuel"
    },
    {
      phase_id: 3,
      key_nutrients: ["antioxidants", "fiber", "healthy fats"],
      focus_foods: ["berries", "avocado", "nuts", "colorful vegetables", "olive oil"],
      avoid_foods: ["heavy meals before workouts"],
      reason: "Support detoxification and provide clean energy for peak performance"
    },
    {
      phase_id: 4,
      key_nutrients: ["magnesium", "B6", "complex carbs"],
      focus_foods: ["dark leafy greens", "bananas", "sweet potatoes", "almonds", "pumpkin seeds"],
      avoid_foods: ["excess caffeine", "alcohol", "high sugar"],
      reason: "Support stable blood sugar and reduce PMS symptoms"
    }
  ],

  healthGoals: [
    {
      goal_id: 1,
      goal_name: "weight_management",
      workout_focus_add: ["fat burning", "metabolic boost"],
      workout_intensity_change: 0.1,
      workout_activities_add: ["circuit training", "interval walking"],
      nutrition_nutrients_add: ["protein", "fiber"],
      nutrition_foods_add: ["lean proteins", "vegetables", "legumes"],
      special_notes: "Focus on portion control and eating regularly"
    },
    {
      goal_id: 2,
      goal_name: "get_stronger",
      workout_focus_add: ["progressive overload", "compound movements"],
      workout_intensity_change: 0,
      workout_activities_add: ["weight lifting", "resistance training", "bodyweight strength"],
      nutrition_nutrients_add: ["protein", "creatine-rich foods"],
      nutrition_foods_add: ["lean meats", "Greek yogurt", "protein-rich legumes"],
      special_notes: "Eat protein within 30 mins post-workout"
    },
    {
      goal_id: 3,
      goal_name: "reduce_stress",
      workout_focus_add: ["mindfulness", "relaxation"],
      workout_intensity_change: -0.2,
      workout_activities_add: ["yoga", "tai chi", "nature walks", "meditation"],
      nutrition_nutrients_add: ["magnesium", "adaptogens", "omega-3"],
      nutrition_foods_add: ["chamomile tea", "dark chocolate", "fatty fish", "herbal teas"],
      special_notes: "Avoid excess caffeine and sugar crashes"
    },
    {
      goal_id: 4,
      goal_name: "improve_sleep",
      workout_focus_add: ["evening focus"],
      workout_intensity_change: 0,
      workout_activities_add: ["evening yoga", "gentle stretching"],
      nutrition_nutrients_add: ["magnesium", "tryptophan", "melatonin precursors"],
      nutrition_foods_add: ["cherries", "almonds", "turkey", "warm milk"],
      special_notes: "Avoid intense workouts 3 hours before bed, Light dinner 2-3 hours before bed"
    },
    {
      goal_id: 5,
      goal_name: "balance_hormones",
      workout_focus_add: ["stress reduction", "consistent routine"],
      workout_intensity_change: 0,
      workout_activities_add: [],
      nutrition_nutrients_add: ["healthy fats", "zinc", "vitamin D"],
      nutrition_foods_add: ["avocado", "seeds", "fatty fish", "cruciferous vegetables"],
      special_notes: "Avoid processed foods, excess sugar, trans fats"
    }
  ],

  healthConditions: [
    {
      condition_id: 1,
      condition_name: "pcos",
      workout_focus_add: ["insulin sensitivity", "strength training"],
      workout_activities_add: ["weight lifting", "moderate cardio"],
      workout_activities_avoid: ["excessive cardio"],
      nutrition_nutrients_add: ["fiber", "protein", "chromium"],
      nutrition_foods_add: ["low glycemic foods", "cinnamon", "green tea"],
      nutrition_foods_avoid: ["refined carbs", "sugary foods", "processed foods"],
      special_instructions: "Focus on stable blood sugar"
    },
    {
      condition_id: 2,
      condition_name: "thyroid_disorder",
      workout_focus_add: ["gentle progression", "avoid overtraining"],
      workout_activities_add: ["swimming", "yoga", "walking"],
      workout_activities_avoid: [],
      nutrition_nutrients_add: ["iodine", "selenium", "zinc"],
      nutrition_foods_add: ["sea vegetables", "Brazil nuts", "lean proteins"],
      nutrition_foods_avoid: ["goitrogenic foods in excess", "soy if hypothyroid"],
      special_instructions: "Support thyroid function"
    },
    {
      condition_id: 3,
      condition_name: "diabetes",
      workout_focus_add: ["blood sugar management", "consistent timing"],
      workout_activities_add: ["post-meal exercise"],
      workout_activities_avoid: [],
      nutrition_nutrients_add: ["fiber", "protein", "complex carbs"],
      nutrition_foods_add: ["whole grains", "vegetables", "lean proteins"],
      nutrition_foods_avoid: ["simple sugars", "refined carbs"],
      special_instructions: "Monitor blood sugar before/after exercise"
    },
    {
      condition_id: 4,
      condition_name: "endometriosis",
      workout_focus_add: ["anti-inflammatory movement", "pain management"],
      workout_activities_add: ["gentle yoga", "swimming", "walking"],
      workout_activities_avoid: ["high impact during flares"],
      nutrition_nutrients_add: ["omega-3", "antioxidants", "anti-inflammatory"],
      nutrition_foods_add: ["fatty fish", "berries", "turmeric", "ginger"],
      nutrition_foods_avoid: ["inflammatory foods", "excess red meat", "trans fats"],
      special_instructions: "Focus on reducing inflammation"
    }
  ],

  fitnessLevels: [
    {
      fitness_id: 1,
      fitness_level: "just_starting",
      duration_multiplier: 0.5,
      intensity_multiplier: 0.7,
      focus_areas_add: ["form", "consistency", "habit building"],
      progression_notes: "Start with 2-3 days per week"
    },
    {
      fitness_id: 2,
      fitness_level: "getting_back",
      duration_multiplier: 0.7,
      intensity_multiplier: 0.8,
      focus_areas_add: ["rebuilding stamina", "injury prevention"],
      progression_notes: "Gradually increase intensity weekly"
    },
    {
      fitness_id: 3,
      fitness_level: "already_active",
      duration_multiplier: 1.0,
      intensity_multiplier: 1.0,
      focus_areas_add: ["consistency", "cycle optimization"],
      progression_notes: "No major adjustments needed"
    },
    {
      fitness_id: 4,
      fitness_level: "very_experienced",
      duration_multiplier: 1.2,
      intensity_multiplier: 1.1,
      focus_areas_add: ["advanced techniques", "peak performance"],
      progression_notes: "Add complex movements, sport-specific training"
    }
  ],

  dailyEnergy: [
    {
      energy_id: 1,
      energy_level: "energetic",
      intensity_multiplier: 1.1,
      duration_multiplier: 1.0,
      focus_areas_add: [],
      daily_message: "Great energy today! Perfect time for a challenging workout."
    },
    {
      energy_id: 2,
      energy_level: "balanced",
      intensity_multiplier: 1.0,
      duration_multiplier: 1.0,
      focus_areas_add: [],
      daily_message: "You're feeling balanced - stick to your planned workout."
    },
    {
      energy_id: 3,
      energy_level: "tired",
      intensity_multiplier: 0.7,
      duration_multiplier: 0.7,
      focus_areas_add: ["gentle movement", "energy restoration"],
      daily_message: "Low energy today - gentle movement will help you feel better."
    },
    {
      energy_id: 4,
      energy_level: "stressed",
      intensity_multiplier: 0.8,
      duration_multiplier: 1.0,
      focus_areas_add: ["stress relief", "mindfulness"],
      daily_message: "Feeling stressed? Let's focus on calming movement today."
    }
  ],

  sampleWorkouts: [
    {
      workout_id: 1,
      workout_name: "Gentle Yoga Flow",
      category: "gentle_movement",
      duration_min: 25,
      equipment_needed: "Yoga mat, pillow",
      warmup_exercises: ["Cat-cow stretches", "Gentle neck rolls", "Shoulder shrugs"],
      main_exercises: ["Child's pose", "Gentle twists", "Legs up wall", "Restorative poses"],
      cooldown_exercises: ["Savasana", "Deep breathing", "Gentle meditation"]
    },
    {
      workout_id: 2,
      workout_name: "Strength Circuit",
      category: "strength_training",
      duration_min: 40,
      equipment_needed: "Weights or resistance bands",
      warmup_exercises: ["Dynamic stretching", "Arm circles", "Leg swings", "Light cardio"],
      main_exercises: ["Squats", "Push-ups", "Lunges", "Planks", "Rows", "Overhead press"],
      cooldown_exercises: ["Static stretching", "Foam rolling"]
    },
    {
      workout_id: 3,
      workout_name: "HIIT Blast",
      category: "high_intensity",
      duration_min: 25,
      equipment_needed: "None needed",
      warmup_exercises: ["Light jogging", "Dynamic stretches", "Activation exercises"],
      main_exercises: ["Burpees", "Mountain climbers", "Jump squats", "High knees"],
      cooldown_exercises: ["Walking", "Full body stretching"]
    }
  ],

  sampleMeals: [
    {
      meal_id: 1,
      meal_name: "Iron-Rich Spinach Omelet",
      meal_type: "breakfast",
      target_phase_id: 1,
      target_goal_id: null,
      ingredients: ["spinach", "mushrooms", "eggs", "whole grain toast"],
      nutrients_provided: ["iron", "protein", "B vitamins"],
      reason: "Perfect for menstrual phase iron replenishment"
    },
    {
      meal_id: 2,
      meal_name: "Energy Quinoa Bowl",
      meal_type: "lunch",
      target_phase_id: 2,
      target_goal_id: null,
      ingredients: ["quinoa", "grilled chicken", "roasted vegetables"],
      nutrients_provided: ["complex carbs", "lean protein", "fiber"],
      reason: "Sustained energy for follicular phase workouts"
    },
    {
      meal_id: 3,
      meal_name: "Hormone-Balancing Salmon Dinner",
      meal_type: "dinner",
      target_phase_id: null,
      target_goal_id: 5,
      ingredients: ["baked salmon", "sweet potato", "steamed broccoli"],
      nutrients_provided: ["omega-3", "beta carotene", "fiber"],
      reason: "Supports hormone production and balance"
    }
  ]
};

// Export for use in other files
export default FITNESS_DATABASE;