'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { 
  Info, 
  TrendingUp, 
  Activity, 
  DollarSign,
  ChevronRight,
  BarChart3,
  Users,
  ArrowUp,
  Tag,
  Link as LinkIcon,
  Scale,
  Zap,
  ChevronDown,
  Shield,
  Handshake,
  ArrowRight,
  AlertTriangle,
  LogOut,
  Lock,
  Clock,
  ChevronUp,
  type LucideIcon
} from 'lucide-react';
import { BusinessModelSimulator } from '@/components/investor/BusinessModelSimulator';
import { 
  GMV_DATA,
  USER_TRACTION_DATA,
} from '@/data/dashboard-data';

// --- THEME CONFIGURATION (Light Mode Professional) ---
const THEME = {
  background: {
    primary: '#fafbfc',
    secondary: '#ffffff',
    accent: '#f1f5f9',
  },
  accent: {
    blue: '#3b82f6',
    green: '#059669',
    purple: '#8b5cf6',
    gray: '#94a3b8',
    grayDark: '#334155',
    grayMedium: '#64748b',
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

const formatShortNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

// Navigation items
const NAV_ITEMS = [
  { id: 'kpis', label: 'Key Metrics', icon: BarChart3 },
  { id: 'simulator', label: 'Business Model', icon: DollarSign },
  { id: 'capabilities', label: 'Product Capabilities', icon: Zap },
  { id: 'strategic-fit', label: 'Strategic Fit', icon: Handshake },
  { id: 'deal-status', label: 'Deal Status', icon: AlertTriangle },
];

// --- CHART INFO ---
const CHART_INFO = {
  bookings: { 
    calculation: "Total confirmed court bookings per period", 
    source: "Source: Excel File - 'Sinjab Daily Bookings Report' (Confirmed Bookings Count)." 
  },
  retention: { 
    calculation: "New User Registrations vs Monthly Active Users (Retention = Active/Total)", 
    source: "Source: Excel File - 'Sinjab Daily Bookings Report' (User Activity Tracking)." 
  },
  gmv: { 
    calculation: "Gross Transaction Value (Sum of all completed bookings)", 
    source: "Source: Excel File - 'Al Rajhi Bank Statement' (Credit Column Analysis)." 
  },
};

// --- CUSTOM TOOLTIP ---
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color?: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-3 min-w-[150px]">
      <p className="font-semibold text-slate-900 mb-2 text-sm">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600">{entry.name}</span>
            </div>
            <span className="font-medium text-slate-900">
              {entry.dataKey.includes('gmv') ? formatCurrency(entry.value) : formatShortNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTS ---

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
        <div className="text-xs text-blue-600 uppercase tracking-widest mt-1 font-semibold">Investor Deck</div>
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

const ChartCard = ({ title, info, children, className = "", analysis }: {
  title: string;
  info?: { calculation: string; source: string };
  children: React.ReactNode;
  className?: string;
  analysis?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-slate-900 flex items-center">
        {title}
        {info && <InfoTooltip info={info} />}
      </h3>
    </div>
    <div className="h-[240px]">
      {children}
    </div>
    {analysis && (
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2">
        <ArrowUp className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: analysis }} />
      </div>
    )}
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

// --- COUNTDOWN TIMER COMPONENT ---
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });
  
  useEffect(() => {
    // Deadline: Feb 10, 2026 at midnight Riyadh time (UTC+3)
    const deadline = new Date('2026-02-10T00:00:00+03:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = deadline - now;
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false,
      });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (timeLeft.expired) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center">
        <p className="text-white text-2xl font-black">DEADLINE HAS PASSED</p>
        <p className="text-slate-400 mt-2">The deal window has closed as of February 11th, 2026.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800 rounded-xl p-8">
      <div className="text-center mb-6">
        <p className="text-slate-300 text-xs uppercase tracking-widest font-bold mb-2">Deadline: February 10th, 2026 at Midnight (Riyadh)</p>
        <p className="text-slate-500 text-sm">On Feb 11th, 2026, the new equity structure is locked permanently.</p>
      </div>
      
      <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
        {/* Days */}
        <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600">
          <p className="text-4xl md:text-5xl font-black text-white tabular-nums">{String(timeLeft.days).padStart(2, '0')}</p>
          <p className="text-slate-500 text-xs uppercase tracking-wider mt-1">Days</p>
        </div>
        
        {/* Hours */}
        <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600">
          <p className="text-4xl md:text-5xl font-black text-white tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</p>
          <p className="text-slate-500 text-xs uppercase tracking-wider mt-1">Hours</p>
        </div>
        
        {/* Minutes */}
        <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600">
          <p className="text-4xl md:text-5xl font-black text-slate-300 tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</p>
          <p className="text-slate-500 text-xs uppercase tracking-wider mt-1">Mins</p>
        </div>
        
        {/* Seconds */}
        <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600">
          <p className="text-4xl md:text-5xl font-black text-slate-400 tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</p>
          <p className="text-slate-500 text-xs uppercase tracking-wider mt-1">Secs</p>
        </div>
      </div>
    </div>
  );
};

// --- DEAL STATUS SECTION (COLLAPSIBLE) ---
const DealStatusSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <section id="deal-status" className="py-16 scroll-mt-12">
      <div id="deal-status-header" className="scroll-mt-24 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Deal Status & Timeline</h2>
          <p className="text-slate-500 text-lg">Critical decision window — February 10th, 2026 deadline.</p>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden"
      >
        {/* Collapsible Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-slate-800 px-6 py-5 hover:bg-slate-700 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-slate-300" />
              <span className="text-lg font-bold text-white text-left">
                Important: Current Deal Status & Timeline
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm font-medium hidden sm:inline">
                {isExpanded ? 'Click to Collapse' : 'Click to Expand'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </div>
        </button>
        
        {/* Collapsible Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="p-8 bg-slate-50">
                {/* Status Alert */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                  <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    Due to <strong className="text-slate-900">4 months of inactivity</strong>, we have moved forward with an alternative offer from a <strong className="text-slate-900">vehicle within a 1 Billion SAR Family Group</strong> with extensive B2B access.
                  </p>
                  
                  {/* Implications */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <LogOut className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Founder Cash-Out</p>
                        <p className="text-xs text-slate-500">Minority position shift</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <Lock className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Loss of Control</p>
                        <p className="text-xs text-slate-500">No power to sell post-deal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <Clock className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">1-Year Lock-in</p>
                        <p className="text-xs text-slate-500">Founder obligation period</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Countdown Timer */}
                <CountdownTimer />
                
                {/* Strategic Ultimatum */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 bg-slate-800 rounded-xl p-8"
                >
                  <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-4 text-center">Strategic Ultimatum</p>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto text-center">
                    This disclosure fulfills my <strong className="text-white">final obligation</strong> to our historical relationship. A <strong className="text-white">superior, countersigned offer</strong> received before the deadline will supersede the current agreement. On <strong className="text-white">February 11th, 2026</strong>, this window closes permanently and the new equity structure is locked.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

// --- NODE-FLOW DIAGRAM COMPONENT ---
const NodeFlowDiagram = ({ 
  feature, 
  icon: Icon, 
  iconColor,
  benefit,
  nodes,
  href
}: { 
  feature: string;
  icon: LucideIcon;
  iconColor: string;
  benefit: string;
  nodes: string[];
  href?: string;
}) => {
  const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', iconBg: 'bg-blue-500' },
    green: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', iconBg: 'bg-emerald-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', iconBg: 'bg-purple-500' },
    slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', iconBg: 'bg-slate-500' },
  };
  const colors = colorClasses[iconColor] || colorClasses.blue;
  
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all ${href ? 'cursor-pointer hover:border-blue-300' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">{feature}</h3>
          <p className={`text-sm ${colors.text} font-medium`}>{benefit}</p>
        </div>
        {href && (
          <div className="text-blue-500 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
            <span>Open in Dashboard</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Node Flow - Horizontal on desktop, vertical on mobile */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 overflow-x-auto pb-2">
        {nodes.map((node, index) => (
          <React.Fragment key={index}>
            {/* Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`flex-shrink-0 px-4 py-3 ${colors.bg} ${colors.border} border rounded-xl text-center min-w-[140px]`}
            >
              <span className="text-sm font-medium text-slate-700">{node}</span>
            </motion.div>
            
            {/* Arrow (except for last node) */}
            {index < nodes.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.05 }}
                className="flex-shrink-0 hidden md:flex items-center"
              >
                <svg className="w-8 h-8 text-slate-300" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
            
            {/* Vertical arrow for mobile */}
            {index < nodes.length - 1 && (
              <ChevronDown className="w-5 h-5 text-slate-300 md:hidden" />
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
  
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }
  
  return content;
};

// --- MAIN COMPONENT ---
export default function InvestorPage() {
  const [activeSection, setActiveSection] = useState('kpis');
  
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

  // Prepare chart data - filter to 2024 data for clarity
  const bookingsData = GMV_DATA.filter(d => d.month.includes('24') || d.month.includes('25'))
    .map(d => ({
      month: d.month.replace(' 24', "'24").replace(' 25', "'25"),
      bookings: d.bookings,
    }));
  
  const retentionData = USER_TRACTION_DATA.filter(d => d.month.includes('24') || d.month.includes('25'))
    .map(d => ({
      month: d.month.replace(' 24', "'24").replace(' 25', "'25"),
      activeUsers: d.activeUsers,
      newUsers: d.newUsers,
    }));
  
  const gmvData = GMV_DATA.filter(d => d.month.includes('24') || d.month.includes('25'))
    .map(d => ({
      month: d.month.replace(' 24', "'24").replace(' 25', "'25"),
      gmv: d.gmv,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-900 selection:bg-blue-500/20 font-sans">
      
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
      
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} />
      
      {/* Main Content */}
      <main className="lg:ml-64">
        <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
          
          {/* ========== HERO HEADER ========== */}
          <section className="pt-8 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Investor Presentation</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600">
                  Building the Future of Sports in Saudi Arabia
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">
                Sinjab is the vertical SaaS and fintech platform powering the Kingdom&apos;s sports infrastructure. 
                Explore our growth metrics, business model, and product capabilities.
              </p>
            </motion.div>
            
            {/* Verified KPI Hero Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {/* 2024 GMV */}
              <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Verified GMV</span>
                </div>
                <p className="text-3xl font-black text-slate-900">28.7M SAR</p>
                <p className="text-xs text-slate-500 mt-1">2024 • Bank Statement Verified</p>
              </div>
              
              {/* Booking Volume */}
              <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Market Leader</span>
                </div>
                <p className="text-3xl font-black text-slate-900">326,000+</p>
                <p className="text-xs text-slate-500 mt-1">2024 Confirmed Bookings</p>
              </div>
              
              {/* Annual Beneficiaries */}
              <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Impact</span>
                </div>
                <p className="text-3xl font-black text-slate-900">8 Million+</p>
                <p className="text-xs text-slate-500 mt-1">Annual Beneficiaries</p>
              </div>
              
              {/* Partner Network */}
              <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Network</span>
                </div>
                <p className="text-3xl font-black text-slate-900">140+</p>
                <p className="text-xs text-slate-500 mt-1">Partner Facilities</p>
              </div>
            </motion.div>
          </section>
          
          {/* ========== SECTION 1: KPI CHARTS ========== */}
          <section id="kpis" className="py-16 scroll-mt-12">
            <SectionHeader 
              id="kpis-header"
              title="Growth Metrics" 
              subtitle="Key performance indicators demonstrating product-market fit and operational excellence."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart 1: Booking Volume */}
              <ChartCard 
                title="Booking Volume" 
                info={CHART_INFO.bookings}
                analysis="<strong>342K bookings</strong> in 2025 vs 323K in 2024 (+6% YoY), maintaining market leadership."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsData}>
                    <defs>
                      <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={THEME.accent.blue} stopOpacity={0.9}/>
                        <stop offset="100%" stopColor={THEME.accent.blue} stopOpacity={0.5}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10, fill: THEME.accent.textSecondary }}
                      interval={2}
                    />
                    <YAxis 
                      tickFormatter={formatShortNumber}
                      tick={{ fontSize: 10, fill: THEME.accent.textSecondary }}
                      width={45}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Bar 
                      dataKey="bookings" 
                      fill="url(#bookingsGradient)" 
                      name="Bookings"
                      radius={[4, 4, 0, 0]}
                    />
                    {/* Annotation */}
                    <ReferenceLine
                      y={30000}
                      stroke={THEME.accent.green}
                      strokeDasharray="5 5"
                      label={{
                        value: 'Market Leader →',
                        position: 'insideTopRight',
                        fill: THEME.accent.green,
                        fontSize: 11,
                        fontWeight: 600
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
              
              {/* Chart 2: User Retention */}
              <ChartCard 
                title="User Retention" 
                info={CHART_INFO.retention}
                analysis="Retention rates stabilized at <strong>94%</strong>, reducing long-term CAC."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retentionData}>
                    <defs>
                      <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={THEME.accent.blue} stopOpacity={0.6}/>
                        <stop offset="100%" stopColor={THEME.accent.blue} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={THEME.accent.gray} stopOpacity={0.4}/>
                        <stop offset="100%" stopColor={THEME.accent.gray} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10, fill: THEME.accent.textSecondary }}
                      interval={2}
                    />
                    <YAxis 
                      tickFormatter={formatShortNumber}
                      tick={{ fontSize: 10, fill: THEME.accent.textSecondary }}
                      width={45}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stackId="1"
                      stroke={THEME.accent.blue} 
                      fill="url(#activeGradient)"
                      name="Active Users"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="newUsers" 
                      stackId="2"
                      stroke={THEME.accent.gray} 
                      fill="url(#newGradient)"
                      name="New Users"
                    />
                    {/* Annotation for compounding base */}
                    <ReferenceLine
                      y={6000}
                      stroke={THEME.accent.blue}
                      strokeDasharray="5 5"
                      label={{
                        value: 'Compounding Base →',
                        position: 'insideTopRight',
                        fill: THEME.accent.blue,
                        fontSize: 11,
                        fontWeight: 600
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
              
              {/* Chart 3: GMV Stability */}
              <ChartCard 
                title="GMV Stability" 
                info={CHART_INFO.gmv}
                analysis="Processed <strong>28.7M SAR</strong> in 2024 with zero downtime."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gmvData}>
                    <defs>
                      <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={THEME.accent.blue} stopOpacity={0.6}/>
                        <stop offset="100%" stopColor={THEME.accent.blue} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10, fill: THEME.accent.textSecondary }}
                      interval={2}
                    />
                    <YAxis 
                      tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                      tick={{ fontSize: 10, fill: THEME.accent.textSecondary }}
                      width={45}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="gmv"
                      stroke="transparent"
                      fill="url(#gmvGradient)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gmv" 
                      stroke={THEME.accent.blue} 
                      strokeWidth={3}
                      dot={false}
                      name="GMV (SAR)"
                    />
                    {/* 2024 Annotation */}
                    <ReferenceLine
                      x="Jan'24"
                      stroke={THEME.accent.blue}
                      strokeDasharray="3 3"
                      label={{
                        value: 'Market Leadership',
                        position: 'top',
                        fill: THEME.accent.blue,
                        fontSize: 11,
                        fontWeight: 600
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
              
            </div>
          </section>
          
          {/* ========== MARKET CONTEXT SECTION ========== */}
          <section className="py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 via-white to-slate-50 border border-blue-200 rounded-2xl p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Market Context: Resilient Growth Despite Competition</h3>
                  <p className="text-slate-600">Understanding the 6% YoY growth in competitive context</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Card 1: Growth Achievement */}
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowUp className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Growth Achieved</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 mb-1">+6% YoY</p>
                  <p className="text-sm text-slate-500">342K bookings in 2025 vs 323K in 2024</p>
                </div>
                
                {/* Card 2: Market Share Lost */}
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Competitive Impact</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 mb-1">20-25%</p>
                  <p className="text-sm text-slate-500">Market revenue captured by Playtomic</p>
                </div>
                
                {/* Card 3: Net Position */}
                <div className="bg-white rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Market Position</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 mb-1">Market Leader</p>
                  <p className="text-sm text-slate-500">Maintained dominance despite headwinds</p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Key Insight:</strong> Achieving <strong className="text-emerald-600">6% growth</strong> while simultaneously losing <strong className="text-amber-600">20-25% of market revenue</strong> to a well-funded competitor (Playtomic) is a significant validation of Sinjab&apos;s platform strength. This demonstrates that organic demand and user loyalty are driving growth that <em>more than compensates</em> for competitive losses. With the leading clubs recovery opportunity (+22.5%), Sinjab is positioned for accelerated growth.
                </p>
              </div>
            </motion.div>
          </section>
          
          {/* ========== SECTION 2: BUSINESS MODEL SIMULATOR ========== */}
          <section id="simulator" className="py-16 scroll-mt-12">
            <SectionHeader 
              id="simulator-header"
              title="Business Model Simulator" 
              subtitle="Interactive 'What If' calculator to explore revenue scenarios with different take rates."
            />
            
            <BusinessModelSimulator />
          </section>
          
          {/* ========== SECTION 3: PRODUCT CAPABILITIES ========== */}
          <section id="capabilities" className="py-16 scroll-mt-12">
            <SectionHeader 
              id="capabilities-header"
              title="Product Capabilities" 
              subtitle="Core platform features powering vendor operations and end-user engagement."
            />
            
            <div className="space-y-6">
              
              {/* Feature 1: Automated Settlements */}
              <NodeFlowDiagram
                feature="Automated Settlements"
                icon={Scale}
                iconColor="purple"
                benefit="Zero-friction financial trust"
                href="https://partners.sinjabapps.com/settlements/accountant"
                nodes={[
                  'Transaction Inflow',
                  'Splitter Engine',
                  'Deduct Fees/VAT',
                  'Vendor Wallet',
                  'Bank Dispatch'
                ]}
              />
              
              {/* Feature 2: Universal Payment Links */}
              <NodeFlowDiagram
                feature="Universal Payment Links"
                icon={LinkIcon}
                iconColor="green"
                benefit="Monetizing non-standard inventory (Events, Sponsorships)"
                href="https://partners.sinjabapps.com/payment-link"
                nodes={[
                  'Vendor Service',
                  'Generate Secure Link',
                  'SMS/WhatsApp',
                  'Payment Gateway',
                  'Instant Reconciliation'
                ]}
              />
              
              {/* Feature 3: Smart Discount Engine */}
              <NodeFlowDiagram
                feature="Smart Discount Engine"
                icon={Tag}
                iconColor="blue"
                benefit="Automated yield management"
                href="https://partners.sinjabapps.com/discount-code"
                nodes={[
                  'Vendor Dashboard',
                  'Create Rules (Date/Type)',
                  'Generate Code',
                  'User App',
                  'Conversion Tracking'
                ]}
              />
              
            </div>
          </section>
          
          {/* ========== SECTION 4: STRATEGIC FIT ========== */}
          <section id="strategic-fit" className="py-16 scroll-mt-12">
            <SectionHeader 
              id="strategic-fit-header"
              title="The Ideal Partnership" 
              subtitle="A bridge diagram illustrating the synergistic potential."
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border border-slate-200 rounded-2xl p-8"
            >
              {/* Bridge Diagram */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                
                {/* Left Pillar: Sinjab */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Sinjab</h3>
                      <p className="text-sm text-blue-600 font-semibold">Proven Infrastructure</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900">326K+</p>
                        <p className="text-xs text-slate-500">Annual Bookings</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900">140+</p>
                        <p className="text-xs text-slate-500">Partner Venues</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-slate-900">28.7M</p>
                        <p className="text-xs text-slate-500">GMV Processed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">Market Leader</p>
                        <p className="text-xs text-slate-500">Tech & Operations</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Center Connector */}
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    {/* Arrow Lines */}
                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-0.5 bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-500" />
                    
                    {/* Center Circle */}
                    <div className="relative z-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full p-6 shadow-xl">
                      <ArrowRight className="w-8 h-8 text-white lg:hidden" />
                      <TrendingUp className="w-8 h-8 text-white hidden lg:block" />
                    </div>
                    
                    {/* Arrow heads */}
                    <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
                      <div className="w-3 h-3 border-l-2 border-b-2 border-blue-400 rotate-45" />
                    </div>
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                      <div className="w-3 h-3 border-r-2 border-t-2 border-emerald-500 rotate-45" />
                    </div>
                  </motion.div>
                  
                  <div className="mt-6 text-center max-w-[200px]">
                    <p className="text-lg font-black text-emerald-600 mb-1">SYNERGY</p>
                    <p className="text-sm text-slate-600 leading-tight">Unlocking the Corporate Sports Market</p>
                  </div>
                </div>
                
                {/* Right Pillar: Strategic Partner */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Handshake className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Strategic Partner</h3>
                      <p className="text-sm text-emerald-600 font-semibold">B2B Dominance</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <p className="text-sm font-bold text-slate-900">Gov/Semi-Gov Relations</p>
                      </div>
                      <p className="text-xs text-slate-500 ml-4">Access to ministry contracts & initiatives</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <p className="text-sm font-bold text-slate-900">Corporate Access</p>
                      </div>
                      <p className="text-xs text-slate-500 ml-4">Banks, Telcos, Enterprise clients</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <p className="text-sm font-bold text-slate-900">Marketing Reach</p>
                      </div>
                      <p className="text-xs text-slate-500 ml-4">Brand amplification & distribution</p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <p className="text-sm font-bold text-slate-900">Capital & Resources</p>
                      </div>
                      <p className="text-xs text-slate-500 ml-4">Growth funding & operational support</p>
                    </div>
                  </div>
                </div>
                
              </div>
              
              {/* Summary Box */}
              <div className="mt-8 bg-slate-800 rounded-xl p-6 text-white">
                <p className="text-center text-lg">
                  <span className="text-slate-400">The combination of</span>{' '}
                  <span className="text-blue-400 font-bold">Sinjab&apos;s proven infrastructure</span>{' '}
                  <span className="text-slate-400">with a</span>{' '}
                  <span className="text-emerald-400 font-bold">strategic partner&apos;s B2B reach</span>{' '}
                  <span className="text-slate-400">creates an unrivaled position in the Kingdom&apos;s sports technology market.</span>
                </p>
              </div>
            </motion.div>
          </section>
          
          {/* ========== SECTION 5: DEAL STATUS & URGENCY (COLLAPSIBLE) ========== */}
          <DealStatusSection />
          
          {/* Footer */}
          <div className="border-t border-slate-200 pt-12 pb-8 text-center">
            <p className="text-slate-400 text-xs uppercase tracking-[0.3em] font-semibold">
              Confidential Investor Materials • Sinjab 2025
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}
