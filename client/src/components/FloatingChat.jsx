import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import axios from 'axios';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! 👋 I'm the BusinessConnect AI assistant. Ask me anything about our services, pricing, project tracking, or booking a consultation!"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  const suggestionChips = [
    'What services do you offer?',
    'How do I schedule a consultation?',
    'Tell me about pricing',
    'Where is your portfolio?'
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const text = textToSend || message;
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setMessage('');
    setIsTyping(true);

    try {
      const res = await axios.post('/chat', { message: text });
      
      // Artificial delay for smooth typing realism
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
        setIsTyping(false);
      }, 700);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: "I'm having trouble connecting to my servers right now, but feel free to review our services tab or shoot us an email!" }]);
        setIsTyping(false);
      }, 700);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary-600 to-secondary-500 hover:from-primary-750 hover:to-secondary-650 text-white flex items-center justify-center shadow-2xl shadow-primary-500/35 hover:scale-110 active:scale-95 transition-all duration-300 relative group"
        >
          <div className="absolute inset-0 rounded-full bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <MessageSquare size={24} className="animate-float-medium" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-50"></span>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[360px] sm:w-[380px] h-[520px] rounded-3xl glass-card bg-white/90 dark:bg-slate-900/90 shadow-2xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col overflow-hidden animate-float-medium">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary-600 to-secondary-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-xs leading-none">BusinessConnect AI</h4>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] text-white/80">Support Agent Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-slate-50/50 dark:bg-slate-950/20"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 max-w-[80%] ${
                  msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800/40 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 self-start items-center">
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-850 flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <div className="p-3 bg-white dark:bg-slate-850 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar whitespace-nowrap bg-white/40 dark:bg-slate-900/40">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium rounded-full transition-colors border border-slate-200/30 dark:border-slate-700/30"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Ask AI a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-white"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-glow-primary"
              aria-label="Send Message"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChat;
