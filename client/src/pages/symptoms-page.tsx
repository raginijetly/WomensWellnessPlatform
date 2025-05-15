import { FC, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, History, BarChart } from "lucide-react";

// Types for our symptom logging
type SymptomIntensity = 'None' | 'Mild' | 'Moderate' | 'Severe';
type MoodType = 'Happy' | 'Neutral' | 'Sad' | 'Irritable' | 'Anxious';
type EnergyLevel = 'Low' | 'Moderate' | 'High';
type SleepQuality = 'Poor' | 'Fair' | 'Good' | 'Excellent';

interface SymptomQuestion {
  id: string;
  question: string;
  options: string[];
  emoji?: string;
}

const SymptomsPage: FC = () => {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("log");
  
  // State to track which questions are expanded
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  
  // State to track answers
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Define our symptom questions
  const symptomQuestions: SymptomQuestion[] = [
    {
      id: "mood",
      question: "How's your mood today?",
      options: ["Happy", "Neutral", "Sad", "Irritable", "Anxious"],
      emoji: "😊"
    },
    {
      id: "energy",
      question: "What's your energy level?",
      options: ["Low", "Moderate", "High"],
      emoji: "⚡"
    },
    {
      id: "sleep",
      question: "How was your sleep last night?",
      options: ["Poor", "Fair", "Good", "Excellent"],
      emoji: "😴"
    },
    {
      id: "pain",
      question: "Are you experiencing any pain?",
      options: ["None", "Mild", "Moderate", "Severe"],
      emoji: "🩹"
    },
    {
      id: "bloating",
      question: "How's your bloating today?",
      options: ["None", "Mild", "Moderate", "Severe"],
      emoji: "🫃"
    }
  ];
  
  // Toggle question expansion
  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId]
    );
  };
  
  // Handle selecting an answer
  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // Mock historical data for the history tab
  const mockHistoryData = [
    { date: "May 15, 2025", mood: "Happy", energy: "High", pain: "None" },
    { date: "May 14, 2025", mood: "Neutral", energy: "Moderate", pain: "Mild" },
    { date: "May 13, 2025", mood: "Irritable", energy: "Low", pain: "Moderate" },
  ];

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

            <TabsContent value="log" className="p-4">
              <div className="max-w-md mx-auto space-y-4">
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
                        {q.emoji && <span className="text-xl">{q.emoji}</span>}
                        <h3 className="font-medium text-gray-800">{q.question}</h3>
                      </div>
                      <div className="flex items-center">
                        {answers[q.id] && (
                          <span className="mr-2 text-sm px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {answers[q.id]}
                          </span>
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
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="space-y-2">
                          {q.options.map((option) => (
                            <div 
                              key={option}
                              onClick={() => selectAnswer(q.id, option)}
                              className={`p-3 rounded-md cursor-pointer transition-colors
                                ${answers[q.id] === option 
                                  ? 'bg-purple-100 border-purple-300 border text-purple-700' 
                                  : 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                              {option}
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

            <TabsContent value="history" className="p-4">
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Symptom History</h3>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <BarChart className="h-4 w-4 mr-1" />
                    View Trends
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {mockHistoryData.map((entry, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-purple-700">{entry.date}</span>
                        <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-purple-700">
                          Details
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-purple-50 rounded-md">
                          <div className="text-xs text-gray-500">Mood</div>
                          <div className="font-medium text-purple-700">{entry.mood}</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded-md">
                          <div className="text-xs text-gray-500">Energy</div>
                          <div className="font-medium text-purple-700">{entry.energy}</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded-md">
                          <div className="text-xs text-gray-500">Pain</div>
                          <div className="font-medium text-purple-700">{entry.pain}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4 text-purple-700 border-purple-200">
                    <History className="h-4 w-4 mr-2" />
                    Load More History
                  </Button>
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