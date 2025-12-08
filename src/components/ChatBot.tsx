import { useState, useEffect, useRef } from 'react';
// Removed lucide-react import

interface Message {
  text: string;
  isUser: boolean;
  feedback?: 'like' | 'unlike' | 'sad' | 'not_satisfied' | null;
  // Added options property for quick replies
  options?: string[]; 
}

interface UserInfo {
  name: string; // Keeping this for later personalization, even if not collected immediately
  preferredTracking: string;
  isFirstTime: boolean;
  contactShared: boolean;
}

// New type for theme
type Theme = 'light' | 'dark';

// --- SVG ICON DEFINITIONS ---

// X Icon
const CloseIcon = (props: { className?: string }) => (
    <svg className={props.className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Send Icon
const SendIcon = (props: { className?: string }) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {/* FIX: Removed the duplicate strokeLinecap attribute */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

// Lightbulb Icon (for Light Mode toggle when in Dark Mode)
const LightbulbIcon = (props: { className?: string }) => (
    <svg className={props.className || "w-5 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19M12 4V7M12 17V20M16 10H19M5 10H8M21 12H19.5M4.5 12H3M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z" />
    </svg>
);

// Moon Icon (for Dark Mode toggle when in Light Mode)
const MoonIcon = (props: { className?: string }) => (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);


const ChatBot = () => {
  // --- STATE ---
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
  const [step, setStep] = useState<'intro' | 'tracking' | 'chat'>('intro'); 
  const [showFeedback, setShowFeedback] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Define constants for quick reply options
  const INITIAL_OPTIONS = ['Track Shipment', 'General Question', 'Contact Support'];
  const TRACKING_OPTIONS = ['Vehicle', 'Package', 'Container'];
  
  // Define the default fallback message (used to trigger the main menu)
  const FALLBACK_MESSAGE = `That's an interesting question! As a specialized tracking assistant, I can best help with questions about tracking IDs, shipment status, or TxLogic services. Can you tell me more about what you are looking for?`;


  // --- UI/UX EFFECTS ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  useEffect(() => {
    if (isOpen && userInfo.isFirstTime) {
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        setMessages([{
          // Changed introductory text and added options
          text: "Hello! I'm your TxLogic Tracking Assistant. How can I help you get started?",
          isUser: false,
          options: INITIAL_OPTIONS // Initial quick choices
        }]);
        setUserInfo(prev => ({ ...prev, isFirstTime: false })); // Mark first time done after greeting
      }, 1500);
    }
  }, [isOpen]); 

  
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // --- HANDLERS ---
  
  // Handler for all quick reply clicks
  const handleQuickReply = (text: string) => {
    // 1. Add user message
    setMessages(prev => [...prev, { text, isUser: true }]);
    setIsBotTyping(true);

    // 2. Hide options on the message that was just replied to
    setMessages(prev => {
        const newMessages = [...prev];
        // Find the actual last bot message (where the options were displayed)
        let indexToClear = newMessages.length - 1;
        while (indexToClear >= 0 && newMessages[indexToClear].isUser) {
            indexToClear--;
        }

        if (indexToClear >= 0) {
            newMessages[indexToClear] = { ...newMessages[indexToClear], options: undefined };
        }
        return newMessages;
    });

    // 3. Get bot response
    setTimeout(() => {
      setIsBotTyping(false);
      const botResponse = getBotResponse(text);
      
      let newMessage: Message = { text: botResponse, isUser: false };
      
      // If we transition to the tracking step, add the specific tracking options
      if (step === 'tracking' && botResponse.includes('What type of items do you usually track')) {
          newMessage.options = TRACKING_OPTIONS;
      }
      
      // FIX: If the response is the fallback message, re-add the initial options AND reset step
      if (botResponse === FALLBACK_MESSAGE) {
          newMessage.options = INITIAL_OPTIONS;
          setStep('intro'); // <--- Essential fix
      }
      
      setMessages(prev => [...prev, newMessage]);
      
      // Only show general feedback after setup is complete (step is 'chat')
      if (step === 'chat' && botResponse !== FALLBACK_MESSAGE) {
        setShowFeedback(true);
      }
    }, 1500 + Math.random() * 500);
  };
  
  // Updated handleSend to handle manual input after the initial choices
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      setIsBotTyping(false);
      const botResponse = getBotResponse(input);
      
      let newMessage: Message = { text: botResponse, isUser: false };
      
      // If we transition to the tracking step, add the specific tracking options
      if (step === 'tracking' && botResponse.includes('What type of items do you usually track')) {
          newMessage.options = TRACKING_OPTIONS;
      }
      
      // FIX: If the response is the fallback message, re-add the initial options AND reset step
      if (botResponse === FALLBACK_MESSAGE) {
          newMessage.options = INITIAL_OPTIONS;
          setStep('intro'); // <--- Essential fix
      }
      
      setMessages(prev => [...prev, newMessage]);
      
      // Only show feedback if it's not the initial fallback
      if (botResponse !== FALLBACK_MESSAGE) {
        setShowFeedback(true);
      }
    }, 1500 + Math.random() * 500);
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
          text: "I'm sorry I couldn't help you effectively. Would you like to speak with a human representative? You can reach us at support@txlogic.com or call +250788888888. You can also visit our website at TXLOGIC.",
          isUser: false
        }]);
        setUserInfo(prev => ({ ...prev, contactShared: true }));
      }, 1500);
    }
  };

  // --- BOT LOGIC (IMAGINATION/BROAD TRAINING) ---
  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Initial Choice Handling (intro step)
    if (step === 'intro') {
        if (input.includes('track shipment')) {
            setStep('tracking');
            // This response triggers the second set of quick replies in handleQuickReply/handleSend
            return `Got it! To help you track, I need to know: What type of items do you usually track? (vehicles, packages, or containers)`;
        }
        if (input.includes('general question')) {
            setStep('chat'); // Skip the tracking setup
            return "Sure! I can answer questions about TxLogic services, location, or capabilities. What's your question?";
        }
        if (input.includes('contact support')) {
             setStep('chat'); 
             setUserInfo(prev => ({ ...prev, contactShared: true }));
             return "You can reach our human representatives at support@txlogic.com or call +250788888888. You can also visit our website at TXLOGIC.";
        }
        // If they bypass initial buttons (shouldn't happen with quick reply), fallback to generic and show buttons
        return FALLBACK_MESSAGE;
    }


    // Tracking Type Setup (tracking step)
    if (step === 'tracking') {
      if (input.includes('vehicle') || input.includes('car')) {
        setUserInfo(prev => ({ ...prev, preferredTracking: 'vehicle' }));
        setStep('chat');
        return `Great! I see you're interested in **vehicle tracking**. I can help you track vehicles using their ID (e.g., VH123456). How can I assist you today?`;
      }
      if (input.includes('package') || input.includes('parcel')) {
        setUserInfo(prev => ({ ...prev, preferredTracking: 'package' }));
        setStep('chat');
        return `Perfect! I can help you track **packages** using their ID (e.g., PKG123456). What would you like to know about package tracking?`;
      }
      if (input.includes('container') || input.includes('cargo')) {
        setUserInfo(prev => ({ ...prev, preferredTracking: 'container' }));
        setStep('chat');
        return `Excellent! I can help you track **containers** using their ID (e.g., CNT123456). How can I help you with container tracking?`;
      }
      // If user is in tracking step but types something else, re-ask with the menu 
      return `I'm not sure what kind of item you want to track. Please use the buttons or type one: vehicles, packages, or containers.`;
    }

    // --- General/Broad Reply Training (when step is 'chat') ---

    // 1. Company/Owner Information
    if (input.includes('who made you') || input.includes('who is tuyizere ibrahim') || input.includes('owner')) {
        return "I was created by Tuyizere Ibrahim, the owner of TxLogic. My purpose is to assist you with all your logistics tracking questions.";
    }

    // 2. Capabilities
    if (input.includes('what can you do') || input.includes('what are you')) {
        return `I am the TxLogic Assistant. I specialize in real-time tracking support for **vehicles**, **packages**, and **containers**. You can ask me for tracking status, service information, or general questions about TxLogic!`;
    }
    
    // 3. Default/Fallback 
    return FALLBACK_MESSAGE;
  };

  // Typing Indicator Component (Styling adjusted for theme)
  const TypingIndicator = () => (
    <div className={`flex justify-start items-center space-x-1.5 p-3 rounded-xl max-w-[80%] shadow-md ${
        theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
    }`}>
      <div className={`dot animate-bounce-slow h-2 w-2 rounded-full ${
        theme === 'light' ? 'bg-gray-500' : 'bg-gray-400'
      }`} style={{ animationDelay: '0s' }}></div>
      <div className={`dot animate-bounce-slow h-2 w-2 rounded-full ${
        theme === 'light' ? 'bg-gray-500' : 'bg-gray-400'
      }`} style={{ animationDelay: '0.2s' }}></div>
      <div className={`dot animate-bounce-slow h-2 w-2 rounded-full ${
        theme === 'light' ? 'bg-gray-500' : 'bg-gray-400'
      }`} style={{ animationDelay: '0.4s' }}></div>
      {/* CSS remains the same */}
    </div>
  );
  
  // Dynamic Chat Bubble Classes
  const getMessageClasses = (message: Message) => {
    if (message.isUser) {
        // User (Consistent Blue)
        return 'bg-blue-600 text-white rounded-br-none';
    } else {
        // Bot (Theme-dependent)
        if (theme === 'light') {
            return 'bg-white text-gray-800 rounded-tl-none border border-gray-200';
        } else {
            return 'bg-gray-800 text-gray-50 rounded-tl-none border border-gray-700';
        }
    }
  }

  // Root theme classes
  const rootClasses = theme === 'light' 
    ? 'bg-white text-gray-800' 
    : 'bg-gray-900 text-white border-gray-700';
  
  const bodyBgClasses = theme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const inputBgClasses = theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-800 border-gray-700 text-white';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-500 text-white p-4 rounded-full shadow-2xl hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-transform duration-200 transform hover:scale-110"
          aria-label="Open Chatbot"
        >
          {/* Default Chat Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className={`rounded-xl shadow-2xl w-[calc(100vw-2rem)] sm:w-96 h-[calc(100vh-8rem)] sm:h-[600px] flex flex-col border overflow-hidden ${rootClasses}`}>
          
          {/* Header */}
          <div className="p-4 bg-teal-500 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
              </span>
              <h3 className="text-lg font-semibold">TxLogic Assistant</h3>
            </div>
            <div className="flex space-x-2 items-center">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                    aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                >
                    {theme === 'light' ? <MoonIcon /> : <LightbulbIcon />}
                </button>
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full text-white bg-teal-600 hover:text-black hover:bg-white transition-colors"
                    aria-label="Close Chatbot"
                >
                    <CloseIcon />
                </button>
            </div>
          </div>
          
          {/* Message Area */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${bodyBgClasses}`}>
            {messages.map((message, index) => (
              <div key={index} className="space-y-1">
                <div
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 text-sm rounded-2xl shadow-md ${getMessageClasses(message)}`}
                  >
                    {message.text}
                  </div>
                </div>
                {/* Quick Reply Options */}
                {/* Show quick replies only for the last message from the bot that has options */}
                {!message.isUser && message.options && index === messages.length - 1 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {message.options.map((option, optIndex) => (
                            <button
                                key={optIndex}
                                onClick={() => handleQuickReply(option)}
                                className="px-4 py-2 text-xs font-medium rounded-full bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors shadow-sm"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
                {/* Feedback Display */}
                {!message.isUser && message.feedback && (
                  <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} text-xs ml-4 italic ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {message.feedback === 'like' && '👍 Thanks for the positive feedback!'}
                    {message.feedback === 'unlike' && '👎 Duly noted.'}
                    {message.feedback === 'sad' && '😢 Feedback submitted for review.'}
                    {message.feedback === 'not_satisfied' && '📞 Connecting you to support now.'}
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isBotTyping && (
                <div className="flex justify-start">
                    <TypingIndicator />
                </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Feedback Section */}
          {showFeedback && (
            <div className={`px-4 py-3 border-t ${theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}`}>
              <p className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Was this helpful?</p>
              <div className="flex space-x-3">
                <button onClick={() => handleFeedback('like')} className="text-xl hover:scale-110 transition-transform" title="Helpful">👍</button>
                <button onClick={() => handleFeedback('unlike')} className="text-xl hover:scale-110 transition-transform" title="Not helpful">👎</button>
                <button onClick={() => handleFeedback('sad')} className="text-xl hover:scale-110 transition-transform" title="Confusing">😢</button>
                <button onClick={() => handleFeedback('not_satisfied')} className="text-xl hover:scale-110 transition-transform" title="Need Human">📞</button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className={`p-4 border-t ${theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}`}>
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me about tracking..."
                className={`flex-1 border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow ${inputBgClasses}`}
                disabled={isBotTyping}
              />
              <button
                onClick={() => handleSend()}
                className="bg-teal-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:bg-gray-400 transition-colors"
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