import { 
  Building2, Hammer, Wrench, Store, 
  TrendingUp, BarChart3, Cpu, ShieldCheck, 
  Scale, Clock, FileCheck, Users, 
  Truck, Activity, Leaf, Navigation, 
  Box, Scissors, X, Dumbbell 
} from 'lucide-react';
import React from 'react';

// --- TYPES ---
export type IndustryCategory = 'CORPORATE' | 'INFRASTRUCTURE' | 'SERVICES' | 'LIFESTYLE';
export type IndustryType = 'FINANCE' | 'LAW' | 'LOGISTICS' | 'REAL_ESTATE' | 'LANDSCAPING' | 'HVAC' | 'BARBER' | 'FITNESS';
export type ModuleType = 'OPERATIONS' | 'NETWORK' | 'AUTOMATION' | 'SECURITY';
export type TourScenario = 'INTRO' | 'OPERATIONS' | 'NETWORK' | 'AUTOMATION' | 'SECURITY';

export interface IndustryContext {
  id: IndustryType;
  category: IndustryCategory;
  label: string;
  icon: React.ElementType;
  description: string;
  metrics: { label: string; value: string; trend: string; icon: React.ElementType; translation?: string }[];
  mirror?: { leakLabel: string; leakValue: string; recoveredLabel: string; recoveredValue: string };
  bots: { name: string; status: 'active' | 'learning' | 'idle'; efficiency: string }[];
}

export interface TourStep {
  targetId: string | null;
  tabSwitch?: ModuleType;
  title: string;
  message: string;
}

// --- CATEGORIES ---
export const CATEGORIES: {id: IndustryCategory, label: string, icon: any}[] = [
  { id: 'CORPORATE', label: 'Corporate', icon: Building2 },
  { id: 'INFRASTRUCTURE', label: 'Infrastructure', icon: Hammer }, 
  { id: 'SERVICES', label: 'Services', icon: Wrench },
  { id: 'LIFESTYLE', label: 'Lifestyle', icon: Store },
];

// --- INDUSTRY DATA ---
// Icon helper
function CalendarX(props: any) { return React.createElement(X, props); }

export const INDUSTRY_DATA: Record<IndustryType, IndustryContext> = {
  // --- CORPORATE ---
  FINANCE: {
    id: 'FINANCE',
    category: 'CORPORATE',
    label: 'Private Equity',
    icon: TrendingUp,
    description: "High-frequency risk modeling and compliance.",
    metrics: [
      { label: "Recaptured Billing", value: "$320,000", trend: "Q1 Savings", icon: BarChart3, translation: "Revenue found in lost invoices" },
      { label: "Workflow Speed", value: "+18%", trend: "Efficiency", icon: Cpu, translation: "Deals closing faster" },
      { label: "Risk Flags", value: "0", trend: "Secure", icon: ShieldCheck, translation: "Audit-ready 24/7" },
    ],
    mirror: {
      leakLabel: "Hours lost to manual compliance checks",
      leakValue: "45 hrs/mo",
      recoveredLabel: "Hours recovered for strategy",
      recoveredValue: "42 hrs/mo"
    },
    bots: [
      { name: "Compliance Sentry", status: "active", efficiency: "100%" },
      { name: "Deal Flow Scraper", status: "active", efficiency: "94.2%" },
    ],
  },
  LAW: {
    id: 'LAW',
    category: 'CORPORATE',
    label: 'Legal Firm',
    icon: Scale,
    description: "Automated discovery and case-flow management.",
    metrics: [
      { label: "Billable Hours Saved", value: "420 hrs", trend: "This Month", icon: Clock, translation: "Time freed for high-value counsel" },
      { label: "Doc Review Speed", value: "+300%", trend: "AI Enabled", icon: FileCheck, translation: "Discovery finished in minutes" },
      { label: "Client Response", value: "< 2min", trend: "Instant", icon: Users, translation: "No client left waiting" },
    ],
    mirror: {
      leakLabel: "Unbilled time on admin tasks",
      leakValue: "$12k/mo",
      recoveredLabel: "Revenue recaptured via automation",
      recoveredValue: "$11.5k/mo"
    },
    bots: [
      { name: "Discovery Engine", status: "active", efficiency: "99.5%" },
      { name: "Brief Generator", status: "learning", efficiency: "88.0%" },
    ],
  },
  
  // --- INFRASTRUCTURE ---
  LOGISTICS: {
    id: 'LOGISTICS',
    category: 'INFRASTRUCTURE',
    label: 'Logistics',
    icon: Truck,
    description: "Predictive routing and fleet optimization.",
    metrics: [
      { label: "Fuel Saved", value: "$14,500", trend: "Optimized", icon: TrendingUp, translation: "Direct profit increase" },
      { label: "On-Time Rate", value: "98.4%", trend: "Top 1%", icon: Activity, translation: "Customers are happier" },
      { label: "Fleet Uptime", value: "100%", trend: "Maintenance", icon: Truck, translation: "Trucks are moving, not stalling" },
    ],
    mirror: {
      leakLabel: "Fuel wasted on idling/bad routes",
      leakValue: "18%",
      recoveredLabel: "Route density improvement",
      recoveredValue: "16.5%"
    },
    bots: [
      { name: "Route Brain V4", status: "active", efficiency: "96.4%" },
      { name: "Load Balancer", status: "active", efficiency: "92.0%" },
    ],
  },
  REAL_ESTATE: {
    id: 'REAL_ESTATE',
    category: 'INFRASTRUCTURE',
    label: 'Real Estate',
    icon: Building2,
    description: "Tenant management and automated showing coordination.",
    metrics: [
      { label: "Occupancy Rate", value: "99%", trend: "Full", icon: Building2, translation: "No empty units" },
      { label: "Maintenance Cost", value: "-15%", trend: "Predicted", icon: Wrench, translation: "Fixing issues before they break" },
      { label: "Lead Response", value: "Instant", trend: "24/7", icon: Users, translation: "Capturing every renter" },
    ],
    mirror: {
      leakLabel: "Leads lost to slow response",
      leakValue: "40%",
      recoveredLabel: "Auto-booking conversion",
      recoveredValue: "95%"
    },
    bots: [
      { name: "Leasing Assistant", status: "active", efficiency: "97%" },
      { name: "Maintenance Dispatch", status: "active", efficiency: "92%" },
    ],
  },

  // --- SERVICES ---
  LANDSCAPING: {
    id: 'LANDSCAPING',
    category: 'SERVICES',
    label: 'Landscaping',
    icon: Leaf,
    description: "Crew scheduling and route density optimization.",
    metrics: [
      { label: "Fuel Savings", value: "$12,000", trend: "Route Density", icon: Navigation, translation: "Less driving, more mowing" },
      { label: "Hours Won Back", value: "30 hrs/wk", trend: "Admin Time", icon: Clock, translation: "Your weekends are back" },
      { label: "Client Upsells", value: "+$8k", trend: "Auto-SMS", icon: BarChart3, translation: "New work sold automatically" },
    ],
    mirror: {
      leakLabel: "Time lost scheduling crews",
      leakValue: "15 hrs/wk",
      recoveredLabel: "Auto-scheduling speed",
      recoveredValue: "Instant"
    },
    bots: [
      { name: "Smart Scheduler", status: "active", efficiency: "92%" },
      { name: "Seasonal Upsell Bot", status: "active", efficiency: "100%" },
    ],
  },
  HVAC: {
    id: 'HVAC',
    category: 'SERVICES',
    label: 'HVAC & Plumbing',
    icon: Wrench,
    description: "Technician dispatch and seasonal maintenance automation.",
    metrics: [
      { label: "Technician Util", value: "92%", trend: "Billable", icon: Users, translation: "Techs are earning, not waiting" },
      { label: "Parts Ordered", value: "Auto", trend: "Just-in-Time", icon: Box, translation: "Inventory manages itself" },
      { label: "Call Answer Rate", value: "100%", trend: "AI Voice", icon: Activity, translation: "We answer while you sleep" },
    ],
    mirror: {
      leakLabel: "Missed emergency calls",
      leakValue: "12/mo",
      recoveredLabel: "AI Call Capture rate",
      recoveredValue: "100%"
    },
    bots: [
      { name: "Dispatch Helper", status: "active", efficiency: "96%" },
      { name: "Review Generator", status: "active", efficiency: "88%" },
    ],
  },

  // --- LIFESTYLE ---
  BARBER: {
    id: 'BARBER',
    category: 'LIFESTYLE',
    label: 'Barber & Salon',
    icon: Scissors,
    description: "Client retention and appointment recapture.",
    metrics: [
      { label: "Missed Appts", value: "-85%", trend: "Reminders", icon: CalendarX, translation: "Chairs stay full" },
      { label: "Auto Re-bookings", value: "+$4,200", trend: "Monthly", icon: BarChart3, translation: "Clients locking in early" },
      { label: "Client Retention", value: "98%", trend: "Loyalty", icon: Users, translation: "They keep coming back" },
    ],
    mirror: {
      leakLabel: "Revenue lost to no-shows",
      leakValue: "$3k/mo",
      recoveredLabel: "Recaptured via deposits/SMS",
      recoveredValue: "$2.8k/mo"
    },
    bots: [
      { name: "No-Show Preventer", status: "active", efficiency: "95%" },
      { name: "Style Lookbook AI", status: "idle", efficiency: "98%" },
    ],
  },
  FITNESS: {
    id: 'FITNESS',
    category: 'LIFESTYLE',
    label: 'Fitness Studio',
    icon: Dumbbell,
    description: "Member engagement and class yield management.",
    metrics: [
      { label: "Class Fill Rate", value: "96%", trend: "Waitlist", icon: Users, translation: "Max revenue per hour" },
      { label: "Churn Reduction", value: "-20%", trend: "Retention", icon: Activity, translation: "Members staying longer" },
      { label: "Member LTV", value: "+$150", trend: "Growing", icon: BarChart3, translation: "More value per member" },
    ],
    mirror: {
      leakLabel: "Empty slots in prime classes",
      leakValue: "15%",
      recoveredLabel: "Waitlist auto-fill rate",
      recoveredValue: "99%"
    },
    bots: [
      { name: "Waitlist Manager", status: "active", efficiency: "99%" },
      { name: "Nutrition Coach AI", status: "learning", efficiency: "91%" },
    ],
  }
};

// --- TOUR SCRIPTS ---
export const TOURS: Record<TourScenario, TourStep[]> = {
  INTRO: [
    { targetId: null, title: "Welcome to Atlas Synapse.", message: "I am your Strategic Intelligence Engine. I have replaced your fragmented tools with a single, cohesive operating system designed for growth." },
    { targetId: 'tour-sidebar', title: "Command Bar", message: "This is your nervous system. Operations, Automation, Network, and Security—all your hubs are accessible here. No more jumping between 10 different tabs." },
    { targetId: 'tour-roi', title: "The Scoreboard", message: "We measure success in profit. This live ticker tracks the exact capital and man-hours I have recaptured for you. If this number isn't growing, I am not doing my job." },
    { targetId: 'tour-navigator', title: "Calibration", message: "I am context-aware. Use this Navigator to select your specific industry. I will instantly re-architect your dashboard, bot logic, and news feed to match your trade." },
    { targetId: 'tour-operations', title: "The Cockpit", message: "This is the Operations Hub. It is your 'Truth Source'. It aggregates data from your bank, CRM, and scheduling tools into a single view." },
    { targetId: 'tour-architect', title: "Your Strategist", message: "You are not alone. This 'Architect' link is a direct, encrypted line to Julius Sanders and his team. Use this when you need high-level strategy, not just tech support." },
    { targetId: 'orb-trigger', title: "I Am Always Here", message: "Finally, I am always watching. Click this Orb whenever you are stuck. I will analyze your screen and guide you to the next right move." },
  ],
  OPERATIONS: [
    { targetId: 'tour-operations', title: "Live Metrics", message: "These cards show what matters. We translate raw data into plain English so you know exactly where your business stands." },
    { targetId: 'tour-mirror', title: "The Mirror", message: "This visualizes your operational efficiency. I actively look for 'leaks'—money or time you are losing—and highlight them here." },
  ],
  NETWORK: [
    { targetId: 'tour-network-feed', title: "Strategic Intelligence", message: "This is not social media. This is a closed-loop intelligence feed where verified owners share high-impact strategies." },
    { targetId: 'tour-network-peers', title: "Verified Peers", message: "Connect with other high-performance owners in your industry. Build your circle with people who are actually in the arena." },
    { targetId: 'tour-network-architect', title: "Lead Architects", message: "Look for posts from our Architects. They provide expert analysis on strategies that are working right now." },
  ],
  AUTOMATION: [
    { targetId: 'tour-automation', title: "The Workroom", message: "Meet your digital workforce. These bots run 24/7, handling tasks like scheduling, billing, and follow-ups." },
    { targetId: null, title: "Radical Transparency", message: "Click any bot to see its live logic stream. Watch it make decisions in real-time so you trust the work it's doing." },
  ],
  SECURITY: [
    { targetId: 'tour-security', title: "The Vault", message: "Bank-grade encryption for your assets. If it's not green, I'll alert you immediately. You own your data; we just keep it safe." },
  ]
};