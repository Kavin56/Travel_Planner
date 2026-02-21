import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, FileText, Loader2 } from "lucide-react";
import ItineraryDisplay from "./ItineraryDisplay";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { htmlExportService } from "@/services/htmlExportService";

interface ItineraryModalProps {
  itineraryId: string;
  onClose: () => void;
}

import { ItineraryResponse, Activity, DayItinerary } from "@/services/geminiService";
import ActivityModal from "./ActivityModal";

const ItineraryModal = ({ itineraryId, onClose }: ItineraryModalProps) => {
  const { toast } = useToast();
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<{ dayIndex: number, activity: Activity } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Load itinerary from cached data
    const cached = localStorage.getItem('recentItineraries');
    if (cached) {
      const itineraries = JSON.parse(cached);
      const found = itineraries.find((item: ItineraryResponse) => item.id === itineraryId);
      if (found) {
        setItinerary(found);
      }
    }
    setIsLoading(false);
  }, [itineraryId]);

  const handleLocalUpdate = (dayIndex: number, updated: Activity) => {
    if (!itinerary) return;
    const newItinerary = { ...itinerary };
    newItinerary.itinerary[dayIndex].activities = newItinerary.itinerary[dayIndex].activities.map(
      a => a.id === updated.id ? updated : a
    );
    setItinerary(newItinerary);
    updateCache(newItinerary);
  };

  const handleLocalDelete = (dayIndex: number, activityId: string) => {
    if (!itinerary) return;
    const newItinerary = { ...itinerary };
    newItinerary.itinerary[dayIndex].activities = newItinerary.itinerary[dayIndex].activities.filter(
      a => a.id !== activityId
    );
    setItinerary(newItinerary);
    updateCache(newItinerary);
    setSelectedActivity(null);
  };

  const updateCache = (updatedItinerary: ItineraryResponse) => {
    const cached = localStorage.getItem('recentItineraries');
    if (cached) {
      const recent = JSON.parse(cached);
      const index = recent.findIndex((it: ItineraryResponse) => it.id === updatedItinerary.id);
      if (index !== -1) {
        recent[index] = updatedItinerary;
        localStorage.setItem('recentItineraries', JSON.stringify(recent));
      }
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl">
            {itinerary ? `${itinerary.numberOfDays}-Day Trip to ${itinerary.destination}` : 'Loading...'}
          </DialogTitle>
          <div className="flex items-center space-x-2">
            {itinerary && (
              <>
                <Button
                  onClick={exportToHTML}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {isExporting ? "Generating..." : "Export HTML"}
                  </span>
                </Button>
                <Button
                  onClick={exportToText}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                >
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Export Text</span>
                </Button>
              </>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600">Loading itinerary...</p>
            </div>
          </div>
        )}

        {!isLoading && !itinerary && (
          <div className="text-center py-12">
            <p className="text-red-600">Itinerary not found</p>
          </div>
        )}

        {itinerary && (
          <div className="space-y-4">
            <div className="text-sm text-gray-500 mb-4">
              Created on {new Date(itinerary.createdAt).toLocaleDateString()}
            </div>
            <ItineraryDisplay
              itinerary={itinerary}
              onActivityClick={(dayIndex, activity) => setSelectedActivity({ dayIndex, activity })}
            />
          </div>
        )}
      </DialogContent>
      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity.activity}
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onUpdate={(updated) => handleLocalUpdate(selectedActivity.dayIndex, updated)}
          onDelete={() => handleLocalDelete(selectedActivity.dayIndex, selectedActivity.activity.id)}
        />
      )}
    </Dialog>
  );
};

export default ItineraryModal;
