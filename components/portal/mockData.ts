// Mock data for Portal dashboard — all static/demo
export const MOCK_KPI_CARDS = [
  {
    id: 1,
    title: 'FUEL SAVINGS',
    value: '$12,000',
    icon: '✈️',
    badge: 'Route Density',
    tagline: '"Less driving, more mowing"',
    trend: 'up',
  },
  {
    id: 2,
    title: 'HOURS WON BACK',
    value: '30 hrs/wk',
    icon: '⏱️',
    badge: 'Admin Time',
    tagline: '"Your weekends are back"',
    trend: 'up',
  },
  {
    id: 3,
    title: 'CLIENT UPSELLS',
    value: '+$8k',
    icon: '📊',
    badge: 'Auto-SMS',
    tagline: '"New work sold automatically"',
    trend: 'up',
  },
  {
    id: 4,
    title: 'RECAPTURED BILLING',
    value: '$320,000',
    icon: '📈',
    badge: 'Q1 Savings',
    tagline: '"Revenue found in lost invoices"',
    trend: 'up',
  },
  {
    id: 5,
    title: 'WORKFLOW SPEED',
    value: '+18%',
    icon: '⚡',
    badge: 'Efficiency',
    tagline: '"Deals closing faster"',
    trend: 'up',
  },
  {
    id: 6,
    title: 'RISK FLAGS',
    value: '0',
    icon: '🛡️',
    badge: 'Secure',
    tagline: '"Audit-ready 24/7"',
    trend: 'up',
  },
  {
    id: 7,
    title: 'TECHNICIAN UTIL',
    value: '92%',
    icon: '👤',
    badge: 'Billable',
    tagline: '"Techs are earning, not waiting"',
    trend: 'up',
  },
  {
    id: 8,
    title: 'PARTS ORDERED',
    value: 'Auto',
    icon: '🔧',
    badge: 'Just-in-Time',
    tagline: '"Inventory manages itself"',
    trend: 'up',
  },
  {
    id: 9,
    title: 'CALL ANSWER RATE',
    value: '100%',
    icon: '📞',
    badge: 'AI Voice',
    tagline: '"We answer while you sleep"',
    trend: 'up',
  },
];

export const BUSINESS_CATEGORIES = [
  'Corporate',
  'Infrastructure',
  'Services',
  'Lifestyle',
  'Private Equity',
  'Legal Firm',
  'Landscaping',
  'HVAC & Plumbing',
];

export const NETWORK_NODES = [
  { id: 'hub-center', x: 50, y: 50, size: 40, label: 'Hub', type: 'center' },
  { id: 'node-1', x: 20, y: 20, size: 25, label: 'Active Mode', type: 'node' },
  { id: 'node-2', x: 80, y: 20, size: 22, label: 'Node', type: 'node' },
  { id: 'node-3', x: 50, y: 10, size: 20, label: 'Node', type: 'node' },
  { id: 'node-4', x: 20, y: 80, size: 24, label: 'Node', type: 'node' },
  { id: 'node-5', x: 80, y: 80, size: 23, label: 'Node', type: 'node' },
  { id: 'node-6', x: 50, y: 90, size: 21, label: 'Node', type: 'node' },
];

export const DAILY_WINS = [
  {
    id: 1,
    title: 'Route A-12 optimized for weather conditions.',
    time: '14:00 PM',
  },
  {
    id: 2,
    title: 'Route A-12 optimized for weather conditions.',
    time: '14:01 PM',
  },
  {
    id: 3,
    title: 'Route A-12 optimized for weather conditions.',
    time: '14:02 PM',
  },
  {
    id: 4,
    title: 'Route A-12 optimized for weather conditions.',
    time: '14:03 PM',
  },
];

export const OPPORTUNITY_MISSED = {
  title: 'MISSED OPPORTUNITY',
  problem: 'Time lost scheduling crews',
  impact: '15 hrs/wk',
};

export const OPPORTUNITY_CORRECTION = {
  title: 'ATLAS CORRECTION',
  solution: 'Auto-scheduling speed',
  impact: 'Instant',
};

export const CHATBOT_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Welcome to the Synapse. I am Atlas. I\'m here to help you navigate our architecture. To point you in the right direction, what industry are you currently leading?',
    timestamp: new Date(),
  },
];

export const CHATBOT_QUICK_OPTIONS = [
  'Law Firm',
  'Field Services',
  'Retail/Lifestyle',
  'Logistic',
];

export const LIVE_TICKER_START = 14_250_973;
export const LIVE_TICKER_INCREMENT = Math.floor(Math.random() * 50) + 10; // Random 10-60
