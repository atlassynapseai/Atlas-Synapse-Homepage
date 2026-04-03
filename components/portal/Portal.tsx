'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { OperationsHub } from './OperationsHub';
import { AutomationLab } from './AutomationLab';
import { SynapseNetwork } from './SynapseNetwork';
import { SecurityVault } from './SecurityVault';
import {
  LayoutDashboard, Globe, Bot, ShieldCheck,
  Scale, Truck, TrendingUp,
  Activity, BarChart3,
  Users, UserPlus, MapPin,
  Briefcase,
  FileCheck, Clock,
  Cpu, ArrowRight, X, Sparkles,
  Leaf, Scissors, Store, Navigation,
  Fingerprint, Key, Building2, Wrench, Dumbbell, Hammer, Box, Send
} from 'lucide-react';
import {
  INDUSTRY_DATA, CATEGORIES, TOURS,
  IndustryCategory, IndustryType, ModuleType, TourScenario
} from '@/lib/portalData';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
      active
        ? 'bg-cyan-400 text-slate-900 shadow-[0_0_15px_rgba(0,242,255,0.4)]'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

export function Portal() {
  const [authStep, setAuthStep] = useState<'LOGIN' | 'DECRYPTING' | 'AUTHENTICATED'>('AUTHENTICATED');
  const [activeTab, setActiveTab] = useState<ModuleType>('OPERATIONS');

  // Navigation State
  const [activeCategory, setActiveCategory] = useState<IndustryCategory>('SERVICES');
  const [activeIndustry, setActiveIndustry] = useState<IndustryType>('LANDSCAPING');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [decryptionProgress, setDecryptionProgress] = useState(0);
  const [globalROI, setGlobalROI] = useState(14250890);

  // Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<TourScenario>('INTRO');
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // Architect Chat State
  const [architectChatOpen, setArchitectChatOpen] = useState(false);
  const [architectMsgInput, setArchitectMsgInput] = useState("");
  const [architectMessages, setArchitectMessages] = useState<string[]>([]);

  // Briefing Trigger State
  const [visitedTabs, setVisitedTabs] = useState<Set<ModuleType>>(new Set(['OPERATIONS']));
  const [showBriefingCTA, setShowBriefingCTA] = useState(false);

  const currentData = INDUSTRY_DATA[activeIndustry];

  const handleTabChange = (tab: ModuleType) => {
    setActiveTab(tab);
    setVisitedTabs(prev => {
      const newSet = new Set(prev);
      newSet.add(tab);
      if (newSet.size >= 3) setShowBriefingCTA(true);
      return newSet;
    });
  };

  const handleCategoryChange = (cat: IndustryCategory) => {
    setActiveCategory(cat);
    const firstInd = Object.values(INDUSTRY_DATA).find(d => d.category === cat)?.id;
    if (firstInd) setActiveIndustry(firstInd);
  };

  const handleOpenArchitectChat = () => {
    setArchitectChatOpen(true);
    if (architectMessages.length === 0) {
      setArchitectMessages(["Secure line established with Lead Strategist."]);
    }
  };

  const handleSendArchitectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!architectMsgInput.trim()) return;
    setArchitectMessages(prev => [...prev, architectMsgInput]);
    setArchitectMsgInput("");

    setTimeout(() => {
      setArchitectMessages(prev => [...prev, "Julius is currently in a deep-work session. Your priority message has been queued for his next review window."]);
    }, 1500);
  };

  const startTour = () => {
    let scenario: TourScenario = 'INTRO';
    if (activeTab === 'OPERATIONS') scenario = 'OPERATIONS';
    if (activeTab === 'NETWORK') scenario = 'NETWORK';
    if (activeTab === 'AUTOMATION') scenario = 'AUTOMATION';
    if (activeTab === 'SECURITY') scenario = 'SECURITY';

    if (authStep === 'AUTHENTICATED' && !visitedTabs.has('NETWORK') && activeTab === 'OPERATIONS') {
      scenario = 'INTRO';
    }

    setCurrentScenario(scenario);
    setTourStepIndex(0);
    setIsTourActive(true);

    const startStep = TOURS[scenario][0];
    if (startStep.tabSwitch) {
      handleTabChange(startStep.tabSwitch);
    }
  };

  const nextTourStep = () => {
    const currentSteps = TOURS[currentScenario];
    if (tourStepIndex < currentSteps.length - 1) {
      const nextIndex = tourStepIndex + 1;
      setTourStepIndex(nextIndex);

      const nextStep = currentSteps[nextIndex];
      if (nextStep.tabSwitch && nextStep.tabSwitch !== activeTab) {
        handleTabChange(nextStep.tabSwitch);
      }
    } else {
      setIsTourActive(false);
    }
  };

  const skipTour = () => {
    setIsTourActive(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalROI(prev => prev + Math.floor(Math.random() * 15));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentTourStep = TOURS[currentScenario][tourStepIndex];

  const getHighlightClass = (id: string) => {
    if (!isTourActive) return "";
    return currentTourStep.targetId === id
      ? "ring-2 ring-cyan-400 shadow-[0_0_40px_rgba(0,242,255,0.4)] z-40 bg-slate-900/80 transition-all duration-500 scale-[1.01]"
      : "opacity-40 transition-opacity duration-500 blur-[1px] pointer-events-none";
  };

  return (
    <div className="pt-24 pb-64 px-4 md:px-8 font-sans min-h-screen flex flex-col md:flex-row gap-6 container mx-auto relative">

      {/* PERSISTENT SIDEBAR */}
      <aside
        id="tour-sidebar"
        className={`w-full md:w-64 flex flex-col gap-4 md:gap-6 shrink-0 relative rounded-2xl ${getHighlightClass('tour-sidebar')}`}
      >
        <GlassCard className="!p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 md:px-4 py-2 md:py-3 mb-2 border-b border-white/10">
            <div className="w-8 h-8 rounded bg-cyan-400 flex items-center justify-center text-sm font-bold text-slate-900">A</div>
            <div>
              <div className="text-sm font-bold text-white">Business Command</div>
              <div className="text-xs text-cyan-400">System Online</div>
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-2 md:flex md:flex-col md:space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Home Base" active={activeTab === 'OPERATIONS'} onClick={() => handleTabChange('OPERATIONS')} />
            <SidebarItem icon={Bot} label="Workroom" active={activeTab === 'AUTOMATION'} onClick={() => handleTabChange('AUTOMATION')} />
            <SidebarItem icon={Globe} label="Network" active={activeTab === 'NETWORK'} onClick={() => handleTabChange('NETWORK')} />
            <SidebarItem icon={ShieldCheck} label="Vault" active={activeTab === 'SECURITY'} onClick={() => handleTabChange('SECURITY')} />
          </nav>
        </GlassCard>

        <div id="tour-architect" className="hidden md:block">
          <button
            onClick={handleOpenArchitectChat}
            className="w-full text-left group cursor-pointer relative block"
            style={{ pointerEvents: 'auto' }}
          >
            <GlassCard className="p-0 overflow-hidden hover:border-cyan-400/50 transition-colors">
              <div className="p-4 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase">Your Architect</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-slate-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">Julius Sanders</div>
                    <div className="text-[10px] text-slate-500">Lead Strategist</div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-cyan-500/10 text-center">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  Message Direct <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </GlassCard>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col gap-6 relative min-w-0">

        {/* TOP BAR: GLOBAL ROI & NAVIGATOR */}
        <header
          id="tour-roi"
          className={`flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-md relative ${getHighlightClass('tour-roi')}`}
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-2">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Business Command</h1>
              <p className="text-xs md:text-sm text-slate-400">Money saved for you</p>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-4xl font-mono font-bold text-cyan-400 tabular-nums tracking-tight">
                ${globalROI.toLocaleString()}
              </div>
              <div className="text-[10px] md:text-xs font-bold text-green-500 uppercase tracking-widest flex items-center justify-end gap-1">
                <Activity className="w-3 h-3" /> Live Ticker
              </div>
            </div>
          </div>

          <div id="tour-navigator" className={`flex flex-col xl:flex-row gap-6 rounded-xl transition-all duration-300 ${getHighlightClass('tour-navigator')}`}>
            <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl overflow-x-auto scrollbar-hide border border-white/5 shrink-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`
                    px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap
                    ${activeCategory === cat.id
                      ? 'bg-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="h-px w-full xl:h-auto xl:w-px bg-white/10" />

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {Object.values(INDUSTRY_DATA)
                .filter(d => d.category === activeCategory)
                .map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setActiveIndustry(d.id)}
                    className={`
                      px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border
                      ${activeIndustry === d.id
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,242,255,0.2)]'
                        : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:border-white/10'}
                    `}
                  >
                    <d.icon className="w-3 h-3" />
                    {d.label}
                  </button>
                ))}
            </div>
          </div>
        </header>

        {/* DYNAMIC MODULE VIEW */}
        <div className="flex-1 min-h-[500px]">
          <AnimatePresence mode='wait'>

            {activeTab === 'OPERATIONS' && (
              <motion.div
                key="operations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`relative rounded-2xl ${getHighlightClass('tour-operations')}`}
                id="tour-operations"
              >
                <OperationsHub data={currentData} />
              </motion.div>
            )}

            {activeTab === 'AUTOMATION' && (
              <motion.div
                key="automation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="tour-automation"
                className={getHighlightClass('tour-automation')}
              >
                <AutomationLab bots={currentData.bots} />
              </motion.div>
            )}

            {activeTab === 'NETWORK' && (
              <motion.div
                key="network"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SynapseNetwork />
              </motion.div>
            )}

            {activeTab === 'SECURITY' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="tour-security"
                className={getHighlightClass('tour-security')}
              >
                <SecurityVault />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* PERSISTENT ATLAS ORB */}
      {createPortal(
        <div id="orb-trigger" className={`fixed bottom-6 left-6 z-[80] transition-all duration-300 ${isTourActive ? 'scale-125 opacity-100' : 'scale-100 opacity-80 hover:opacity-100'}`}>
          <button
            onClick={startTour}
            className="relative group w-12 h-12 md:w-16 md:h-16 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-50 group-hover:opacity-80 animate-pulse" />
            <div className="absolute inset-2 bg-gradient-to-tr from-cyan-500 to-white rounded-full shadow-[0_0_30px_rgba(0,242,255,0.6)]" />
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-slate-900 relative z-10 animate-spin" />

            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 border border-cyan-400/30 rounded text-xs text-cyan-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
              Initialize Atlas Guide
            </div>
          </button>
        </div>,
        document.body
      )}

      {/* ATLAS AI ASSISTANT OVERLAY (GUIDED TOUR) */}
      {createPortal(
        <AnimatePresence>
          {isTourActive && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:bottom-32 z-[90] w-auto md:w-[400px] mx-auto md:mx-0"
            >
              <div className="relative bg-slate-900/95 backdrop-blur-xl border border-cyan-400/50 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] max-h-[80vh] overflow-y-auto">

                <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5 sticky top-0 backdrop-blur-md z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Sparkles className="w-5 h-5 text-cyan-400 relative z-10" />
                      <div className="absolute inset-0 bg-cyan-400 blur-sm opacity-50 animate-pulse" />
                    </div>
                    <span className="text-sm font-bold text-white uppercase tracking-widest">Atlas Assistant</span>
                  </div>
                  <button onClick={skipTour} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded uppercase">
                      Step {tourStepIndex + 1}/{TOURS[currentScenario].length}
                    </span>
                    <h4 className="text-white font-bold text-lg">{currentTourStep.title}</h4>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-8">
                    {currentTourStep.message}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button
                      onClick={skipTour}
                      className="text-xs text-slate-500 hover:text-white font-medium px-2"
                    >
                      Close Guide
                    </button>
                    <button
                      onClick={nextTourStep}
                      className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                    >
                      {tourStepIndex === TOURS[currentScenario].length - 1 ? 'Complete' : 'Next Step'}
                      {tourStepIndex !== TOURS[currentScenario].length - 1 && <ArrowRight className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                  <motion.div
                    className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(0,242,255,0.5)]"
                    animate={{
                      width: `${((tourStepIndex + 1) / TOURS[currentScenario].length) * 100}%`
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ARCHITECT CHAT DRAWER */}
      {createPortal(
        <AnimatePresence>
          {architectChatOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setArchitectChatOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              />

              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[100] flex flex-col"
              >
                <div className="p-4 bg-slate-900 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <div className="w-full h-full rounded-full bg-cyan-900 flex items-center justify-center font-bold border border-cyan-400/50 text-cyan-400">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Julius Sanders</h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono uppercase tracking-wider">
                        <Briefcase className="w-3 h-3" /> Lead Strategist
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setArchitectChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50">
                  {architectMessages.map((msg, i) => (
                    <div key={i} className={`flex ${i === 0 ? 'justify-center' : i % 2 !== 0 ? 'justify-end' : 'justify-start'}`}>
                      {i === 0 ? (
                        <span className="text-[10px] text-slate-600 font-mono bg-white/5 px-3 py-1 rounded-full text-center border border-white/5">{msg}</span>
                      ) : (
                        <div className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                          i % 2 !== 0
                            ? 'bg-cyan-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 rounded-bl-none'
                        }`}>
                          {msg}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendArchitectMessage} className="p-4 bg-slate-900 border-t border-white/10">
                  <div className="relative">
                    <input
                      type="text"
                      value={architectMsgInput}
                      onChange={(e) => setArchitectMsgInput(e.target.value)}
                      placeholder="Message direct line..."
                      className="w-full bg-black border border-white/10 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <button type="submit" className="absolute right-2 top-2 p-1.5 bg-cyan-400 rounded text-slate-900 hover:bg-white transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}
