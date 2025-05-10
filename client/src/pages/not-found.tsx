import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      <div className="text-center max-w-md bg-white/90 p-8 rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-gradient-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="gradient-primary hover:opacity-90">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}