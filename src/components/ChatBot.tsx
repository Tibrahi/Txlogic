import { useState, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
  feedback?: 'like' | 'unlike' | 'sad' | 'not_satisfied' | null;
}

interface UserInfo {
  name: string;
  preferredTracking: string;
  isFirstTime: boolean;
  contactShared: boolean;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    preferredTracking: '',
    isFirstTime: true,
    contactShared: false
  });
  const [step, setStep] = useState<'intro' | 'name' | 'tracking' | 'chat'>('intro');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (isOpen && userInfo.isFirstTime) {
      setMessages([{
        text: "Hello! I'm your TxLogic Tracking Assistant. I'd like to get to know you better to provide personalized tracking assistance. What's your name?",
        isUser: false
      }]);
    }
  }, [isOpen, userInfo.isFirstTime]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
      setShowFeedback(true);
    }, 1000);
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
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "I'm sorry I couldn't help you effectively. Would you like to speak with a human representative? You can reach us at support@txlogic.com or call +1-800-TXLOGIC.",
          isUser: false
        }]);
        setUserInfo(prev => ({ ...prev, contactShared: true }));
      }, 1000);
    }
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Check if the question is outside tracking scope
    const trackingKeywords = ['track', 'tracking', 'vehicle', 'car', 'package', 'container', 'cargo', 'shipment', 'delivery', 'status'];
    const isTrackingRelated = trackingKeywords.some(keyword => input.includes(keyword));

    if (!isTrackingRelated && step === 'chat') {
      return "I'm a tracking assistant chatbot created by Tuyizere Ibrahim, the owner of TxLogic. I'm specialized in helping with tracking vehicles, packages, and containers. I'm afraid I can't help with that specific request. Would you like to know about our tracking services instead?";
    }

    if (step === 'intro' || step === 'name') {
      if (!userInfo.name) {
        setUserInfo(prev => ({ ...prev, name: userInput }));
        setStep('tracking');
        return `Nice to meet you, ${userInput}! I'm here to help you track your shipments. What type of items do you usually track? (vehicles, packages, or containers)`;
      }
    }

    if (step === 'tracking') {
      if (input.includes('vehicle') || input.includes('car')) {
        setUserInfo(prev => ({ ...prev, preferredTracking: 'vehicle', isFirstTime: false }));
        setStep('chat');
        return `Great! I see you're interested in vehicle tracking. I can help you track vehicles using their ID (e.g., VH123456). How can I assist you today, ${userInfo.name}?`;
      }
      if (input.includes('package') || input.includes('parcel')) {
        setUserInfo(prev => ({ ...prev, preferredTracking: 'package', isFirstTime: false }));
        setStep('chat');
        return `Perfect! I can help you track packages using their ID (e.g., PKG123456). What would you like to know about package tracking, ${userInfo.name}?`;
      }
      if (input.includes('container') || input.includes('cargo')) {
        setUserInfo(prev => ({ ...prev, preferredTracking: 'container', isFirstTime: false }));
        setStep('chat');
        return `Excellent! I can help you track containers using their ID (e.g., CNT123456). How can I help you with container tracking, ${userInfo.name}?`;
      }
      return "I'm not sure I understand. Do you track vehicles, packages, or containers?";
    }

    // Regular chat responses
    if (input.includes('hello') || input.includes('hi')) {
      return `Hello ${userInfo.name}! How can I help you with your ${userInfo.preferredTracking} tracking today?`;
    }
    if (input.includes('help')) {
      return `I'm here to help you track your ${userInfo.preferredTracking}. Just let me know what you need, ${userInfo.name}!`;
    }
    if (input.includes('thank')) {
      return `You're welcome, ${userInfo.name}! Let me know if you need anything else with your ${userInfo.preferredTracking} tracking.`;
    }
    if (input.includes('bye') || input.includes('goodbye')) {
      return `Goodbye ${userInfo.name}! Feel free to chat again if you need help with your ${userInfo.preferredTracking} tracking.`;
    }
    if (input.includes('contact') || input.includes('human') || input.includes('representative')) {
      setUserInfo(prev => ({ ...prev, contactShared: true }));
      return "You can reach our human representatives at support@txlogic.com or call +1-800-TXLOGIC. They're available 24/7 to assist you.";
    }

    return `I can help you with your ${userInfo.preferredTracking} tracking. What specific information do you need, ${userInfo.name}?`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-[calc(100vw-2rem)] sm:w-96 h-[calc(100vh-8rem)] sm:h-[500px] flex flex-col">
          <div className="p-3 sm:p-4 border-b flex justify-between items-center">
            <h3 className="text-base sm:text-lg font-semibold">Tracking Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="space-y-2">
                <div
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                      message.isUser
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
                {!message.isUser && message.feedback && (
                  <div className="flex justify-start space-x-2 ml-2">
                    <span className="text-sm text-gray-500">
                      {message.feedback === 'like' && '👍 Liked'}
                      {message.feedback === 'unlike' && '👎 Disliked'}
                      {message.feedback === 'sad' && '😢 Not helpful'}
                      {message.feedback === 'not_satisfied' && '😕 Not satisfied'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showFeedback && (
            <div className="px-4 py-2 border-t border-b bg-gray-50">
              <div className="flex justify-start space-x-4">
                <button
                  onClick={() => handleFeedback('like')}
                  className="text-gray-600 hover:text-green-600"
                  title="Like"
                >
                  👍
                </button>
                <button
                  onClick={() => handleFeedback('unlike')}
                  className="text-gray-600 hover:text-red-600"
                  title="Dislike"
                >
                  👎
                </button>
                <button
                  onClick={() => handleFeedback('sad')}
                  className="text-gray-600 hover:text-yellow-600"
                  title="Not helpful"
                >
                  😢
                </button>
                <button
                  onClick={() => handleFeedback('not_satisfied')}
                  className="text-gray-600 hover:text-orange-600"
                  title="Not satisfied"
                >
                  😕
                </button>
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSend}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 