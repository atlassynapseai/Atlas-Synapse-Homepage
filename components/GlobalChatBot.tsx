'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Smart responses for common questions
const RESPONSE_MAP: Record<string, string> = {
  // Product questions
  'aegis': 'Aegis Prime Auditor is our flagship AI governance platform. It monitors AI system outputs at the boundary, detecting and preventing risks like fabricated outputs, data leakage, and governance drift. Visit our Risks or Solutions pages to learn more!',
  'pricing': 'We offer three tiers: Standard ($100/mo), Premium ($300/mo), and VIP ($1,500/mo). Each includes access to Aegis Prime with different levels of support and features. Check our Pricing page for details!',
  'features': 'Atlas Synapse provides AI governance, real-time risk detection, compliance auditing, and enterprise-grade monitoring. Visit our Solutions page to see our trust simulator in action!',
  'product': 'Atlas Synapse is the trust engine for agentic AI systems. We handle governance, verification, and auditability at the boundaries of your AI. Learn more on our About Us page!',

  // Account/Login questions
  'login': 'You can log in using your email/password or OAuth (Google/GitHub). Head to our Auth page to get started. Already have an account? Just sign in there!',
  'signup': 'Sign up at our Auth page with email/password or connect with Google/GitHub. It takes just a minute! After signup, you\'ll be taken to pricing to select your plan.',
  'password': 'Forgot your password? Use the "Forgot Password" link on the Auth page. We\'ll send you a reset link to your email.',
  'profile': 'Your profile is in your Dashboard once you\'re logged in. You can update your information, manage your subscription, and access your products there.',

  // Billing/Subscription
  'billing': 'Manage your subscription and billing in your Dashboard. You can view invoices, upgrade/downgrade your plan, or contact our sales team for enterprise options.',
  'cancel': 'You can cancel your subscription anytime from your Dashboard. We offer monthly billing with no long-term contracts required.',
  'discount': 'Enterprise and volume discounts are available for larger teams. Contact our Sales team to discuss your specific needs!',
  'trial': 'We don\'t currently offer a free trial, but check out our Solutions page for an interactive trust simulator that shows how Aegis works!',

  // Support/Help
  'help': 'I\'m Iris, your Atlas Synapse guide! I can help with questions about our products, pricing, account setup, or direct you to the right page. What would you like to know?',
  'contact': 'You can contact us through our Contact page, or email our team directly. For sales inquiries, we recommend the Request Demo option in the navbar.',
  'security': 'Security is at our core. Visit our Security page to learn about our compliance, data protection, and governance measures.',
  'risks': 'Interested in AI risks? Our Risks page details the challenges like governance drift, policy conflict, data leakage, and more - and how we prevent them.',
  'solution': 'Check out our Solutions page for an interactive trust simulator showing how Atlas Synapse intercepts risks at input and output gates.',
  'about': 'Learn about Atlas Synapse\'s mission, vision, and approach on our About Us page. We\'re building the integrity layer for the AI era.',
  'portal': 'The Portal is your command center after logging in. It shows your business metrics, network insights, and opportunities in one dashboard.',
  'demo': 'Want to see Atlas Synapse in action? Click "Request Demo" in the navbar. Our team will set up a personalized walkthrough for you!',
  'enterprise': 'For enterprise solutions and custom integrations, visit our Contact page or click "Request Demo". Our team can discuss your specific needs!',
};

const QUICK_OPTIONS = [
  'What is Atlas Synapse?',
  'Tell me about Aegis Prime',
  'How do I sign up?',
  'Pricing & Plans',
  'Contact Sales',
];

export function GlobalChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m Iris, your guide to Atlas Synapse. Ask me anything about our products, pricing, or how to get started!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Find best matching response
  const findResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();

    // Check for exact keyword matches
    for (const [keyword, response] of Object.entries(RESPONSE_MAP)) {
      if (lowerText.includes(keyword)) {
        return response;
      }
    }

    // Default response for unknown questions
    return 'Great question! I\'m Iris, and I can help with questions about Atlas Synapse products, pricing, accounts, and more. Try asking about "Aegis Prime", "Pricing", "Security", or "How to get started"! 🌐';
  };

  const handleQuickOption = (option: string) => {
    handleSend(option);
  };

  const handleSend = (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Simulate thinking and generate response
    setTimeout(() => {
      const response = findResponse(text);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: response,
        },
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl z-40 transition-all duration-300 ${isOpen
            ? 'bg-atlas-cyan scale-110'
            : 'bg-atlas-primary hover:bg-atlas-primary/90 hover:scale-110'
          }`}
        title="Chat with Iris"
      >
        💬
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[600px] bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-atlas-cyan/20 rounded-2xl shadow-2xl flex flex-col z-40 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="border-b border-atlas-cyan/20 bg-gradient-to-r from-atlas-primary/10 to-transparent p-4 flex items-center justify-between rounded-t-2xl">
            <div>
              <p className="text-base font-bold text-white">Iris</p>
              <p className="text-xs text-atlas-cyan/90">● Active & Ready to Help</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-2xl transition-colors duration-200"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-xl text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-atlas-primary/40 text-white rounded-br-none'
                      : 'bg-slate-800/80 text-slate-100 rounded-bl-none border border-atlas-cyan/20'
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/80 px-4 py-3 rounded-xl border border-atlas-cyan/20">
                  <div className="flex gap-2 items-center">
                    <span className="inline-block animate-bounce text-atlas-cyan">●</span>
                    <span className="inline-block animate-bounce text-atlas-cyan" style={{ animationDelay: '0.2s' }}>●</span>
                    <span className="inline-block animate-bounce text-atlas-cyan" style={{ animationDelay: '0.4s' }}>●</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Options (show only if few messages) */}
          {messages.length <= 2 && (
            <div className="border-t border-atlas-cyan/20 bg-slate-900/50 p-3 space-y-2 max-h-40 overflow-y-auto">
              {QUICK_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleQuickOption(option)}
                  className="w-full px-3 py-2 rounded-lg border border-atlas-cyan/40 text-atlas-cyan/90 hover:bg-atlas-cyan/10 hover:border-atlas-cyan/60 text-xs font-medium transition-all duration-200"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-atlas-cyan/20 bg-slate-900/50 p-3 flex gap-2 rounded-b-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Iris anything..."
              className="flex-1 bg-slate-800/60 border border-atlas-cyan/30 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-atlas-cyan/60 focus:bg-slate-800 transition-all duration-200"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-atlas-cyan hover:bg-atlas-cyan/90 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 font-bold px-4 py-2 rounded-lg transition-all duration-200"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
