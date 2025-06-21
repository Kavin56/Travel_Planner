import { Link, useLocation } from "react-router-dom";
import { MapPin, Clock, Menu, LogOut, User, MessageCircle, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SupportChatbot from "./SupportChatbot";
import VoiceAgent from "./VoiceAgent";
import { eventBus } from '@/services/eventBus';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = eventBus.on('closeVoiceAgent', () => {
      setIsVoiceAgentOpen(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "Come back soon for more adventures!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">TravelPlanner</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/"
                    ? "bg-orange-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                Plan Trip
              </Link>
              <Link
                to="/history"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === "/history"
                    ? "bg-orange-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>My Trips</span>
              </Link>

              {/* Voice Agent Button */}
              <Button
                onClick={() => setIsVoiceAgentOpen(true)}
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span>Voice Agent</span>
              </Button>

              {/* Get Support Button */}
              <Button
                onClick={() => setIsSupportOpen(true)}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Get Support</span>
              </Button>

              {/* User Info and Logout */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-red-50 px-3 py-2 rounded-lg">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-orange-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || 'User'}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === "/"
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Plan Trip
                </Link>
                <Link
                  to="/history"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    location.pathname === "/history"
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Clock className="h-4 w-4" />
                  <span>My Trips</span>
                </Link>
                
                {/* Mobile Voice Agent Button */}
                <Button
                  onClick={() => {
                    setIsVoiceAgentOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 flex items-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>Voice Agent</span>
                </Button>
                
                {/* Mobile Get Support Button */}
                <Button
                  onClick={() => {
                    setIsSupportOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Get Support</span>
                </Button>
                
                {/* Mobile User Info and Logout */}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg mb-2">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-orange-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsSupportOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Get Travel Support"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Floating Voice Agent Button */}
      <div className="fixed bottom-6 right-20 z-50">
        <Button
          onClick={() => setIsVoiceAgentOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Talk to AI Agent"
        >
          <Phone className="h-6 w-6" />
        </Button>
      </div>

      {/* Support Chatbot */}
      <SupportChatbot isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      
      {/* Voice Agent */}
      <VoiceAgent isOpen={isVoiceAgentOpen} onClose={() => setIsVoiceAgentOpen(false)} />
    </div>
  );
};

export default Layout;
