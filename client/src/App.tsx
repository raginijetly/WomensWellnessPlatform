import { Switch, Route, Redirect } from "wouter";
import AuthPage from "@/pages/auth-page";
import OnboardingPage from "@/pages/onboarding-page";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Create our own simplified protected route
const ProtectedRoute = ({ 
  component: Component, 
  path 
}: { 
  component: React.ComponentType<any>, 
  path: string 
}) => {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen gradient-primary">
              <div className="dotted-grid w-full h-full absolute top-0 left-0 opacity-10"></div>
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to="/auth" />;
        }

        // If the user exists but hasn't completed onboarding
        if (user && !user.completedOnboarding && path !== "/onboarding") {
          return <Redirect to="/onboarding" />;
        }

        return <Component />;
      }}
    </Route>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/onboarding" component={OnboardingPage} />
      <Route path="/auth">
        {() => (user ? <Redirect to="/" /> : <AuthPage />)}
      </Route>
      <Route path="*" component={() => <NotFound />} />
    </Switch>
  );
}

export default App;
