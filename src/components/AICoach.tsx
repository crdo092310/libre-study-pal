import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Send, 
  Lightbulb, 
  Target, 
  BookOpen, 
  Clock, 
  Star,
  MessageCircle
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'suggestion' | 'motivation' | 'tip' | 'reminder';
}

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Study Coach. I'm here to help you optimize your learning journey. What would you like to work on today?",
      isUser: false,
      timestamp: new Date(),
      type: 'motivation'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const suggestions = [
    "How can I improve my study habits?",
    "Create a study schedule for me",
    "What's the best way to memorize formulas?",
    "Help me stay motivated",
    "Tips for better focus"
  ];

  const coachResponses = {
    "study habits": "Here are some proven study habits that can transform your learning:\n\n🎯 **Active Recall**: Test yourself regularly instead of just re-reading\n📝 **Spaced Repetition**: Review material at increasing intervals\n⏰ **Pomodoro Technique**: Study in 25-minute focused blocks\n🧠 **Teach Others**: Explain concepts to reinforce your understanding\n💤 **Quality Sleep**: Get 7-9 hours for memory consolidation",
    
    "schedule": "Let me help you create an effective study schedule:\n\n📅 **Morning (9-11 AM)**: Your brain is freshest - tackle difficult subjects\n🍽️ **After Lunch (2-4 PM)**: Review and practice problems\n🌅 **Evening (7-9 PM)**: Light review and reading\n\n✅ Include 15-minute breaks every hour\n✅ Reserve weekends for review and catch-up\n✅ Plan specific goals for each session",
    
    "memorize": "Effective memorization techniques:\n\n🧩 **Chunking**: Break information into smaller, manageable pieces\n🎨 **Visual Memory**: Create mind maps and diagrams\n📖 **Storytelling**: Create narratives linking facts together\n🔄 **Multiple Senses**: Read aloud, write, and visualize\n🏃 **Movement**: Walk while reviewing to boost retention",
    
    "motivation": "Here's how to stay motivated on your learning journey:\n\n🎯 Set specific, achievable daily goals\n🏆 Celebrate small wins and progress\n👥 Join study groups or find accountability partners\n📈 Track your progress visually\n🌟 Remember your 'why' - your long-term goals\n💪 Take breaks to prevent burnout",
    
    "focus": "Boost your focus with these strategies:\n\n📱 Put devices in airplane mode while studying\n🎵 Try instrumental music or white noise\n🪑 Create a dedicated study space\n🍃 Ensure good lighting and ventilation\n💧 Stay hydrated and take movement breaks\n🧘 Practice mindfulness before study sessions"
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
        type: response.type
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): { content: string; type: Message['type'] } => {
    const input = userInput.toLowerCase();
    
    if (input.includes('habit')) {
      return { content: coachResponses["study habits"], type: 'tip' };
    } else if (input.includes('schedule') || input.includes('plan')) {
      return { content: coachResponses["schedule"], type: 'suggestion' };
    } else if (input.includes('memorize') || input.includes('remember')) {
      return { content: coachResponses["memorize"], type: 'tip' };
    } else if (input.includes('motivat') || input.includes('inspire')) {
      return { content: coachResponses["motivation"], type: 'motivation' };
    } else if (input.includes('focus') || input.includes('concentrat')) {
      return { content: coachResponses["focus"], type: 'tip' };
    } else {
      return {
        content: "I understand you're looking for study guidance. Here are some ways I can help:\n\n📚 Study techniques and strategies\n⏰ Creating effective schedules\n🧠 Memory and retention tips\n💪 Motivation and goal setting\n🎯 Focus and concentration methods\n\nWhat specific area would you like to explore?",
        type: 'suggestion'
      };
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'tip': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'suggestion': return <Target className="h-4 w-4 text-blue-500" />;
      case 'motivation': return <Star className="h-4 w-4 text-purple-500" />;
      case 'reminder': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <Brain className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Coach Header */}
      <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Study Coach
            </CardTitle>
          </div>
          <CardDescription className="text-lg">
            Your personal AI assistant for optimized learning
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Brain className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Study Coach</CardTitle>
              <CardDescription className="text-sm">Online • Ready to help</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isUser && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Brain className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] ${message.isUser ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.isUser
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      {!message.isUser && message.type && (
                        <div className="flex items-center gap-1 mb-2">
                          {getMessageIcon(message.type)}
                          <Badge variant="secondary" className="text-xs">
                            {message.type}
                          </Badge>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.isUser && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-secondary">
                        You
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Brain className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggestions */}
          <div className="border-t p-4">
            <p className="text-sm font-medium mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about studying..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTyping}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}