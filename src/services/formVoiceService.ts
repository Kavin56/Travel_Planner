export type VoiceResultCallback = (transcript: string) => void;
export type VoiceErrorCallback = (error: string) => void;

class FormVoiceService {
  private recognition: any | null = null;
  private isListening = false;
  private onResultCallback: VoiceResultCallback | null = null;
  private onErrorCallback: VoiceErrorCallback | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onResultCallback = null;
      this.onErrorCallback = null;
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (this.onResultCallback) {
        this.onResultCallback(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (this.onErrorCallback) {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          this.onErrorCallback("Microphone access was denied. Please allow microphone access in your browser settings.");
        } else {
          this.onErrorCallback("An error occurred with speech recognition.");
        }
      }
      this.isListening = false;
    };
  }

  public start(onResult: VoiceResultCallback, onError: VoiceErrorCallback) {
    if (!this.recognition) {
        onError("Speech recognition is not supported in your browser.");
        return;
    }
    if (!this.isListening) {
      this.onResultCallback = onResult;
      this.onErrorCallback = onError;
      this.recognition.start();
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }
}

export const formVoiceService = new FormVoiceService(); 