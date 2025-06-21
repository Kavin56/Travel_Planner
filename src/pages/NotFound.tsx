import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Plane } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Icons */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full shadow-lg">
            <Plane className="h-12 w-12 text-white animate-bounce" />
          </div>
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full shadow-lg">
            <MapPin className="h-12 w-12 text-white animate-pulse" />
          </div>
        </div>

        {/* 404 Text */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Oops! Page not found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The page you're looking for seems to have wandered off on its own adventure.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 px-8 py-3 rounded-xl transition-all duration-300">
              <Plane className="h-5 w-5 mr-2" />
              Sign In
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-sm text-gray-500 mt-8">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
