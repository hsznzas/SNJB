'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { 
  Info, 
  TrendingUp, 
  Shield, 
  Activity, 
  DollarSign,
  FileText,
  Building2,
  Code2,
  Rocket,
  Users,
  ChevronRight,
  Briefcase,
  Scale,
  Monitor,
  Headphones,
  UserCircle,
  Building,
  Target,
  Cpu,
  Crown,
  AlertTriangle,
  Construction,
  Hourglass,
  Coins,
  TriangleAlert,
  Wallet
} from 'lucide-react';
import { 
  DATA_2024, 
  DATA_2025, 
  DATA_CONSOLIDATED, 
  DEBT_BALANCE_HISTORY,
  DEBT_SCHEDULE, 
  LOAN_DETAILS,
  GMV_DATA,
  TAKE_RATE_DATA,
  TICKET_SIZE_DATA,
  USER_TRACTION_DATA,
  EXPENSE_HISTORY_CONSOLIDATED,
  LIABILITY_BREAKDOWN,
  LIABILITY_TOTAL
} from '@/data/dashboard-data';

// --- THEME CONFIGURATION (Professional Minimal Colors) ---
const THEME = {
  background: {
    primary: '#fafbfc',
    secondary: '#ffffff',
    accent: '#f1f5f9',
  },
  accent: {
    // Primary colors - use sparingly
    blue: '#3b82f6',        // Professional blue for primary data
    green: '#059669',       // Only for growth/positive metrics
    // Neutral tones - use for secondary/contrasting elements
    gray: '#94a3b8',        // Light gray for secondary data
    grayDark: '#334155',    // Dark gray for high contrast
    grayMedium: '#64748b',  // Medium gray
    text: '#0f172a',
    textSecondary: '#64748b',
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Common props for MUI Charts - Light Mode
// Note: hideLegend suppresses React DOM warnings from MUI's internal legend component
const commonChartProps = {
  grid: { horizontal: true },
  margin: { top: 20, bottom: 40, left: 80, right: 30 },
  hideLegend: true,
  sx: {
    '.MuiChartsAxis-tickLabel': { fill: `${THEME.accent.textSecondary} !important`, fontSize: 10 },
    '.MuiChartsAxis-line': { stroke: 'rgba(0,0,0,0.1) !important' },
    '.MuiChartsAxis-tick': { stroke: 'rgba(0,0,0,0.1) !important' },
    '.MuiChartsGrid-line': { stroke: 'rgba(0,0,0,0.05) !important' },
  }
};

// Updated Data Sources - Hyper-specific references
const CHART_INFO = {
  performance: { 
    calculation: "Revenue - Operating Expenses = Net Margin", 
    source: "Source: Internal Financial Statement 2024 & P&L Ledger." 
  },
  gmv: { 
    calculation: "Gross Transaction Value (Sum of all completed bookings)", 
    source: "Source: Excel File - 'Al Rajhi Bank Statement' (Credit Column Analysis)." 
  },
  userTraction: { 
    calculation: "New User Registrations vs Monthly Active Users", 
    source: "Source: Excel File - 'Sinjab Daily Bookings Report' (Confirmed Bookings Count)." 
  },
  unitEconomics: { 
    calculation: "Gross Revenue (4.9% Take Rate) minus Payment Processing Costs", 
    source: "Source: Excel File - 'Al Rajhi Bank Statement' (Credit Column Analysis)." 
  },
  debt: { 
    calculation: "Outstanding Principal Balance after scheduled repayments", 
    source: "Source: Internal Financial Statement 2024 & P&L Ledger." 
  },
  bookings: { 
    calculation: "Total confirmed court bookings per period", 
    source: "Source: Excel File - 'Sinjab Daily Bookings Report' (Confirmed Bookings Count)." 
  },
  ticket: { 
    calculation: "GMV ÷ Total Bookings = Average Transaction Value", 
    source: "Source: Computed from Bank Statement & Booking Report data." 
  },
  expenses: { 
    calculation: "Payroll + Technology + Operations = Total Burn", 
    source: "Source: Internal Financial Statement 2024 & P&L Ledger." 
  }
};

// Navigation items
const NAV_ITEMS = [
  { id: 'introduction', label: 'Introduction', icon: FileText },
  { id: 'financial', label: 'Financial Performance', icon: TrendingUp },
  { id: 'organization', label: 'Organizational Structure', icon: Building2 },
  { id: 'tech', label: 'Tech Architecture', icon: Code2 },
  { id: 'roadmap', label: 'Road to Profitability', icon: Rocket },
  { id: 'projections', label: 'Future Projections', icon: Hourglass },
];

// --- COMPONENTS ---

// Simple custom legend to avoid MUI's internal prop warnings
const ChartLegend = ({ items }: { items: { label: string; color: string }[] }) => (
  <div className="flex flex-wrap gap-4 mb-4">
    {items.map((item, idx) => (
      <div key={idx} className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
        <span className="text-xs text-slate-600">{item.label}</span>
      </div>
    ))}
  </div>
);

const InfoTooltip = ({ info }: { info: { calculation: string; source: string } }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block ml-2 z-50">
      <button 
        onMouseEnter={() => setIsOpen(true)} 
        onMouseLeave={() => setIsOpen(false)} 
        className="text-slate-400 hover:text-blue-600 transition-colors"
      >
        <Info className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 5 }} 
            className="absolute left-0 bottom-full mb-2 w-72 p-4 rounded-xl bg-white border border-slate-200 text-xs shadow-xl z-[100]"
          >
            <div className="font-bold text-blue-600 mb-1">Calculation Method</div>
            <div className="text-slate-600 mb-3">{info.calculation}</div>
            <div className="font-bold text-emerald-600 mb-1">Data Source</div>
            <div className="text-slate-500 text-[11px] leading-relaxed">{info.source}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ activeSection }: { activeSection: string }) => {
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex-col py-8 px-4 z-40"
    >
      <div className="mb-10 px-4">
        <div className="text-2xl font-black text-slate-900">Sinjab</div>
        <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Investor Portal</div>
      </div>
      
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="text-sm">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto text-blue-500" />
              )}
            </a>
          );
        })}
      </nav>
      
      <div className="px-4 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-slate-500">Live Data Feed</span>
        </div>
      </div>
    </motion.aside>
  );
};

const ChartCard = ({ title, info, children, className = "" }: { 
  title: string; 
  info?: { calculation: string; source: string }; 
  children: React.ReactNode; 
  className?: string 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }}
    className={`bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all ${className}`}
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-base font-bold text-slate-900 flex items-center">
        {title} 
        {info && <InfoTooltip info={info} />}
      </h3>
    </div>
    {children}
  </motion.div>
);

const StatCard = ({ label, value, sub, icon: Icon, color }: { 
  label: string; 
  value: string; 
  sub: string; 
  icon: any; 
  color: string 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white/70 backdrop-blur-sm p-5 rounded-xl border border-slate-200 flex flex-col gap-3 hover:shadow-md hover:border-slate-300 transition-all"
  >
    <div className="flex justify-between items-start">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
  </motion.div>
);

const SectionHeader = ({ title, subtitle, id }: { title: string; subtitle: string; id: string }) => (
  <div id={id} className="scroll-mt-24 mb-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 text-lg">{subtitle}</p>
    </motion.div>
  </div>
);

// --- ORG CHART COMPONENTS ---

const OrgNode = ({ 
  title, 
  name, 
  badge, 
  badgeColor = "blue",
  icon: Icon, 
  color = "blue",
  subtitle,
  children 
}: { 
  title: string; 
  name?: string; 
  badge?: string; 
  badgeColor?: 'blue' | 'gray' | 'amber';
  icon: any; 
  color?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
  };
  
  const badgeColorClasses: Record<string, string> = {
    blue: 'bg-blue-500 text-white',
    gray: 'bg-slate-400 text-white',
    amber: 'bg-amber-500 text-white',
  };
  
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`relative p-4 rounded-xl border-2 ${colorClasses[color]} min-w-[160px] text-center`}
      >
        <Icon className="w-6 h-6 mx-auto mb-2 opacity-60" />
        <div className="font-bold text-sm">{title}</div>
        {name && <div className="text-xs opacity-70 mt-1">{name}</div>}
        {subtitle && <div className="text-[10px] opacity-50 mt-1">{subtitle}</div>}
        {badge && (
          <span className={`absolute -top-2 -right-2 ${badgeColorClasses[badgeColor]} text-[9px] font-bold px-2 py-0.5 rounded-full`}>
            {badge}
          </span>
        )}
      </motion.div>
      {children}
    </div>
  );
};

const OrgConnector = ({ type = 'vertical' }: { type?: 'vertical' | 'horizontal' }) => (
  <div className={`${type === 'vertical' ? 'w-0.5 h-8 mx-auto' : 'h-0.5 w-8'} bg-slate-300`} />
);

const OrganizationChart = () => (
  <div className="overflow-x-auto py-8">
    <div className="flex flex-col items-center min-w-[800px]">
      {/* CEO Level */}
      <OrgNode title="CEO" name="Hassan" icon={Crown} color="amber" />
      <OrgConnector />
      
      {/* Level 2 - Departments */}
      <div className="flex items-start gap-4 relative">
        {/* Horizontal connector line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-80px)] h-0.5 bg-slate-300" />
        
        {/* Finance */}
        <div className="flex flex-col items-center pt-8">
          <div className="w-0.5 h-8 bg-slate-300 -mt-8" />
          <OrgNode 
            title="Finance & HR" 
            name="Omar" 
            icon={Briefcase} 
            color="blue"
            subtitle="4 Employees"
            badge="Partner"
            badgeColor="blue"
          />
        </div>
        
        {/* Legal */}
        <div className="flex flex-col items-center pt-8">
          <div className="w-0.5 h-8 bg-slate-300 -mt-8" />
          <OrgNode 
            title="Legal" 
            name="MZ Lawyers" 
            icon={Scale} 
            color="purple"
            badge="2% Equity"
            badgeColor="blue"
          />
        </div>
        
        {/* Tech */}
        <div className="flex flex-col items-center pt-8">
          <div className="w-0.5 h-8 bg-slate-300 -mt-8" />
          <OrgNode 
            title="Tech / Dev" 
            name="NextGeni" 
            icon={Monitor} 
            color="green"
            badge="Partner"
            badgeColor="blue"
          />
        </div>
        
        {/* Operations */}
        <div className="flex flex-col items-center pt-8">
          <div className="w-0.5 h-8 bg-slate-300 -mt-8" />
          <OrgNode 
            title="Operations" 
            icon={Building} 
            color="orange"
            badge="Vacant"
            badgeColor="gray"
          />
          <OrgConnector />
          
          {/* Sub-departments */}
          <div className="flex gap-4 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] h-0.5 bg-slate-300" />
            
            {/* Sales */}
            <div className="flex flex-col items-center pt-8">
              <div className="w-0.5 h-8 bg-slate-300 -mt-8" />
              <OrgNode 
                title="Sales" 
                name="Mansour" 
                icon={Users} 
                color="slate"
                subtitle="Saudi National"
              />
            </div>
            
            {/* CS */}
            <div className="flex flex-col items-center pt-8">
              <div className="w-0.5 h-8 bg-slate-300 -mt-8" />
              <OrgNode 
                title="Customer Success" 
                name="Faris (Remote)" 
                icon={Headphones} 
                color="slate"
              />
              <OrgConnector />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center"
                  >
                    <UserCircle className="w-5 h-5 text-slate-400" />
                  </motion.div>
                ))}
              </div>
              <div className="text-[10px] text-slate-400 mt-2">3 Remote Agents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- ROADMAP COMPONENTS ---

const MILESTONES = [
  {
    id: 'consolidation',
    title: 'Market Consolidation',
    subtitle: 'Strategic Mergers',
    description: 'Merging with competitors and market leaders to expand our court network and user base across the Kingdom.',
    impact: '+25% Revenue (Conservative)',
    icon: Building2,
    color: 'blue',
    status: 'in-progress'
  },
  {
    id: 'b2b',
    title: 'B2B Vertical',
    subtitle: 'Corporate Access Program',
    description: 'Opening gate access for corporate partners to offer court bookings as employee benefits and wellness programs.',
    partners: ['Noon', 'Roshn', 'Aramco', 'Webook', 'Wafy', 'STC Bank', 'Walaa', 'AlAhli Bank', 'AlRajhi Bank'],
    icon: Briefcase,
    color: 'purple',
    status: 'planned'
  },
  {
    id: 'pricing',
    title: 'Organized Match Monetization',
    subtitle: 'Platform Fee Revenue',
    description: 'Monetizing Organized Matches. Implementation of a 5 SAR Platform Fee per player for every match organized via Sinjab.',
    impact: 'New Revenue Stream per Match',
    icon: Cpu,
    color: 'green',
    status: 'planned'
  },
  {
    id: 'yield',
    title: 'Upfront Yield Model',
    subtitle: 'Inventory Pre-Purchase',
    description: 'Pre-purchasing club inventory for guaranteed liquidity in exchange for 100% booking revenue retention.',
    impact: '+30% Profit Margin Increase',
    icon: Coins,
    color: 'amber',
    status: 'planned'
  }
];

const MilestoneCard = ({ milestone, index }: { milestone: typeof MILESTONES[0]; index: number }) => {
  const Icon = milestone.icon;
  const colorClasses: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
    green: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  };
  const colors = colorClasses[milestone.color];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative flex gap-6"
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border-2 flex items-center justify-center relative z-10`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        {index < MILESTONES.length - 1 && (
          <div className="w-0.5 h-full bg-slate-200 absolute top-12 left-6" />
        )}
      </div>
      
      {/* Content */}
      <div className={`flex-1 pb-12 ${index === MILESTONES.length - 1 ? 'pb-0' : ''}`}>
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-lg">{milestone.title}</h4>
              <p className="text-sm text-slate-500">{milestone.subtitle}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.badge}`}>
              {milestone.status === 'in-progress' ? 'In Progress' : 'Planned'}
            </span>
          </div>
          
          <p className="text-slate-600 text-sm mb-4">{milestone.description}</p>
          
          {milestone.impact && (
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-700">{milestone.impact}</span>
            </div>
          )}
          
          {milestone.partners && (
            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-2 font-medium">Target Partners:</div>
              <div className="flex flex-wrap gap-2">
                {milestone.partners.map((partner) => (
                  <span key={partner} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- INDIRECT COSTS DATA ---
const INDIRECT_COSTS = [
  { role: 'CEO', name: 'Hassan', cost: 20000 },
  { role: 'COO (Head of Ops)', name: 'Vacant', cost: 15000 },
  { role: 'Sales', name: 'Mansour', cost: 10000 },
  { role: 'CS Lead', name: 'Faris', cost: 7500 },
  { role: 'CS Agent #1', name: 'Remote', cost: 4500 },
  { role: 'CS Agent #2', name: 'Remote', cost: 4500 },
  { role: 'CS Agent #3', name: 'Remote', cost: 4500 },
];

// --- MAIN COMPONENT ---

export default function InvestorRelations() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [view, setView] = useState<2024 | 2025 | 'all'>(2025);
  
  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const currentData = view === 'all' ? DATA_CONSOLIDATED : (view === 2025 ? DATA_2025 : DATA_2024);
  const totalRev = currentData.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const totalExp = currentData.reduce((acc, curr) => acc + (curr.expenses || 0), 0);
  const netMargin = totalRev - totalExp;
  const totalIndirectCost = INDIRECT_COSTS.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-900 selection:bg-blue-500/20 font-sans">
      
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
      
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} />
      
      {/* Main Content */}
      <main className="lg:ml-64">
        <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
          
          {/* ========== SECTION 1: INTRODUCTION (POWER HERO) ========== */}
          <section id="introduction" className="pt-12 pb-16 scroll-mt-12">
            {/* Light Hero Container */}
            <div 
              className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border border-slate-200"
            >
              {/* Subtle Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(71, 85, 105, 0.1) 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}
              />
              
              <div className="relative z-10 p-8 md:p-12">
                {/* Hero Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Verified Data • Real-Time</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600">
                      The Operating System for Sports in Saudi Arabia.
                    </span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-4xl">
                    Sinjab is the vertical SaaS and Fintech layer powering the Kingdom's sports infrastructure. 
                    We have transitioned from high-growth acquisition to operational profitability.
                  </p>
                </motion.div>

                {/* Traction Grid - 4 High-Contrast Cards */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
                >
                  {/* Metric 1: Financial */}
                  <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 hover:bg-white/90 hover:border-slate-300 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                        <Wallet className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Verified</div>
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">28.7M SAR</div>
                    <div className="text-sm text-slate-600 mb-1">2024 Verified GMV</div>
                    <div className="text-xs text-slate-500 font-mono">Source: Bank Statement</div>
                  </div>

                  {/* Metric 2: Volume */}
                  <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 hover:bg-white/90 hover:border-slate-300 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                        <Activity className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Confirmed</div>
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">326,000+</div>
                    <div className="text-sm text-slate-600 mb-1">Confirmed Matches (2024)</div>
                    <div className="text-xs text-slate-500 font-mono">Source: Booking Logs</div>
                  </div>

                  {/* Metric 3: Infrastructure */}
                  <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 hover:bg-white/90 hover:border-slate-300 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                        <Building2 className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Network</div>
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">140+ Clubs</div>
                    <div className="text-sm text-slate-600 mb-1">Partner Facilities</div>
                    <div className="text-xs text-slate-500 font-mono">Source: Investment Brief</div>
                  </div>

                  {/* Metric 4: Reach */}
                  <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 hover:bg-white/90 hover:border-slate-300 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
                        <Users className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Impact</div>
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">8 Million+</div>
                    <div className="text-sm text-slate-600 mb-1">Annual Beneficiaries</div>
                    <div className="text-xs text-slate-500 font-mono">Source: Investment Brief (Page 41)</div>
                  </div>
                </motion.div>

                {/* Strategic Evolution Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mb-12"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Strategic Evolution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-slate-100 transition-all">
                      <div className="text-xs text-slate-600 uppercase tracking-wider mb-2 font-semibold">2022</div>
                      <div className="text-sm text-slate-700 leading-relaxed">MVP & Market Entry</div>
                      <div className="absolute top-3 right-3 w-2 h-2 bg-slate-400 rounded-full" />
                    </div>
                    <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-slate-100 transition-all">
                      <div className="text-xs text-slate-600 uppercase tracking-wider mb-2 font-semibold">2023</div>
                      <div className="text-sm text-slate-700 leading-relaxed">Hyper-Growth (Acquisition Phase)</div>
                      <div className="absolute top-3 right-3 w-2 h-2 bg-slate-400 rounded-full" />
                    </div>
                    <div className="relative bg-emerald-50 border border-emerald-200 rounded-xl p-5 hover:bg-emerald-100 transition-all">
                      <div className="text-xs text-emerald-700 uppercase tracking-wider mb-2 font-semibold">2024</div>
                      <div className="text-sm text-slate-700 leading-relaxed">Market Leadership (28M SAR Run Rate)</div>
                      <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-slate-100 transition-all">
                      <div className="text-xs text-slate-600 uppercase tracking-wider mb-2 font-semibold">2025</div>
                      <div className="text-sm text-slate-700 leading-relaxed">Financial Optimization & B2B Expansion</div>
                      <div className="absolute top-3 right-3 w-2 h-2 bg-slate-400 rounded-full" />
                    </div>
                  </div>
                </motion.div>

                {/* Trust Bar - Partners */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Trusted by Industry Leaders</h3>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {['Aramco', 'Roshn', 'STC Bank', 'AlRajhi Bank', 'Noon', 'Webook', 'Wala'].map((partner, idx) => (
                      <div 
                        key={partner}
                        className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-xl px-6 py-3 hover:bg-white/90 hover:border-slate-300 hover:shadow-md transition-all"
                      >
                        <span className="text-sm font-semibold text-slate-700">{partner}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Financial Disclaimer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-slate-50 border border-slate-200 rounded-xl p-5"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800 text-sm mb-1">Financial Disclaimer</div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    All financial data is sourced from verified bank statements and internal ledgers. 
                    Ecosystem metrics are derived from the Investment Brief 2025. 
                    Information is for informational purposes only and should not be construed as 
                    investment advice. Confidential — For authorized investors only.
                  </p>
                </div>
              </div>
            </motion.div>
          </section>
          
          {/* ========== SECTION 2: FINANCIAL PERFORMANCE ========== */}
          <section id="financial" className="py-24">
            <SectionHeader 
              id="financial-header"
              title="Financial Performance" 
              subtitle="Comprehensive view of revenue, expenses, and operational metrics."
            />
            
            {/* View Toggle */}
            <div className="flex justify-end mb-8">
              <div className="bg-white/70 backdrop-blur-sm p-1 rounded-full flex gap-1 border border-slate-200 shadow-sm">
                {[2024, 2025].map((y) => (
                  <button 
                    key={y} 
                    onClick={() => setView(y as 2024 | 2025)} 
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                      view === y ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {y}
                  </button>
                ))}
                <button 
                  onClick={() => setView('all')} 
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    view === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard label="Total Revenue" value={formatCurrency(totalRev)} sub="Financial Actuals" icon={DollarSign} color={THEME.accent.blue} />
              <StatCard label="Burn Rate" value={formatCurrency(totalExp)} sub="Operating Expenses" icon={Activity} color={THEME.accent.grayDark} />
              <StatCard label="Net Efficiency" value={formatCurrency(netMargin)} sub={netMargin > 0 ? "Profit Surplus" : "Burn Window"} icon={TrendingUp} color={netMargin > 0 ? THEME.accent.green : THEME.accent.grayDark} />
              <StatCard label="Security Level" value="SOC2 Type II" sub="Compliance Status" icon={Shield} color={THEME.accent.blue} />
            </div>
            
            {/* Performance Overview Chart */}
            <div className="mb-8">
              <ChartCard title="Performance Overview" info={CHART_INFO.performance}>
                <ChartLegend items={[
                  { label: 'Revenue', color: THEME.accent.blue },
                  { label: 'Expenses', color: THEME.accent.purple },
                ]} />
                <div className="h-[320px] w-full">
                  <BarChart
                    dataset={currentData}
                    xAxis={[{ scaleType: 'band', dataKey: 'month', tickLabelStyle: { fill: THEME.accent.textSecondary, fontSize: 10 } }]}
                    series={[
                      { dataKey: 'revenue', label: 'Revenue', color: THEME.accent.blue, stack: 'A' },
                      { dataKey: 'expenses', label: 'Expenses', color: THEME.accent.grayDark, stack: 'B' },
                    ]}
                    yAxis={[{ tickLabelStyle: { fill: THEME.accent.textSecondary } }]}
                    {...commonChartProps}
                  />
                </div>
              </ChartCard>
            </div>
            
            {/* GMV & User Traction */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ChartCard title="GMV Growth" info={CHART_INFO.gmv}>
                <div className="h-[280px] w-full">
                  <LineChart
                    dataset={GMV_DATA}
                    xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.accent.textSecondary, fontSize: 9 } }]}
                    series={[{ dataKey: 'gmv', label: 'GMV (SAR)', color: THEME.accent.green, area: true, showMark: false, curve: 'linear' }]}
                    yAxis={[{ tickLabelStyle: { fill: THEME.accent.textSecondary } }]}
                    {...commonChartProps}
                  />
                </div>
              </ChartCard>
              
              <ChartCard title="User Retention & Capacity" info={CHART_INFO.userTraction}>
                <ChartLegend items={[
                  { label: 'Active Users', color: THEME.accent.blue },
                  { label: 'New Users', color: THEME.accent.purple },
                ]} />
                <div className="h-[250px] w-full">
                  <LineChart
                    dataset={USER_TRACTION_DATA}
                    xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.accent.textSecondary, fontSize: 9 } }]}
                    series={[
                      { dataKey: 'activeUsers', label: 'Active Users', color: THEME.accent.blue, showMark: false, area: true },
                      { dataKey: 'newUsers', label: 'New Users', color: THEME.accent.grayDark, showMark: false },
                    ]}
                    yAxis={[{ tickLabelStyle: { fill: THEME.accent.textSecondary } }]}
                    {...commonChartProps}
                  />
                </div>
              </ChartCard>
            </div>
            
            {/* Booking & Ticket Size */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ChartCard title="Booking Volume" info={CHART_INFO.bookings}>
                <div className="h-[280px] w-full">
                  <BarChart
                    dataset={GMV_DATA}
                    xAxis={[{ scaleType: 'band', dataKey: 'month', tickLabelStyle: { fill: THEME.accent.textSecondary, fontSize: 8 } }]}
                    series={[{ dataKey: 'bookings', label: 'Bookings', color: THEME.accent.blue }]}
                    yAxis={[{ tickLabelStyle: { fill: THEME.accent.textSecondary } }]}
                    {...commonChartProps}
                  />
                </div>
              </ChartCard>
              
              <ChartCard title="Avg. Ticket Size" info={CHART_INFO.ticket}>
                <div className="h-[280px] w-full">
                  <LineChart
                    dataset={TICKET_SIZE_DATA}
                    xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.accent.textSecondary, fontSize: 9 } }]}
                    series={[{ dataKey: 'ticket', label: 'SAR / Booking', color: THEME.accent.blue, showMark: false }]}
                    yAxis={[{ tickLabelStyle: { fill: THEME.accent.textSecondary } }]}
                    {...commonChartProps}
                  />
                </div>
              </ChartCard>
            </div>
            
            {/* Unit Economics & Costs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ChartCard title="Unit Economics" info={CHART_INFO.unitEconomics}>
                <ChartLegend items={[
                  { label: 'Gross Revenue', color: THEME.accent.blue },
                  { label: 'Net Spread', color: THEME.accent.green },
                ]} />
                <div className="h-[250px] w-full">
                  <LineChart
                    dataset={TAKE_RATE_DATA}
                    xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.accent.textSecondary, fontSize: 9 } }]}
                    series={[
                      { dataKey: 'grossRevenue', label: 'Gross', color: THEME.accent.blue, showMark: false },
                      { dataKey: 'netRevenue', label: 'Net Spread', color: THEME.accent.green, area: true, showMark: false },
                    ]}
                    yAxis={[{ tickLabelStyle: { fill: THEME.accent.textSecondary } }]}
                    {...commonChartProps}
                  />
                </div>
              </ChartCard>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all relative"
              >
                {/* Revision Alert Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold border border-slate-300">
                  <TriangleAlert className="w-3.5 h-3.5" />
                  Subject to Revision
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center">
                    Cost Structure 
                    <InfoTooltip info={CHART_INFO.expenses} />
                  </h3>
                </div>
                <ChartLegend items={[
                  { label: 'Payroll', color: THEME.accent.blue },
                  { label: 'Tech', color: THEME.accent.purple },
                  { label: 'Operations', color: THEME.accent.orange },
                ]} />
                <div className="h-[230px] w-full">
                  <LineChart
                    dataset={EXPENSE_HISTORY_CONSOLIDATED}
                    xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.accent.textSecondary, fontSize: 9 } }]}
                    series={[
                      { dataKey: 'payroll', label: 'Payroll', color: THEME.accent.blue, showMark: false },
                      { dataKey: 'tech', label: 'Tech', color: THEME.accent.grayDark, showMark: false },
                      { dataKey: 'ops', label: 'Ops', color: THEME.accent.grayMedium, showMark: false },
                    ]}
                    yAxis={[{ tickLabelStyle: { fill: THEME.accent.textSecondary } }]}
                    {...commonChartProps}
                  />
                </div>
              </motion.div>
            </div>
            
            {/* Debt Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <ChartCard title="Debt Trajectory" info={CHART_INFO.debt} className="lg:col-span-2">
                <div className="h-[280px] w-full">
                  <LineChart
                    dataset={DEBT_BALANCE_HISTORY}
                    xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.accent.textSecondary, fontSize: 10 } }]}
                    series={[{ dataKey: 'balance', label: 'Principal Balance', color: THEME.accent.blue, area: true, showMark: true }]}
                    yAxis={[{ tickLabelStyle: { fill: THEME.accent.textSecondary } }]}
                    {...commonChartProps}
                  />
                </div>
              </ChartCard>
              
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Capital Structure</h4>
                {LOAN_DETAILS.map((loan, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/70 backdrop-blur-sm border border-slate-200 p-4 rounded-xl"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-900">{loan.name}</span>
                      <div className="w-2 h-2 rounded-full" style={{ background: loan.color }} />
                    </div>
                    <div className="text-xl font-black text-slate-900">
                      {formatCurrency(parseFloat(loan.principal.replace(/,/g, '')))}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest pt-2 mt-2 border-t border-slate-100">
                      Monthly: {loan.monthly} SAR
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Outstanding Liabilities Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Outstanding Liabilities</h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">November 2025 Update</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (SAR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LIABILITY_BREAKDOWN.map((item, idx) => (
                      <motion.tr 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">{item.category}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-slate-900 text-right font-mono">
                          {formatCurrency(item.amount)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                      <td className="py-3 px-4 text-sm font-bold text-blue-800">TOTAL LIABILITIES</td>
                      <td className="py-3 px-4 text-lg font-black text-blue-600 text-right font-mono">
                        {formatCurrency(LIABILITY_TOTAL)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </motion.div>
          </section>
          
          {/* ========== SECTION 3: ORGANIZATIONAL STRUCTURE ========== */}
          <section id="organization" className="py-24">
            <SectionHeader 
              id="org-header"
              title="Organizational Structure" 
              subtitle="Leadership team and operational hierarchy."
            />
            
            {/* Org Chart */}
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 mb-8 overflow-hidden">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Company Hierarchy</h3>
              <OrganizationChart />
            </div>
            
            {/* Indirect Costs Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">Monthly Indirect Cost Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INDIRECT_COSTS.map((item, idx) => (
                      <motion.tr 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">{item.role}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{item.name}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-slate-900 text-right">
                          {formatCurrency(item.cost)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50">
                      <td colSpan={2} className="py-3 px-4 text-sm font-bold text-slate-900">Total Indirect Costs</td>
                      <td className="py-3 px-4 text-lg font-black text-blue-600 text-right">
                        {formatCurrency(totalIndirectCost)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </motion.div>
          </section>
          
          {/* ========== SECTION 4: TECH ARCHITECTURE ========== */}
          <section id="tech" className="py-24">
            <SectionHeader 
              id="tech-header"
              title="Tech Architecture" 
              subtitle="System infrastructure and code structure."
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 rounded-2xl p-12 text-center relative overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Construction className="w-4 h-4" />
                  Under Construction
                </div>
                
                <Code2 className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Code Structure Documentation</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  Detailed technical architecture, API documentation, and infrastructure diagrams 
                  are currently being prepared.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  {['Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'Redis', 'AWS'].map((tech) => (
                    <span key={tech} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm text-slate-600 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>
          
          {/* ========== SECTION 5: ROAD TO PROFITABILITY ========== */}
          <section id="roadmap" className="py-24">
            <SectionHeader 
              id="roadmap-header"
              title="Road to Profitability" 
              subtitle="Strategic milestones for sustainable growth."
            />
            
            <div className="max-w-3xl">
              {MILESTONES.map((milestone, index) => (
                <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
              ))}
            </div>
          </section>
          
          {/* ========== SECTION 6: FUTURE PROJECTIONS ========== */}
          <section id="projections" className="py-24">
            <SectionHeader 
              id="projections-header"
              title="Future Projections" 
              subtitle="Financial modeling and growth scenarios."
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 rounded-2xl p-12 text-center relative overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Hourglass className="w-4 h-4" />
                  Coming Soon
                </div>
                
                <TrendingUp className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Financial Projections</h3>
                <p className="text-slate-500 max-w-lg mx-auto mb-8">
                  Financial modeling based on the implementation of the Road to Profitability strategy. 
                  Detailed revenue forecasts, break-even analysis, and growth scenarios are being prepared.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  {['Revenue Forecast', 'Break-Even Analysis', 'Growth Scenarios', 'Cash Flow Projections'].map((item) => (
                    <span key={item} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm text-slate-600 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>
          
          {/* Footer */}
          <div className="border-t border-slate-200 pt-12 pb-8 text-center">
            <p className="text-slate-400 text-xs uppercase tracking-[0.3em] font-semibold">
              Confidential Enterprise Data • Sinjab Analytics v5.0
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}
