import { FC, ReactNode } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Dumbbell, 
  Utensils, 
  BookOpen
} from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen gradient-primary pb-16">
      {children}

      {/* Bottom Navigation Bar - Always visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-2 py-2 z-10">
        {/* Home */}
        <Button 
          variant="ghost" 
          className={`text-${location === '/' ? 'purple-600' : 'gray-500'} flex flex-col items-center p-1 h-auto w-1/5`}
          onClick={() => setLocation('/')}
        >
          <div className="flex flex-col items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            <span className="text-xs mt-1">Home</span>
          </div>
        </Button>
        
        {/* Log Symptoms */}
        <Button 
          variant="ghost" 
          className={`text-${location === '/symptoms' ? 'purple-600' : 'gray-500'} flex flex-col items-center p-1 h-auto w-1/5`}
          onClick={() => setLocation('/symptoms')}
        >
          <div className="flex flex-col items-center justify-center">
            <Heart className="h-6 w-6" />
            <span className="text-xs mt-1">Log Symptoms</span>
          </div>
        </Button>
        
        {/* Workout */}
        <Button 
          variant="ghost" 
          className={`text-${location === '/workout' ? 'purple-600' : 'gray-500'} flex flex-col items-center p-1 h-auto w-1/5`}
          onClick={() => setLocation('/workout')}
        >
          <div className="flex flex-col items-center justify-center">
            <Dumbbell className="h-6 w-6" />
            <span className="text-xs mt-1">Workout</span>
          </div>
        </Button>
        
        {/* Nutrition */}
        <Button 
          variant="ghost" 
          className={`text-${location === '/nutrition' ? 'purple-600' : 'gray-500'} flex flex-col items-center p-1 h-auto w-1/5`}
          onClick={() => setLocation('/nutrition')}
        >
          <div className="flex flex-col items-center justify-center">
            <Utensils className="h-6 w-6" />
            <span className="text-xs mt-1">Nutrition</span>
          </div>
        </Button>
        
        {/* Info Hub */}
        <Button 
          variant="ghost" 
          className={`text-${location === '/info-hub' ? 'purple-600' : 'gray-500'} flex flex-col items-center p-1 h-auto w-1/5`}
          onClick={() => setLocation('/info-hub')}
        >
          <div className="flex flex-col items-center justify-center">
            <BookOpen className="h-6 w-6" />
            <span className="text-xs mt-1">Info Hub</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default AppLayout;