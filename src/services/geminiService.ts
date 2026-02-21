import { GoogleGenAI } from "@google/genai";

// Hardcoded API key as requested for this personal project
const API_KEY = "AIzaSyBvDb1ncmMBj1PogqaRj72GjAx7q3BuzVI";

// Initialize the Google Gen AI client
const genAI = new GoogleGenAI({ apiKey: API_KEY });

export interface ItineraryRequest {
  destination: string;
  numberOfDays: number;
  adventureType?: string;
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
}

export interface Activity {
  id: string;
  time: string;
  activity: string;
  description: string;
  location?: string;
  rating?: number;
  review?: string;
}

export interface ItineraryResponse {
  id: string;
  destination: string;
  numberOfDays: number;
  itinerary: DayItinerary[];
  createdAt: string;
  adventureType?: string;
}

export const geminiService = {
  async generateItinerary(data: ItineraryRequest): Promise<ItineraryResponse> {
    try {
      const adventureContext = data.adventureType && data.adventureType !== 'balanced'
        ? (() => {
          switch (data.adventureType.toLowerCase()) {
            case 'culture':
              return " The traveler wants a deep cultural immersion. Focus on fewer locations per day to allow for meaningful time at each site. Prioritize history, local traditions, and museum visits.";
            case 'romantic':
              return " The traveler wants a romantic getaway. Focus on a relaxed pace with 2-3 high-quality, intimate experiences per day. Prioritize sunset views, cozy dining, and scenic walks.";
            case 'nature':
              return " The traveler wants a nature-focused trip. Include outdoor adventures, scenic hikes, and natural wonders. Allow ample time for transportation to potentially remote areas.";
            case 'party':
              return " The traveler wants a high-energy party trip. Focus on nightlife, social hubs, and vibrant daytime events. Pacing can be quicker but ensure time for recovery.";
            case 'adventure':
              return " The traveler is seeking thrills and adrenaline. Include physically active experiences and unique adventures. Ensure activities are safely spaced but keep the energy high.";
            case 'family':
              return " The traveler is with family. Include kid-friendly activities, frequent breaks, and convenient locations. Pacing should be moderate and accessible.";
            default:
              return ` The traveler is looking for a ${data.adventureType}-focused trip.`;
          }
        })()
        : " Maintain a balanced pace with a mix of activities.";

      const itineraryPrompt = `Create a detailed ${data.numberOfDays}-day travel itinerary for ${data.destination}.${adventureContext} 

Please provide a comprehensive day-by-day plan with the following structure for each day:
- Day number
- Activities with specific times, descriptions, and locations
- **CRITICAL**: Adjust the number of activities based on the requested mood. High-immersion moods (Culture, Romantic, Family) should have fewer activities with more time spent at each (3-4 hours per major site).
- **LOGISTICS**: Be realistic about travel distances. If two activities are far apart, account for 1-2 hours of transit time and mention it in the description or as a separate 'Transit' note if significant.
- Consider opening hours and optimal times to visit (e.g., sunrise/sunset for viewpoints).

Format the response as a JSON object with this exact structure:
{
  "itinerary": [
    {
      "day": 1,
      "activities": [
        {
          "time": "09:00",
          "activity": "Activity name",
          "description": "Detailed description of the activity and any travel notes",
          "location": "Specific location or area"
        }
      ]
    }
  ]
}

Make the itinerary realistic, enjoyable, and include both popular attractions and hidden gems.`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: itineraryPrompt,
      });
      const text = response.text;

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse Gemini response as JSON");
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Add IDs to activities and ensure structure
      const processedItinerary = parsedResponse.itinerary.map((day: DayItinerary) => ({
        ...day,
        activities: day.activities.map((activity: Activity) => ({
          ...activity,
          id: `activity_${Math.random().toString(36).substr(2, 9)}`,
          rating: undefined,
          review: ""
        }))
      }));

      // Create the final response object
      const itineraryResponse: ItineraryResponse = {
        id: `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        destination: data.destination,
        numberOfDays: data.numberOfDays,
        adventureType: data.adventureType || 'balanced',
        itinerary: processedItinerary,
        createdAt: new Date().toISOString(),
      };

      return itineraryResponse;
    } catch (error) {
      console.error("Error generating itinerary with Gemini:", error);
      throw new Error(`Failed to generate itinerary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
}; 