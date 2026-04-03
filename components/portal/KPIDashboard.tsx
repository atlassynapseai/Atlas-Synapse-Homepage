'use client'

import { useState, useEffect } from 'react'
import KPICard from './KPICard'
import { MOCK_KPI_CARDS, BUSINESS_CATEGORIES, LIVE_TICKER_START } from './mockData'

export default function KPIDashboard() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Services'])
  const [displayedCards, setDisplayedCards] = useState(MOCK_KPI_CARDS.slice(0, 3))
  const [tickerValue, setTickerValue] = useState(LIVE_TICKER_START)
  const [cardRotationIndex, setCardRotationIndex] = useState(0)

  // Live ticker increment
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setTickerValue((prev) => {
        const increment = Math.floor(Math.random() * 50) + 10
        return prev + increment
      })
    }, 2000)
    return () => clearInterval(tickerInterval)
  }, [])

  // Card rotation every 8 seconds
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setCardRotationIndex((prev) => {
        const nextIndex = prev + 3
        if (nextIndex >= MOCK_KPI_CARDS.length) {
          return 0
        }
        return nextIndex
      })
    }, 8000)
    return () => clearInterval(rotationInterval)
  }, [])

  // Update displayed cards based on rotation
  useEffect(() => {
    const newCards = []
    for (let i = 0; i < 3; i++) {
      const index = (cardRotationIndex + i) % MOCK_KPI_CARDS.length
      newCards.push(MOCK_KPI_CARDS[index])
    }
    setDisplayedCards(newCards)
  }, [cardRotationIndex])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="ml-56 space-y-6 pt-20 px-8 pb-8">
      {/* Header Section */}
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Business Command</h2>
            <p className="text-slate-400">Money saved for you</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-atlas-cyan">
              ${(tickerValue / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-atlas-cyan font-semibold tracking-wider">📈 LIVE TICKER</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {BUSINESS_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategories.includes(category)
                  ? 'bg-atlas-cyan text-slate-900 shadow-lg shadow-atlas-cyan/50'
                  : 'border border-white/10 bg-slate-800/60 text-slate-300 hover:border-white/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {displayedCards.map((card) => (
          <KPICard
            key={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            badge={card.badge}
            tagline={card.tagline}
          />
        ))}
      </div>
    </div>
  )
}
