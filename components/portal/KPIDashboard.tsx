'use client';

import { useState, useEffect } from 'react';
import { KPICard } from './KPICard';
import { LIVE_TICKER_START, KPI_CARDS, BUSINESS_CATEGORIES } from '@/lib/portal-mock-data';

export function KPIDashboard() {
  const [tickerValue, setTickerValue] = useState(LIVE_TICKER_START);
  const [cardIndex, setCardIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  // Ticker animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerValue((prev) => prev + Math.floor(Math.random() * 50) + 10);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Card rotation every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCardIndex((prev) => (prev + 3) % KPI_CARDS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const toggleCategory = (cat: string) => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(cat)) {
      newSet.delete(cat);
    } else {
      newSet.add(cat);
    }
    setSelectedCategories(newSet);
  };

  const displayedCards = [
    KPI_CARDS[(cardIndex + 0) % KPI_CARDS.length],
    KPI_CARDS[(cardIndex + 1) % KPI_CARDS.length],
    KPI_CARDS[(cardIndex + 2) % KPI_CARDS.length],
  ];

  return (
    <div className="space-y-6">
      {/* Header Card with Ticker */}
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Business Command</h2>
            <p className="text-slate-400">Money saved for you</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-atlas-cyan">${(tickerValue / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-atlas-cyan font-semibold tracking-wider mt-1">📈 LIVE TICKER</p>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {BUSINESS_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                selectedCategories.has(cat)
                  ? 'bg-white text-slate-900 font-semibold'
                  : 'border border-white/20 text-slate-300 hover:border-white/40'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedCards.map((card) => (
          <KPICard
            key={card.id}
            icon={card.icon}
            label={card.label}
            value={card.value}
            quote={card.quote}
            metric={card.metric}
            isActive={true}
          />
        ))}
      </div>
    </div>
  );
}
