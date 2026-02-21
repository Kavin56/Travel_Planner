import { Link, useLocation } from "react-router-dom";
import { MapPin, Clock, Menu, LogOut, User, MessageCircle, TrendingUp, Globe } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SupportChatbot from "./SupportChatbot";
import AuthModal from "./AuthModal";
import ProfileModal from "./ProfileModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">TravelPlanner</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4 mr-4 border-r border-gray-100 pr-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === "/"
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                >
                  Plan Trip
                </Link>
                <Link
                  to="/history"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${location.pathname === "/history"
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>My Trips</span>
                </Link>
              </div>

              {/* Get Support Button */}
              <Button
                onClick={() => setIsSupportOpen(true)}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Support</span>
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border-2 border-orange-100 hover:border-orange-500 transition-all">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user.photoURL || undefined} alt={profile?.name || "User"} />
                        <AvatarFallback className="bg-orange-500 text-white font-bold">
                          {(profile?.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 rounded-2xl p-1 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
                    align="end"
                    sideOffset={12}
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal px-3 py-4 mb-1 bg-[#FAF9F6] rounded-t-xl border-b border-gray-100/50">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none text-gray-900">{profile?.name || user.displayName || "Explorer"}</p>
                        <p className="text-[11px] leading-none text-gray-400 truncate mt-1.5 font-medium">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>

                    <div className="p-1 space-y-0.5">
                      <DropdownMenuItem
                        onClick={() => setIsProfileModalOpen(true)}
                        className="rounded-lg py-3 px-3 cursor-pointer focus:bg-orange-50 focus:text-orange-700 font-semibold text-gray-700 transition-all text-sm group"
                      >
                        <User className="mr-3 h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span>My Profile</span>
                      </DropdownMenuItem>

                      <Link to="/history">
                        <DropdownMenuItem
                          className="rounded-lg py-3 px-3 cursor-pointer focus:bg-orange-50 focus:text-orange-700 font-semibold text-gray-700 transition-all text-sm group"
                        >
                          <Clock className="mr-3 h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <span>My Trips</span>
                        </DropdownMenuItem>
                      </Link>

                      <DropdownMenuItem
                        className="rounded-lg py-3 px-3 cursor-pointer focus:bg-orange-50 focus:text-orange-700 font-semibold text-gray-700 transition-all text-sm group"
                        onClick={() => setIsProfileModalOpen(true)}
                      >
                        <TrendingUp className="mr-3 h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span>Preferences</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="rounded-lg py-3 px-3 cursor-pointer focus:bg-orange-50 focus:text-orange-700 font-semibold text-gray-700 transition-all text-sm group opacity-60"
                      >
                        <Globe className="mr-3 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-gray-100 my-1.5" />

                      <DropdownMenuItem
                        onClick={() => setIsSupportOpen(true)}
                        className="rounded-lg py-3 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-700 font-semibold text-gray-700 transition-all text-sm group"
                      >
                        <MessageCircle className="mr-3 h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span>Help & Support</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-gray-100 my-1.5" />

                      <DropdownMenuItem
                        onClick={() => logout()}
                        className="rounded-lg py-3 px-3 cursor-pointer focus:bg-red-50 focus:text-red-700 text-red-500 font-bold transition-all text-sm group"
                      >
                        <LogOut className="mr-3 h-4 w-4 opacity-80 group-hover:rotate-12 transition-transform" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleAuthClick("login")}
                    className="text-gray-700 font-semibold hover:text-orange-600 hover:bg-orange-50 rounded-xl"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleAuthClick("signup")}
                    className="bg-gray-900 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-all"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {user && (
                <Button
                  variant="ghost"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="p-1 rounded-full border border-gray-100"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-orange-500 text-xs text-white">
                      {(profile?.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              )}
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
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${location.pathname === "/"
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-orange-50"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Plan Trip
                </Link>
                <Link
                  to="/history"
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 ${location.pathname === "/history"
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-orange-50"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Clock className="h-4 w-4" />
                  <span>My Trips</span>
                </Link>

                {!user && (
                  <div className="pt-2 grid grid-cols-2 gap-2 px-2">
                    <Button variant="ghost" onClick={() => handleAuthClick("login")} className="font-bold">Log In</Button>
                    <Button onClick={() => handleAuthClick("signup")} className="bg-gray-900 font-bold">Sign Up</Button>
                  </div>
                )}

                {user && (
                  <Button
                    variant="ghost"
                    onClick={() => logout()}
                    className="flex justify-start items-center text-red-600 font-bold px-4 h-12 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </Button>
                )}
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

      {/* Modals */}
      <SupportChatbot isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default Layout;
