import { FC, useState } from "react";
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
  const [activeQuestion, setActiveQuestion] = useState<string | null>("mood");
  const [expandedCalendars, setExpandedCalendars] = useState<string[]>([]);
  
  // State to track answers
  const [answers, setAnswers] = useState<Record<string, string>>({});

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
  
  // Handle selecting an answer
  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // Toggle calendar expansion for history view
  const toggleCalendar = (questionId: string) => {
    setExpandedCalendars(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId]
    );
  };

  // Mock historical data for calendars (one month of data)
  const getMockCalendarData = (questionId: string): CalendarEntry[] => {
    const options = symptomQuestions.find(q => q.id === questionId)?.options || [];
    const result: CalendarEntry[] = [];
    
    // Generate some random historical data for demo purposes
    for (let i = 1; i <= 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const randomOption = options[Math.floor(Math.random() * options.length)];
      result.push({
        date,
        value: randomOption.value
      });
    }
    
    return result;
  };

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

            {/* Log Today Tab - Grid Layout with Emojis and Colors */}
            <TabsContent value="log" className="p-4">
              <div className="max-w-lg mx-auto space-y-6">
                {symptomQuestions.map((q) => (
                  <div key={q.id} className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl">{q.emoji}</span>
                      <h3 className="font-medium text-gray-800">{q.question}</h3>
                      {answers[q.id] && (
                        <span className="ml-auto text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                          {answers[q.id]}
                        </span>
                      )}
                    </div>

                    {/* Grid layout for options */}
                    <div className="grid grid-cols-2 gap-3">
                      {q.options.map((option) => (
                        <div 
                          key={option.value}
                          onClick={() => selectAnswer(q.id, option.value)}
                          className={`${option.color} rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm
                            ${answers[q.id] === option.value 
                              ? 'ring-2 ring-purple-500 shadow-md transform scale-105' 
                              : 'hover:shadow-md hover:scale-102'
                            }`}
                        >
                          <span className="text-3xl mb-2">{option.emoji}</span>
                          <span className="font-medium text-gray-700">{option.label}</span>
                        </div>
                      ))}
                    </div>
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

            {/* History Tab - Calendar View By Symptom Type */}
            <TabsContent value="history" className="p-4">
              <div className="max-w-lg mx-auto space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Symptom History</h3>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <BarChart className="h-4 w-4 mr-1" />
                    View Trends
                  </Button>
                </div>
                
                {/* Symptom-specific calendars */}
                <div className="space-y-4">
                  {symptomQuestions.map((q) => (
                    <div key={q.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Calendar header */}
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer bg-white border-b"
                        onClick={() => toggleCalendar(q.id)}
                      >
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{q.emoji}</span>
                          <h4 className="font-medium text-gray-800">{q.question}</h4>
                        </div>
                        <div>
                          {expandedCalendars.includes(q.id) ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                      
                      {/* Calendar body */}
                      {expandedCalendars.includes(q.id) && (
                        <div className="p-4 bg-white">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex space-x-4">
                              {q.options.map(option => (
                                <div key={option.value} className="flex items-center space-x-1">
                                  <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                                  <span className="text-xs text-gray-600">{option.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Calendar
                            mode="single"
                            selected={new Date()}
                            className="mx-auto"
                            modifiers={{
                              highlighted: getMockCalendarData(q.id).map(entry => entry.date)
                            }}
                            modifiersStyles={{
                              highlighted: {
                                fontWeight: 'bold',
                                backgroundColor: '#F3E8FF',
                                color: '#6D28D9'
                              }
                            }}
                          />
                          
                          <div className="mt-4">
                            <Button variant="outline" className="w-full text-sm text-purple-700 border-purple-200">
                              <CalendarDays className="h-4 w-4 mr-2" />
                              View Full Calendar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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