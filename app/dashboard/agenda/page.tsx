'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Zap, 
  Calendar,
  Clock,
  Flag,
  Key,
  FileText,
  Code2,
  Phone,
  ArrowRight,
  Shield,
  Users,
  Briefcase,
  Scale,
  Settings,
  Wrench,
  MoveRight,
  CheckCircle
} from 'lucide-react';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Arrow animation for migration
const arrowFloat = {
  initial: { x: 0, opacity: 0.5 },
  animate: { 
    x: [0, 10, 0], 
    opacity: [0.5, 1, 0.5],
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

// January 2026 Calendar Data
// January 2026 starts on Thursday (index 4 in 0-indexed Sun-Sat)
const JANUARY_2026 = {
  startDay: 4, // Thursday (0=Sun, 1=Mon, ..., 4=Thu)
  days: 31,
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Migration items
const STAYING_ITEMS = [
  { name: 'Operations', icon: Users, color: 'blue' },
  { name: 'Sales', icon: Briefcase, color: 'blue' },
];

const MIGRATING_ITEMS = [
  { name: 'Finance', icon: Scale, color: 'slate' },
  { name: 'Legal', icon: Shield, color: 'slate' },
  { name: 'Admin', icon: Settings, color: 'slate' },
  { name: 'Tech Development', icon: Code2, color: 'amber', highlight: true },
];

// Animated Arrow Component
const MigrationArrow = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="flex items-center gap-1"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <motion.div
      className="flex items-center"
      variants={arrowFloat}
      initial="initial"
      animate="animate"
    >
      <div className="w-12 h-0.5 bg-gradient-to-r from-slate-300 to-slate-400" />
      <MoveRight className="w-5 h-5 text-slate-400 -ml-1" />
    </motion.div>
  </motion.div>
);

// Calendar Cell Component
const CalendarCell = ({ 
  day, 
  type 
}: { 
  day: number | null; 
  type: 'empty' | 'negotiation' | 'meeting' | 'deadline' | 'unavailable' | 'normal'
}) => {
  if (day === null) {
    return <div className="h-16 bg-slate-50 border border-slate-100" />;
  }

  const baseClasses = "h-16 border flex flex-col items-center justify-center relative transition-all";
  
  const typeClasses = {
    empty: 'bg-slate-50 border-slate-100',
    normal: 'bg-white border-slate-200 hover:bg-slate-50',
    negotiation: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    meeting: 'bg-blue-600 border-blue-700 text-white',
    deadline: 'bg-red-50 border-red-300',
    unavailable: 'bg-slate-100 border-slate-200',
  };

  const hashedPattern = type === 'unavailable' ? {
    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 6px)'
  } : {};

  return (
    <div 
      className={`${baseClasses} ${typeClasses[type]}`}
      style={hashedPattern}
    >
      {/* Day Number */}
      <span className={`text-sm font-semibold ${type === 'meeting' ? 'text-white' : type === 'deadline' ? 'text-red-700' : 'text-slate-700'}`}>
        {day}
      </span>
      
      {/* Special Labels */}
      {type === 'meeting' && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2">
          <span className="text-[8px] font-bold bg-blue-800 text-white px-1.5 py-0.5 rounded animate-pulse whitespace-nowrap">
            FINAL MEETING
          </span>
        </div>
      )}
      
      {type === 'deadline' && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2">
          <span className="text-[8px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5 whitespace-nowrap">
            <Flag className="w-2 h-2" />
            DEADLINE
          </span>
        </div>
      )}
    </div>
  );
};

export default function FarzalMeetingAgenda() {
  // Generate calendar grid
  const generateCalendarGrid = () => {
    const grid: (number | null)[] = [];
    
    // Add empty cells for days before Jan 1
    for (let i = 0; i < JANUARY_2026.startDay; i++) {
      grid.push(null);
    }
    
    // Add days 1-31
    for (let day = 1; day <= JANUARY_2026.days; day++) {
      grid.push(day);
    }
    
    // Fill remaining cells to complete the last row
    while (grid.length % 7 !== 0) {
      grid.push(null);
    }
    
    return grid;
  };

  const getCellType = (day: number | null): 'empty' | 'negotiation' | 'meeting' | 'deadline' | 'unavailable' | 'normal' => {
    if (day === null) return 'empty';
    if (day >= 1 && day <= 9) return 'negotiation';
    if (day === 10) return 'meeting';
    if (day === 12) return 'deadline';
    if (day >= 13) return 'unavailable';
    return 'normal';
  };

  const calendarGrid = generateCalendarGrid();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto px-8 py-12">
        
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Strategic Partnership</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Farzal Meeting Agenda</h1>
          <p className="text-slate-500">January 2026 • Structural Handover & Timeline</p>
        </motion.div>

        {/* ==================== SECTION 1: MIGRATION DIAGRAM ==================== */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.div variants={fadeIn} className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Structural Handover</h2>
            <p className="text-slate-500 text-sm">Transfer of Responsibility — Sinjab becomes a pure Operational Engine</p>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
          >
            {/* Label */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4" />
                Strategic Offloading: Sinjab becomes a pure Operational Engine
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-start">
              
              {/* Left Side - Sinjab Current */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#1B5BCC] rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Sinjab</h3>
                    <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">Current State</p>
                  </div>
                </div>

                {/* Staying */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Staying</span>
                  </div>
                  <div className="space-y-2">
                    {STAYING_ITEMS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <motion.div 
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100"
                        >
                          <Icon className="w-5 h-5 text-[#1B5BCC]" />
                          <span className="text-sm font-medium text-slate-700">{item.name}</span>
                          <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                            CORE
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Migrating Out */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MoveRight className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transferring Out</span>
                  </div>
                  <div className="space-y-2">
                    {MIGRATING_ITEMS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <motion.div 
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          className={`flex items-center gap-3 p-3 rounded-lg border border-dashed ${
                            item.highlight 
                              ? 'bg-amber-50 border-amber-300' 
                              : 'bg-slate-50 border-slate-300'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${item.highlight ? 'text-amber-600' : 'text-slate-500'}`} />
                          <span className={`text-sm font-medium ${item.highlight ? 'text-amber-800 font-bold' : 'text-slate-600'}`}>
                            {item.name}
                          </span>
                          {item.highlight && (
                            <span className="ml-auto text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                              FARZAL
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Center - Animated Arrows */}
              <div className="flex flex-col items-center justify-center gap-3 py-8 lg:py-0">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 lg:hidden">Transfer</div>
                {MIGRATING_ITEMS.map((item, idx) => (
                  <MigrationArrow key={item.name} delay={0.5 + idx * 0.15} />
                ))}
                <div className="mt-2 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Responsibility<br />Transfer
                  </span>
                </div>
              </div>

              {/* Right Side - Thrive Target */}
              <div className="bg-slate-100 border-2 border-slate-300 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Thrive</h3>
                    <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">New Owner</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Receiving</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {MIGRATING_ITEMS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div 
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.15 }}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          item.highlight 
                            ? 'bg-amber-50 border-amber-200' 
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${item.highlight ? 'text-amber-600' : 'text-slate-600'}`} />
                        <span className={`text-sm font-medium ${item.highlight ? 'text-amber-800 font-bold' : 'text-slate-700'}`}>
                          {item.name}
                        </span>
                        {item.highlight && (
                          <span className="ml-auto text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                            KEY TRANSFER
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 text-center">
                    Thrive assumes full responsibility for back-office operations
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ==================== SECTION 2: CALENDAR ==================== */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.div variants={fadeIn} className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">January 2026</h2>
            </div>
            <p className="text-slate-500 text-sm">Critical timeline before CEO leave period</p>
          </motion.div>

          {/* Legend */}
          <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-50 border border-emerald-200 rounded" />
              <span className="text-slate-600">Negotiation Window (Jan 1-9)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded" />
              <span className="text-slate-600">Final Meeting (Jan 10)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-300 rounded" />
              <span className="text-slate-600">Deadline (Jan 12)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-100 border border-slate-200 rounded" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)' }} />
              <span className="text-slate-600">CEO Unavailable (Jan 13+)</span>
            </div>
          </motion.div>

          {/* Calendar Grid */}
          <motion.div 
            variants={fadeIn}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden"
          >
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-center py-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    day === 'Sun' || day === 'Sat' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarGrid.map((day, idx) => (
                <CalendarCell key={idx} day={day} type={getCellType(day)} />
              ))}
            </div>

            {/* Zone Labels */}
            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
              <div className="bg-emerald-50 rounded-lg py-2 px-3">
                <p className="text-[10px] font-bold text-emerald-700 uppercase">Jan 1-9</p>
                <p className="text-xs text-emerald-600">Negotiation Window</p>
              </div>
              <div className="bg-blue-50 rounded-lg py-2 px-3">
                <p className="text-[10px] font-bold text-blue-700 uppercase">Jan 10</p>
                <p className="text-xs text-blue-600">Final Meeting Day</p>
              </div>
              <div className="bg-slate-100 rounded-lg py-2 px-3">
                <p className="text-[10px] font-bold text-slate-600 uppercase">Jan 13-31</p>
                <p className="text-xs text-slate-500">CEO Break Period</p>
              </div>
            </div>
          </motion.div>

          {/* Alert Box */}
          <motion.div 
            variants={fadeIn}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4 flex items-start gap-3"
          >
            <Phone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">Availability Notice</p>
              <p className="text-amber-700 text-sm">
                Thrive CEO is available for a call with Farzal <strong>anytime before Jan 12th</strong>.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* ==================== SECTION 3: REQUIREMENTS CHECKLIST ==================== */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Immediate Action Items</h2>
            <p className="text-slate-500 text-sm">Requirements checklist for partnership initiation</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* API Keys */}
            <motion.div 
              variants={fadeIn}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full uppercase">
                  High Priority
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">API Keys Completion</h3>
              <p className="text-sm text-slate-500 mb-4">Complete all pending API integrations and credentials handover.</p>
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">F</div>
                <span className="text-xs text-slate-600">Owner: <strong>Farzal</strong></span>
              </div>
            </motion.div>

            {/* Handover Contract */}
            <motion.div 
              variants={fadeIn}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  In Progress
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Handover Contract</h3>
              <p className="text-sm text-slate-500 mb-4">Legal documentation for partnership transfer and terms agreement.</p>
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">M</div>
                <span className="text-xs text-slate-600">Owner: <strong>Myself & Hassan Jaffar</strong></span>
              </div>
            </motion.div>

            {/* Dev Maintenance Transfer */}
            <motion.div 
              variants={fadeIn}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full uppercase">
                  Transfer
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Dev Maintenance Transfer</h3>
              <p className="text-sm text-slate-500 mb-4">Move development and maintenance responsibility to Thrive team.</p>
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                </div>
                <span className="text-xs text-slate-600">Transfer to: <strong>Thrive</strong></span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-slate-200 text-center"
        >
          <p className="text-slate-400 text-xs">
            Confidential Meeting Document • Sinjab × Thrive Partnership • January 2026
          </p>
        </motion.div>

      </div>
    </div>
  );
}
