'use client';

import { useState, useRef, useEffect } from 'react';
import { CHATBOT_QUICK_OPTIONS, CHATBOT_INITIAL_MESSAGE } from '@/lib/portal-mock-data';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([CHATBOT_INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickOption = (option: string) => {
    setInput(option);
    handleSend(option);
  };

  const handleSend = (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: text },
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Simulate bot response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `I understand you're from ${text}. Let me show you how Atlas Synapse tailors solutions for your industry...`,
        },
      ]);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-atlas-primary hover:bg-atlas-primary/90 shadow-lg flex items-center justify-center text-white text-xl z-50 transition-all hover:scale-110"
      >
        💬
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[600px] bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl flex flex-col z-50 backdrop-blur">
          {/* Header */}
          <div className="border-b border-white/10 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Atlas Architect</p>
              <p className="text-xs text-atlas-cyan">● ONLINE</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-atlas-primary/30 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 px-4 py-2 rounded-lg">
                  <p className="text-sm text-slate-300">Atlas is typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Options (show only if no prior messages) */}
          {messages.length === 1 && (
            <div className="border-t border-white/10 p-4 space-y-2">
              {CHATBOT_QUICK_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleQuickOption(option)}
                  className="w-full px-3 py-2 rounded-lg border border-atlas-cyan/40 text-atlas-cyan hover:bg-atlas-cyan/10 text-xs font-medium transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-white/10 p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your response..."
              className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-atlas-primary/50"
            />
            <button
              onClick={() => handleSend()}
              className="bg-atlas-cyan hover:bg-atlas-secondary text-slate-900 font-semibold px-4 py-2 rounded-lg transition-all"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
