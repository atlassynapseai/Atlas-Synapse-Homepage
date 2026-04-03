'use client'

import { useState, useRef, useEffect } from 'react'
import { CHATBOT_MESSAGES, CHATBOT_QUICK_OPTIONS } from './mockData'

interface Message {
  id: number
  sender: 'user' | 'bot'
  text: string
  timestamp: Date
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message>(CHATBOT_MESSAGES[0] as unknown as Message)
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleQuickSelect = (option: string) => {
    setInputValue(option)
    // Simulate sending message
    setTimeout(() => {
      setMessages({
        id: Date.now(),
        sender: 'bot',
        text: `Great! A ${option} is a perfect fit for our synapse. Let me show you some relevant solutions...`,
        timestamp: new Date(),
      })
      setInputValue('')
    }, 500)
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    // User message
    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    }
    setMessages(userMsg)

    // Simulate bot response
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'I understand. Let me process that and provide recommendations...',
        timestamp: new Date(),
      }
      setMessages(botMsg)
    }, 1000)

    setInputValue('')
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-atlas-cyan to-atlas-primary shadow-lg shadow-atlas-cyan/50 flex items-center justify-center text-white font-bold text-xl transition-all hover:scale-110 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        💬
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-96 bg-slate-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl shadow-atlas-cyan/20 flex flex-col h-[600px] animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div>
              <h3 className="text-lg font-bold text-white">Atlas Architect</h3>
              <p className="text-xs text-atlas-cyan">🟢 ONLINE</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div className="rounded-lg bg-slate-800/60 p-3 max-w-xs">
              <p className="text-sm text-slate-100">{messages.text}</p>
              <p className="text-xs text-slate-500 mt-2">
                {messages.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Options (only on first message) */}
          <div className="px-4 py-3 space-y-2">
            <p className="text-xs text-slate-400 mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {CHATBOT_QUICK_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleQuickSelect(option)}
                  className="rounded-full border border-atlas-cyan/50 bg-atlas-cyan/10 px-3 py-1 text-xs text-atlas-cyan hover:bg-atlas-cyan/20 transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-4 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your response..."
              className="flex-1 rounded-lg bg-slate-800/60 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-atlas-cyan/50"
            />
            <button
              onClick={handleSend}
              className="rounded-lg bg-atlas-cyan text-slate-900 px-4 py-2.5 font-semibold hover:shadow-lg hover:shadow-atlas-cyan/50 transition-all active:scale-95"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
