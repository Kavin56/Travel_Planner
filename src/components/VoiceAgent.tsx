import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff, 
  X, 
  User, 
  Bot,
  Loader2,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { voiceAgentService, VoiceAgentState, VoiceMessage } from "@/services/voiceAgentService";

interface VoiceAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceAgent = ({ isOpen, onClose }: VoiceAgentProps) => {
  const [state, setState] = useState<VoiceAgentState>({
    isListening: false,
    isSpeaking: false,
    isConnected: false,
    messages: []
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeVoiceAgent();
    }
  }, [isOpen, isInitialized]);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const initializeVoiceAgent = () => {
    try {
      // Set up state change callback
      voiceAgentService.setStateChangeCallback((newState) => {
        setState(prev => ({ ...prev, ...newState }));
      });

      // Get initial state
      const initialState = voiceAgentService.getState();
      setState(initialState);
      setIsInitialized(true);

      // Welcome message
      const welcomeMessage: VoiceMessage = {
        id: 'welcome',
        text: "Hi! I'm your AI travel planning assistant. I can help you plan your perfect trip. Just speak naturally and I'll assist you with destinations, budgets, timing, and more!",
        sender: 'agent',
        timestamp: new Date(),
        isVoice: true
      };

      setState(prev => ({
        ...prev,
        messages: [welcomeMessage],
        isConnected: true
      }));

      // Speak welcome message
      setTimeout(() => {
        voiceAgentService.speak(welcomeMessage.text);
      }, 500);

    } catch (error) {
      console.error('Error initializing voice agent:', error);
      toast({
        title: "Voice Agent Error",
        description: "Failed to initialize voice features. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartListening = () => {
    try {
      voiceAgentService.startListening();
      toast({
        title: "Listening...",
        description: "I'm listening to you now. Speak naturally!",
      });
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const handleStopListening = () => {
    voiceAgentService.stopListening();
    toast({
      title: "Stopped Listening",
      description: "I've stopped listening.",
    });
  };

  const handleStopSpeaking = () => {
    voiceAgentService.stopSpeaking();
  };

  const handleClose = () => {
    voiceAgentService.stopListening();
    voiceAgentService.stopSpeaking();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                AI Travel Assistant
              </DialogTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className={`w-2 h-2 rounded-full ${state.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span>{state.isConnected ? 'Connected' : 'Disconnected'}</span>
                <Sparkles className="h-3 w-3 text-yellow-500" />
                <span>Voice Enabled</span>
              </div>
            </div>
          </div>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Video Call Interface */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4">
          {/* Video Area */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-full mb-4 mx-auto w-24 h-24 flex items-center justify-center">
                  <Bot className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Travel Assistant</h3>
                <p className="text-gray-300 text-sm">
                  {state.isListening ? 'Listening to you...' : 
                   state.isSpeaking ? 'Speaking...' : 
                   'Ready to help you plan your trip!'}
                </p>
                
                {/* Status Indicators */}
                <div className="flex items-center justify-center space-x-4 mt-4">
                  {state.isListening && (
                    <div className="flex items-center space-x-2 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Listening</span>
                    </div>
                  )}
                  {state.isSpeaking && (
                    <div className="flex items-center space-x-2 text-blue-400">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Speaking</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="w-full lg:w-80 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {state.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <Card className={`${message.sender === 'user' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-50'}`}>
                      <CardContent className="p-3">
                        <div className="text-sm whitespace-pre-wrap">
                          {message.text}
                        </div>
                        <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {message.isVoice && (
                            <span className="ml-2">🎤</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Control Buttons */}
            <div className="border-t pt-4 space-y-3">
              {/* Main Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={state.isListening ? handleStopListening : handleStartListening}
                  className={`w-16 h-16 rounded-full ${
                    state.isListening 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                  disabled={!state.isConnected}
                >
                  {state.isListening ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>

                {state.isSpeaking && (
                  <Button
                    onClick={handleStopSpeaking}
                    className="w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <VolumeX className="h-6 w-6" />
                  </Button>
                )}
              </div>

              {/* Status Bar */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  {state.isListening && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                      <span>Listening...</span>
                    </>
                  )}
                  {state.isSpeaking && (
                    <>
                      <Volume2 className="h-4 w-4 text-blue-500" />
                      <span>Speaking...</span>
                    </>
                  )}
                  {!state.isListening && !state.isSpeaking && (
                    <>
                      <Mic className="h-4 w-4 text-gray-400" />
                      <span>Click to speak</span>
                    </>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="text-xs text-gray-500 text-center">
                <p>Try saying: "I want to plan a trip to Europe" or "What's a good budget for a week-long vacation?"</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceAgent; 