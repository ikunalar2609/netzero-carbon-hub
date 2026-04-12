
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error("404 Error: Page not found");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-green-50 to-white">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-brand-green mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Oops! We couldn't find the page you're looking for.
        </p>
        <p className="text-gray-600 mb-8">
          The page might have been moved, deleted, or perhaps never existed.
        </p>
        <Button onClick={() => navigate("/")} className="px-6">
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
