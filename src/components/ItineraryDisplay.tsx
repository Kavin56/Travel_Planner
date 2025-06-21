import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Star, Camera, Utensils, ExternalLink } from "lucide-react";
import { ItineraryResponse } from "@/services/api";
import { generateGoogleMapsUrl } from "@/lib/utils";

interface ItineraryDisplayProps {
  itinerary: ItineraryResponse;
}

const ItineraryDisplay = ({ itinerary }: ItineraryDisplayProps) => {
  const getActivityIcon = (activity: string) => {
    const lower = activity.toLowerCase();
    if (lower.includes('eat') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('breakfast')) {
      return <Utensils className="h-4 w-4 text-green-500" />;
    }
    if (lower.includes('visit') || lower.includes('see') || lower.includes('tour')) {
      return <Camera className="h-4 w-4 text-blue-500" />;
    }
    return <Star className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-8">
      {itinerary.itinerary.map((day, dayIndex) => (
        <Card 
          key={day.day} 
          className="shadow-2xl border-0 bg-white hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] animate-slide-in-up overflow-hidden"
          style={{ animationDelay: `${dayIndex * 0.2}s` }}
        >
          <CardHeader className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-t-lg relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <CardTitle className="text-2xl font-bold flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-xl font-bold">{day.day}</span>
                </div>
                <span>Day {day.day}</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-base">
                {day.activities.length} Experiences
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {day.activities.map((activity, index) => (
                <div 
                  key={index} 
                  className="p-8 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/30 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-100/0 to-red-100/0 group-hover:from-orange-100/30 group-hover:to-red-100/20 transition-all duration-500"></div>
                  
                  <div className="flex items-start space-x-6 relative z-10">
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full text-base font-bold flex items-center space-x-2 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                        <Clock className="h-4 w-4" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow space-y-4">
                      <div>
                        <div className="flex items-start space-x-3 mb-3">
                          <div className="mt-1 group-hover:animate-bounce">
                            {getActivityIcon(activity.activity)}
                          </div>
                          <h4 className="font-bold text-xl text-gray-900 group-hover:text-orange-700 transition-colors duration-300">
                            {activity.activity}
                          </h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg pl-7">
                          {activity.description}
                        </p>
                      </div>
                      
                      {activity.location && (
                        <div className="flex items-center space-x-3 text-base text-gray-600 pl-7 group-hover:text-orange-600 transition-colors duration-300">
                          <div className="bg-orange-100 p-2 rounded-full group-hover:bg-orange-200 transition-colors duration-300">
                            <MapPin className="h-4 w-4 text-orange-600" />
                          </div>
                          <a
                            href={generateGoogleMapsUrl(activity.location)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold hover:text-orange-700 hover:underline flex items-center space-x-1 transition-all duration-300 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{activity.location}</span>
                            <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Activity number indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full flex items-center justify-center text-sm font-bold opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItineraryDisplay;
