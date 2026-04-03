'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Knowledge base for Iris
const IRIS_KNOWLEDGE_BASE: { [key: string]: string[] } = {
  'aegis prime': [
    'Aegis Prime is our flagship AI governance platform designed to help businesses automate compliance, risk management, and decision-making workflows.',
    'Aegis Prime features real-time threat detection, automated response protocols, and comprehensive audit trails for complete visibility.',
  ],
  'pricing': [
    'We offer flexible pricing tiers: Starter ($99/mo), Professional ($299/mo), Enterprise (custom). All plans include 24/7 support.',
  ],
  'signup': [
    'Sign up for free at atlassynapseai.com/signup. Takes less than 2 minutes to get started.',
  ],
  'security': [
    'Atlas Synapse uses enterprise-grade encryption (AES-256), multi-factor authentication, and zero-trust architecture.',
  ],
  'support': [
    'Our support team is available 24/7 via email, chat, and phone. Response time under 1 hour guaranteed.',
  ],
  'portal': [
    'The Atlas Portal is your command center for business operations - real-time dashboards, KPI tracking, and automated workflows.',
  ],
};

const QUICK_SUGGESTIONS = [
  "What is Aegis Prime?",
  "Tell me about pricing",
  "How do I sign up?",
  "Is my data secure?",
];

function findBestResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  for (const [keyword, responses] of Object.entries(IRIS_KNOWLEDGE_BASE)) {
    if (lowerMessage.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  return "I'm not sure about that, but I'm here to help! Feel free to ask about our products, pricing, security, or how to get started.";
}

export function IrisGlobalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Iris, your Atlas Synapse guide. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const response = findBestResponse(messageText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 300);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/40 flex items-center justify-center hover:shadow-xl hover:shadow-cyan-500/60 transition-all duration-300 group"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-40 w-full max-w-sm h-96 bg-gradient-to-b from-slate-900 to-slate-950 border border-white/15 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            <div className="px-4 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase">Iris Guide</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white/10 text-slate-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="px-4 py-3 bg-white/5 border-t border-white/10"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button type="submit" className="p-2 bg-cyan-600 rounded-lg text-white">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
