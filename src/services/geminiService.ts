import { GoogleGenerativeAI } from "@google/generative-ai";

// Attempt to load the API key from environment variables
let API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// If environment variable is not available, use the hardcoded key
if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY not found in environment variables, using hardcoded key");
  API_KEY = "AIzaSyDCxb3mTA_rSRGltD8b8tr-4Yzkp7w1R70";
}

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ItineraryRequest {
  destination: string;
  numberOfDays: number;
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
}

export interface Activity {
  time: string;
  activity: string;
  description: string;
  location?: string;
}

export interface ItineraryResponse {
  id: string;
  destination: string;
  numberOfDays: number;
  itinerary: DayItinerary[];
  createdAt: string;
}

export const geminiService = {
  async generateItinerary(data: ItineraryRequest): Promise<ItineraryResponse> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Create a detailed ${data.numberOfDays}-day travel itinerary for ${data.destination}. 

Please provide a comprehensive day-by-day plan with the following structure for each day:
- Day number
- Multiple activities with specific times, descriptions, and locations
- Include a mix of cultural sites, local experiences, food recommendations, and relaxation time
- Consider practical logistics like opening hours and travel time between locations

Format the response as a JSON object with this exact structure:
{
  "itinerary": [
    {
      "day": 1,
      "activities": [
        {
          "time": "09:00",
          "activity": "Activity name",
          "description": "Detailed description of the activity",
          "location": "Specific location or area"
        }
      ]
    }
  ]
}

Make the itinerary realistic, enjoyable, and include both popular attractions and hidden gems. Consider the local culture, cuisine, and must-see landmarks.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse Gemini response as JSON");
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Create the final response object
      const itineraryResponse: ItineraryResponse = {
        id: `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        destination: data.destination,
        numberOfDays: data.numberOfDays,
        itinerary: parsedResponse.itinerary,
        createdAt: new Date().toISOString(),
      };

      return itineraryResponse;
    } catch (error) {
      console.error("Error generating itinerary with Gemini:", error);
      throw new Error(`Failed to generate itinerary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
}; 