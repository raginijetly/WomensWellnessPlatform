import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen gradient-primary">
          <div className="dotted-grid w-full h-full absolute top-0 left-0 opacity-10"></div>
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // If the user exists but hasn't completed onboarding and is not already on the onboarding page
  if (user && !user.completedOnboarding && path !== "/onboarding") {
    return (
      <Route path={path}>
        <Redirect to="/onboarding" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
