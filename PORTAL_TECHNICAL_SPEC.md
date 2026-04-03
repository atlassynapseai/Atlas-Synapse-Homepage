# Atlas Synapse Portal - Complete Technical Specification

## Overview
The Portal is a React + TypeScript SPA built with Next.js using Tailwind CSS for styling and Framer Motion (optional) for advanced animations. It features a command center dashboard with KPI tracking, network visualization, daily wins logging, and an interactive chatbot.

---

## 1. DOM STRUCTURE & LAYOUT

### Root Container
```
<div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
  [Sidebar]
  [Main Content Wrapper - flex flex-col]
    [KPI Dashboard]
    [Network Graph + Opportunities]
    [Daily Wins Log]
  [ChatBot]
</div>
```

### 1.1 Sidebar (Left Navigation)
- **Position**: `fixed left-0 top-16` (fixed positioning)
- **Width**: `w-56` (224px)
- **Height**: `h-[calc(100vh-4rem)]` (full height minus navbar)
- **Background**: `bg-slate-900/40 backdrop-blur` (glassmorphism)
- **Border**: `border-r border-white/10`
- **Padding**: `p-6`

#### Contents (top to bottom):
1. **Brand Section** (mb-8)
   - Background: `bg-atlas-primary/10` rounded-lg p-4
   - Title: "Business Command" (text-2xl font-bold text-atlas-primary)
   - Subtitle: "System Online" (text-xs text-slate-400)

2. **Home Base Button** (mb-6, full width)
   - Background: `bg-atlas-cyan` (cyan #06b6d4)
   - Text: `text-slate-900 font-semibold py-3 px-4`
   - Hover: `shadow-lg shadow-atlas-cyan/50`
   - Active: `scale-95` (pressed state)

3. **Navigation Items** (nav, mb-auto, space-y-3)
   - Icons + Labels: 🌐 Network, 🔒 Vault, 💼 Workroom
   - Padding: `px-4 py-2.5`
   - Hover: `bg-white/5 text-white`

4. **User Profile Section** (border-t border-white/10, pt-4)
   - Background: `bg-atlas-blue/10`
   - User avatar: `h-10 w-10 rounded-full bg-atlas-primary/30`
   - Name: "Julius Sanders", Role: "Lead Strategist"
   - CTA: "MESSAGE DIRECT →" (text-atlas-cyan hover:text-atlas-secondary)

### 1.2 Top Navbar (Header)
- **Position**: `fixed inset-x-0 top-0 z-50 min-h-[4rem]`
- **Classes**: `border-b transition-all duration-300 overflow-hidden border-transparent bg-transparent`
- **Content Container**: `mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 py-0`

#### Navbar Items:
1. **Logo/Brand** (left)
   - Rounded pill: `rounded-full bg-atlas-soft/80 pl-2 pr-4 ring-1 ring-white/8`
   - Icon + Text: Logo image (h-8/w-8) + "Atlas Synapse" (hidden on mobile, sm:block)

2. **Navigation Links** (center, hidden on mobile, md:flex)
   - Links: "About Us", "Risks", "Solutions", "Contact"
   - Style: `text-slate-300 hover:text-white text-sm font-medium`

3. **Action Buttons** (right)
   - "Request Demo" button (hidden on sm, sm:inline-flex)
   - Menu toggle (md:hidden)

### 1.3 Main Content Area
- **Margin**: `ml-56` (pushed right by sidebar)
- **Layout**: `flex flex-col space-y-6`
- **Padding**: `pt-20 px-8 pb-8` (top padding accounts for navbar)

---

## 2. KPI DASHBOARD SECTION

### 2.1 Header Card
- **Container**: `rounded-xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm`
- **Layout**: `flex items-end justify-between mb-6`

#### Left Side (Title Area):
```
h2: "Business Command" (text-2xl font-bold text-white)
p: "Money saved for you" (text-slate-400)
```

#### Right Side (Ticker):
```
p: "$14.3M" (text-4xl font-bold text-atlas-cyan)
p: "📈 LIVE TICKER" (text-xs text-atlas-cyan font-semibold tracking-wider)
```

**Ticker Logic**:
- Initial value: `$14,250,973` (LIVE_TICKER_START)
- Increments every 2000ms with random value: `Math.floor(Math.random() * 50) + 10` (10-60)
- Displays as: `$(value / 1000000).toFixed(1)M`
- State: `[tickerValue, setTickerValue]` with useEffect

### 2.2 Category Filter Buttons
- **Container**: `flex flex-wrap gap-2`
- **Categories**: "Corporate", "Infrastructure", "Services", "Lifestyle", "Private Equity", "Legal Firm", "Landscaping", "HVAC & Plumbing"

**Button States**:
- **Selected**: `bg-atlas-cyan text-slate-900 shadow-lg shadow-atlas-cyan/50`
- **Unselected**: `border border-white/10 bg-slate-800/60 text-slate-300 hover:border-white/30`
- **Styling**: `rounded-full px-4 py-2 text-sm font-medium transition-all`

**Logic**:
```typescript
const toggleCategory = (category: string) => {
  setSelectedCategories((prev) =>
    prev.includes(category)
      ? prev.filter((c) => c !== category)
      : [...prev, category]
  )
}
```

### 2.3 KPI Cards Grid
- **Layout**: `grid gap-6 md:grid-cols-3` (3 cards per row on md+)
- **Rotation**: Every 8 seconds, display next 3 cards from pool
- **Total Cards**: 9 cards available (rotates through all)

#### Card Structure (KPICard Component)
```
Container: rounded-xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm
Hover: border-atlas-primary/50 shadow-lg shadow-atlas-primary/20
```

**Card Layout** (vertical):
1. **Icon + Badge** (mb-4, flex justify-between)
   - Icon: emoji (text-3xl)
   - Badge: `inline-block rounded-full bg-atlas-cyan/20 px-2.5 py-0.5 text-xs font-semibold text-atlas-cyan`

2. **Value** (mb-1, text-4xl font-bold text-white)
   - e.g., "$12,000", "30 hrs/wk", "+$8k"

3. **Title** (mb-3, text-xs font-semibold uppercase tracking-wider text-slate-400)
   - e.g., "FUEL SAVINGS", "HOURS WON BACK"

4. **Tagline** (text-sm italic text-slate-500)
   - e.g., '"Less driving, more mowing"'

#### Mock Data (9 cards total):
| ID | Title | Value | Icon | Badge | Tagline |
|---|---|---|---|---|---|
| 1 | FUEL SAVINGS | $12,000 | ✈️ | Route Density | "Less driving, more mowing" |
| 2 | HOURS WON BACK | 30 hrs/wk | ⏱️ | Admin Time | "Your weekends are back" |
| 3 | CLIENT UPSELLS | +$8k | 📊 | Auto-SMS | "New work sold automatically" |
| 4 | RECAPTURED BILLING | $320,000 | 📈 | Q1 Savings | "Revenue found in lost invoices" |
| 5 | WORKFLOW SPEED | +18% | ⚡ | Efficiency | "Deals closing faster" |
| 6 | RISK FLAGS | 0 | 🛡️ | Secure | "Audit-ready 24/7" |
| 7 | TECHNICIAN UTIL | 92% | 👤 | Billable | "Techs are earning, not waiting" |
| 8 | PARTS ORDERED | Auto | 🔧 | Just-in-Time | "Inventory manages itself" |
| 9 | CALL ANSWER RATE | 100% | 📞 | AI Voice | "We answer while you sleep" |

---

## 3. NETWORK GRAPH & OPPORTUNITIES SECTION

### 3.1 Layout
- **Container**: `grid gap-6 md:grid-cols-2`
- **Left (60%)**: Network graph SVG
- **Right (40%)**: Opportunity cards (stacked)

### 3.2 Network Graph (SVG)
- **Container**: `rounded-xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm`
- **SVG Dimensions**: `viewBox="0 0 400 300"` (responsive with w-full h-64)
- **Background**: `bg-slate-800/20 rounded-lg`

#### SVG Elements:
**Lines (Edges)** - 6 connecting lines from center hub:
- `stroke="rgba(6, 182, 212, 0.3)"` (cyan with 30% opacity)
- `strokeWidth="2"`
- Connects: (200,150) center → 6 outer nodes

**Nodes (Circles)** - 7 nodes total:
- **Center Hub**: `cx="200" cy="150" r="20" fill="#06b6d4" opacity="0.8"` + `animate-pulse`
  - Label: "HUB" (text anchor middle, fontSize 10, white, bold)
- **6 Outer Nodes**: Various positions with decreasing size
  - Opacity: 0.5-0.6
  - All have `animate-pulse` class
  - No text labels on outer nodes

**Node Positions**:
- (200, 150) - Center, r=20
- (80, 60) - Top-left, r=15
- (320, 60) - Top-right, r=15
- (200, 30) - Top, r=12
- (80, 240) - Bottom-left, r=14
- (320, 240) - Bottom-right, r=14
- (200, 270) - Bottom, r=12

### 3.3 SVG Filters (in Defs)
```xml
<filter id="edge-blur">
  <feGaussianBlur stdDeviation="0.8" />
  <feMerge>
    <feMergeNode in="blur" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>

<filter id="node-glow">
  <feGaussianBlur stdDeviation="1.5" />
  <feMerge>
    <feMergeNode in="blur" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>
```

### 3.4 Missed Opportunity Card
- **Container**: `rounded-xl border border-white/10 bg-red-900/20 p-6 backdrop-blur-sm border-red-500/30`
- **Layout**: Vertical stack

**Sections**:
1. **Header** (mb-3, flex justify-between)
   - Title: "MISSED OPPORTUNITY" (text-xs font-bold uppercase tracking-wider text-red-400)
   - Icon: "⚠️" (text-lg)

2. **Problem** (text-sm text-slate-300 mb-4)
   - Text: "Time lost scheduling crews"

3. **Impact** (border-t border-red-500/20 pt-3, flex justify-between)
   - Label: "Impact" (text-xs text-slate-400)
   - Value: "15 hrs/wk" (text-2xl font-bold text-red-400)

4. **Arrow** (text-center, mt-3, text-2xl)
   - Symbol: "↓"

### 3.5 Atlas Correction Card
- **Container**: `rounded-xl border border-white/10 bg-green-900/20 p-6 backdrop-blur-sm border-green-500/30`
- **Similar layout to Missed Opportunity**

**Sections**:
1. **Header**
   - Title: "ATLAS CORRECTION" (text-xs font-bold uppercase text-green-400)
   - Icon: "✓" (text-lg)

2. **Solution** (text-sm text-slate-300 mb-4)
   - Text: "Auto-scheduling speed"

3. **Impact** (border-t border-green-500/20 pt-3)
   - Label: "Speed" (text-xs text-slate-400)
   - Value: "Instant" (text-2xl font-bold text-green-400)

---

## 4. DAILY WINS LOG SECTION

### 4.1 Container
- **Positioning**: `ml-56 px-8 pb-8`
- **Card**: `rounded-xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm`

### 4.2 Header
- **Title**: "Daily Wins Log" (text-lg font-semibold text-white)
- **Margin**: `mb-4`

### 4.3 Wins List
- **Container**: `space-y-3 max-h-48 overflow-y-auto custom-scrollbar`
- **Height**: Fixed at 48 units (192px), scrollable
- **Custom Scrollbar**: Defined in globals.css with cyan hover states

#### Win Item Structure:
```
<div className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
  <div className="mt-1 h-2 w-2 rounded-full bg-atlas-cyan flex-shrink-0" />
  <div className="flex-1 min-w-0">
    <p className="text-sm text-slate-300">{win.title}</p>
    <p className="text-xs text-slate-500 mt-1">{win.time}</p>
  </div>
</div>
```

#### Mock Data (4 entries):
| ID | Title | Time |
|---|---|---|
| 1 | Route A-12 optimized for weather conditions. | 14:00 PM |
| 2 | Route A-12 optimized for weather conditions. | 14:01 PM |
| 3 | Route A-12 optimized for weather conditions. | 14:02 PM |
| 4 | Route A-12 optimized for weather conditions. | 14:03 PM |

---

## 5. CHATBOT SECTION

### 5.1 Floating Button
- **Position**: `fixed bottom-8 right-8 z-50`
- **Dimensions**: `h-16 w-16`
- **Background**: `bg-gradient-to-br from-atlas-cyan to-atlas-primary shadow-lg shadow-atlas-cyan/50`
- **Content**: "💬" (text-xl font-bold text-white)
- **Hover**: `hover:scale-110`
- **States**:
  - When closed: `opacity-100`
  - When open: `opacity-0 pointer-events-none`

### 5.2 Chat Panel
- **Position**: `fixed bottom-8 right-8 z-50`
- **Dimensions**: `w-96 h-[600px]`
- **Background**: `bg-slate-900/95 backdrop-blur-lg`
- **Border**: `rounded-2xl border border-white/10`
- **Shadow**: `shadow-2xl shadow-atlas-cyan/20`
- **Animation**: `animate-slide-up`
- **Layout**: `flex flex-col`

### 5.3 Chat Header
- **Border**: `border-b border-white/10`
- **Padding**: `p-4`
- **Layout**: `flex items-center justify-between`

**Left Section**:
- Title: "Atlas Architect" (text-lg font-bold text-white)
- Status: "🟢 ONLINE" (text-xs text-atlas-cyan)

**Right Section**:
- Close button: "✕" (text-slate-400 hover:text-white)

### 5.4 Messages Container
- **Height**: `flex-1 overflow-y-auto`
- **Padding**: `p-4`
- **Gap**: `space-y-4`
- **Scrollbar**: `custom-scrollbar`

#### Message Bubble:
```
<div className="rounded-lg bg-slate-800/60 p-3 max-w-xs">
  <p className="text-sm text-slate-100">{message.text}</p>
  <p className="text-xs text-slate-500 mt-2">{timestamp}</p>
</div>
```

**First Message (Bot)**:
```
"Welcome to the Synapse. I am Atlas. I'm here to help you navigate our
architecture. To point you in the right direction, what industry are
you currently leading?"
```

### 5.5 Quick Options Section
- **Padding**: `px-4 py-3`
- **Label**: "Quick select:" (text-xs text-slate-400 mb-2)
- **Container**: `flex flex-wrap gap-2`

**Quick Option Buttons**:
- "Law Firm", "Field Services", "Retail/Lifestyle", "Logistic"
- Style: `rounded-full border border-atlas-cyan/50 bg-atlas-cyan/10 px-3 py-1 text-xs text-atlas-cyan`
- Hover: `hover:bg-atlas-cyan/20`

**Click Logic**:
```typescript
const handleQuickSelect = (option: string) => {
  setInputValue(option)
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
```

### 5.6 Input Section
- **Border**: `border-t border-white/10`
- **Padding**: `p-4`
- **Layout**: `flex gap-2`

**Text Input**:
- Style: `flex-1 rounded-lg bg-slate-800/60 border border-white/10 px-4 py-2.5 text-sm text-white`
- Placeholder: "Type your response..."
- Focus: `focus:border-atlas-cyan/50`
- Placeholder color: `placeholder-slate-500`

**Send Button**:
- Style: `rounded-lg bg-atlas-cyan text-slate-900 px-4 py-2.5 font-semibold`
- Content: "→"
- Hover: `hover:shadow-lg hover:shadow-atlas-cyan/50`
- Active: `active:scale-95`
- Trigger: `onClick={handleSend}` or `onKeyPress: Enter`

---

## 6. CSS & STYLING GUIDE

### 6.1 Design Tokens (Tailwind Config)

#### Colors:
```javascript
'atlas-bg': '#050816',
'atlas-surface': '#050b18',
'atlas-elevated': '#0b1020',
'atlas-border': 'rgba(148, 163, 184, 0.35)',
'atlas-soft': 'rgba(15,23,42,0.8)',
'atlas-primary': '#a855f7',     // Purple
'atlas-primary-soft': 'rgba(168, 85, 247, 0.35)',
'atlas-secondary': '#38bdf8',   // Sky blue
'atlas-cyan': '#06b6d4',        // Cyan (used for highlights)
'atlas-accent': '#e5e7eb',
'atlas-danger': '#f97373',      // Red
'atlas-success': '#34d399',     // Green
```

#### Border Radius:
```javascript
'atlas-sm': '0.5rem',   // 8px
'atlas-md': '0.75rem',  // 12px
'atlas-lg': '1rem',     // 16px
'atlas-xl': '1.25rem',  // 20px
'atlas-2xl': '1.5rem',  // 24px
```

#### Box Shadows:
```javascript
'atlas-soft': '0 18px 45px rgba(15,23,42,0.85)',
'atlas-glow': '0 0 40px rgba(168,85,247,0.4)',
'atlas-glow-sm': '0 0 20px rgba(168,85,247,0.3)',
'atlas-border-glow': '0 0 0 1px rgba(148,163,184,0.4)',
```

### 6.2 Global CSS Classes

#### Glassmorphism
```css
.glass-panel {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.glass {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}
```

#### Custom Scrollbar
```css
/* Applied to .custom-scrollbar elements */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.3);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.6);
}
```

#### Sheen Button (overlay effect)
```css
.sheen-button::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.26) 35%, transparent 70%);
  transform: translateX(-120%);
}

.sheen-button:hover::after {
  transition: transform 600ms ease-out;
  transform: translateX(120%);
}
```

### 6.3 Responsive Breakpoints
- **sm**: 640px
- **md**: 768px (main breakpoint for dashboard layout)
- **lg**: 1024px
- **xl**: 1280px

**Key Responsive Classes**:
- KPI dashboard: `ml-56` always applies (sidebar always visible)
- Nav items: `hidden flex-1 items-center justify-center gap-0.5 md:flex`
- Sidebar: Always visible, fixed width `w-56`

---

## 7. ANIMATIONS & TRANSITIONS

### 7.1 Keyframe Animations

#### Pulse (Network Nodes)
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.85; }
}
.animate-pulse { animation: pulse 3s ease-in-out infinite; }
```

#### Gradient Shift (Body Background)
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
body {
  animation: gradientShift 15s ease infinite;
  background-size: 400% 400%;
}
```

#### Slide Up (Chat Panel)
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up { animation: slideUp 0.6s ease-out; }
```

#### Fade In Up (General elements)
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.9s ease-out forwards; }
```

### 7.2 Transition Properties

#### KPI Card Hover
```css
.rounded-xl {
  transition: all duration-300;
}
.hover:border-atlas-primary/50
.hover:shadow-lg.shadow-atlas-primary/20
```

#### Category Buttons
```css
button {
  transition: all (included in Tailwind)
}
/* Smooth color transitions when toggled */
```

#### Chat Panel Button
```css
button {
  transition: all hover:scale-110
}
```

---

## 8. MOCK DATA REFERENCE

### All Mock Data Structure

```typescript
export const MOCK_KPI_CARDS = [/* 9 cards as listed above */]
export const BUSINESS_CATEGORIES = [/* 8 categories */]
export const NETWORK_NODES = [/* 7 nodes with x, y, size, label */]
export const DAILY_WINS = [/* 4 win entries */]
export const OPPORTUNITY_MISSED = {
  title: 'MISSED OPPORTUNITY',
  problem: 'Time lost scheduling crews',
  impact: '15 hrs/wk'
}
export const OPPORTUNITY_CORRECTION = {
  title: 'ATLAS CORRECTION',
  solution: 'Auto-scheduling speed',
  impact: 'Instant'
}
export const CHATBOT_MESSAGES = [/* Initial bot message */]
export const CHATBOT_QUICK_OPTIONS = ['Law Firm', 'Field Services', 'Retail/Lifestyle', 'Logistic']
export const LIVE_TICKER_START = 14_250_973
```

---

## 9. STATE MANAGEMENT & LOGIC

### 9.1 KPI Dashboard State
```typescript
const [selectedCategories, setSelectedCategories] = useState<string[]>(['Services'])
const [displayedCards, setDisplayedCards] = useState(MOCK_KPI_CARDS.slice(0, 3))
const [tickerValue, setTickerValue] = useState(LIVE_TICKER_START)
const [cardRotationIndex, setCardRotationIndex] = useState(0)
```

**Ticker Effect** (2000ms interval):
```typescript
useEffect(() => {
  const tickerInterval = setInterval(() => {
    setTickerValue((prev) => {
      const increment = Math.floor(Math.random() * 50) + 10 // 10-60
      return prev + increment
    })
  }, 2000)
  return () => clearInterval(tickerInterval)
}, [])
```

**Card Rotation Effect** (8000ms interval):
```typescript
useEffect(() => {
  const rotationInterval = setInterval(() => {
    setCardRotationIndex((prev) => {
      const nextIndex = prev + 3
      if (nextIndex >= MOCK_KPI_CARDS.length) return 0
      return nextIndex
    })
  }, 8000)
  return () => clearInterval(rotationInterval)
}, [])

// Update displayed cards when rotation index changes
useEffect(() => {
  const newCards = []
  for (let i = 0; i < 3; i++) {
    const index = (cardRotationIndex + i) % MOCK_KPI_CARDS.length
    newCards.push(MOCK_KPI_CARDS[index])
  }
  setDisplayedCards(newCards)
}, [cardRotationIndex])
```

### 9.2 ChatBot State
```typescript
interface Message {
  id: number
  sender: 'user' | 'bot'
  text: string
  timestamp: Date
}

const [messages, setMessages] = useState<Message>(CHATBOT_MESSAGES[0])
const [isOpen, setIsOpen] = useState(false)
const [inputValue, setInputValue] = useState('')
const messagesEndRef = useRef<HTMLDivElement>(null)
```

**Handle Send**:
```typescript
const handleSend = () => {
  if (!inputValue.trim()) return

  const userMsg: Message = {
    id: Date.now(),
    sender: 'user',
    text: inputValue,
    timestamp: new Date(),
  }
  setMessages(userMsg)

  // Simulate bot response after 1s
  setTimeout(() => {
    const botMsg: Message = {
      id: Date.now() + 1,
      sender: 'bot',
      text: 'I understand. Let me process that...',
      timestamp: new Date(),
    }
    setMessages(botMsg)
  }, 1000)

  setInputValue('')
}
```

**Auto-scroll to bottom**:
```typescript
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])
```

---

## 10. REBUILD CHECKLIST FOR REACT + TYPESCRIPT

### Architecture Overview:
```
src/
  components/portal/
    ├── Portal.tsx (main wrapper, combines all)
    ├── Sidebar.tsx (fixed left nav)
    ├── KPIDashboard.tsx (top section with ticker & cards)
    ├── KPICard.tsx (individual card)
    ├── NetworkGraph.tsx (SVG graph + opportunity cards)
    ├── DailyWinsLog.tsx (scrollable wins list)
    ├── ChatBot.tsx (floating button + modal)
    └── mockData.ts (all static data)
  hooks/
    ├── usePulseAnimation.ts (optional, for node pulse)
    └── useScrollToBottom.ts (for chat auto-scroll)
  styles/
    ├── globals.css (all animations, gradients, glassmorphism)
    └── (Tailwind configured in tailwind.config.js)
  lib/
    └── auth-context.ts (useAuth hook for user info)
```

### Key Implementation Tasks:

#### 1. **Component Structure**
- [ ] Create Portal wrapper component with min-h-screen gradient background
- [ ] Build Sidebar with fixed positioning and navigation items
- [ ] Implement KPIDashboard with ticker and category filters
- [ ] Create KPICard sub-component with hover effects
- [ ] Build NetworkGraph with inline SVG
- [ ] Create DailyWinsLog with scrollable container
- [ ] Build ChatBot with floating button and modal panel

#### 2. **State Management**
- [ ] Implement ticker increment logic (useEffect + setInterval)
- [ ] Implement card rotation logic (8s interval)
- [ ] Implement category toggle logic
- [ ] Implement chatbot message state and scroll behavior
- [ ] Connect to useAuth hook for user profile

#### 3. **Styling**
- [ ] Apply Tailwind utilities throughout (all classes used above)
- [ ] Implement custom animations in globals.css
- [ ] Create glassmorphism effect utilities
- [ ] Style custom scrollbar
- [ ] Implement gradient background on body
- [ ] Add hover/active states for all interactive elements

#### 4. **Animations**
- [ ] Network node pulse animation
- [ ] Ticker value increments (visual smooth number update)
- [ ] Card rotation transitions
- [ ] Chat panel slide-up animation
- [ ] Button hover scale effects
- [ ] Gradient shift background

#### 5. **Responsive Design**
- [ ] Sidebar always visible (no collapse on mobile in spec)
- [ ] KPI cards responsive: 1 col mobile, 3 cols on md+
- [ ] Network graph responsive viewport
- [ ] Chat panel fixed on right side
- [ ] Test on 640px, 768px, 1024px, 1280px breakpoints

#### 6. **Data & Mock**
- [ ] Create mockData.ts with all card/node/message data
- [ ] Ensure all values, icons, badges match original
- [ ] Create types for KPICard, Message, DailyWin, etc.

#### 7. **Testing & Polish**
- [ ] Test ticker increments correctly every 2s
- [ ] Test card rotation every 8s
- [ ] Test category filter toggle and UI update
- [ ] Test chatbot message sending and quick options
- [ ] Test scroll behavior in Daily Wins Log
- [ ] Test animations smooth and performant
- [ ] Test keyboard interaction (Enter to send message)
- [ ] Test hover states on all interactive elements

---

## 11. TECHNICAL DEPENDENCIES

### Required Libraries:
- **React 19.2.3+** - UI framework
- **React DOM 19.2.3+** - React rendering
- **React Router 7.13.0+** - SPA routing (for Portal route)
- **TypeScript** - Type safety
- **Tailwind CSS 3+** - Utility-first CSS
- **Next.js** - App framework
- **Framer Motion 12.29.0+** (optional) - Advanced animations if needed

### Optional but Recommended:
- **Lucide React 0.563.0+** - Icon library (currently using emoji)
- **Google GenAI SDK** - For future chatbot AI integration

---

## 12. PERFORMANCE CONSIDERATIONS

1. **Ticker Updates**: 2s interval with random increment (10-60) - minimal DOM updates
2. **Card Rotation**: 8s interval, DOM updates only when rotation happens
3. **SVG Optimization**: Keep node count to 7, use CSS animate-pulse instead of JavaScript
4. **Custom Scrollbar**: Only on Daily Wins Log, limited to visible area
5. **Chat Messages**: Single message state (not array) - ensure memory efficient
6. **Animations**: Use CSS animations where possible, avoid JavaScript animations
7. **Glassmorphism**: Backdrop blur 20-25px, monitor GPU usage on lower-end devices

---

## 13. ACCESSIBILITY NOTES

- [ ] Add ARIA labels to interactive elements (buttons, nav)
- [ ] Ensure color contrast meets WCAG AA standards
- [ ] Add focus states to all buttons (outline-blue-500)
- [ ] Test keyboard navigation (Tab, Enter)
- [ ] Add alt text to SVG elements
- [ ] Ensure chat input has associated label
- [ ] Test with screen readers (sidebar nav, chat flow)
- [ ] Respect prefers-reduced-motion setting (animations can be disabled)

---

## 14. FUTURE ENHANCEMENTS

1. **Real-time Data**: Replace ticker with WebSocket connection
2. **AI Chatbot**: Integrate Google GenAI for intelligent responses
3. **Real Network Graph**: Dynamic nodes based on actual business data
4. **Export/Report**: Add ability to download KPI reports
5. **Dark/Light Mode Toggle**: Already supports dark, add light mode option
6. **Mobile Sidebar**: Collapse/expand on mobile
7. **Multi-language**: i18n for international users
8. **Analytics**: Track dashboard interactions
9. **Saved Views**: User preference for category filters
10. **Push Notifications**: For daily wins and alerts

---

**Document Version**: 1.0
**Last Updated**: 2026-04-03
**Component Location**: `/components/portal/`
