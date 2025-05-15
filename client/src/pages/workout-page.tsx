import { FC } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Dumbbell } from "lucide-react";

const WorkoutPage: FC = () => {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen gradient-primary">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">FemFit</h1>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => setLocation('/')}
          >
            Back Home
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 pb-20">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-purple-100 p-6">
            <h2 className="text-2xl font-bold text-purple-800 flex items-center">
              <Dumbbell className="mr-2 h-6 w-6" />
              Workouts
            </h2>
            <p className="text-purple-700 mt-2">Tailored to your cycle phase</p>
          </div>

          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                Workout content will be available in the next update. When launched, you'll be able to:
              </p>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Access workouts specifically designed for each phase of your cycle</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Follow along with guided video routines led by women trainers</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Adjust intensity levels based on your energy and how you're feeling</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Track your progress and sync with your cycle data for optimal results</span>
                </li>
              </ul>
              
              <Button
                className="gradient-primary hover:opacity-90 text-white"
                onClick={() => setLocation('/')}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutPage;