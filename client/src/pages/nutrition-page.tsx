import { FC } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Utensils } from "lucide-react";

const NutritionPage: FC = () => {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

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
            <h2 className="text-2xl font-bold text-purple-800 flex items-center">
              <Utensils className="mr-2 h-6 w-6" />
              Nutrition
            </h2>
            <p className="text-purple-700 mt-2">Food recommendations for your cycle</p>
          </div>

          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                Nutrition features will be available in the next update. When launched, you'll have access to:
              </p>
              
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Personalized meal plans tailored to each phase of your cycle</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Recipes that support hormone balance and reduce uncomfortable symptoms</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Nutritional guidance on which foods help or hurt specific symptoms</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Shopping lists and easy meal prep options to support your health</span>
                </li>
              </ul>
              

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NutritionPage;