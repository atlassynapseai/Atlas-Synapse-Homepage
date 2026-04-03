// Portal Mock Data - All static data for the Portal section
// This mirrors Jude's site exactly

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const LIVE_TICKER_START = 14250973;

export const BUSINESS_CATEGORIES = [
  'Corporate',
  'Infrastructure',
  'Services',
  'Lifestyle',
  'Landscaping',
  'HVAC & Plumbing',
  'Private Equity',
  'Legal Firm',
];

export const KPI_CARDS = [
  {
    id: 'fuel-savings',
    icon: '✈️',
    label: 'FUEL SAVINGS',
    value: '$12,000',
    metric: 'Route Density',
    quote: '"Less driving, more mowing"',
  },
  {
    id: 'hours-won-back',
    icon: '⏱️',
    label: 'HOURS WON BACK',
    value: '30 hrs/wk',
    metric: 'Admin Time',
    quote: '"Your weekends are back"',
  },
  {
    id: 'client-upsells',
    icon: '📊',
    label: 'CLIENT UPSELLS',
    value: '+$8k',
    metric: 'Auto-SMS',
    quote: '"New work sold automatically"',
  },
  {
    id: 'billing-recovery',
    icon: '📈',
    label: 'RECAPTURED BILLING',
    value: '$320,000',
    metric: 'Q1 Savings',
    quote: '"Revenue found in lost invoices"',
  },
  {
    id: 'workflow-speed',
    icon: '⚡',
    label: 'WORKFLOW SPEED',
    value: '+18%',
    metric: 'Efficiency',
    quote: '"Deals closing faster"',
  },
  {
    id: 'risk-flags',
    icon: '🛡️',
    label: 'RISK FLAGS',
    value: '0',
    metric: 'Secure',
    quote: '"Audit-ready 24/7"',
  },
  {
    id: 'technician-util',
    icon: '👥',
    label: 'TECHNICIAN UTIL',
    value: '92%',
    metric: 'Billable',
    quote: '"Techs are earning, not waiting"',
  },
  {
    id: 'parts-ordered',
    icon: '🎯',
    label: 'PARTS ORDERED',
    value: 'Auto',
    metric: 'Just-in-Time',
    quote: '"Inventory manages itself"',
  },
  {
    id: 'call-answer-rate',
    icon: '📞',
    label: 'CALL ANSWER RATE',
    value: '100%',
    metric: 'AI Voice',
    quote: '"We answer while you sleep"',
  },
];

export const NETWORK_NODES = [
  { id: 1, x: 35, y: 20 },
  { id: 2, x: 65, y: 20 },
  { id: 3, x: 15, y: 55 },
  { id: 4, x: 50, y: 65 },
  { id: 5, x: 85, y: 55 },
  { id: 6, x: 35, y: 85 },
  { id: 7, x: 65, y: 85 },
];

export const NETWORK_CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [1, 4], [2, 3], [3, 4], [3, 5], [3, 6], [4, 5], [5, 6],
];

export const OPPORTUNITY_DATA = {
  missed: {
    title: 'MISSED OPPORTUNITY',
    problem: 'Time lost scheduling crews',
    metric: '15 hrs/wk',
  },
  correction: {
    title: 'ATLAS CORRECTION',
    solution: 'Auto-scheduling speed',
    metric: 'Instant',
  },
};

export const DAILY_WINS = [
  { id: 1, text: 'Route A-12 optimized for weather conditions.', time: '14:00 PM' },
  { id: 2, text: 'Route A-12 optimized for weather conditions.', time: '14:01 PM' },
  { id: 3, text: 'Route A-12 optimized for weather conditions.', time: '14:02 PM' },
  { id: 4, text: 'Route A-12 optimized for weather conditions.', time: '14:03 PM' },
];

export const CHATBOT_QUICK_OPTIONS = [
  'Law Firm',
  'Field Services',
  'Retail/Lifestyle',
  'Logistic',
];

export const CHATBOT_INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'Welcome to the Synapse. I am Atlas. I\'m here to help you navigate our architecture. To point you in the right direction, what industry are you currently leading?',
};
