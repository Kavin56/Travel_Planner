
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface ItineraryRequest {
  destination: string;
  numberOfDays: number;
}

export interface ItineraryResponse {
  id: string;
  destination: string;
  numberOfDays: number;
  itinerary: DayItinerary[];
  createdAt: string;
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

export interface HistoryItem {
  id: string;
  destination: string;
  numberOfDays: number;
  createdAt: string;
}

export const apiService = {
  async createItinerary(data: ItineraryRequest): Promise<ItineraryResponse> {
    const response = await fetch(`${API_BASE_URL}/api/itinerary/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create itinerary: ${response.statusText}`);
    }

    return response.json();
  },

  async getHistory(): Promise<HistoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/history/`);

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }

    return response.json();
  },

  async getItineraryById(id: string): Promise<ItineraryResponse> {
    const response = await fetch(`${API_BASE_URL}/api/itinerary/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch itinerary: ${response.statusText}`);
    }

    return response.json();
  }
};
