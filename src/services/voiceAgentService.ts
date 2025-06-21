import { GoogleGenerativeAI } from "@google/generative-ai";
import { eventBus } from './eventBus';

// Initialize Gemini AI
let API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  API_KEY = "AIzaSyDCxb3mTA_rSRGltD8b8tr-4Yzkp7w1R70";
}
const genAI = new GoogleGenerativeAI(API_KEY);

export interface VoiceMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  isVoice?: boolean;
}

export interface VoiceAgentState {
  isListening: boolean;
  isSpeaking: boolean;
  isConnected: boolean;
  messages: VoiceMessage[];
}

class VoiceAgentService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isListening = false;
  private isSpeaking = false;
  private onStateChange: ((state: Partial<VoiceAgentState>) => void) | null = null;

  constructor() {
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
  }

  private initializeSpeechRecognition() {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition settings
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      this.updateState({ isListening: true });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.updateState({ isListening: false });
    };

    this.recognition.onresult = async (event: any) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript.trim()) {
        await this.processUserInput(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      this.updateState({ isListening: false });
    };
  }

  private initializeSpeechSynthesis() {
    if (typeof window === 'undefined' || !('speechSynthesis'in window)) {
      console.error('Speech synthesis not supported in this browser');
      return;
    }

    this.synthesis = window.speechSynthesis;
    
    const loadVoices = () => {
        this.voices = this.synthesis?.getVoices() || [];
        if (this.voices.length === 0) {
            this.synthesis?.addEventListener('voiceschanged', () => {
                this.voices = this.synthesis?.getVoices() || [];
            });
        }
    }
    
    loadVoices();
  }

  private updateState(state: Partial<VoiceAgentState>) {
    if (this.onStateChange) {
      this.onStateChange(state);
    }
  }

  private async processUserInput(text: string) {
    try {
      this.updateState({ messages: [{ id: Date.now().toString(), text, sender: 'user', timestamp: new Date(), isVoice: true }] });
      
      const aiResponse = await this.generateAIResponse(text);

      // Check if the response is a command to plan a trip
      try {
        const parsedResponse = JSON.parse(aiResponse);
        if (parsedResponse.action === 'plan_trip' && parsedResponse.parameters) {
          const { destination, numberOfDays } = parsedResponse.parameters;
          const confirmationText = `Of course! Planning a ${numberOfDays}-day trip to ${destination} for you now.`;
          
          this.updateState({ messages: [{ id: (Date.now() + 1).toString(), text: confirmationText, sender: 'agent', timestamp: new Date(), isVoice: true }]});
          this.speak(confirmationText);
          
          eventBus.emit('planItinerary', parsedResponse.parameters);
          eventBus.emit('closeVoiceAgent');
          return;
        }
      } catch (e) {
        // Not a JSON command, so treat it as a conversational response
      }

      // Handle conversational response
      this.updateState({ messages: [{ id: (Date.now() + 1).toString(), text: aiResponse, sender: 'agent', timestamp: new Date(), isVoice: true }]});
      this.speak(aiResponse);

    } catch (error) {
      console.error('Error processing user input:', error);
      const errorMessage = "I'm sorry, I'm having trouble understanding. Could you please repeat that?";
      this.speak(errorMessage);
    }
  }

  private async generateAIResponse(userInput: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `You are a friendly and knowledgeable travel planning voice assistant. Your goal is to determine if the user wants to have a conversation or if they want you to perform the action of planning a trip.

Analyze the user's input: "${userInput}"

1.  **If the user gives a clear command to plan a trip** (e.g., "plan a 5 day trip to Paris", "I want to go to Tokyo for a week"), extract the destination and number of days. Respond with ONLY a valid JSON object in this exact format:
    \`\`\`json
    {
      "action": "plan_trip",
      "parameters": {
        "destination": "DESTINATION_NAME",
        "numberOfDays": "NUMBER_OF_DAYS"
      }
    }
    \`\`\`
    - For durations like "a week", use "7".

2.  **If the user's input is conversational, vague, or a question** (e.g., "I want to go somewhere", "What are some good places?", "Hi!"), respond with a friendly, conversational, short text message suitable for voice. Do NOT use JSON.
    - Example conversational response: "Of course! I can help with that. Where are you thinking of going, and for how long?"
    - Do NOT use markdown.

Your response must be either the JSON object or the conversational text, nothing else.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      // Clean up potential markdown code block fences
      let text = response.text();
      if (text.startsWith('```json')) {
        text = text.slice(7, -3).trim();
      }
      return text;

    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  }

  private speak(text: string) {
    if (!this.synthesis) {
      console.error('Speech synthesis not available');
      return;
    }

    // Stop any current speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // --- Voice Selection Logic ---
    // Prefer a high-quality, natural-sounding Google voice if available
    const preferredVoice = this.voices.find(
      (voice) => voice.name === 'Google US English' && voice.lang === 'en-US'
    ) || this.voices.find(
        (voice) => voice.lang === 'en-US' && voice.name.includes('Google')
    ) || this.voices.find(
        (voice) => voice.lang === 'en-US' && voice.localService
    ) || this.voices.find(
        (voice) => voice.lang === 'en-US'
    ) || this.voices[0];

    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    // --- End of Voice Selection ---

    // Configure voice settings
    utterance.rate = 1.0; // Normal rate
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume

    // Set up event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateState({ isSpeaking: true });
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateState({ isSpeaking: false });
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.isSpeaking = false;
      this.updateState({ isSpeaking: false });
    };

    // Speak the text
    this.synthesis.speak(utterance);
  }

  // Public methods
  public startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.updateState({ isSpeaking: false });
    }
  }

  public setStateChangeCallback(callback: (state: Partial<VoiceAgentState>) => void) {
    this.onStateChange = callback;
  }

  public getState(): VoiceAgentState {
    return {
      isListening: this.isListening,
      isSpeaking: this.isSpeaking,
      isConnected: true,
      messages: []
    };
  }
}

// Create singleton instance
export const voiceAgentService = new VoiceAgentService(); 