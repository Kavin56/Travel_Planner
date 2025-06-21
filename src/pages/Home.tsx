import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Calendar, Clock, Download, Plane, Users, Star, Globe, TrendingUp, ChevronDown, ChevronUp, FileText, Mic } from "lucide-react";
import { geminiService, ItineraryResponse } from "@/services/geminiService";
import { htmlExportService } from "@/services/htmlExportService";
import { useToast } from "@/hooks/use-toast";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import { useVoiceForm } from "@/hooks/useVoiceForm";
import { eventBus } from '@/services/eventBus';

const formSchema = z.object({
  destination: z.string().min(1, "Please enter a destination"),
  numberOfDays: z.string().refine(val => parseInt(val) > 0, {
    message: "Trip must be at least 1 day",
  }),
});

type FormData = z.infer<typeof formSchema>;

const Home = () => {
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const itineraryRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      numberOfDays: "1",
    },
  });

  const { listeningField, startListening } = useVoiceForm({
    setValue: form.setValue,
    triggerSubmit: form.handleSubmit((data) => mutation.mutate({ destination: data.destination, numberOfDays: Number(data.numberOfDays) })),
  });
  
  // Handle scroll events for floating button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mutation = useMutation({
    mutationFn: geminiService.generateItinerary,
    onSuccess: (data, variables) => {
      setItinerary(data);
      toast({
        title: "Trip Planned Successfully!",
        description: `Your ${variables.numberOfDays}-day trip to ${variables.destination} is ready!`,
      });
      
      const cached = localStorage.getItem('recentItineraries');
      const recent = cached ? JSON.parse(cached) : [];
      recent.unshift(data);
      localStorage.setItem('recentItineraries', JSON.stringify(recent.slice(0, 5)));
    },
    onError: (error) => {
      toast({
        title: "Planning Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({ destination: data.destination, numberOfDays: Number(data.numberOfDays) });
  };

  const scrollToItinerary = () => {
    if (itineraryRef.current) {
      itineraryRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const exportToHTML = async () => {
    if (!itinerary) return;
    
    setIsExporting(true);
    try {
      htmlExportService.exportToHTML(itinerary);
      toast({
        title: "HTML Export Successful!",
        description: "Your beautiful itinerary HTML has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to generate HTML",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToText = () => {
    if (!itinerary) return;
    
    // Create a simple text-based export for now
    let content = `Travel Itinerary: ${itinerary.destination}\n`;
    content += `Duration: ${itinerary.numberOfDays} days\n`;
    content += `Created: ${new Date(itinerary.createdAt).toLocaleDateString()}\n\n`;
    
    itinerary.itinerary.forEach(day => {
      content += `Day ${day.day}:\n`;
      day.activities.forEach(activity => {
        content += `  ${activity.time} - ${activity.activity}\n`;
        content += `    ${activity.description}\n`;
        if (activity.location) {
          content += `    Location: ${activity.location}\n`;
          content += `    Map: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}\n`;
        }
        content += '\n';
      });
    });
    
    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itinerary.destination}-${itinerary.numberOfDays}-day-itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Text Export Successful!",
      description: "Your itinerary has been downloaded as a text file.",
    });
  };

  useEffect(() => {
    const handlePlanItinerary = (data: { destination: string, numberOfDays: string }) => {
      form.setValue('destination', data.destination);
      form.setValue('numberOfDays', data.numberOfDays);
      mutation.mutate({ destination: data.destination, numberOfDays: Number(data.numberOfDays) });
    };

    const unsubscribe = eventBus.on('planItinerary', handlePlanItinerary);

    return () => {
      unsubscribe();
    };
  }, [form, mutation]);

  return (
    <div className="space-y-8" ref={topRef}>
      {/* Enhanced Hero Section with Background Image */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-700 ease-out"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(251, 146, 60, 0.9), rgba(239, 68, 68, 0.8)), url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        
        {/* Animated Overlay Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 -left-20 w-32 h-32 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-10 right-1/4 w-24 h-24 bg-white/10 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative bg-gradient-to-r from-orange-600/20 via-red-500/10 to-pink-500/20 rounded-2xl p-8 md:p-16 text-white backdrop-blur-sm">
          <div className="max-w-4xl animate-fade-in">
            <div className="flex items-center space-x-3 mb-4 animate-slide-in-left">
              <Globe className="h-8 w-8 animate-spin-slow" />
              <span className="text-lg font-medium opacity-90">AI-Powered Travel Planning</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              Where do you want to
              <span className="bg-gradient-to-r from-yellow-300 to-orange-200 bg-clip-text text-transparent animate-pulse">
                {" "}explore?
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl opacity-90 mb-8 animate-slide-in-left max-w-3xl" style={{ animationDelay: '0.4s' }}>
              Discover amazing destinations with personalized itineraries crafted just for you. 
              From hidden gems to must-see attractions.
            </p>
            
            {/* Enhanced Stats with Animation */}
            <div className="grid grid-cols-3 gap-6 md:gap-12 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="group cursor-pointer transform transition-all duration-300 hover:scale-110">
                <div className="text-3xl md:text-4xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">500+</div>
                <div className="text-sm opacity-80 flex items-center justify-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  Destinations
                </div>
              </div>
              <div className="group cursor-pointer transform transition-all duration-300 hover:scale-110">
                <div className="text-3xl md:text-4xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">100K+</div>
                <div className="text-sm opacity-80 flex items-center justify-center">
                  <Users className="h-3 w-3 mr-1" />
                  Happy Travelers
                </div>
              </div>
              <div className="group cursor-pointer transform transition-all duration-300 hover:scale-110">
                <div className="text-3xl md:text-4xl font-bold mb-1 group-hover:text-yellow-300 transition-colors flex items-center justify-center">
                  4.9
                  <Star className="h-4 w-4 ml-1 text-yellow-300" fill="currentColor" />
                </div>
                <div className="text-sm opacity-80 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Planning Form */}
      <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300 animate-slide-in-up">
        <CardHeader className="text-center pb-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full shadow-lg animate-bounce">
              <Plane className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Plan Your Dream Trip
          </CardTitle>
          <p className="text-gray-600 text-lg">AI-powered itineraries in seconds</p>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3 group">
                <Label htmlFor="destination" className="text-base font-semibold text-gray-700 flex items-center group-hover:text-orange-600 transition-colors">
                  <MapPin className="h-5 w-5 mr-2 text-orange-500 group-hover:animate-pulse" />
                  Where are you going?
                </Label>
                <div className="relative">
                  <Input
                    id="destination"
                    placeholder="e.g., Bali, Paris, Tokyo"
                    className="h-14 text-lg pl-4 pr-12"
                    {...form.register("destination")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full ${listeningField === 'destination' ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`}
                    onClick={() => startListening('destination')}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>
                {form.formState.errors.destination && (
                  <p className="text-sm text-red-500">{form.formState.errors.destination.message}</p>
                )}
              </div>

              <div className="space-y-3 group">
                <Label htmlFor="numberOfDays" className="text-base font-semibold text-gray-700 flex items-center group-hover:text-orange-600 transition-colors">
                  <Calendar className="h-5 w-5 mr-2 text-orange-500 group-hover:animate-pulse" />
                  How many days?
                </Label>
                <div className="relative">
                  <Input
                    id="numberOfDays"
                    type="number"
                    min="1"
                    placeholder="e.g., 5"
                    className="h-14 text-lg pl-4 pr-12"
                    {...form.register("numberOfDays")}
                  />
                   <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full ${listeningField === 'numberOfDays' ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`}
                    onClick={() => startListening('numberOfDays')}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>
                 {form.formState.errors.numberOfDays && (
                  <p className="text-sm text-red-500">{form.formState.errors.numberOfDays.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-16 text-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  <span className="animate-pulse">Creating Your Perfect Trip...</span>
                </>
              ) : (
                <>
                  <Plane className="mr-3 h-6 w-6 animate-bounce" />
                  Plan My Adventure
                </>
              )}
            </Button>
          </form>

          {/* View Plan Button - appears after successful generation */}
          {itinerary && (
            <div className="mt-6 text-center animate-fade-in">
              <Button
                onClick={scrollToItinerary}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ChevronDown className="mr-2 h-5 w-5 animate-bounce" />
                View Your Complete Itinerary
              </Button>
            </div>
          )}

          {mutation.error && (
            <Alert className="mt-6 border-red-200 bg-red-50 animate-shake">
              <AlertDescription className="text-red-800">
                {mutation.error.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Popular Destinations */}
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-3">Trending Destinations</h3>
          <p className="text-gray-600 text-lg">Discover where travelers are going this season</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {[
            { name: 'Paris', image: 'photo-1502602898536-47ad22581b52', subtitle: 'City of Love' },
            { name: 'Tokyo', image: 'photo-1540959733332-eab4deabeeaf', subtitle: 'Modern Meets Traditional' },
            { name: 'Bali', image: 'photo-1537953773345-d172ccf13cf1', subtitle: 'Island Paradise' },
            { name: 'New York', image: 'photo-1496442226666-8d4d0e62e6e9', subtitle: 'The Big Apple' },
            { name: 'Dubai', image: 'photo-1512453979798-5ea266f8880c', subtitle: 'Luxury & Innovation' },
            { name: 'London', image: 'photo-1513635269975-59663e0ac1ad', subtitle: 'Royal Heritage' },
            { name: 'Singapore', image: 'photo-1525625293386-3f8f99389edd', subtitle: 'Garden City' },
            { name: 'Barcelona', image: 'photo-1539037116277-4db20889f2d4', subtitle: 'Art & Architecture' }
          ].map((city, index) => (
            <button
              key={city.name}
              onClick={() => form.setValue("destination", city.name)}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="h-32 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url('https://images.unsplash.com/${city.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="font-bold text-lg group-hover:text-orange-300 transition-colors">{city.name}</div>
                <div className="text-xs opacity-90">{city.subtitle}</div>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                  <Plane className="h-4 w-4 text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Itinerary Display */}
      {itinerary && (
        <div className="max-w-6xl mx-auto space-y-8 animate-slide-in-up" ref={itineraryRef}>
          <div className="bg-gradient-to-r from-white to-orange-50 rounded-2xl p-8 shadow-xl border border-orange-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="animate-slide-in-left">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                  Your {itinerary.numberOfDays}-Day Adventure in {itinerary.destination}
                </h2>
                <p className="text-gray-600 flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2 text-orange-500" />
                  Created on {new Date(itinerary.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                <Button
                  onClick={scrollToTop}
                  variant="outline"
                  className="flex items-center space-x-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 h-12 px-6 animate-slide-in-right"
                >
                  <ChevronUp className="h-5 w-5" />
                  <span className="font-medium">Back to Top</span>
                </Button>
                <Button
                  onClick={exportToHTML}
                  disabled={isExporting}
                  variant="outline"
                  className="flex items-center space-x-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 h-12 px-6 animate-slide-in-right"
                >
                  {isExporting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  <span className="font-medium">
                    {isExporting ? "Generating HTML..." : "Export HTML"}
                  </span>
                </Button>
                <Button
                  onClick={exportToText}
                  variant="outline"
                  className="flex items-center space-x-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 h-12 px-6 animate-slide-in-right"
                >
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">Export Text</span>
                </Button>
              </div>
            </div>
          </div>
          <ItineraryDisplay itinerary={itinerary} />
        </div>
      )}

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 animate-fade-in"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Home;
