import React, { FC, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, ChevronUp, History, BarChart, CalendarDays } from "lucide-react";

// Expanded interface for more detailed symptom options
interface SymptomOption {
  value: string;
  label: string;
  emoji: string;
  color: string;
}

interface SymptomQuestion {
  id: string;
  question: string;
  options: SymptomOption[];
  emoji: string;
}

// Calendar entry type for history tracking
interface CalendarEntry {
  date: Date;
  value: string;
}

const SymptomsPage: FC = () => {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("log");
  
  // States for Log tab
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // States for History tab
  const [activeMetric, setActiveMetric] = useState<string>("mood");

  // Define our symptom questions with rich UI options
  const symptomQuestions: SymptomQuestion[] = [
    {
      id: "mood",
      question: "How's your mood today?",
      emoji: "😊",
      options: [
        { value: "Energetic", label: "Energetic", emoji: "😄", color: "bg-purple-100" },
        { value: "Balanced", label: "Balanced", emoji: "😊", color: "bg-blue-100" },
        { value: "Tired", label: "Tired", emoji: "😴", color: "bg-blue-100" },
        { value: "Stressed", label: "Stressed", emoji: "😓", color: "bg-red-100" }
      ]
    },
    {
      id: "energy",
      question: "What's your energy level?",
      emoji: "⚡",
      options: [
        { value: "High", label: "High", emoji: "⚡", color: "bg-yellow-100" },
        { value: "Medium", label: "Medium", emoji: "✨", color: "bg-green-100" },
        { value: "Low", label: "Low", emoji: "🔋", color: "bg-blue-100" },
        { value: "Exhausted", label: "Exhausted", emoji: "🛌", color: "bg-gray-100" }
      ]
    },
    {
      id: "sleep",
      question: "How was your sleep last night?",
      emoji: "😴",
      options: [
        { value: "Excellent", label: "Excellent", emoji: "💤", color: "bg-indigo-100" },
        { value: "Good", label: "Good", emoji: "😴", color: "bg-blue-100" },
        { value: "Fair", label: "Fair", emoji: "😐", color: "bg-yellow-100" },
        { value: "Poor", label: "Poor", emoji: "😫", color: "bg-red-100" }
      ]
    },
    {
      id: "pain",
      question: "Are you experiencing any pain?",
      emoji: "🩹",
      options: [
        { value: "None", label: "None", emoji: "👍", color: "bg-green-100" },
        { value: "Mild", label: "Mild", emoji: "🤏", color: "bg-yellow-100" },
        { value: "Moderate", label: "Moderate", emoji: "😣", color: "bg-orange-100" },
        { value: "Severe", label: "Severe", emoji: "😖", color: "bg-red-100" }
      ]
    },
    {
      id: "bloating",
      question: "How's your bloating today?",
      emoji: "🫃",
      options: [
        { value: "None", label: "None", emoji: "👌", color: "bg-green-100" },
        { value: "Mild", label: "Mild", emoji: "🤏", color: "bg-yellow-100" },
        { value: "Moderate", label: "Moderate", emoji: "😔", color: "bg-orange-100" },
        { value: "Severe", label: "Severe", emoji: "😩", color: "bg-red-100" }
      ]
    }
  ];
  
  // Toggle question expansion in Log tab
  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId]
    );
  };
  
  // Handle selecting an answer in Log tab
  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Auto-collapse the question after selection
    setTimeout(() => {
      setExpandedQuestions(prev => prev.filter(id => id !== questionId));
    }, 300);
  };
  
  // Change the active metric for history calendar
  const changeMetric = (metricId: string) => {
    setActiveMetric(metricId);
  };

  // Mock historical data for calendars
  const getMockCalendarData = (questionId: string): Record<string, CalendarEntry[]> => {
    const question = symptomQuestions.find(q => q.id === questionId);
    const options = question?.options || [];
    
    // Organize entries by option value
    const result: Record<string, CalendarEntry[]> = {};
    
    // Initialize empty arrays for each option
    options.forEach(option => {
      result[option.value] = [];
    });
    
    // Generate some consistent mock data for demo
    const moodPatternByDay: Record<number, string> = {
      1: "Energetic", 2: "Balanced", 3: "Balanced", 4: "Energetic", 
      5: "Tired", 6: "Tired", 7: "Stressed", 8: "Stressed", 
      9: "Tired", 10: "Balanced", 11: "Balanced", 12: "Energetic", 
      13: "Balanced", 14: "Tired", 15: "Stressed"
    };
    
    const energyPatternByDay: Record<number, string> = {
      1: "High", 2: "High", 3: "Medium", 4: "Medium", 
      5: "Medium", 6: "Low", 7: "Low", 8: "Exhausted", 
      9: "Low", 10: "Medium", 11: "High", 12: "High", 
      13: "Medium", 14: "Low", 15: "Exhausted"
    };
    
    const sleepPatternByDay: Record<number, string> = {
      1: "Excellent", 2: "Good", 3: "Good", 4: "Excellent", 
      5: "Fair", 6: "Poor", 7: "Poor", 8: "Fair", 
      9: "Fair", 10: "Good", 11: "Excellent", 12: "Good", 
      13: "Fair", 14: "Poor", 15: "Poor"
    };
    
    const painPatternByDay: Record<number, string> = {
      1: "None", 2: "None", 3: "None", 4: "None", 
      5: "Mild", 6: "Mild", 7: "Moderate", 8: "Severe", 
      9: "Moderate", 10: "Mild", 11: "None", 12: "None", 
      13: "None", 14: "Mild", 15: "Moderate"
    };
    
    const bloatingPatternByDay: Record<number, string> = {
      1: "None", 2: "None", 3: "None", 4: "Mild", 
      5: "Mild", 6: "Moderate", 7: "Severe", 8: "Severe", 
      9: "Moderate", 10: "Mild", 11: "None", 12: "None", 
      13: "None", 14: "Mild", 15: "Moderate"
    };
    
    // Select the right pattern based on question type
    let pattern: Record<number, string>;
    switch(questionId) {
      case "mood": 
        pattern = moodPatternByDay;
        break;
      case "energy":
        pattern = energyPatternByDay;
        break;
      case "sleep":
        pattern = sleepPatternByDay;
        break;
      case "pain":
        pattern = painPatternByDay;
        break;
      case "bloating":
        pattern = bloatingPatternByDay;
        break;
      default:
        pattern = moodPatternByDay;
    }
    
    // Generate the entries based on the selected pattern
    for (let i = 1; i <= 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const value = pattern[i];
      if (value && result[value]) {
        result[value].push({
          date,
          value
        });
      }
    }
    
    return result;
  };

  // Get the active question for history view
  const activeQuestion = symptomQuestions.find(q => q.id === activeMetric);

  return (
    <div className="min-h-screen gradient-primary">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">FemFit</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 pb-20">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-purple-100 p-6">
            <h2 className="text-2xl font-bold text-purple-800">Symptom Tracker</h2>
            <p className="text-purple-700 mt-2">Track how you feel throughout your cycle</p>
          </div>

          <Tabs defaultValue="log" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full bg-gray-100 p-1 rounded-md mx-auto my-4 max-w-md">
              <TabsTrigger 
                value="log" 
                className={`flex-1 rounded-sm py-2 text-sm transition-colors
                  ${activeTab === 'log' 
                    ? 'bg-white text-purple-700 font-medium shadow' 
                    : 'bg-transparent text-gray-600'
                  }`}
              >
                Log Today
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className={`flex-1 rounded-sm py-2 text-sm transition-colors
                  ${activeTab === 'history' 
                    ? 'bg-white text-purple-700 font-medium shadow' 
                    : 'bg-transparent text-gray-600'
                  }`}
              >
                History
              </TabsTrigger>
            </TabsList>

            {/* Log Today Tab - Collapsible Questions */}
            <TabsContent value="log" className="p-4">
              <div className="max-w-lg mx-auto space-y-4">
                {symptomQuestions.map((q) => (
                  <div 
                    key={q.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    {/* Question header - always visible, clickable to expand */}
                    <div 
                      className="flex items-center justify-between p-4 bg-white cursor-pointer"
                      onClick={() => toggleQuestion(q.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{q.emoji}</span>
                        <h3 className="font-medium text-gray-800">{q.question}</h3>
                      </div>
                      <div className="flex items-center">
                        {answers[q.id] && (
                          <div className="flex items-center mr-3 px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                            <span className="text-lg mr-1">
                              {q.options.find(o => o.value === answers[q.id])?.emoji}
                            </span>
                            <span className="text-sm font-medium">{answers[q.id]}</span>
                          </div>
                        )}
                        {expandedQuestions.includes(q.id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    {/* Options - only visible when expanded */}
                    {expandedQuestions.includes(q.id) && (
                      <div className="p-4 bg-gray-50 transition-all duration-300">
                        <div className="grid grid-cols-2 gap-3">
                          {q.options.map((option) => (
                            <div 
                              key={option.value}
                              onClick={() => selectAnswer(q.id, option.value)}
                              className={`${option.color} rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm
                                ${answers[q.id] === option.value 
                                  ? 'ring-2 ring-purple-500 shadow-md transform scale-105' 
                                  : 'hover:shadow-md hover:brightness-95'
                                }`}
                            >
                              <span className="text-3xl mb-2">{option.emoji}</span>
                              <span className="font-medium text-gray-700">{option.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="flex justify-end mt-6 space-x-2">
                  <Button variant="outline" className="border-gray-300 text-gray-600">
                    Cancel
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Save Symptoms
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* History Tab - Single Calendar with Filters */}
            <TabsContent value="history" className="p-4">
              <div className="max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Symptom History</h3>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <BarChart className="h-4 w-4 mr-1" />
                    View Trends
                  </Button>
                </div>
                
                {/* Filter tabs at the top */}
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {symptomQuestions.map((q) => (
                    <Button
                      key={q.id}
                      variant={activeMetric === q.id ? "default" : "outline"}
                      size="sm"
                      className={`flex items-center py-1 px-3 ${
                        activeMetric === q.id ? 
                          'bg-purple-600 text-white' : 
                          'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => changeMetric(q.id)}
                    >
                      <span className="mr-1">{q.emoji}</span>
                      {q.question.split('?')[0].replace("How's your ", "").replace("What's your ", "")}
                    </Button>
                  ))}
                </div>
                
                {/* Calendar view */}
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                      {activeQuestion?.options.map(option => (
                        <div key={option.value} className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${option.color}`}>
                          <span className="text-sm">{option.emoji}</span>
                          <span className="text-xs font-medium text-gray-700">{option.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {activeQuestion && (
                    <Calendar
                      mode="single"
                      selected={undefined}
                      className="mx-auto rounded border custom-calendar"
                      classNames={{
                        day_today: "font-medium text-black border-0",
                        day_outside: "text-gray-300"
                      }}
                      modifiers={{
                        ...activeQuestion.options.reduce<Record<string, Date[]>>((acc, option) => {
                          const calendarData = getMockCalendarData(activeMetric);
                          return {
                            ...acc,
                            [option.value]: calendarData[option.value]?.map((entry: CalendarEntry) => entry.date) || []
                          };
                        }, {})
                      }}
                      modifiersStyles={
                        activeQuestion.options.reduce<Record<string, React.CSSProperties>>((acc, option) => {
                          // Remove 'bg-' prefix to get the color name
                          const colorName = option.color.replace('bg-', '');
                          // Create a style based on the option's value
                          return {
                            ...acc,
                            [option.value]: {
                              fontWeight: 'bold',
                              // For example, if colorName is 'purple-100', use a more vibrant 'purple-500' for text
                              color: colorName.includes('purple') ? '#9333EA' : 
                                     colorName.includes('blue') ? '#3B82F6' : 
                                     colorName.includes('yellow') ? '#D97706' : 
                                     colorName.includes('green') ? '#22C55E' : 
                                     colorName.includes('red') ? '#EF4444' : 
                                     colorName.includes('orange') ? '#F97316' : 
                                     colorName.includes('gray') ? '#6B7280' : 
                                     colorName.includes('indigo') ? '#6366F1' : '#9333EA',
                              backgroundColor: colorName.includes('purple') ? 'rgba(243, 232, 255, 0.5)' : 
                                     colorName.includes('blue') ? 'rgba(235, 244, 255, 0.5)' : 
                                     colorName.includes('yellow') ? 'rgba(254, 249, 195, 0.5)' : 
                                     colorName.includes('green') ? 'rgba(236, 253, 240, 0.5)' : 
                                     colorName.includes('red') ? 'rgba(254, 240, 240, 0.5)' : 
                                     colorName.includes('orange') ? 'rgba(255, 247, 237, 0.5)' : 
                                     colorName.includes('gray') ? 'rgba(243, 244, 246, 0.5)' : 
                                     colorName.includes('indigo') ? 'rgba(238, 242, 255, 0.5)' : 'rgba(243, 232, 255, 0.5)',
                              borderRadius: '50%'
                            }
                          };
                        }, {})
                      }
                    />
                  )}
                  
                  <div className="mt-4 text-center text-sm text-gray-500">
                    <p>Dates are color-coded based on your recorded symptoms</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SymptomsPage;