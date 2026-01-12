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
  Wallet,
  Server,
  Layout,
  Smartphone,
  Database,
  Lock,
  FileCode,
  CreditCard,
  Zap,
  BarChart3,
  Palette,
  MapPin,
  Bell,
  GitBranch,
  Banknote,
  Calendar,
  Trophy,
  Globe,
  Landmark,
  Gavel,
  ClipboardCheck,
  BadgeCheck,
  CircleDot,
  type LucideIcon
} from 'lucide-react';
import { FinancialScenarioPlanner } from '@/components/dashboard/FinancialScenarioPlanner';
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

// Common props for MUI Charts - Light Mode (Optimized spacing)
// Note: hideLegend suppresses React DOM warnings from MUI's internal legend component
const commonChartProps = {
  grid: { horizontal: true },
  margin: { top: 10, bottom: 30, left: 60, right: 10 },
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
// Supports horizontal (default) and vertical (right-side) layout
const ChartLegend = ({ items, layout = 'horizontal' }: { 
  items: { label: string; color: string }[]; 
  layout?: 'horizontal' | 'vertical';
}) => (
  <div className={layout === 'vertical' 
    ? "flex flex-col gap-2 pl-4 border-l border-slate-100" 
    : "flex flex-wrap gap-4 mb-4"
  }>
    {items.map((item, idx) => (
      <div key={idx} className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
        <span className="text-xs text-slate-600 whitespace-nowrap">{item.label}</span>
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

const ChartCard = ({ title, info, children, className = "", legendItems, oneLiner }: {
  title: string;
  info?: { calculation: string; source: string };
  children: React.ReactNode;
  className?: string;
  legendItems?: { label: string; color: string }[];
  oneLiner?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:border-slate-300 transition-all ${className}`}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-bold text-slate-900 flex items-center">
        {title}
        {info && <InfoTooltip info={info} />}
      </h3>
    </div>
    <div className="flex gap-3">
      <div className="flex-1 min-w-0">
        {children}
      </div>
      {legendItems && legendItems.length > 0 && (
        <ChartLegend items={legendItems} layout="vertical" />
      )}
    </div>
    {oneLiner && (
      <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-emerald-600">
        {oneLiner}
      </div>
    )}
  </motion.div>
);

const StatCard = ({ label, value, sub, icon: Icon, color, trend, showOneLiner = true }: {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color: string;
  trend?: number;
  showOneLiner?: boolean;
}) => {
  // Determine if this is a debt/liability card by label
  const isDebtCard = label.toLowerCase().includes('debt') || 
                     label.toLowerCase().includes('liabilit') ||
                     label.toLowerCase().includes('loan') ||
                     label.toLowerCase().includes('burn');
  
  const shouldShowOneLiner = showOneLiner && !isDebtCard && trend !== undefined;
  const isPositive = trend !== undefined && trend >= 0;
  
  return (
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
      {shouldShowOneLiner && (
        <div className={`text-xs pt-2 border-t border-slate-100 ${isPositive ? 'text-emerald-600' : 'text-slate-500'}`}>
          {isPositive 
            ? `↑ Up ${Math.abs(trend).toFixed(1)}% from last period, signaling strong retention.`
            : `↓ Down ${Math.abs(trend).toFixed(1)}% from last period, monitoring closely.`
          }
        </div>
      )}
    </motion.div>
  );
};

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
  badgeColor?: 'blue' | 'gray' | 'green';
  icon: LucideIcon; 
  color?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    navy: 'bg-slate-100 border-slate-300 text-slate-800',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
    light: 'bg-white border-slate-200 text-slate-700',
  };
  
  const badgeColorClasses: Record<string, string> = {
    blue: 'bg-blue-500 text-white',
    gray: 'bg-slate-400 text-white',
    green: 'bg-emerald-500 text-white',
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
    <div className="flex flex-col items-center min-w-[900px]">
      {/* CEO Level */}
      <OrgNode title="CEO" name="Hassan" icon={Crown} color="blue" />
      <OrgConnector />
      
      {/* Level 2 - Departments */}
      <div className="flex items-start gap-4 relative">
        {/* Horizontal connector line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-80px)] h-0.5 bg-slate-300" />
        
        {/* Departments to be consolidated under Strategic Investor */}
        <div className="flex flex-col items-center">
          <div className="flex items-start gap-4 relative">
            {/* Inner horizontal connector */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] h-0.5 bg-slate-300" />
            
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
                color="slate"
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
          </div>
          
          {/* Connector lines merging to Strategic Investor */}
          <div className="relative w-full flex justify-center mt-4">
            {/* Three vertical lines going down */}
            <div className="absolute left-[calc(50%-168px)] w-0.5 h-6 bg-blue-300" />
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-6 bg-blue-300" />
            <div className="absolute right-[calc(50%-168px)] w-0.5 h-6 bg-blue-300" />
            {/* Horizontal line connecting them */}
            <div className="absolute top-6 left-[calc(50%-168px)] w-[336px] h-0.5 bg-blue-300" />
            {/* Single line going down to investor card */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-blue-300" />
          </div>
          
          {/* Strategic Investor Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-14 relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
              Post-Investment Transition
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-blue-300 border-dashed rounded-xl p-5 text-center min-w-[220px]">
              <Building className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="font-bold text-slate-900 text-sm">Strategic Investor&apos;s Company</div>
              <div className="text-xs text-slate-500 mt-1">Consolidated Services</div>
              <div className="flex justify-center gap-1 mt-3">
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px]">Finance</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">Legal</span>
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px]">Tech</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Operations - Stays with Sinjab */}
        <div className="flex flex-col items-center pt-8">
          <div className="w-0.5 h-8 bg-slate-300 -mt-8" />
          <OrgNode 
            title="Operations" 
            icon={Building} 
            color="slate"
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
    color: 'blue',
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
    color: 'slate',
    status: 'planned'
  }
];

const MilestoneCard = ({ milestone, index }: { milestone: typeof MILESTONES[0]; index: number }) => {
  const Icon = milestone.icon;
  const colorClasses: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    slate: { bg: 'bg-slate-50', border: 'border-slate-200', icon: 'text-slate-600', badge: 'bg-slate-100 text-slate-700' },
    green: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
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
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Verified Data</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-slate-100 transition-all">
                      <div className="text-xs text-slate-600 uppercase tracking-wider mb-2 font-semibold">2024</div>
                      <div className="text-sm text-slate-700 leading-relaxed">Market Leadership (28M SAR GMV)</div>
                      <div className="absolute top-3 right-3 w-2 h-2 bg-slate-400 rounded-full" />
                    </div>
                    <div className="relative bg-emerald-50 border border-emerald-200 rounded-xl p-5 hover:bg-emerald-100 transition-all">
                      <div className="text-xs text-emerald-700 uppercase tracking-wider mb-2 font-semibold">2025</div>
                      <div className="text-sm text-slate-700 leading-relaxed">Financial Optimization</div>
                      <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <div className="relative bg-blue-50 border border-blue-200 rounded-xl p-5 hover:bg-blue-100 transition-all">
                      <div className="text-xs text-blue-700 uppercase tracking-wider mb-2 font-semibold">2026</div>
                      <div className="text-sm text-slate-700 leading-relaxed">B2B Expansion & New Revenue Streams</div>
                      <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full" />
                    </div>
                  </div>
                </motion.div>

                </div>
            </div>
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
              <ChartCard 
                title="Performance Overview" 
                info={CHART_INFO.performance}
                legendItems={[
                  { label: 'Revenue', color: THEME.accent.blue },
                  { label: 'Expenses', color: THEME.accent.grayDark },
                ]}
                oneLiner="↑ Revenue momentum sustained across all periods, demonstrating operational resilience."
              >
                <div className="h-[260px] w-full">
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
              <ChartCard 
                title="GMV Growth" 
                info={CHART_INFO.gmv}
                legendItems={[{ label: 'GMV (SAR)', color: THEME.accent.green }]}
                oneLiner="↑ Gross merchandise value trending upward, reflecting market expansion."
              >
                <div className="h-[220px] w-full">
                  <LineChart
                    dataset={GMV_DATA}
                    xAxis={[{ scaleType: 'point', dataKey: 'month', tickLabelStyle: { fill: THEME.accent.textSecondary, fontSize: 9 } }]}
                    series={[{ dataKey: 'gmv', label: 'GMV (SAR)', color: THEME.accent.green, area: true, showMark: false, curve: 'linear' }]}
                    yAxis={[{ tickLabelStyle: { fill: THEME.accent.textSecondary } }]}
                    {...commonChartProps}
                  />
                </div>
              </ChartCard>
              
              <ChartCard 
                title="User Retention & Capacity" 
                info={CHART_INFO.userTraction}
                legendItems={[
                  { label: 'Active Users', color: THEME.accent.blue },
                  { label: 'New Users', color: THEME.accent.grayDark },
                ]}
                oneLiner="↑ Active user base growing steadily, indicating strong platform stickiness."
              >
                <div className="h-[220px] w-full">
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
              <ChartCard 
                title="Booking Volume" 
                info={CHART_INFO.bookings}
                legendItems={[{ label: 'Bookings', color: THEME.accent.blue }]}
                oneLiner="↑ Booking frequency increasing, indicating improved user engagement."
              >
                <div className="h-[220px] w-full">
                      <BarChart
                      dataset={GMV_DATA}
                    xAxis={[{ scaleType: 'band', dataKey: 'month', tickLabelStyle: { fill: THEME.accent.textSecondary, fontSize: 8 } }]}
                    series={[{ dataKey: 'bookings', label: 'Bookings', color: THEME.accent.blue }]}
                    yAxis={[{ tickLabelStyle: { fill: THEME.accent.textSecondary } }]}
                      {...commonChartProps}
                      />
                </div>
              </ChartCard>
              
              <ChartCard 
                title="Avg. Ticket Size" 
                info={CHART_INFO.ticket}
                legendItems={[{ label: 'SAR / Booking', color: THEME.accent.blue }]}
                oneLiner="↑ Average transaction value stable, reflecting healthy pricing power."
              >
                <div className="h-[220px] w-full">
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
              <ChartCard 
                title="Unit Economics" 
                info={CHART_INFO.unitEconomics}
                legendItems={[
                  { label: 'Gross Revenue', color: THEME.accent.blue },
                  { label: 'Net Spread', color: THEME.accent.green },
                ]}
                oneLiner="↑ Net spread margins improving, demonstrating pricing power."
              >
                <div className="h-[200px] w-full">
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
                className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:border-slate-300 transition-all relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center">
                    Cost Structure
                    <InfoTooltip info={CHART_INFO.expenses} />
                  </h3>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 h-[200px]">
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
                  <ChartLegend 
                    items={[
                      { label: 'Payroll', color: THEME.accent.blue },
                      { label: 'Tech', color: THEME.accent.grayDark },
                      { label: 'Operations', color: THEME.accent.grayMedium },
                    ]} 
                    layout="vertical" 
                  />
                </div>
          </motion.div>
            </div>
            
            {/* Debt Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <ChartCard title="Debt Trajectory" info={CHART_INFO.debt} className="lg:col-span-2">
                <div className="h-[220px] w-full">
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
              subtitle="Financial Command Center — System infrastructure powering our platform."
            />
            
            {/* Three Column Architecture Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Column 1: The Core (Backend Engine) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className="bg-white/60 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-8 relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                    <Server className="w-7 h-7 text-white" />
                  </div>
                  
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">The Core</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Modular Monolith API</h3>
                  <p className="text-sm text-slate-500 mb-6">Laravel 8.54 Framework [PHP 8.0]</p>
                  
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Capabilities</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lock className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Security</p>
                          <p className="text-xs text-slate-500">Laravel Sanctum (Token-based Auth)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileCode className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Docs</p>
                          <p className="text-xs text-slate-500">Swagger UI (Automated API Documentation)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Payments</p>
                          <p className="text-xs text-slate-500">HyperPay & Apple Pay Integration</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Database className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Modules</p>
                          <p className="text-xs text-slate-500">Booking Engine, POS System, Tournament Logic</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Column 2: The Interface (Web Platform) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white/60 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-8 relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                    <Layout className="w-7 h-7 text-white" />
                  </div>
                  
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">The Interface</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Investor & Club Dashboard</h3>
                  <p className="text-sm text-slate-500 mb-6">Next.js 15 (App Router)</p>
                  
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Capabilities</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Performance</p>
                          <p className="text-xs text-slate-500">Server-Side Rendering (SSR) for speed</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Visuals</p>
                          <p className="text-xs text-slate-500">Recharts/MUI X for real-time financial plotting</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Palette className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Styling</p>
                          <p className="text-xs text-slate-500">Tailwind CSS for responsive dark mode</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Column 3: The Reach (Native Mobile Apps) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/60 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-8 relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-slate-500/20">
                    <Smartphone className="w-7 h-7 text-white" />
                  </div>
                  
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">The Reach</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Player & Social App</h3>
                  <p className="text-sm text-slate-500 mb-6">Native Android (Java/Kotlin) & Native iOS (Swift)</p>
                  
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Capabilities</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Cpu className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Performance</p>
                          <p className="text-xs text-slate-500">Hardware-accelerated native performance</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bell className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Engagement</p>
                          <p className="text-xs text-slate-500">Firebase Cloud Messaging (Push Notifications)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Features</p>
                          <p className="text-xs text-slate-500">GPS Location Services & Social Feeds</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer Note */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-slate-100 to-blue-50 border border-slate-200 rounded-xl p-6 text-center"
            >
              <p className="text-slate-600 text-sm">
                System processes <span className="text-slate-900 font-bold">~28M SAR GMV</span> annually with <span className="text-emerald-600 font-bold">99.9% uptime</span> architecture.
              </p>
            </motion.div>
          </section>

          {/* ========== SECTION 4.5: ENTERPRISE SYSTEM FLOW ========== */}
          <section id="system-flow" className="py-24">
            <SectionHeader 
              id="system-flow-header"
              title="Enterprise System Flow" 
              subtitle="Unified architecture powering seamless operations across all platforms."
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
{/* THE CORE - Central Node */}
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 text-center shadow-lg border border-blue-200 max-w-md w-full"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                    <GitBranch className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">The Core</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Unified Modular API Engine</h3>
                  <p className="text-slate-500 text-sm">Laravel 8 • PHP 8.0</p>
                </motion.div>
              </div>

              {/* Connector Lines */}
              <div className="flex justify-center mb-4">
                <div className="w-px h-8 bg-gradient-to-b from-blue-300 to-slate-300"></div>
              </div>
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-0">
                  <div className="w-[200px] lg:w-[280px] h-px bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                  <div className="w-[200px] lg:w-[280px] h-px bg-slate-300"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-slate-300"></div>
                </div>
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-slate-300"></div>
                </div>
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-slate-300"></div>
                </div>
              </div>

              {/* Sub-Nodes - 3 Branches */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Financials */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/60 backdrop-blur-xl border border-slate-200/80 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Banknote className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Module</p>
                      <h4 className="font-bold text-slate-900">Financials</h4>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Automated Club Settlements
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      HyperPay Gateway Integration
                    </li>
                  </ul>
                </motion.div>

                {/* Operations */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/60 backdrop-blur-xl border border-slate-200/80 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center shadow-lg shadow-slate-500/20">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Module</p>
                      <h4 className="font-bold text-slate-900">Operations</h4>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                      Booking Engine
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                      POS System
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                      Court Management
                    </li>
                  </ul>
                </motion.div>

                {/* Engagement */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/60 backdrop-blur-xl border border-slate-200/80 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Module</p>
                      <h4 className="font-bold text-slate-900">Engagement</h4>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Tournament Logic
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Academy Modules
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      Ranking Systems
                    </li>
                  </ul>
                </motion.div>
              </div>

              {/* API Connection Indicator */}
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-3 bg-slate-100 rounded-full px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">API Layer</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
              </div>

              {/* Connector to Delivery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-slate-300"></div>
                </div>
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-slate-300"></div>
                </div>
              </div>

              {/* THE DELIVERY - End Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Investor/Club Dashboard */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">The Delivery</p>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Investor & Club Dashboard</h4>
                      <p className="text-slate-500 text-sm mb-3">Next.js 15 High-Performance Web</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">SSR</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Real-time Charts</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Dark Mode</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Player Experience */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">The Delivery</p>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Player Experience</h4>
                      <p className="text-slate-500 text-sm mb-3">Native Mobile Infrastructure (Android/iOS)</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                          326k+ Annual Bookings
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
              subtitle="Interactive financial modeling and growth scenario planning."
            />

            <FinancialScenarioPlanner />
          </section>

          {/* ========== SECTION 7: CORPORATE GOVERNANCE & LEGAL STRUCTURE ========== */}
          <section id="governance" className="py-24">
            <SectionHeader
              id="governance-header"
              title="Corporate Governance & Legal Structure"
              subtitle="Transparent organizational framework ensuring regulatory compliance and investor protection."
            />

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Column 1: Governance Diagram */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-slate-300 transition-all"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-600" />
                  Governance Hierarchy
                </h3>

                <div className="flex flex-col items-center">
                  {/* Shareholders Assembly - Top Tier */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full max-w-xs bg-blue-50 border-2 border-blue-300 rounded-xl p-4 text-center"
                  >
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-slate-900 font-bold text-sm">Shareholders Assembly</p>
                    <p className="text-slate-500 text-xs mt-1">Supreme Authority</p>
                  </motion.div>

                  {/* Vertical Connector */}
                  <div className="w-0.5 h-8 bg-gradient-to-b from-blue-400 to-blue-300" />

                  {/* President & CEO - Middle Tier */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="w-full max-w-xs bg-blue-50 border-2 border-blue-300 rounded-xl p-4 text-center relative"
                  >
                    <Crown className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-slate-900 font-bold text-sm">President & CEO</p>
                    <p className="text-blue-600 text-xs mt-1">Hassan Al-Sharif</p>
                  </motion.div>

                  {/* Horizontal Branch Connector */}
                  <div className="relative w-full max-w-md h-12 mt-4">
                    {/* Vertical line down from CEO */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-4 bg-slate-300" />
                    {/* Horizontal line */}
                    <div className="absolute left-[15%] right-[15%] top-4 h-0.5 bg-slate-300" />
                    {/* Left vertical down */}
                    <div className="absolute left-[15%] top-4 w-0.5 h-8 bg-slate-300" />
                    {/* Right vertical down */}
                    <div className="absolute right-[15%] top-4 w-0.5 h-8 bg-slate-300" />
                  </div>

                  {/* Side Branches */}
                  <div className="flex justify-between w-full max-w-md gap-4">
                    {/* Legal Counsel */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-center"
                    >
                      <Scale className="w-5 h-5 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-700 font-semibold text-xs">Legal Counsel</p>
                      <p className="text-slate-400 text-[10px] mt-1">MZ Lawyers (Covington)</p>
                    </motion.div>

                    {/* External Auditor */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-center"
                    >
                      <ClipboardCheck className="w-5 h-5 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-700 font-semibold text-xs">External Auditor</p>
                      <p className="text-slate-400 text-[10px] mt-1">MCPA (Al Hudaithi)</p>
                    </motion.div>
                  </div>
                </div>

                {/* Governance Note */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-slate-400 text-xs text-center">
                    Governance structure compliant with Saudi Companies Law
                  </p>
                </div>
              </motion.div>

              {/* Column 2: Entity Details Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-slate-300 transition-all"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Entity Details
                </h3>

                <div className="space-y-5">
                  {/* Entity Name */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Entity Name</p>
                      <p className="text-slate-900 font-semibold">Sinjab Fun for Sports Clubs</p>
                    </div>
                  </div>

                  {/* Legal Form */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gavel className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Legal Form</p>
                      <p className="text-slate-900 font-semibold">Simplified Joint Stock Company (SJSC)</p>
                      <p className="text-slate-400 text-xs mt-0.5">شركة مساهمة مبسطة</p>
                    </div>
                  </div>

                  {/* Headquarters */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Headquarters</p>
                      <p className="text-slate-900 font-semibold">Riyadh, Saudi Arabia</p>
                    </div>
                  </div>

                  {/* Capitalization */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Banknote className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Capitalization</p>
                      <p className="text-slate-900 font-semibold">10,000 SAR <span className="text-emerald-600 text-xs font-normal">(Fully Paid)</span></p>
                    </div>
                  </div>

                  {/* Fiscal Year */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Fiscal Year</p>
                      <p className="text-slate-900 font-semibold">Jan 1 – Dec 31</p>
                    </div>
                  </div>

                  {/* CR Status */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BadgeCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">CR Status</p>
                      <p className="text-slate-900 font-semibold flex items-center gap-2">
                        Active 
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">Verified June 2025</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fine Print */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-slate-400 text-xs text-center">
                    Source: Articles of Association • Commercial Registration
                  </p>
                </div>
              </motion.div>
            </div>
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
