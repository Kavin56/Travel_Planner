import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import { 
  MessageCircle, 
  Send, 
  X, 
  Loader2, 
  User, 
  Bot, 
  Sparkles,
  Plane,
  DollarSign,
  Clock,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
let API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  API_KEY = "AIzaSyDCxb3mTA_rSRGltD8b8tr-4Yzkp7w1R70";
}
const genAI = new GoogleGenerativeAI(API_KEY);

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface SupportChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportChatbot = ({ isOpen, onClose }: SupportChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your **personal travel planning assistant**! 🗺️✈️\n\nI can help you with:\n\n• **Destination recommendations**\n• **Budget planning**\n• **Best travel times**\n• **Accommodation suggestions**\n• **Local attractions**\n• **Travel tips & advice**\n\nWhat would you like to plan today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `You are a friendly and knowledgeable travel planning sales assistant for a travel planning website. Your role is to help customers plan their trips by providing personalized recommendations and advice.

Key responsibilities:
- Help customers choose destinations based on their preferences, budget, and time constraints
- Provide budget-friendly travel suggestions and cost estimates
- Recommend the best times to visit different destinations
- Suggest accommodations, activities, and local attractions
- Offer travel tips and advice
- Be enthusiastic, helpful, and sales-oriented while being genuine

Customer message: "${userMessage}"

Please respond in a conversational, helpful manner. Keep responses concise but informative. Use emojis occasionally to make the conversation friendly. Focus on being helpful and encouraging them to plan their trip.

**IMPORTANT**: Use proper markdown formatting to make your responses more readable:
- Use **bold** for important points, section headers, and key information
- Use *italic* for emphasis
- Use bullet points (• or -) for lists
- Use numbered lists when appropriate
- Use ### for section headers when organizing information

If they ask about specific destinations, provide:
- **Best time to visit**
- **Estimated budget range**
- **Key attractions**
- **Travel tips**
- **Accommodation suggestions**

If they ask about budget, help them understand costs and suggest budget-friendly options.

If they ask about timing, consider weather, crowds, and prices.

Always be encouraging and make them excited about their potential trip!`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botResponse = response.text();

      return botResponse;
    } catch (error) {
      console.error("Error generating response:", error);
      return "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to explore our travel planning features directly! 🛠️";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const botResponse = await generateResponse(userMessage);
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickSuggestions = [
    "I need help choosing a destination",
    "What's a good budget for a week-long trip?",
    "When is the best time to visit Europe?",
    "Can you suggest family-friendly destinations?",
    "I want to plan a romantic getaway"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                Travel Planning Assistant
              </DialogTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
                <Sparkles className="h-3 w-3 text-yellow-500" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.map((message) => (
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
                    <div className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {message.sender === 'user' ? (
                        <div className="whitespace-pre-wrap">{message.text}</div>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown 
                            components={{
                              h1: ({children}) => <h1 className="text-lg font-bold text-gray-900 mb-2">{children}</h1>,
                              h2: ({children}) => <h2 className="text-base font-bold text-gray-900 mb-2">{children}</h2>,
                              h3: ({children}) => <h3 className="text-sm font-bold text-gray-900 mb-1">{children}</h3>,
                              p: ({children}) => <p className="mb-2">{children}</p>,
                              ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                              ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                              li: ({children}) => <li className="text-sm">{children}</li>,
                              strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                              em: ({children}) => <em className="italic">{children}</em>,
                              code: ({children}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                              blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">{children}</blockquote>,
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      <span className="text-sm text-gray-600">Typing...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => setInputValue(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t pt-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about destinations, budgets, timing, or anything travel-related..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportChatbot; 