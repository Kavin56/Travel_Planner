import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, MapPin, Clock, Eye, Plane, Star, Globe, TrendingUp, Download, FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import ItineraryModal from "@/components/ItineraryModal";
import { useToast } from "@/hooks/use-toast";
import { htmlExportService } from "@/services/htmlExportService";

interface HistoryItem {
  id: string;
  destination: string;
  numberOfDays: number;
  createdAt: string;
}

const History = () => {
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(null);
  const [cachedItineraries, setCachedItineraries] = useState<HistoryItem[]>([]);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { toast } = useToast();

  // Load cached itineraries from localStorage
  useEffect(() => {
    const cached = localStorage.getItem('recentItineraries');
    if (cached) {
      setCachedItineraries(JSON.parse(cached));
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewItinerary = (id: string) => {
    setSelectedItineraryId(id);
  };

  const handleQuickExportHTML = async (item: HistoryItem) => {
    // Find the full itinerary data
    const cached = localStorage.getItem('recentItineraries');
    if (cached) {
      const itineraries = JSON.parse(cached);
      const fullItinerary = itineraries.find((it: any) => it.id === item.id);
      
      if (fullItinerary) {
        setIsExporting(item.id);
        try {
          htmlExportService.exportToHTML(fullItinerary);
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
          setIsExporting(null);
        }
      }
    }
  };

  const handleQuickExport = (item: HistoryItem) => {
    // Find the full itinerary data
    const cached = localStorage.getItem('recentItineraries');
    if (cached) {
      const itineraries = JSON.parse(cached);
      const fullItinerary = itineraries.find((it: any) => it.id === item.id);
      
      if (fullItinerary) {
        // Create export content
        let content = `Travel Itinerary: ${fullItinerary.destination}\n`;
        content += `Duration: ${fullItinerary.numberOfDays} days\n`;
        content += `Created: ${new Date(fullItinerary.createdAt).toLocaleDateString()}\n\n`;
        
        fullItinerary.itinerary.forEach((day: any) => {
          content += `Day ${day.day}:\n`;
          day.activities.forEach((activity: any) => {
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
        a.download = `${fullItinerary.destination}-${fullItinerary.numberOfDays}-day-itinerary.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Text Export Successful!",
          description: "Your itinerary has been downloaded as a text file.",
        });
      }
    }
  };

  // Destination images mapping
  const getDestinationImage = (destination: string) => {
    const images: { [key: string]: string } = {
      'paris': 'photo-1502602898536-47ad22581b52',
      'tokyo': 'photo-1540959733332-eab4deabeeaf',
      'bali': 'photo-1537953773345-d172ccf13cf1',
      'new york': 'photo-1496442226666-8d4d0e62e6e9',
      'dubai': 'photo-1512453979798-5ea266f8880c',
      'london': 'photo-1513635269975-59663e0ac1ad',
      'singapore': 'photo-1525625293386-3f8f99389edd',
      'barcelona': 'photo-1539037116277-4db20889f2d4',
      'rome': 'photo-1552832230-c0197dd311b5',
      'amsterdam': 'photo-1534351590666-13e3e96b5017'
    };
    
    const key = destination.toLowerCase();
    return images[key] || 'photo-1500375592092-40eb2168fd21'; // Default travel image
  };

  if (cachedItineraries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-full inline-block animate-pulse">
            <Plane className="h-12 w-12 animate-spin text-orange-600" />
          </div>
          <div>
            <p className="text-gray-700 text-2xl font-semibold mb-2">Loading your adventures...</p>
            <p className="text-gray-500">Gathering your travel memories</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden">
        {/* Background with animated elements */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        />
        
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-200/20 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 -left-32 w-48 h-48 bg-red-200/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-pink-200/20 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-4xl animate-slide-in-left">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="h-8 w-8 animate-spin-slow" />
              <span className="text-lg font-medium opacity-90">Your Travel Journey</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              My Travel History
            </h1>
            <p className="text-xl opacity-90 mb-8 animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
              Revisit your amazing adventures and get inspired for your next journey.
            </p>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-6 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="group cursor-pointer transform transition-all duration-300 hover:scale-110">
                <div className="text-3xl md:text-4xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">
                  {cachedItineraries.length}
                </div>
                <div className="text-sm opacity-80 flex items-center justify-center">
                  <Plane className="h-4 w-4 mr-1 group-hover:animate-bounce" />
                  Total Trips
                </div>
              </div>
              <div className="group cursor-pointer transform transition-all duration-300 hover:scale-110">
                <div className="text-3xl md:text-4xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">
                  {cachedItineraries.reduce((acc: number, item: HistoryItem) => acc + item.numberOfDays, 0)}
                </div>
                <div className="text-sm opacity-80 flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-1 group-hover:animate-pulse" />
                  Days Planned
                </div>
              </div>
              <div className="group cursor-pointer transform transition-all duration-300 hover:scale-110">
                <div className="text-3xl md:text-4xl font-bold mb-1 flex items-center justify-center group-hover:text-yellow-300 transition-colors">
                  4.9
                  <Star className="h-5 w-5 ml-1 text-yellow-300 group-hover:animate-spin" fill="currentColor" />
                </div>
                <div className="text-sm opacity-80 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-1 group-hover:animate-bounce" />
                  Avg Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {cachedItineraries.length === 0 ? (
        <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white animate-fade-in">
          <CardContent className="p-16 text-center space-y-8">
            <div className="bg-gradient-to-r from-orange-100 to-red-100 p-8 rounded-full inline-block animate-bounce">
              <Plane className="h-16 w-16 text-orange-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Adventures Yet</h3>
              <p className="text-gray-600 text-xl leading-relaxed">
                Your travel story starts here! Plan your first amazing adventure and watch your memories grow.
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <Plane className="mr-3 h-5 w-5 animate-bounce" />
              Start Your First Adventure
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cachedItineraries.map((item: HistoryItem, index) => (
            <Card 
              key={item.id} 
              className="shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 overflow-hidden group animate-slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Destination Image Header */}
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('https://images.unsplash.com/${getDestinationImage(item.destination)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating badges */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 font-semibold">
                    <Calendar className="h-3 w-3 mr-1" />
                    {item.numberOfDays} {item.numberOfDays === 1 ? 'day' : 'days'}
                  </Badge>
                </div>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Star className="h-4 w-4 text-yellow-300" fill="currentColor" />
                  </div>
                </div>
                
                {/* Destination name overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-orange-200 transition-colors">
                    {item.destination}
                  </h3>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">{formatDate(item.createdAt)}</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleViewItinerary(item.id)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-12"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Relive This Adventure
                  </Button>
                  <Button
                    onClick={() => handleQuickExportHTML(item)}
                    disabled={isExporting === item.id}
                    variant="outline"
                    className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-200 h-12 px-3"
                    title="Export HTML"
                  >
                    {isExporting === item.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Download className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    onClick={() => handleQuickExport(item)}
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 h-12 px-3"
                    title="Export Text"
                  >
                    <FileText className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedItineraryId && (
        <ItineraryModal
          itineraryId={selectedItineraryId}
          onClose={() => setSelectedItineraryId(null)}
        />
      )}
    </div>
  );
};

export default History;
