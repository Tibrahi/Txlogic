import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
  feedback?: 'like' | 'unlike' | 'sad' | 'not_satisfied' | null;
  options?: string[];
}

interface UserInfo {
  name: string;
  preferredTracking: string;
  isFirstTime: boolean;
  contactShared: boolean;
}

type Theme = 'light' | 'dark';

// SVG Icons
const CloseIcon = (props: { className?: string }) => (
  <svg className={props.className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = (props: { className?: string }) => (
  <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const LightbulbIcon = (props: { className?: string }) => (
  <svg className={props.className || "w-5 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19M12 4V7M12 17V20M16 10H19M5 10H8M21 12H19.5M4.5 12H3M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z" />
  </svg>
);

const MoonIcon = (props: { className?: string }) => (
  <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const ClearIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'User',
    preferredTracking: '',
    isFirstTime: true,
    contactShared: false
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick reply options
  const INITIAL_OPTIONS = ['Track Shipment', 'General Question', 'Contact Support'];
  const TRACKING_OPTIONS = ['Vehicle', 'Package', 'Container'];

  // Generate unique session ID
  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  useEffect(() => {
    if (isOpen && userInfo.isFirstTime) {
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        setMessages([{
          text: "Hello! I'm your TxLogic Tracking Assistant. How can I help you today?",
          isUser: false,
          options: INITIAL_OPTIONS
        }]);
        setUserInfo(prev => ({ ...prev, isFirstTime: false }));
      }, 800);
    }
  }, [isOpen]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Clear chat history from MongoDB
  const clearChatHistory = async () => {
    try {
      if (sessionId) {
        await axios.delete(`${API_BASE_URL}/chat/history/${sessionId}`);
      }
      setMessages([]);
      setUserInfo({
        name: 'User',
        preferredTracking: '',
        isFirstTime: true,
        contactShared: false
      });
      setShowFeedback(false);
      // Re-initialize with greeting
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        setMessages([{
          text: "Hello! I'm your TxLogic Tracking Assistant. How can I help you today?",
          isUser: false,
          options: INITIAL_OPTIONS
        }]);
        setUserInfo(prev => ({ ...prev, isFirstTime: false }));
      }, 500);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  // Get response from Gemini API
  const getGeminiResponse = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      const formattedHistory = conversationHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: userMessage,
        conversationHistory: formattedHistory,
        userInfo: userInfo
      });

      return response.data.response;
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    }
  };

  // Save chat history to MongoDB
  const saveChatHistory = async () => {
    try {
      if (sessionId && messages.length > 0) {
        const formattedMessages = messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }));
        
        await axios.post(`${API_BASE_URL}/chat/history`, {
          sessionId,
          messages: formattedMessages,
          userInfo
        });
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Auto-save every 5 messages
  useEffect(() => {
    if (messages.length > 0 && messages.length % 5 === 0) {
      saveChatHistory();
    }
  }, [messages]);

  const handleQuickReply = async (text: string) => {
    setMessages(prev => [...prev, { text, isUser: true }]);
    setIsBotTyping(true);

    // Remove options from previous bot message
    setMessages(prev => {
      const newMessages = [...prev];
      let indexToClear = newMessages.length - 2;
      while (indexToClear >= 0 && newMessages[indexToClear].isUser) {
        indexToClear--;
      }
      if (indexToClear >= 0) {
        newMessages[indexToClear] = { ...newMessages[indexToClear], options: undefined };
      }
      return newMessages;
    });

    // Update user info based on selection
    if (text === 'Track Shipment') {
      setUserInfo(prev => ({ ...prev, preferredTracking: 'general' }));
    } else if (text === 'Contact Support') {
      setUserInfo(prev => ({ ...prev, contactShared: true }));
    }

    setTimeout(async () => {
      setIsBotTyping(false);
      const botResponse = await getGeminiResponse(text, messages);
      
      let newMessage: Message = { text: botResponse, isUser: false };
      
      // Show tracking options after "Track Shipment"
      if (text === 'Track Shipment') {
        newMessage.options = TRACKING_OPTIONS;
      }
      
      setMessages(prev => [...prev, newMessage]);
      setShowFeedback(true);
      saveChatHistory();
    }, 1000 + Math.random() * 500);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setIsBotTyping(true);

    setTimeout(async () => {
      setIsBotTyping(false);
      const currentMessages = [...messages, { text: userMessage, isUser: true }];
      const botResponse = await getGeminiResponse(userMessage, currentMessages);
      
      let newMessage: Message = { text: botResponse, isUser: false };
      setMessages(prev => [...prev, newMessage]);
      setShowFeedback(true);
      saveChatHistory();
    }, 1000 + Math.random() * 500);
  };

  const handleFeedback = (feedback: 'like' | 'unlike' | 'sad' | 'not_satisfied') => {
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && !lastMessage.isUser) {
        lastMessage.feedback = feedback;
      }
      return newMessages;
    });
    setShowFeedback(false);

    if (feedback === 'not_satisfied' || feedback === 'sad') {
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        setMessages(prev => [...prev, {
          text: "I'm sorry I couldn't help effectively. Would you like to speak with a human? Contact us at support@txlogic.com or call +250788888888.",
          isUser: false
        }]);
        setUserInfo(prev => ({ ...prev, contactShared: true }));
      }, 800);
    }
  };

  // Typing Indicator
  const TypingIndicator = () => (
    <div className={`flex justify-start items-center space-x-1.5 p-3 rounded-2xl max-w-[80%] ${
      theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
    }`}>
      <div className={`h-2 w-2 rounded-full animate-bounce ${
        theme === 'light' ? 'bg-gray-400' : 'bg-gray-300'
      }`} style={{ animationDelay: '0s', animationDuration: '0.6s' }}></div>
      <div className={`h-2 w-2 rounded-full animate-bounce ${
        theme === 'light' ? 'bg-gray-400' : 'bg-gray-300'
      }`} style={{ animationDelay: '0.2s', animationDuration: '0.6s' }}></div>
      <div className={`h-2 w-2 rounded-full animate-bounce ${
        theme === 'light' ? 'bg-gray-400' : 'bg-gray-300'
      }`} style={{ animationDelay: '0.4s', animationDuration: '0.6s' }}></div>
    </div>
  );

  // Message bubble styling
  const getMessageClasses = (isUser: boolean) => {
    if (isUser) {
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md shadow-sm';
    } else {
      if (theme === 'light') {
        return 'bg-white text-gray-800 rounded-bl-md border border-gray-100 shadow-sm';
      } else {
        return 'bg-gray-800 text-gray-100 rounded-bl-md border border-gray-700 shadow-sm';
      }
    }
  };

  // Theme classes
  const rootClasses = theme === 'light' 
    ? 'bg-white text-gray-800 border-gray-200' 
    : 'bg-gray-900 text-gray-100 border-gray-700';
  
  const bodyBgClasses = theme === 'light' ? 'bg-gradient-to-b from-gray-50 to-white' : 'bg-gradient-to-b from-gray-900 to-gray-800';
  const inputBgClasses = theme === 'light' 
    ? 'bg-white border-gray-200 text-gray-800 placeholder-gray-400' 
    : 'bg-gray-800 border-gray-600 text-white placeholder-gray-400';

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
          aria-label="Open Chatbot"
        >
          <ChatIcon />
        </button>
      ) : (
        <div className={`rounded-2xl shadow-2xl w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px] h-[calc(100vh-8rem)] sm:h-[580px] flex flex-col border overflow-hidden ${rootClasses} transition-all duration-300`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-base">TxLogic Assistant</h3>
                <p className="text-xs text-blue-100">Powered by AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChatHistory}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Clear Chat"
                title="Clear Chat"
              >
                <ClearIcon />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                {theme === 'light' ? <MoonIcon /> : <LightbulbIcon />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Close Chatbot"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
          
          {/* Message Area */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${bodyBgClasses}`}>
            {messages.map((message, index) => (
              <div key={index} className="space-y-2">
                <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end space-x-2 max-w-[85%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isUser 
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' 
                        : theme === 'light' 
                          ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600' 
                          : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300'
                    }`}>
                      {message.isUser ? <span className="text-xs font-semibold">You</span> : <span className="text-xs font-semibold">AI</span>}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`px-4 py-3 text-sm rounded-2xl ${getMessageClasses(message.isUser)}`}>
                      <p className="leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                </div>
                
                {/* Quick Reply Options */}
                {!message.isUser && message.options && index === messages.length - 1 && (
                  <div className="flex flex-wrap gap-2 ml-10">
                    {message.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => handleQuickReply(option)}
                        className={`px-4 py-2 text-xs font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${
                          theme === 'light' 
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200' 
                            : 'bg-gray-700 text-blue-300 hover:bg-gray-600 border border-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Feedback Display */}
                {!message.isUser && message.feedback && (
                  <div className={`text-xs ml-10 italic ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {message.feedback === 'like' && '👍 Thanks for the feedback!'}
                    {message.feedback === 'unlike' && '👎 Feedback noted.'}
                    {message.feedback === 'sad' && '😢 We\'ll improve.'}
                    {message.feedback === 'not_satisfied' && '📞 Connecting to support...'}
                  </div>
                )}
              </div>
            ))}
            
            {isBotTyping && (
              <div className="flex justify-start ml-10">
                <TypingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Feedback Section */}
          {showFeedback && (
            <div className={`px-4 py-3 border-t ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
              <p className={`text-xs mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Was this helpful?</p>
              <div className="flex space-x-3">
                <button onClick={() => handleFeedback('like')} className="text-xl hover:scale-125 transition-transform" title="Helpful">👍</button>
                <button onClick={() => handleFeedback('unlike')} className="text-xl hover:scale-125 transition-transform" title="Not helpful">👎</button>
                <button onClick={() => handleFeedback('sad')} className="text-xl hover:scale-125 transition-transform" title="Confusing">😢</button>
                <button onClick={() => handleFeedback('not_satisfied')} className="text-xl hover:scale-125 transition-transform" title="Need Human">📞</button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className={`p-4 border-t ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className={`flex-1 border rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${inputBgClasses}`}
                disabled={isBotTyping}
              />
              <button
                onClick={() => handleSend()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                disabled={!input.trim() || isBotTyping}
                aria-label="Send Message"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;