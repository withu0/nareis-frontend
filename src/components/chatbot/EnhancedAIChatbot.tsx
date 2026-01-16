import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  timestamp: Date;
}

export default function EnhancedAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your AI assistant. I can help you with events, resources, networking, and more. What can I help you with today?',
      suggestions: ['Find events', 'Browse resources', 'Member directory', 'My benefits'],
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getIntelligentResponse = (msg: string) => {
    const lower = msg.toLowerCase();
    
    if (lower.includes('event') || lower.includes('webinar') || lower.includes('conference')) {
      return {
        text: "I can help you find upcoming events! We have networking events, webinars, and conferences. Would you like to see events in a specific category?",
        suggestions: ['Upcoming events', 'Webinars', 'Local chapters', 'Register for event'],
        action: '/events'
      };
    }
    
    if (lower.includes('resource') || lower.includes('document') || lower.includes('download')) {
      return {
        text: "Our resource library has templates, guides, and industry reports. What type of resource are you looking for?",
        suggestions: ['Browse all', 'Templates', 'Reports', 'Videos'],
        action: '/resources'
      };
    }
    
    if (lower.includes('benefit') || lower.includes('membership') || lower.includes('tier')) {
      return {
        text: "Your membership includes exclusive benefits like event discounts, resource access, and networking opportunities. Would you like to see your benefit usage?",
        suggestions: ['My benefits', 'Upgrade tier', 'Benefit details'],
        action: '/member-benefits'
      };
    }
    
    if (lower.includes('network') || lower.includes('connect') || lower.includes('member')) {
      return {
        text: "Connect with fellow members! You can search by industry, location, or expertise.",
        suggestions: ['Member directory', 'Find mentors', 'Local chapters'],
        action: '/member-directory'
      };
    }
    
    if (lower.includes('forum') || lower.includes('discussion')) {
      return {
        text: "Join discussions in our forums! Share insights and learn from peers.",
        suggestions: ['Browse forums', 'Recent posts', 'Start discussion'],
        action: '/forums'
      };
    }
    
    return {
      text: "I can assist with events, resources, networking, forums, and membership benefits. What interests you?",
      suggestions: ['Events', 'Resources', 'Directory', 'Benefits'],
      action: null
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getIntelligentResponse(input);
      const botMsg: Message = { 
        role: 'assistant', 
        content: response.text,
        suggestions: response.suggestions,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSend();
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col border">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {msg.content}
                </div>
                {msg.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2 justify-start">
                    {msg.suggestions.map((sug, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => handleSuggestionClick(sug)}
                      >
                        {sug}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon" className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
