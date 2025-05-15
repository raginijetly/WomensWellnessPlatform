import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import AuthPage from "@/pages/auth-page-tabs";
import HomePage from "@/pages/home-page";
import OnboardingPage from "@/pages/onboarding-page";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/lib/protected-route";

// Placeholder Pages
import SymptomsPage from "@/pages/symptoms-page";
import WorkoutPage from "@/pages/workout-page";
import NutritionPage from "@/pages/nutrition-page";
import InfoHubPage from "@/pages/info-hub-page";

// Helper function to convert FC components to be compatible with Route/ProtectedRoute
const asComponent = (Component: React.FC): (() => React.JSX.Element) => {
  return () => <Component />;
};

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={asComponent(HomePage)} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <ProtectedRoute path="/symptoms" component={asComponent(SymptomsPage)} />
      <ProtectedRoute path="/workout" component={asComponent(WorkoutPage)} />
      <ProtectedRoute path="/nutrition" component={asComponent(NutritionPage)} />
      <ProtectedRoute path="/info-hub" component={asComponent(InfoHubPage)} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;